import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    console.log('=== USERS API CALLED ===');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('MongoDB URI configured:', !!process.env.MONGODB_URI);
    
    const { db } = await connectToDatabase();
    console.log('Database connected successfully');
    
    const usersCollection = db.collection('users');
    
    // Get query parameters - using nextUrl to avoid dynamic server error
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    console.log(`Fetching users: page=${page}, limit=${limit}, skip=${skip}`);
    
    // Fetch users with pagination
    const users = await usersCollection
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();
    
    const total = await usersCollection.countDocuments();
    console.log(`Found ${users.length} users out of ${total} total`);
    
    // Transform users data with safety check
    const usersArray = Array.isArray(users) ? users : [];
    const transformedUsers = usersArray.map(user => ({
      id: user._id.toString(),
      uid: user.uid || 'N/A',
      email: user.email || 'N/A',
      displayName: user.displayName || 'N/A',
      photoURL: user.photoURL || null,
      emailVerified: user.emailVerified || false,
      disabled: user.disabled || false,
      provider: user.providerData?.[0]?.providerId || 'unknown',
      createdAt: user.metadata?.creationTime || user.createdAt || new Date().toISOString(),
      lastSignInTime: user.metadata?.lastSignInTime || user.lastSignInTime || 'Never',
      customClaims: user.customClaims || {}
    }));
    
    console.log('Transformed users:', transformedUsers.length);
    console.log('CRITICAL: Returning data as ARRAY directly, not nested object');
    
    // CRITICAL FIX: Return users array directly in data field
    const response = {
      success: true,
      data: transformedUsers, // This MUST be the array directly
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      timestamp: new Date().toISOString(),
      version: '2.0-restructured'
    };
    
    console.log('Response structure:', {
      success: response.success,
      dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
      dataLength: Array.isArray(response.data) ? response.data.length : 'N/A',
      hasPagination: !!response.pagination
    });
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Users API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch users',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
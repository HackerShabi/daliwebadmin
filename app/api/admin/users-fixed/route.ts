import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching users from fixed endpoint...');
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Fetch users with pagination
    const users = await usersCollection
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();
    
    const total = await usersCollection.countDocuments();
    
    // Transform users data
    const transformedUsers = users.map(user => ({
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
    
    console.log(`Returning ${transformedUsers.length} users directly in data field`);
    
    // CRITICAL: Return users array directly in data field, NOT nested
    return NextResponse.json({
      success: true,
      data: transformedUsers, // This should be the array directly
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      timestamp: new Date().toISOString(),
      endpoint: 'users-fixed'
    });
  } catch (error) {
    console.error('Users Fixed API error:', error);
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
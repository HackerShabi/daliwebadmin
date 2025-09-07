import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    const usersCollection = db.collection('users');
    
    // Get total count for pagination
    const total = await usersCollection.countDocuments();
    
    // Get users with pagination
    const users = await usersCollection
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Transform users to match expected format
    const transformedUsers = users.map(user => ({
      id: user._id.toString(),
      uid: user.uid || user._id.toString(),
      email: user.email || 'No email',
      displayName: user.displayName || user.name || 'Unknown',
      photoURL: user.photoURL || null,
      emailVerified: user.emailVerified || false,
      disabled: user.disabled || false,
      provider: user.provider || 'email',
      createdAt: user.createdAt || new Date(),
      lastSignInTime: user.lastSignInTime || user.createdAt || new Date(),
      customClaims: user.customClaims || {}
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        users: transformedUsers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Users API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
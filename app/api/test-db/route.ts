import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    const { client, db } = await connectToDatabase();
    console.log('Database connected successfully');
    
    // Test basic database operations
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Test users collection specifically
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log('Users count:', userCount);
    
    // Get a sample user
    const sampleUser = await usersCollection.findOne({});
    console.log('Sample user:', sampleUser ? 'Found' : 'None');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        collections: collections.map(c => c.name),
        userCount,
        hasSampleUser: !!sampleUser,
        environment: process.env.NODE_ENV,
        mongoUriConfigured: !!process.env.MONGODB_URI
      }
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: process.env.NODE_ENV,
        mongoUriConfigured: !!process.env.MONGODB_URI
      },
      { status: 500 }
    );
  }
}
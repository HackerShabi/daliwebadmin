import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    const demosCollection = db.collection('demos');
    
    // Get total count for pagination
    const total = await demosCollection.countDocuments();
    
    // Get demos with pagination
    const demos = await demosCollection
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Transform demos to match expected format
    const transformedDemos = demos.map(demo => ({
      id: demo._id.toString(),
      name: demo.name || 'Unknown',
      email: demo.email || 'No email',
      phone: demo.phone || 'No phone',
      company: demo.company || 'No company',
      preferredDate: demo.preferredDate || new Date(),
      preferredTime: demo.preferredTime || 'Not specified',
      message: demo.message || 'No message',
      status: demo.status || 'pending',
      createdAt: demo.createdAt || new Date(),
      updatedAt: demo.updatedAt || new Date()
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        demos: transformedDemos,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Demos API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch demos' },
      { status: 500 }
    );
  }
}
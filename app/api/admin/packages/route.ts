import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    const packagesCollection = db.collection('packages');
    
    // Get total count for pagination
    const total = await packagesCollection.countDocuments();
    
    // Get packages with pagination
    const packages = await packagesCollection
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Transform packages to match expected format
    const transformedPackages = packages.map(pkg => ({
      id: pkg._id.toString(),
      name: pkg.name || 'Unknown',
      email: pkg.email || 'No email',
      phone: pkg.phone || 'No phone',
      company: pkg.company || 'No company',
      packageType: pkg.packageType || 'Unknown',
      packageName: pkg.packageName || 'Unknown Package',
      price: pkg.price || 0,
      status: pkg.status || 'pending',
      paymentStatus: pkg.paymentStatus || 'pending',
      createdAt: pkg.createdAt || new Date(),
      updatedAt: pkg.updatedAt || new Date()
    }));
    
    console.log('CRITICAL: Returning packages data as ARRAY directly, not nested object');
    
    const response = {
      success: true,
      data: transformedPackages, // This MUST be the array directly
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      timestamp: new Date().toISOString(),
      version: '2.0-restructured'
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Packages API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}
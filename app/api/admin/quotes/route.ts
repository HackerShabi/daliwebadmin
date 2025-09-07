import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    const quotesCollection = db.collection('quotes');
    
    // Get total count for pagination
    const total = await quotesCollection.countDocuments();
    
    // Get quotes with pagination
    const quotes = await quotesCollection
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Transform quotes to match expected format
    const transformedQuotes = quotes.map(quote => ({
      id: quote._id.toString(),
      name: quote.name || 'Unknown',
      email: quote.email || 'No email',
      phone: quote.phone || 'No phone',
      company: quote.company || 'No company',
      message: quote.message || 'No message',
      status: quote.status || 'pending',
      createdAt: quote.createdAt || new Date(),
      updatedAt: quote.updatedAt || new Date()
    }));
    
    console.log('CRITICAL: Returning quotes data as ARRAY directly, not nested object');
    
    const response = {
      success: true,
      data: transformedQuotes, // This MUST be the array directly
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
    console.error('Quotes API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}
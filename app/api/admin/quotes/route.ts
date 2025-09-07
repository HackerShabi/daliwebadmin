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
    
    return NextResponse.json({
      success: true,
      data: transformedQuotes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Quotes API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}
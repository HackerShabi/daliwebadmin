import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    
    // Get quotes statistics
    const quotesCollection = db.collection('quotes');
    const totalQuotes = await quotesCollection.countDocuments();
    const pendingQuotes = await quotesCollection.countDocuments({ status: 'pending' });
    const completedQuotes = await quotesCollection.countDocuments({ status: 'completed' });
    
    // Get demos statistics
    const demosCollection = db.collection('demos');
    const totalDemos = await demosCollection.countDocuments();
    const pendingDemos = await demosCollection.countDocuments({ status: 'pending' });
    const completedDemos = await demosCollection.countDocuments({ status: 'completed' });
    
    // Get packages statistics
    const packagesCollection = db.collection('packages');
    const totalPackages = await packagesCollection.countDocuments();
    const pendingPackages = await packagesCollection.countDocuments({ status: 'pending' });
    const completedPackages = await packagesCollection.countDocuments({ status: 'completed' });
    
    // Get users statistics
    const usersCollection = db.collection('users');
    const totalUsers = await usersCollection.countDocuments();
    const verifiedUsers = await usersCollection.countDocuments({ emailVerified: true });
    
    // Calculate revenue (mock data for now)
    const totalRevenue = totalPackages * 500; // Assuming average package value
    const averageBookingValue = totalPackages > 0 ? totalRevenue / totalPackages : 0;
    
    const dashboardData = {
      quotes: {
        total: totalQuotes,
        pending: pendingQuotes,
        completed: completedQuotes,
        today: 0, // Would need date filtering
        thisWeek: 0,
        thisMonth: 0
      },
      demos: {
        total: totalDemos,
        pending: pendingDemos,
        completed: completedDemos,
        today: 0,
        thisWeek: 0,
        thisMonth: 0
      },
      packages: {
        total: totalPackages,
        pending: pendingPackages,
        processing: 0,
        completed: completedPackages,
        cancelled: 0,
        paymentPending: 0,
        paymentCompleted: completedPackages,
        today: 0,
        thisWeek: 0,
        thisMonth: 0
      },
      auth: {
        totalUsers: totalUsers,
        emailUsers: totalUsers, // Assuming all are email users
        googleUsers: 0,
        verifiedUsers: verifiedUsers,
        activeUsers: verifiedUsers,
        today: 0,
        thisWeek: 0,
        thisMonth: 0
      },
      revenue: {
        total: totalRevenue,
        average: averageBookingValue,
        packages: totalRevenue
      }
    };
    
    return NextResponse.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
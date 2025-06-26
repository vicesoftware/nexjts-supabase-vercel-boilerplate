import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/database/supabase';
import { type HealthCheckResponse } from '@/features/health-check';

export async function GET(): Promise<NextResponse<HealthCheckResponse>> {
  try {
    const startTime = Date.now();

    // Test basic database connectivity by checking if we can connect
    // We'll just try to access the supabase client and catch any connection errors
    let dbConnected = true;
    let dbError = null;

    try {
      // Simple connection test - this will throw if there's a connection issue
      await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 });
    } catch (err) {
      dbConnected = false;
      dbError = err instanceof Error ? err.message : 'Connection failed';
    }

    const responseTime = Date.now() - startTime;

    if (!dbConnected) {
      // eslint-disable-next-line no-console
      console.error('Database health check failed:', dbError);
      return NextResponse.json(
        {
          status: 'unhealthy',
          database: 'disconnected',
          error: dbError || 'Unknown connection error',
          timestamp: new Date().toISOString(),
          responseTime: `${responseTime}ms`,
          checks: {
            database: false,
            api: true,
          },
        },
        { status: 503 },
      );
    }

    const response: HealthCheckResponse = {
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      environment: process.env.NODE_ENV,
      checks: {
        database: true,
        api: true,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        responseTime: 'N/A',
        checks: {
          database: false,
          api: false,
        },
      },
      { status: 500 },
    );
  }
}

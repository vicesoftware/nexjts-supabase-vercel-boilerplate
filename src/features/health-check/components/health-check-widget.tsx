'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { HealthStatus } from '../types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function HealthCheckWidget() {
  const [isPolling, setIsPolling] = useState(true);

  const { data, error, isLoading, mutate } = useSWR<HealthStatus>(
    '/api/health-check',
    fetcher,
    {
      refreshInterval: isPolling ? 5000 : 0, // Poll every 5 seconds when enabled
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  );

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'unhealthy':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'healthy':
        return '✅';
      case 'unhealthy':
        return '❌';
      default:
        return '⏳';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className={`border rounded-lg p-4 ${getStatusColor(data?.status)}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {getStatusIcon(data?.status)}
            System Health
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPolling(!isPolling)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                isPolling
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isPolling ? 'Auto' : 'Manual'}
            </button>
            <button
              onClick={() => mutate()}
              className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {isLoading && !data && (
          <div className="space-y-2">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Status:</span> Error connecting
            </p>
            <p className="text-xs opacity-75">Failed to fetch health status</p>
          </div>
        )}

        {data && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Status:</span>
                <div className="capitalize">{data.status}</div>
              </div>
              <div>
                <span className="font-medium">Database:</span>
                <div className="capitalize">{data.database}</div>
              </div>
              <div>
                <span className="font-medium">Response:</span>
                <div>{data.responseTime}</div>
              </div>
              <div>
                <span className="font-medium">Environment:</span>
                <div>{data.environment || 'unknown'}</div>
              </div>
            </div>

            {data.error && (
              <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-xs">
                <span className="font-medium">Error:</span> {data.error}
              </div>
            )}

            <div className="mt-3 text-xs opacity-75">
              Last updated: {new Date(data.timestamp).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

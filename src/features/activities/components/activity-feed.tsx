'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/database/client';
import { Activity } from '../types';

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial activities
  useEffect(() => {
    const fetchActivities = async () => {
      const supabase = createBrowserClient();
      try {
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;
        setActivities(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch activities',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    const supabase = createBrowserClient();
    const channel = supabase
      .channel('activities_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activities',
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            setActivities(prev => [
              payload.new as Activity,
              ...prev.slice(0, 19),
            ]);
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setActivities(prev =>
              prev.filter(activity => activity.id !== payload.old.id),
            );
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            setActivities(prev =>
              prev.map(activity =>
                activity.id === payload.new.id
                  ? (payload.new as Activity)
                  : activity,
              ),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'user_action':
        return '👤';
      case 'system_event':
        return '⚙️';
      case 'data_change':
        return '📊';
      default:
        return '📝';
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'user_action':
        return 'border-blue-200 bg-blue-50';
      case 'system_event':
        return 'border-green-200 bg-green-50';
      case 'data_change':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📊</span>
          <h3 className="text-lg font-semibold">Activity Feed</h3>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border rounded-lg p-3 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 rounded-lg p-4 bg-red-50">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">❌</span>
          <h3 className="text-lg font-semibold text-red-800">
            Activity Feed Error
          </h3>
        </div>
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📊</span>
        <h3 className="text-lg font-semibold">Activity Feed</h3>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
          Real-time
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="border rounded-lg p-6 text-center text-gray-500">
          <span className="text-2xl block mb-2">📭</span>
          No activities yet. Create one to get started!
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.map(activity => (
            <div
              key={activity.id}
              className={`border rounded-lg p-3 transition-all hover:shadow-sm ${getActivityColor(
                activity.type,
              )}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">
                  {getActivityIcon(activity.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {activity.title}
                    </h4>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatTime(activity.created_at)}
                    </span>
                  </div>
                  {activity.description && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {activity.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-70 capitalize">
                      {activity.type.replace('_', ' ')}
                    </span>
                    {activity.metadata &&
                      Object.keys(activity.metadata).length > 0 && (
                        <span className="text-xs text-gray-500">
                          +{Object.keys(activity.metadata).length} metadata
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

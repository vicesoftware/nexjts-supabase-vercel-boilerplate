export type ActivityType = 'user_action' | 'system_event' | 'data_change';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface CreateActivityRequest {
  type: ActivityType;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface ActivitiesResponse {
  activities: Activity[];
  count: number;
  hasMore: boolean;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  database: string;
  timestamp: string;
  responseTime: string;
  environment?: string;
  error?: string;
}

export interface HealthCheckResponse extends HealthStatus {
  checks?: {
    database: boolean;
    api: boolean;
    [key: string]: boolean;
  };
}

import { HealthCheckWidget } from '@/features/health-check';
import { ActivityFeed, AddActivityForm } from '@/features/activities';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            NextJS + Supabase Boilerplate
          </h1>
          <p className="text-xl text-gray-600">
            Feature-based architecture with real-time health monitoring and
            activity tracking
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Health Check */}
          <div>
            <HealthCheckWidget />
          </div>

          {/* Activity Feed */}
          <div>
            <ActivityFeed />
          </div>

          {/* Add Activity Form */}
          <div>
            <AddActivityForm />
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Architecture Showcase
          </h2>
          <div className="bg-white rounded-lg shadow-sm border p-6 text-left max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  ✅ Health Check Feature
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Custom API endpoints</li>
                  <li>• SWR polling & caching</li>
                  <li>• System monitoring</li>
                  <li>• Error handling</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  📊 Activity Feed Feature
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Real-time Supabase subscriptions</li>
                  <li>• Direct database CRUD</li>
                  <li>• Form handling & validation</li>
                  <li>• Optimistic updates</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Try it:</strong> Add a new activity using the form
                and watch it appear in real-time! The health check polls every 5
                seconds, while activities update instantly via WebSocket.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

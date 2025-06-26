import { HealthCheckWidget } from '@/features/health-check';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            NextJS + Supabase Boilerplate
          </h1>
          <p className="text-xl text-gray-600">
            Real-time health monitoring and database connectivity
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <div className="lg:col-start-2 xl:col-start-2">
            <HealthCheckWidget />
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Quick Start Guide
          </h2>
          <div className="bg-white rounded-lg shadow-sm border p-6 text-left max-w-2xl mx-auto">
            <ol className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                  1
                </span>
                <div>
                  <strong>Setup Supabase locally:</strong>
                  <code className="block mt-1 bg-gray-100 p-2 rounded text-xs">
                    npx supabase init
                    <br />
                    npx supabase start
                  </code>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                  2
                </span>
                <div>
                  <strong>Copy your Supabase credentials</strong> to{' '}
                  <code className="bg-gray-100 px-1 rounded">.env.local</code>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                  3
                </span>
                <div>
                  <strong>Start development:</strong>
                  <code className="block mt-1 bg-gray-100 p-2 rounded text-xs">
                    pnpm dev
                  </code>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

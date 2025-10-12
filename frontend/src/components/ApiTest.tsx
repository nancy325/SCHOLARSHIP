import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const ApiTest: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<string>('Testing...');
  const [scholarshipsCount, setScholarshipsCount] = useState<number>(0);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    try {
      // Test health endpoint
      const healthResponse = await apiService.getHealth();
      setHealthStatus(healthResponse.success ? 'Connected ✅' : 'Failed ❌');

      // Test scholarships endpoint
      const scholarshipsResponse = await apiService.getScholarships();
      if (scholarshipsResponse.success && scholarshipsResponse.data) {
        setScholarshipsCount(Array.isArray(scholarshipsResponse.data) ? scholarshipsResponse.data.length : 0);
      }

      // Test stats endpoint
      const statsResponse = await apiService.getStats();
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }

      setError(null);
    } catch (err: any) {
      setError(err.message || 'API connection failed');
      setHealthStatus('Failed ❌');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">API Integration Test</h2>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Health Check</h3>
          <p className="text-sm text-gray-600">{healthStatus}</p>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Scholarships</h3>
          <p className="text-sm text-gray-600">Loaded {scholarshipsCount} scholarships</p>
        </div>

        {stats && (
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">Statistics</h3>
            <div className="text-sm text-gray-600">
              <p>Total Scholarships: {stats.total_scholarships}</p>
              <p>Active Scholarships: {stats.active_scholarships}</p>
              <div className="mt-2">
                <p className="font-medium">By Type:</p>
                <ul className="ml-4">
                  {Object.entries(stats.by_type || {}).map(([type, count]) => (
                    <li key={type} className="capitalize">{type}: {count as number}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
            <h3 className="font-semibold text-red-800">Error</h3>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button 
          onClick={testApiConnection}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Again
        </button>
      </div>
    </div>
  );
};

export default ApiTest;

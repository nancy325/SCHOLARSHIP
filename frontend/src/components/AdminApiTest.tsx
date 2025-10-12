import React, { useState } from 'react';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AdminApiTest = () => {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFn();
      setTestResults(prev => ({ ...prev, [testName]: { success: true, data: result } }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, [testName]: { success: false, error: error.message } }));
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const tests = [
    {
      name: 'Dashboard Stats',
      fn: () => apiService.getDashboardStats()
    },
    {
      name: 'Recent Activity',
      fn: () => apiService.getRecentActivity()
    },
    {
      name: 'Users List',
      fn: () => apiService.getUsers()
    },
    {
      name: 'Institutes List',
      fn: () => apiService.getInstitutes()
    },
    {
      name: 'Universities List',
      fn: () => apiService.getUniversities()
    },
    {
      name: 'Scholarships List',
      fn: () => apiService.getScholarships()
    },
    {
      name: 'Institutes Options',
      fn: () => apiService.getInstitutesOptions()
    },
    {
      name: 'Universities Options',
      fn: () => apiService.getUniversitiesOptions()
    }
  ];

  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test.name, test.fn);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin API Integration Test</CardTitle>
          <CardDescription>Test all admin dashboard API endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={runAllTests} className="w-full">
              Run All Tests
            </Button>
            
            <div className="grid gap-4">
              {tests.map((test) => (
                <div key={test.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{test.name}</span>
                    {loading[test.name] && (
                      <Badge variant="outline">Loading...</Badge>
                    )}
                    {testResults[test.name] && (
                      <Badge 
                        variant={testResults[test.name].success ? "default" : "destructive"}
                        className={testResults[test.name].success ? "bg-green-100 text-green-800" : ""}
                      >
                        {testResults[test.name].success ? "Success" : "Failed"}
                      </Badge>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => runTest(test.name, test.fn)}
                    disabled={loading[test.name]}
                  >
                    Test
                  </Button>
                </div>
              ))}
            </div>

            {Object.keys(testResults).length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Test Results</h3>
                <div className="space-y-4">
                  {Object.entries(testResults).map(([testName, result]) => (
                    <Card key={testName}>
                      <CardHeader>
                        <CardTitle className="text-base">{testName}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {result.success ? (
                          <div>
                            <Badge className="bg-green-100 text-green-800 mb-2">Success</Badge>
                            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </div>
                        ) : (
                          <div>
                            <Badge variant="destructive" className="mb-2">Failed</Badge>
                            <p className="text-sm text-red-600">{result.error}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminApiTest;

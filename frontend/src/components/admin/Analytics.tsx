import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2, 
  GraduationCap, 
  Calendar,
  Download,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { apiService } from '@/services/api';

const Analytics = () => {
  const [showData, setShowData] = useState(true);

  const { data: analyticsResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => apiService.getAnalytics(),
  });

  const { data: activityResponse } = useQuery({
    queryKey: ['admin-recent-activity'],
    queryFn: () => apiService.getRecentActivity(),
  });

  const metrics = analyticsResponse?.data;
  const recentActivity = activityResponse?.data ?? [];

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="outline">{impact}</Badge>;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'institute':
        return <Building2 className="h-4 w-4 text-green-500" />;
      case 'scholarship':
        return <GraduationCap className="h-4 w-4 text-purple-500" />;
      case 'alert':
        return <Calendar className="h-4 w-4 text-destructive" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const exportData = () => {
    if (!metrics) {
      toast.error('There are no analytics metrics to export yet.');
      return;
    }
    const rows = Object.entries(metrics).map(([metric, value]) => `${metric},${JSON.stringify(value)}`);
    const csv = ['Metric,Value', ...rows].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scholarsnap-analytics.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
          <p className="text-sm text-muted-foreground">Current counts and recent activity from the connected admin API</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading} aria-label="Refresh analytics">
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button variant="outline" onClick={() => setShowData(!showData)}>
            {showData ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showData ? 'Hide Data' : 'Show Data'}
          </Button>
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {isError && <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">Analytics could not be loaded. Refresh to retry.</div>}
      {isLoading ? <div role="status" className="rounded-md border border-border bg-card p-8 text-center text-sm text-muted-foreground">Loading current metrics…</div> : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{showData ? (metrics?.total_users?.toLocaleString() ?? '—') : '••••'}</div>
            <p className="text-xs text-muted-foreground">{metrics ? 'Current registered users' : 'No metric available'}</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Institutes</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{showData ? (metrics?.total_institutes?.toLocaleString() ?? '—') : '••••'}</div>
            <p className="text-xs text-muted-foreground">Current registered institutes</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Scholarships</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{showData ? (metrics?.active_scholarships?.toLocaleString() ?? '—') : '••••'}</div>
            <p className="text-xs text-muted-foreground">Scholarships with a current deadline</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Universities</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{showData ? (metrics?.total_universities?.toLocaleString() ?? '—') : '••••'}</div>
            <p className="text-xs text-muted-foreground">Current registered universities</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total scholarships</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{showData ? (metrics?.total_scholarships?.toLocaleString() ?? '—') : '••••'}</div>
            <p className="text-xs text-muted-foreground">Published scholarship records</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest activity returned by the server</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length ? recentActivity.map((activity: any, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{activity.action}</div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{activity.time}</div>
                  </div>
                </div>
              )) : <p className="py-6 text-center text-sm text-muted-foreground">No recent activity is available.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;

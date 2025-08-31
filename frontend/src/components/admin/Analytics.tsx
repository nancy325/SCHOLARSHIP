import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2, 
  GraduationCap, 
  DollarSign,
  Calendar,
  Download,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [showData, setShowData] = useState(true);

  // Mock data for charts - replace with actual API data
  const userGrowthData = [
    { month: 'Jan', users: 1200, institutes: 45, scholarships: 67 },
    { month: 'Feb', users: 1350, institutes: 52, scholarships: 78 },
    { month: 'Mar', users: 1480, institutes: 58, scholarships: 85 },
    { month: 'Apr', users: 1620, institutes: 64, scholarships: 92 },
    { month: 'May', users: 1780, institutes: 71, scholarships: 98 },
    { month: 'Jun', users: 1950, institutes: 78, scholarships: 105 },
    { month: 'Jul', users: 2100, institutes: 85, scholarships: 112 },
    { month: 'Aug', users: 2280, institutes: 92, scholarships: 118 },
    { month: 'Sep', users: 2450, institutes: 98, scholarships: 125 },
    { month: 'Oct', users: 2620, institutes: 105, scholarships: 132 },
    { month: 'Nov', users: 2780, institutes: 112, scholarships: 138 },
    { month: 'Dec', users: 2847, institutes: 156, scholarships: 89 }
  ];

  const applicationTrends = [
    { month: 'Jan', applications: 450, approved: 120, rejected: 80, pending: 250 },
    { month: 'Feb', applications: 520, approved: 145, rejected: 95, pending: 280 },
    { month: 'Mar', applications: 580, approved: 165, rejected: 110, pending: 305 },
    { month: 'Apr', applications: 640, approved: 185, rejected: 125, pending: 330 },
    { month: 'May', applications: 700, approved: 205, rejected: 140, pending: 355 },
    { month: 'Jun', applications: 760, approved: 225, rejected: 155, pending: 380 },
    { month: 'Jul', applications: 820, approved: 245, rejected: 170, pending: 405 },
    { month: 'Aug', applications: 880, approved: 265, rejected: 185, pending: 430 },
    { month: 'Sep', applications: 940, approved: 285, rejected: 200, pending: 455 },
    { month: 'Oct', applications: 1000, approved: 305, rejected: 215, pending: 480 },
    { month: 'Nov', applications: 1060, approved: 325, rejected: 230, pending: 505 },
    { month: 'Dec', applications: 1120, approved: 345, rejected: 245, pending: 530 }
  ];

  const scholarshipDistribution = [
    { name: 'Merit-Based', value: 45, color: '#3B82F6' },
    { name: 'Need-Based', value: 30, color: '#10B981' },
    { name: 'Project-Based', value: 15, color: '#8B5CF6' },
    { name: 'Athletic', value: 10, color: '#F59E0B' }
  ];

  const institutePerformance = [
    { name: 'University of Technology', students: 15000, scholarships: 25, rating: 4.8 },
    { name: 'State Community College', students: 8000, scholarships: 15, rating: 4.2 },
    { name: 'Tech Institute of Innovation', students: 5000, scholarships: 30, rating: 4.6 },
    { name: 'Liberal Arts College', students: 3000, scholarships: 20, rating: 4.4 },
    { name: 'Engineering University', students: 12000, scholarships: 28, rating: 4.7 }
  ];

  const topFields = [
    { field: 'Engineering', applications: 450, successRate: 78 },
    { field: 'Computer Science', applications: 380, successRate: 82 },
    { field: 'Business', applications: 320, successRate: 75 },
    { field: 'Medicine', applications: 280, successRate: 68 },
    { field: 'Arts & Humanities', applications: 240, successRate: 72 }
  ];

  const recentActivity = [
    { action: 'New user registered', time: '2 minutes ago', type: 'user', impact: 'low' },
    { action: 'Institute profile updated', time: '15 minutes ago', type: 'institute', impact: 'medium' },
    { action: 'New scholarship added', time: '1 hour ago', type: 'scholarship', impact: 'high' },
    { action: 'Application submitted', time: '2 hours ago', type: 'application', impact: 'medium' },
    { action: 'Scholarship deadline approaching', time: '3 hours ago', type: 'alert', impact: 'high' },
    { action: 'Institute verification completed', time: '4 hours ago', type: 'institute', impact: 'medium' }
  ];

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
      case 'application':
        return <DollarSign className="h-4 w-4 text-orange-500" />;
      case 'alert':
        return <Calendar className="h-4 w-4 text-red-500" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const exportData = () => {
    // Implement export functionality
    console.log('Exporting analytics data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
          <p className="text-sm text-gray-600">Comprehensive insights and metrics about your scholarship portal</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
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

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Institutes</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Scholarships</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+23%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
            <CardDescription>User, institute, and scholarship growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} name="Users" />
                <Line type="monotone" dataKey="institutes" stroke="#10B981" strokeWidth={2} name="Institutes" />
                <Line type="monotone" dataKey="scholarships" stroke="#8B5CF6" strokeWidth={2} name="Scholarships" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Application Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Application Trends</CardTitle>
            <CardDescription>Monthly application submissions and outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#3B82F6" name="Total Applications" />
                <Bar dataKey="approved" fill="#10B981" name="Approved" />
                <Bar dataKey="rejected" fill="#EF4444" name="Rejected" />
                <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Scholarship Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Scholarship Distribution</CardTitle>
            <CardDescription>Breakdown by scholarship type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scholarshipDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {scholarshipDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Institute Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Institute Performance</CardTitle>
            <CardDescription>Top performing institutions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={institutePerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="scholarships" fill="#8B5CF6" name="Scholarships" />
                <Bar dataKey="rating" fill="#F59E0B" name="Rating" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Fields */}
        <Card>
          <CardHeader>
            <CardTitle>Top Fields of Study</CardTitle>
            <CardDescription>Most popular fields and success rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topFields.map((field, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{field.field}</div>
                    <div className="text-sm text-gray-600">{field.applications} applications</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">{field.successRate}%</div>
                    <div className="text-sm text-gray-600">success rate</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activities and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{activity.action}</div>
                      {getImpactBadge(activity.impact)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>Key performance indicators and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">78%</div>
              <div className="text-sm text-gray-600 mt-1">Average Success Rate</div>
              <div className="text-xs text-green-600 mt-1">+5% from last month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">$2.4M</div>
              <div className="text-sm text-gray-600 mt-1">Total Awarded</div>
              <div className="text-xs text-green-600 mt-1">+15% from last month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">156</div>
              <div className="text-sm text-gray-600 mt-1">Active Partnerships</div>
              <div className="text-xs text-green-600 mt-1">+8% from last month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;

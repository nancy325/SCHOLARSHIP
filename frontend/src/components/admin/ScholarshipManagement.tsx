import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  GraduationCap,
  DollarSign,
  Calendar,
  Users,
  Building2,
  MapPin,
  BookOpen,
  Target,
  Award,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ScholarshipManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddScholarshipOpen, setIsAddScholarshipOpen] = useState(false);
  const [isEditScholarshipOpen, setIsEditScholarshipOpen] = useState(false);
  const [isViewScholarshipOpen, setIsViewScholarshipOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  // Mock data - replace with actual API calls
  const scholarships = [
    {
      id: 1,
      title: 'Merit-Based Engineering Scholarship',
      institute: 'University of Technology',
      type: 'merit_based',
      status: 'active',
      amount: 25000,
      currency: 'USD',
      deadline: '2024-03-15',
      applications: 45,
      maxApplications: 100,
      field: 'Engineering',
      level: 'undergraduate',
      description: 'A prestigious scholarship for outstanding engineering students demonstrating academic excellence and leadership potential.',
      requirements: 'Minimum 3.8 GPA, Engineering major, Leadership experience',
      eligibility: 'US citizens, Full-time students, Engineering majors',
      documents: 'Transcript, Resume, Letters of recommendation, Personal statement',
      createdDate: '2024-01-15',
      lastUpdated: '2024-01-20'
    },
    {
      id: 2,
      title: 'Community Service Leadership Award',
      institute: 'State Community College',
      type: 'need_based',
      status: 'active',
      amount: 10000,
      currency: 'USD',
      deadline: '2024-04-01',
      applications: 23,
      maxApplications: 50,
      field: 'Any',
      level: 'undergraduate',
      description: 'Recognition for students who have demonstrated exceptional community service and leadership.',
      requirements: 'Minimum 3.0 GPA, 100+ community service hours, Leadership role',
      eligibility: 'All students, Community service experience required',
      documents: 'Service log, Letters of recommendation, Personal statement',
      createdDate: '2024-01-10',
      lastUpdated: '2024-01-18'
    },
    {
      id: 3,
      title: 'Innovation in Technology Grant',
      institute: 'Tech Institute of Innovation',
      type: 'project_based',
      status: 'pending',
      amount: 15000,
      currency: 'USD',
      deadline: '2024-05-30',
      applications: 0,
      maxApplications: 25,
      field: 'Technology',
      level: 'graduate',
      description: 'Funding for innovative technology projects that demonstrate creativity and potential impact.',
      requirements: 'Project proposal, Technology background, Innovation focus',
      eligibility: 'Graduate students, Technology/CS majors',
      documents: 'Project proposal, Portfolio, Academic references',
      createdDate: '2024-01-05',
      lastUpdated: '2024-01-20'
    },
    {
      id: 4,
      title: 'Arts and Humanities Excellence Scholarship',
      institute: 'Liberal Arts College',
      type: 'merit_based',
      status: 'expired',
      amount: 20000,
      currency: 'USD',
      deadline: '2023-12-01',
      applications: 67,
      maxApplications: 75,
      field: 'Arts & Humanities',
      level: 'undergraduate',
      description: 'Supporting students pursuing degrees in arts, literature, philosophy, and related fields.',
      requirements: 'Minimum 3.7 GPA, Arts/Humanities major, Creative portfolio',
      eligibility: 'Arts & Humanities majors, Full-time students',
      documents: 'Portfolio, Academic transcript, Creative samples',
      createdDate: '2023-11-01',
      lastUpdated: '2023-12-15'
    }
  ];

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.institute.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.field.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || scholarship.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expired</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'merit_based':
        return <Badge className="bg-blue-100 text-blue-800">Merit-Based</Badge>;
      case 'need_based':
        return <Badge className="bg-green-100 text-green-800">Need-Based</Badge>;
      case 'project_based':
        return <Badge className="bg-purple-100 text-purple-800">Project-Based</Badge>;
      case 'athletic':
        return <Badge className="bg-orange-100 text-orange-800">Athletic</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'undergraduate':
        return <Badge variant="outline">Undergraduate</Badge>;
      case 'graduate':
        return <Badge className="bg-indigo-100 text-indigo-800">Graduate</Badge>;
      case 'phd':
        return <Badge className="bg-purple-100 text-purple-800">PhD</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const isDeadlineNear = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isDeadlineExpired = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    return deadlineDate < today;
  };

  const handleEditScholarship = (scholarship: any) => {
    setSelectedScholarship(scholarship);
    setIsEditScholarshipOpen(true);
  };

  const handleViewScholarship = (scholarship: any) => {
    setSelectedScholarship(scholarship);
    setIsViewScholarshipOpen(true);
  };

  const handleDeleteScholarship = (scholarshipId: number) => {
    // Implement delete functionality
    console.log('Delete scholarship:', scholarshipId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Scholarship Management</h3>
          <p className="text-sm text-gray-600">Manage scholarships, applications, and funding opportunities</p>
        </div>
        <Dialog open={isAddScholarshipOpen} onOpenChange={setIsAddScholarshipOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Scholarship
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Scholarship</DialogTitle>
              <DialogDescription>Add a new scholarship opportunity to the platform</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Scholarship Title</Label>
                  <Input id="title" placeholder="Enter scholarship title" />
                </div>
                <div>
                  <Label htmlFor="institute">Institute</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select institute" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utech">University of Technology</SelectItem>
                      <SelectItem value="scc">State Community College</SelectItem>
                      <SelectItem value="tii">Tech Institute of Innovation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="merit_based">Merit-Based</SelectItem>
                      <SelectItem value="need_based">Need-Based</SelectItem>
                      <SelectItem value="project_based">Project-Based</SelectItem>
                      <SelectItem value="athletic">Athletic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="level">Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="field">Field of Study</Label>
                  <Input id="field" placeholder="e.g., Engineering" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" placeholder="Enter amount" />
                </div>
                <div>
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input id="deadline" type="date" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max-applications">Max Applications</Label>
                  <Input id="max-applications" type="number" placeholder="Enter max applications" />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter scholarship description" rows={3} />
              </div>
              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea id="requirements" placeholder="Enter eligibility requirements" rows={2} />
              </div>
              <div>
                <Label htmlFor="eligibility">Eligibility Criteria</Label>
                <Textarea id="eligibility" placeholder="Enter eligibility criteria" rows={2} />
              </div>
              <div>
                <Label htmlFor="documents">Required Documents</Label>
                <Textarea id="documents" placeholder="Enter required documents" rows={2} />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddScholarshipOpen(false)}>
                Cancel
              </Button>
              <Button>Create Scholarship</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search scholarships by title, institute, or field..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Scholarships Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredScholarships.map((scholarship) => (
          <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{scholarship.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      {getTypeBadge(scholarship.type)}
                      {getStatusBadge(scholarship.status)}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewScholarship(scholarship)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditScholarship(scholarship)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Scholarship
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteScholarship(scholarship.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Scholarship
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Building2 className="h-4 w-4" />
                  <span className="truncate">{scholarship.institute}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <BookOpen className="h-4 w-4" />
                  <span>{scholarship.field}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Target className="h-4 w-4" />
                  <span>{getLevelBadge(scholarship.level)}</span>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{formatCurrency(scholarship.amount, scholarship.currency)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span>{scholarship.applications}/{scholarship.maxApplications}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Deadline:</span>
                      </div>
                      <div className={`text-sm font-medium ${
                        isDeadlineExpired(scholarship.deadline) ? 'text-red-600' :
                        isDeadlineNear(scholarship.deadline) ? 'text-orange-600' : 'text-gray-600'
                      }`}>
                        {scholarship.deadline}
                      </div>
                    </div>
                    
                    {isDeadlineNear(scholarship.deadline) && !isDeadlineExpired(scholarship.deadline) && (
                      <div className="flex items-center space-x-2 text-sm text-orange-600">
                        <Clock className="h-4 w-4" />
                        <span>Deadline approaching!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Scholarship Dialog */}
      <Dialog open={isViewScholarshipOpen} onOpenChange={setIsViewScholarshipOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Scholarship Details</DialogTitle>
            <DialogDescription>Complete information about the scholarship</DialogDescription>
          </DialogHeader>
          {selectedScholarship && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Scholarship Title</Label>
                  <div className="text-sm font-medium">{selectedScholarship.title}</div>
                </div>
                <div>
                  <Label>Institute</Label>
                  <div className="text-sm font-medium">{selectedScholarship.institute}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Type</Label>
                  <div>{getTypeBadge(selectedScholarship.type)}</div>
                </div>
                <div>
                  <Label>Level</Label>
                  <div>{getLevelBadge(selectedScholarship.level)}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div>{getStatusBadge(selectedScholarship.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Amount</Label>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(selectedScholarship.amount, selectedScholarship.currency)}
                  </div>
                </div>
                <div>
                  <Label>Field of Study</Label>
                  <div className="text-sm font-medium">{selectedScholarship.field}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Application Deadline</Label>
                  <div className={`text-sm font-medium ${
                    isDeadlineExpired(selectedScholarship.deadline) ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {selectedScholarship.deadline}
                  </div>
                </div>
                <div>
                  <Label>Applications</Label>
                  <div className="text-sm font-medium">
                    {selectedScholarship.applications}/{selectedScholarship.maxApplications}
                  </div>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <div className="text-sm text-gray-600">{selectedScholarship.description}</div>
              </div>
              <div>
                <Label>Requirements</Label>
                <div className="text-sm text-gray-600">{selectedScholarship.requirements}</div>
              </div>
              <div>
                <Label>Eligibility Criteria</Label>
                <div className="text-sm text-gray-600">{selectedScholarship.eligibility}</div>
              </div>
              <div>
                <Label>Required Documents</Label>
                <div className="text-sm text-gray-600">{selectedScholarship.documents}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Created Date</Label>
                  <div className="text-sm font-medium">{selectedScholarship.createdDate}</div>
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <div className="text-sm font-medium">{selectedScholarship.lastUpdated}</div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsViewScholarshipOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Scholarship Dialog */}
      <Dialog open={isEditScholarshipOpen} onOpenChange={setIsEditScholarshipOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Scholarship</DialogTitle>
            <DialogDescription>Update scholarship information and settings</DialogDescription>
          </DialogHeader>
          {selectedScholarship && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Scholarship Title</Label>
                  <Input id="edit-title" defaultValue={selectedScholarship.title} />
                </div>
                <div>
                  <Label htmlFor="edit-institute">Institute</Label>
                  <Select defaultValue={selectedScholarship.institute}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="University of Technology">University of Technology</SelectItem>
                      <SelectItem value="State Community College">State Community College</SelectItem>
                      <SelectItem value="Tech Institute of Innovation">Tech Institute of Innovation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-type">Type</Label>
                  <Select defaultValue={selectedScholarship.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="merit_based">Merit-Based</SelectItem>
                      <SelectItem value="need_based">Need-Based</SelectItem>
                      <SelectItem value="project_based">Project-Based</SelectItem>
                      <SelectItem value="athletic">Athletic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-level">Level</Label>
                  <Select defaultValue={selectedScholarship.level}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select defaultValue={selectedScholarship.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-amount">Amount</Label>
                  <Input id="edit-amount" type="number" defaultValue={selectedScholarship.amount} />
                </div>
                <div>
                  <Label htmlFor="edit-deadline">Application Deadline</Label>
                  <Input id="edit-deadline" type="date" defaultValue={selectedScholarship.deadline} />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" defaultValue={selectedScholarship.description} rows={3} />
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditScholarshipOpen(false)}>
              Cancel
            </Button>
            <Button>Update Scholarship</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScholarshipManagement;

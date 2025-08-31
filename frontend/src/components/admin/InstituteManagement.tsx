import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  GraduationCap,
  CheckCircle,
  XCircle,
  Star
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

const InstituteManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddInstituteOpen, setIsAddInstituteOpen] = useState(false);
  const [isEditInstituteOpen, setIsEditInstituteOpen] = useState(false);
  const [isViewInstituteOpen, setIsViewInstituteOpen] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState(null);

  // Mock data - replace with actual API calls
  const institutes = [
    {
      id: 1,
      name: 'University of Technology',
      type: 'university',
      status: 'verified',
      email: 'admin@utech.edu',
      phone: '+1 (555) 123-4567',
      website: 'https://utech.edu',
      address: '123 University Ave, New York, NY 10001',
      description: 'A leading technology university offering cutting-edge programs in engineering and computer science.',
      established: '1985',
      accreditation: 'Regional',
      students: 15000,
      scholarships: 25,
      rating: 4.8,
      contactPerson: 'Dr. Sarah Johnson',
      contactPhone: '+1 (555) 123-4568',
      registrationDate: '2024-01-15',
      lastUpdated: '2024-01-20'
    },
    {
      id: 2,
      name: 'State Community College',
      type: 'community_college',
      status: 'pending',
      email: 'info@scc.edu',
      phone: '+1 (555) 987-6543',
      website: 'https://scc.edu',
      address: '456 College Blvd, Los Angeles, CA 90210',
      description: 'A community college providing affordable education and career training programs.',
      established: '1970',
      accreditation: 'Regional',
      students: 8000,
      scholarships: 15,
      rating: 4.2,
      contactPerson: 'Mr. Robert Smith',
      contactPhone: '+1 (555) 987-6544',
      registrationDate: '2024-01-10',
      lastUpdated: '2024-01-18'
    },
    {
      id: 3,
      name: 'Tech Institute of Innovation',
      type: 'technical_institute',
      status: 'verified',
      email: 'contact@tii.edu',
      phone: '+1 (555) 456-7890',
      website: 'https://tii.edu',
      address: '789 Innovation Dr, Austin, TX 73301',
      description: 'A specialized technical institute focusing on innovation and entrepreneurship.',
      established: '2000',
      accreditation: 'National',
      students: 5000,
      scholarships: 30,
      rating: 4.6,
      contactPerson: 'Prof. Michael Chen',
      contactPhone: '+1 (555) 456-7891',
      registrationDate: '2024-01-05',
      lastUpdated: '2024-01-20'
    },
    {
      id: 4,
      name: 'Liberal Arts College',
      type: 'liberal_arts',
      status: 'suspended',
      email: 'admissions@lac.edu',
      phone: '+1 (555) 789-0123',
      website: 'https://lac.edu',
      address: '321 Arts Way, Boston, MA 02101',
      description: 'A liberal arts college emphasizing critical thinking and creative expression.',
      established: '1960',
      accreditation: 'Regional',
      students: 3000,
      scholarships: 20,
      rating: 4.4,
      contactPerson: 'Dr. Emily Davis',
      contactPhone: '+1 (555) 789-0124',
      registrationDate: '2023-12-15',
      lastUpdated: '2024-01-10'
    }
  ];

  const filteredInstitutes = institutes.filter(institute => {
    const matchesSearch = institute.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         institute.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         institute.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || institute.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      case 'rejected':
        return <Badge variant="secondary">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'university':
        return <Badge className="bg-blue-100 text-blue-800">University</Badge>;
      case 'community_college':
        return <Badge className="bg-green-100 text-green-800">Community College</Badge>;
      case 'technical_institute':
        return <Badge className="bg-purple-100 text-purple-800">Technical Institute</Badge>;
      case 'liberal_arts':
        return <Badge className="bg-orange-100 text-orange-800">Liberal Arts</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleEditInstitute = (institute: any) => {
    setSelectedInstitute(institute);
    setIsEditInstituteOpen(true);
  };

  const handleViewInstitute = (institute: any) => {
    setSelectedInstitute(institute);
    setIsViewInstituteOpen(true);
  };

  const handleDeleteInstitute = (instituteId: number) => {
    // Implement delete functionality
    console.log('Delete institute:', instituteId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Institute Management</h3>
          <p className="text-sm text-gray-600">Manage registered educational institutions and their profiles</p>
        </div>
        <Dialog open={isAddInstituteOpen} onOpenChange={setIsAddInstituteOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Register New Institute
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Register New Institute</DialogTitle>
              <DialogDescription>Add a new educational institution to the platform</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Institute Name</Label>
                  <Input id="name" placeholder="Enter institute name" />
                </div>
                <div>
                  <Label htmlFor="type">Institute Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="university">University</SelectItem>
                      <SelectItem value="community_college">Community College</SelectItem>
                      <SelectItem value="technical_institute">Technical Institute</SelectItem>
                      <SelectItem value="liberal_arts">Liberal Arts College</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email address" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" placeholder="Enter website URL" />
                </div>
                <div>
                  <Label htmlFor="established">Established Year</Label>
                  <Input id="established" placeholder="Enter year" />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Enter full address" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter institute description" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-person">Contact Person</Label>
                  <Input id="contact-person" placeholder="Enter contact person name" />
                </div>
                <div>
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input id="contact-phone" placeholder="Enter contact phone" />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddInstituteOpen(false)}>
                Cancel
              </Button>
              <Button>Register Institute</Button>
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
                placeholder="Search institutes by name, email, or address..."
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
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Institutes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredInstitutes.map((institute) => (
          <Card key={institute.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{institute.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      {getTypeBadge(institute.type)}
                      {getStatusBadge(institute.status)}
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
                    <DropdownMenuItem onClick={() => handleViewInstitute(institute)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditInstitute(institute)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Institute
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteInstitute(institute.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Institute
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{institute.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{institute.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{institute.address}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Globe className="h-4 w-4" />
                  <span className="truncate">{institute.website}</span>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{institute.students.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4 text-gray-400" />
                      <span>{institute.scholarships} scholarships</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{institute.rating}</span>
                    <span className="text-xs text-gray-500">({institute.established})</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Institute Dialog */}
      <Dialog open={isViewInstituteOpen} onOpenChange={setIsViewInstituteOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Institute Details</DialogTitle>
            <DialogDescription>Complete information about the institute</DialogDescription>
          </DialogHeader>
          {selectedInstitute && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Institute Name</Label>
                  <div className="text-sm font-medium">{selectedInstitute.name}</div>
                </div>
                <div>
                  <Label>Type</Label>
                  <div>{getTypeBadge(selectedInstitute.type)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <div>{getStatusBadge(selectedInstitute.status)}</div>
                </div>
                <div>
                  <Label>Established</Label>
                  <div className="text-sm font-medium">{selectedInstitute.established}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <div className="text-sm font-medium">{selectedInstitute.email}</div>
                </div>
                <div>
                  <Label>Phone</Label>
                  <div className="text-sm font-medium">{selectedInstitute.phone}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Website</Label>
                  <div className="text-sm font-medium">{selectedInstitute.website}</div>
                </div>
                <div>
                  <Label>Accreditation</Label>
                  <div className="text-sm font-medium">{selectedInstitute.accreditation}</div>
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <div className="text-sm font-medium">{selectedInstitute.address}</div>
              </div>
              <div>
                <Label>Description</Label>
                <div className="text-sm text-gray-600">{selectedInstitute.description}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact Person</Label>
                  <div className="text-sm font-medium">{selectedInstitute.contactPerson}</div>
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <div className="text-sm font-medium">{selectedInstitute.contactPhone}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Students</Label>
                  <div className="text-sm font-medium">{selectedInstitute.students.toLocaleString()}</div>
                </div>
                <div>
                  <Label>Scholarships</Label>
                  <div className="text-sm font-medium">{selectedInstitute.scholarships}</div>
                </div>
                <div>
                  <Label>Rating</Label>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{selectedInstitute.rating}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Registration Date</Label>
                  <div className="text-sm font-medium">{selectedInstitute.registrationDate}</div>
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <div className="text-sm font-medium">{selectedInstitute.lastUpdated}</div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsViewInstituteOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Institute Dialog */}
      <Dialog open={isEditInstituteOpen} onOpenChange={setIsEditInstituteOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Institute</DialogTitle>
            <DialogDescription>Update institute information and status</DialogDescription>
          </DialogHeader>
          {selectedInstitute && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Institute Name</Label>
                  <Input id="edit-name" defaultValue={selectedInstitute.name} />
                </div>
                <div>
                  <Label htmlFor="edit-type">Institute Type</Label>
                  <Select defaultValue={selectedInstitute.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="university">University</SelectItem>
                      <SelectItem value="community_college">Community College</SelectItem>
                      <SelectItem value="technical_institute">Technical Institute</SelectItem>
                      <SelectItem value="liberal_arts">Liberal Arts College</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" type="email" defaultValue={selectedInstitute.email} />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input id="edit-phone" defaultValue={selectedInstitute.phone} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-website">Website</Label>
                  <Input id="edit-website" defaultValue={selectedInstitute.website} />
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select defaultValue={selectedInstitute.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-address">Address</Label>
                <Input id="edit-address" defaultValue={selectedInstitute.address} />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" defaultValue={selectedInstitute.description} rows={3} />
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditInstituteOpen(false)}>
              Cancel
            </Button>
            <Button>Update Institute</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstituteManagement;

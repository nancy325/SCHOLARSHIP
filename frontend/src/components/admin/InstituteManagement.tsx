import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
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
  Users,
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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [universityFilter, setUniversityFilter] = useState('all');
  const [isEditInstituteOpen, setIsEditInstituteOpen] = useState(false);
  const [isViewInstituteOpen, setIsViewInstituteOpen] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [universities, setUniversities] = useState<any[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>('');
  const [newInstitute, setNewInstitute] = useState({
    name: '',
    type: 'university',
    status: 'pending',
    email: '',
    phone: '',
    website: '',
    address: '',
    description: '',
    established: '',
    accreditation: '',
    students: 0,
    rating: 0,
    contact_person: '',
    contact_phone: ''
  });
  const [editInstitute, setEditInstitute] = useState({
    name: '',
    type: 'university',
    status: 'pending',
    email: '',
    phone: '',
    website: '',
    address: '',
    description: '',
    established: '',
    accreditation: '',
    students: 0,
    rating: 0,
    contact_person: '',
    contact_phone: ''
  });

  // Role and scoping
  const currentUser = apiService.getStoredUser();
  const role = (currentUser as any)?.role;
  const [allowedUniversityId, setAllowedUniversityId] = useState<number | undefined>(undefined);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch institutes from API
  useEffect(() => {
    fetchInstitutes();
  }, [debouncedSearchTerm, statusFilter, universityFilter, allowedUniversityId]);

  // Determine allowed university for university_admin using scoped options endpoint
  useEffect(() => {
    (async () => {
      try {
        if (role === 'university_admin') {
          console.log('Fetching universities for university_admin...');
          // This endpoint returns only the allowed university for university_admin
          const resp = await apiService.getUniversitiesOptions();
          console.log('Universities response:', resp);
          if (resp.success) {
            const list: any[] = (resp as any).data || [];
            console.log('Universities list:', list);
            if (list.length === 1) {
              const universityId = Number(list[0].id);
              console.log('Setting allowedUniversityId to:', universityId);
              setAllowedUniversityId(universityId);
            }
          }
        }
      } catch (e) {
        console.error('Failed to determine allowed university', e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load universities for filters and dropdowns
  useEffect(() => {
    (async () => {
      try {
        // Use getUniversities to get all active universities for the filter dropdown
        // Request a large per_page to get all active universities
        // Backend already filters by RecStatus='active' by default
        const resp = await apiService.getUniversities({ per_page: 1000 });
        if (resp.success) {
          const universitiesList = resp.data || [];
          // Additional safety check: filter only active universities (backend should already do this)
          const activeUniversities = universitiesList.filter((u: any) => 
            !u.RecStatus || u.RecStatus === 'active'
          );
          console.log('Loaded universities for filter:', activeUniversities.length, 'active universities');
          setUniversities(activeUniversities);
        } else {
          console.error('Failed to load universities for filter:', resp.message);
          setUniversities([]);
        }
      } catch (e) {
        console.error('Failed to load universities for filter', e);
        setUniversities([]);
      }
    })();
  }, []);

  const fetchInstitutes = async () => {
    try {
      setLoading(true);
      console.log('Fetching institutes with role:', role, 'allowedUniversityId:', allowedUniversityId);
      // Reset to page 1 when filters change
      const currentPage = 1;
      const response = await apiService.getInstitutes({
        search: debouncedSearchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        university_id: universityFilter !== 'all' && universityFilter ? Number(universityFilter) : undefined,
        page: currentPage,
        per_page: 15
      });
      
      if (response.success) {
        const list: any[] = response.data || [];
        console.log('Raw institutes list:', list);
        // Client-side scoping for university_admin (only if not already filtered by backend)
        const scoped = (role === 'university_admin' && allowedUniversityId && !universityFilter)
          ? list.filter((inst: any) => Number(inst.university_id) === Number(allowedUniversityId))
          : list;
        console.log('Scoped institutes list:', scoped);
        setInstitutes(scoped);
        setPagination({
          current_page: response.pagination?.current_page || 1,
          last_page: response.pagination?.last_page || 1,
          total: response.pagination?.total || 0
        });
      } else {
        console.error('Failed to fetch institutes:', response.message);
        setInstitutes([]);
      }
    } catch (error) {
      console.error('Error fetching institutes:', error);
      setInstitutes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstitute = async () => {
    try {
      // Prepare data for API - convert numbers and handle empty strings
      const instituteData = {
        name: newInstitute.name.trim(),
        type: newInstitute.type,
        email: newInstitute.email.trim(),
        phone: newInstitute.phone.trim() || null,
        website: newInstitute.website.trim() || null,
        address: newInstitute.address.trim() || null,
        description: newInstitute.description.trim() || null,
        established: newInstitute.established.trim() || null,
        accreditation: newInstitute.accreditation.trim() || null,
        students: parseInt(newInstitute.students.toString()) || 0,
        rating: parseFloat(newInstitute.rating.toString()) || 0,
        contact_person: newInstitute.contact_person.trim() || null,
        contact_phone: newInstitute.contact_phone.trim() || null,
        status: newInstitute.status
      };

      // Attach university by id if provided
      if (selectedUniversityId) {
        (instituteData as any).university_id = parseInt(selectedUniversityId);
      }

      const response = await apiService.createInstitute(instituteData);
      if (response.success) {
        setNewInstitute({
          name: '',
          type: 'university',
          status: 'pending',
          email: '',
          phone: '',
          website: '',
          address: '',
          description: '',
          established: '',
          accreditation: '',
          students: 0,
          rating: 0,
          contact_person: '',
          contact_phone: ''
        });
        setSelectedUniversityId('');
        fetchInstitutes(); // Refresh the list
        alert('Institute created successfully!');
      } else {
        alert(response.message || 'Failed to create institute');
      }
    } catch (error) {
      console.error('Failed to create institute:', error);
      alert('Failed to create institute. Please check the form data and try again.');
    }
  };

  const handleEditInstitute = (institute: any) => {
    setSelectedInstitute(institute);
    setEditInstitute({
      name: institute.name || '',
      type: institute.type || 'university',
      status: institute.status || 'pending',
      email: institute.email || '',
      phone: institute.phone || '',
      website: institute.website || '',
      address: institute.address || '',
      description: institute.description || '',
      established: institute.established || '',
      accreditation: institute.accreditation || '',
      students: institute.students || 0,
      rating: institute.rating || 0,
      contact_person: institute.contact_person || '',
      contact_phone: institute.contact_phone || ''
    });

    setIsEditInstituteOpen(true);
  };

  const handleUpdateInstitute = async () => {
    try {
      // Prepare data for API - convert numbers and handle empty strings
      const instituteData = {
        name: editInstitute.name.trim(),
        type: editInstitute.type,
        email: editInstitute.email.trim(),
        phone: editInstitute.phone.trim() || '',
        website: editInstitute.website.trim() || '',
        address: editInstitute.address.trim() || '',
        description: editInstitute.description.trim() || '',
        established: editInstitute.established.trim() || '',
        accreditation: editInstitute.accreditation.trim() || '',
        students: parseInt(editInstitute.students.toString()) || 0,
        rating: parseFloat(editInstitute.rating.toString()) || 0,
        contact_person: editInstitute.contact_person.trim() || '',
        contact_phone: editInstitute.contact_phone.trim() || '',
        status: editInstitute.status
      };

      const response = await apiService.updateInstitute(selectedInstitute.id, instituteData);
      if (response.success) {
        setIsEditInstituteOpen(false);
        fetchInstitutes(); // Refresh the list
        alert('Institute updated successfully!');
      } else {
        console.error('Update failed:', response);
        const errorMsg = response.errors ? 
          `Validation errors: ${JSON.stringify(response.errors)}` : 
          (response.message || 'Failed to update institute');
        alert(errorMsg);
      }
    } catch (error: any) {
      console.error('Failed to update institute:', error);
      const server = (error as any)?.response?.data;
      if (server?.errors) {
        alert(`Validation errors: ${JSON.stringify(server.errors)}`);
      } else {
        alert(server?.message || 'Failed to update institute. Please check the form data and try again.');
      }
    }
  };

  const handleViewInstitute = async (institute: any) => {
    try {
      const response = await apiService.getInstitute(institute.id);
      if (response.success) {
        setSelectedInstitute(response.data);
        setIsViewInstituteOpen(true);
      } else {
        console.error('API response not successful:', response);
        // Fallback to the institute data we already have
        setSelectedInstitute(institute);
        setIsViewInstituteOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch institute details:', error);
      // Fallback to the institute data we already have
      setSelectedInstitute(institute);
      setIsViewInstituteOpen(true);
    }
  };

  const handleDeleteInstitute = async (instituteId: number) => {
    if (window.confirm('Are you sure you want to delete this institute?')) {
      try {
        const response = await apiService.deleteInstitute(instituteId);
        if (response.success) {
          fetchInstitutes(); // Refresh the list
          alert('Institute deleted successfully!');
        } else {
          alert(response.message || 'Failed to delete institute');
        }
      } catch (error) {
        console.error('Failed to delete institute:', error);
        alert('Failed to delete institute. Please try again.');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      case 'rejected':
        return <Badge className="bg-gray-100 text-gray-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'university':
        return <Badge className="bg-blue-100 text-blue-800">University</Badge>;
      case 'community_college':
        return <Badge className="bg-purple-100 text-purple-800">Community College</Badge>;
      case 'technical_institute':
        return <Badge className="bg-green-100 text-green-800">Technical Institute</Badge>;

      case 'liberal_arts':
        return <Badge className="bg-orange-100 text-orange-800">Liberal Arts</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Institute Management</h3>
          <p className="text-sm text-gray-600">Manage registered educational institutions and their profiles</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/admin-dashboard/institutes/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Register New Institute
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search institutes..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    // Reset pagination when search changes
                    setPagination({ current_page: 1, last_page: 1, total: 0 });
                  }}
                  className="pl-10"
                />
              </div>
              <Select 
                value={statusFilter} 
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setPagination({ current_page: 1, last_page: 1, total: 0 });
                }}
              >
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
              {(role === 'super_admin' || role === 'admin') && (
                <Select 
                  value={universityFilter} 
                  onValueChange={(value) => {
                    setUniversityFilter(value);
                    setPagination({ current_page: 1, last_page: 1, total: 0 });
                  }}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by university" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Universities</SelectItem>
                    {universities.length > 0 ? (
                      universities.map((university: any) => (
                        <SelectItem key={university.id} value={university.id.toString()}>
                          {university.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-universities" disabled>
                        No universities available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

      {/* Institutes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="text-sm text-gray-500">Loading institutes...</div>
            </div>
          ) : institutes.length > 0 ? (
            institutes.map((institute: any) => (
              <Card key={institute.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{institute.name}</CardTitle>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {getTypeBadge(institute.type)}
                      </div>
                      {institute.university && (
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <span className="font-medium">{institute.university.name}</span>
                        </div>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" aria-label="More options for this institute" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewInstitute(institute)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditInstitute(institute)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteInstitute(institute.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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
                      <span>{institute.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{institute.address || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{institute.students?.toLocaleString() || 0} students</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{institute.rating || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      {getStatusBadge(institute.status)}
                      <div className="text-xs text-gray-500">
                        {institute.created_at ? new Date(institute.created_at).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <div className="text-sm text-gray-500">No institutes found</div>
            </div>
          )}
        </div>

      {/* View Institute Dialog */}
      <Dialog open={isViewInstituteOpen} onOpenChange={setIsViewInstituteOpen}>
        <DialogContent className="max-w-4xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-y-auto">
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
                  <div className="text-sm font-medium">{selectedInstitute.contact_person}</div>
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <div className="text-sm font-medium">{selectedInstitute.contact_phone}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Students</Label>
                  <div className="text-sm font-medium">{selectedInstitute.students?.toLocaleString() || 0}</div>
                </div>
                <div>
                  <Label>Scholarships</Label>
                  <div className="text-sm font-medium">{selectedInstitute.scholarships_count || 0}</div>
                </div>
                <div>
                  <Label>Rating</Label>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{selectedInstitute.rating || 0}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Registration Date</Label>
                  <div className="text-sm font-medium">
                    {selectedInstitute.created_at ? new Date(selectedInstitute.created_at).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <div className="text-sm font-medium">
                    {selectedInstitute.updated_at ? new Date(selectedInstitute.updated_at).toLocaleDateString() : 'N/A'}
                  </div>
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
        <DialogContent className="max-w-4xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Institute</DialogTitle>
            <DialogDescription>Update institute information</DialogDescription>
          </DialogHeader>
          {selectedInstitute && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Institute Name *</Label>
                  <Input 
                    id="edit-name" 
                    value={editInstitute.name}
                    onChange={(e) => setEditInstitute({...editInstitute, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-type">Type *</Label>
                  <Select value={editInstitute.type} onValueChange={(value) => setEditInstitute({...editInstitute, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="university">University</SelectItem>
                      <SelectItem value="community_college">Community College</SelectItem>
                      <SelectItem value="technical_institute">Technical Institute</SelectItem>
                      <SelectItem value="liberal_arts">Liberal Arts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input 
                    id="edit-email" 
                    type="email"
                    value={editInstitute.email}
                    onChange={(e) => setEditInstitute({...editInstitute, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input 
                    id="edit-phone" 
                    value={editInstitute.phone}
                    onChange={(e) => setEditInstitute({...editInstitute, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-website">Website</Label>
                  <Input 
                    id="edit-website" 
                    value={editInstitute.website}
                    onChange={(e) => setEditInstitute({...editInstitute, website: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-established">Established</Label>
                  <Input 
                    id="edit-established" 
                    value={editInstitute.established}
                    onChange={(e) => setEditInstitute({...editInstitute, established: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-address">Address</Label>
                <Textarea 
                  id="edit-address" 
                  value={editInstitute.address}
                  onChange={(e) => setEditInstitute({...editInstitute, address: e.target.value})}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  value={editInstitute.description}
                  onChange={(e) => setEditInstitute({...editInstitute, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-accreditation">Accreditation</Label>
                  <Input 
                    id="edit-accreditation" 
                    value={editInstitute.accreditation}
                    onChange={(e) => setEditInstitute({...editInstitute, accreditation: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-students">Number of Students</Label>
                  <Input 
                    id="edit-students" 
                    type="number"
                    value={editInstitute.students}
                    onChange={(e) => setEditInstitute({...editInstitute, students: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-rating">Rating</Label>
                  <Input 
                    id="edit-rating" 
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editInstitute.rating}
                    onChange={(e) => setEditInstitute({...editInstitute, rating: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={editInstitute.status} onValueChange={(value) => setEditInstitute({...editInstitute, status: value})}>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-contact-person">Contact Person</Label>
                  <Input 
                    id="edit-contact-person" 
                    value={editInstitute.contact_person}
                    onChange={(e) => setEditInstitute({...editInstitute, contact_person: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-contact-phone">Contact Phone</Label>
                  <Input 
                    id="edit-contact-phone" 
                    value={editInstitute.contact_phone}
                    onChange={(e) => setEditInstitute({...editInstitute, contact_phone: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditInstituteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateInstitute}>Update Institute</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstituteManagement;
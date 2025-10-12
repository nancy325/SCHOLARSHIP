import React, { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';

const InstituteManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddInstituteOpen, setIsAddInstituteOpen] = useState(false);
  const [isEditInstituteOpen, setIsEditInstituteOpen] = useState(false);
  const [isViewInstituteOpen, setIsViewInstituteOpen] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [universities, setUniversities] = useState<any[]>([]);
  const [createNewUniversity, setCreateNewUniversity] = useState(false);
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>('');
  const [newUniversity, setNewUniversity] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    description: '',
    established: '',
    accreditation: ''
  });
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

  // Fetch institutes from API
  useEffect(() => {
    fetchInstitutes();
  }, [searchTerm, statusFilter, allowedUniversityId]);

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

  // Load universities when the Add dialog opens
  useEffect(() => {
    if (isAddInstituteOpen) {
      (async () => {
        try {
          const resp = await apiService.getUniversitiesOptions();
          if (resp.success) {
            setUniversities(resp.data || []);
          }
        } catch (e) {
          console.error('Failed to load universities', e);
        }
      })();
    }
  }, [isAddInstituteOpen]);

  const fetchInstitutes = async () => {
    try {
      setLoading(true);
      console.log('Fetching institutes with role:', role, 'allowedUniversityId:', allowedUniversityId);
      const response = await apiService.getInstitutes({
        search: searchTerm,
        status: statusFilter,
        page: pagination.current_page
      });
      
      if (response.success) {
        const list: any[] = response.data || [];
        console.log('Raw institutes list:', list);
        // Client-side scoping for university_admin
        const scoped = (role === 'university_admin' && allowedUniversityId)
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
      }
    } catch (error) {
      console.error('Error fetching institutes:', error);
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

      // Attach university either by id or inline payload
      if (createNewUniversity) {
        const uniPayload = {
          name: newUniversity.name.trim(),
          email: newUniversity.email.trim(),
          phone: newUniversity.phone.trim() || null,
          website: newUniversity.website.trim() || null,
          address: newUniversity.address.trim() || null,
          description: newUniversity.description.trim() || null,
          established: newUniversity.established.trim() || null,
          accreditation: newUniversity.accreditation.trim() || null,
        };
        (instituteData as any).university = uniPayload;
      } else if (selectedUniversityId) {
        (instituteData as any).university_id = parseInt(selectedUniversityId);
      }

      const response = await apiService.createInstitute(instituteData);
      if (response.success) {
        setIsAddInstituteOpen(false);
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
        setCreateNewUniversity(false);
        setSelectedUniversityId('');
        setNewUniversity({
          name: '',
          email: '',
          phone: '',
          website: '',
          address: '',
          description: '',
          established: '',
          accreditation: ''
        });
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
          <Dialog open={isAddInstituteOpen} onOpenChange={setIsAddInstituteOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Register New Institute
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-4xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Institute</DialogTitle>
              <DialogDescription>Add a new educational institution to the platform</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* University link or creation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div>
                  <Label htmlFor="university-mode">Create new university?</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Switch id="university-mode" checked={createNewUniversity} onCheckedChange={setCreateNewUniversity} />
                    <span className="text-sm text-gray-600">Toggle to enter new university details</span>
                  </div>
                </div>
                {!createNewUniversity && (
                  <div>
                    <Label htmlFor="university-select">Attach to University</Label>
                    <Select value={selectedUniversityId} onValueChange={setSelectedUniversityId}>
                      <SelectTrigger id="university-select" className="w-full">
                        <SelectValue placeholder="Select a university" />
                      </SelectTrigger>
                      <SelectContent>
                        {universities.map((u: any) => (
                          <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {createNewUniversity && (
                <div className="grid gap-4 p-3 sm:p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="uni-name">University Name *</Label>
                      <Input id="uni-name" value={newUniversity.name} onChange={(e) => setNewUniversity({ ...newUniversity, name: e.target.value })} placeholder="Enter university name" />
                    </div>
                    <div>
                      <Label htmlFor="uni-email">University Email *</Label>
                      <Input id="uni-email" type="email" value={newUniversity.email} onChange={(e) => setNewUniversity({ ...newUniversity, email: e.target.value })} placeholder="Enter university email" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="uni-phone">Phone</Label>
                      <Input id="uni-phone" value={newUniversity.phone} onChange={(e) => setNewUniversity({ ...newUniversity, phone: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="uni-website">Website</Label>
                      <Input id="uni-website" value={newUniversity.website} onChange={(e) => setNewUniversity({ ...newUniversity, website: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="uni-address">Address</Label>
                    <Textarea id="uni-address" rows={2} value={newUniversity.address} onChange={(e) => setNewUniversity({ ...newUniversity, address: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="uni-description">Description</Label>
                    <Textarea id="uni-description" rows={3} value={newUniversity.description} onChange={(e) => setNewUniversity({ ...newUniversity, description: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="uni-established">Established</Label>
                      <Input id="uni-established" value={newUniversity.established} onChange={(e) => setNewUniversity({ ...newUniversity, established: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="uni-accreditation">Accreditation</Label>
                      <Input id="uni-accreditation" value={newUniversity.accreditation} onChange={(e) => setNewUniversity({ ...newUniversity, accreditation: e.target.value })} />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Institute Name *</Label>
                  <Input 
                    id="name" 
                    value={newInstitute.name}
                    onChange={(e) => setNewInstitute({...newInstitute, name: e.target.value})}
                    placeholder="Enter institute name"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select value={newInstitute.type} onValueChange={(value) => setNewInstitute({...newInstitute, type: value})}>
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
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={newInstitute.email}
                    onChange={(e) => setNewInstitute({...newInstitute, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    value={newInstitute.phone}
                    onChange={(e) => setNewInstitute({...newInstitute, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    value={newInstitute.website}
                    onChange={(e) => setNewInstitute({...newInstitute, website: e.target.value})}
                    placeholder="Enter website URL"
                  />
                </div>
                <div>
                  <Label htmlFor="established">Established</Label>
                  <Input 
                    id="established" 
                    value={newInstitute.established}
                    onChange={(e) => setNewInstitute({...newInstitute, established: e.target.value})}
                    placeholder="Enter establishment year"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address" 
                  value={newInstitute.address}
                  onChange={(e) => setNewInstitute({...newInstitute, address: e.target.value})}
                  placeholder="Enter full address"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newInstitute.description}
                  onChange={(e) => setNewInstitute({...newInstitute, description: e.target.value})}
                  placeholder="Enter institute description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accreditation">Accreditation</Label>
                  <Input 
                    id="accreditation" 
                    value={newInstitute.accreditation}
                    onChange={(e) => setNewInstitute({...newInstitute, accreditation: e.target.value})}
                    placeholder="Enter accreditation info"
                  />
                </div>
                <div>
                  <Label htmlFor="students">Number of Students</Label>
                  <Input 
                    id="students" 
                    type="number"
                    value={newInstitute.students}
                    onChange={(e) => setNewInstitute({...newInstitute, students: parseInt(e.target.value) || 0})}
                    placeholder="Enter number of students"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Input 
                    id="rating" 
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={newInstitute.rating}
                    onChange={(e) => setNewInstitute({...newInstitute, rating: parseFloat(e.target.value) || 0})}
                    placeholder="Enter rating (0-5)"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={newInstitute.status} onValueChange={(value) => setNewInstitute({...newInstitute, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-person">Contact Person</Label>
                  <Input 
                    id="contact-person" 
                    value={newInstitute.contact_person}
                    onChange={(e) => setNewInstitute({...newInstitute, contact_person: e.target.value})}
                    placeholder="Enter contact person name"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input 
                    id="contact-phone" 
                    value={newInstitute.contact_phone}
                    onChange={(e) => setNewInstitute({...newInstitute, contact_phone: e.target.value})}
                    placeholder="Enter contact phone number"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddInstituteOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddInstitute}>Create Institute</Button>
            </div>
          </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create New University
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-full max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New University</DialogTitle>
                <DialogDescription>Add a university without creating an institute</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nu-name">University Name *</Label>
                    <Input id="nu-name" value={newUniversity.name} onChange={(e) => setNewUniversity({ ...newUniversity, name: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="nu-email">Email *</Label>
                    <Input id="nu-email" type="email" value={newUniversity.email} onChange={(e) => setNewUniversity({ ...newUniversity, email: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nu-phone">Phone</Label>
                    <Input id="nu-phone" value={newUniversity.phone} onChange={(e) => setNewUniversity({ ...newUniversity, phone: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="nu-website">Website</Label>
                    <Input id="nu-website" value={newUniversity.website} onChange={(e) => setNewUniversity({ ...newUniversity, website: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="nu-address">Address</Label>
                  <Textarea id="nu-address" rows={2} value={newUniversity.address} onChange={(e) => setNewUniversity({ ...newUniversity, address: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="nu-description">Description</Label>
                  <Textarea id="nu-description" rows={3} value={newUniversity.description} onChange={(e) => setNewUniversity({ ...newUniversity, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nu-established">Established</Label>
                    <Input id="nu-established" value={newUniversity.established} onChange={(e) => setNewUniversity({ ...newUniversity, established: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="nu-accreditation">Accreditation</Label>
                    <Input id="nu-accreditation" value={newUniversity.accreditation} onChange={(e) => setNewUniversity({ ...newUniversity, accreditation: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setNewUniversity({ name: '', email: '', phone: '', website: '', address: '', description: '', established: '', accreditation: '' });
                }}>Cancel</Button>
                <Button onClick={async () => {
                  try {
                    const payload = {
                      name: newUniversity.name.trim(),
                      email: newUniversity.email.trim(),
                      phone: newUniversity.phone.trim() || null,
                      website: newUniversity.website.trim() || null,
                      address: newUniversity.address.trim() || null,
                      description: newUniversity.description.trim() || null,
                      established: newUniversity.established.trim() || null,
                      accreditation: newUniversity.accreditation.trim() || null,
                    };
                    const resp = await apiService.createUniversity(payload);
                    if (resp.success) {
                      alert('University created successfully');
                      setNewUniversity({ name: '', email: '', phone: '', website: '', address: '', description: '', established: '', accreditation: '' });
                    } else {
                      alert(resp.message || 'Failed to create university');
                    }
                  } catch (e) {
                    console.error(e);
                    alert('Failed to create university');
                  }
                }}>Create University</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search institutes..."
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
                    <span>{institute.address || 'N/A'}</span>
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
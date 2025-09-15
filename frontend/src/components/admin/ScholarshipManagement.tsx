import React, { useState, useEffect } from 'react';
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
  Clock,
  Loader2
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
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

const ScholarshipManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isAddScholarshipOpen, setIsAddScholarshipOpen] = useState(false);
  const [isEditScholarshipOpen, setIsEditScholarshipOpen] = useState(false);
  const [isViewScholarshipOpen, setIsViewScholarshipOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [universities, setUniversities] = useState([]);
  const institutesOnly = institutes;
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    university_id: '',
    institute_id: '',
    eligibility: '',
    deadline: '',
    apply_link: ''
  });
  const { toast } = useToast();

  // Load scholarships and options on component mount
  useEffect(() => {
    fetchScholarships();
    fetchInstitutes();
    fetchUniversities();
  }, []);

  // Fetch scholarships from API
  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const response = await apiService.getScholarships({
        search: searchTerm,
        type: typeFilter !== 'all' ? typeFilter : undefined
      });
      if (response.success) {
        setScholarships(response.data.data || []);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch scholarships",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      toast({
        title: "Error",
        description: "Failed to fetch scholarships",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch institutes for dropdown
  const fetchInstitutes = async () => {
    try {
      const response = await apiService.getScholarshipInstitutes();
      if (response.success) {
        setInstitutes(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching institutes:', error);
    }
  };

  const fetchUniversities = async () => {
    try {
      const response = await apiService.getUniversities();
      if (response.success) {
        setUniversities(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };

  // Refetch scholarships when search or filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchScholarships();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, typeFilter]);

  // Form handling functions
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: '',
      university_id: '',
      institute_id: '',
      eligibility: '',
      deadline: '',
      apply_link: ''
    });
  };

  // Create scholarship
  const handleCreateScholarship = async () => {
    setSubmitting(true);
    try {
      const response = await apiService.createScholarship({
        ...formData,
        university_id: formData.university_id ? Number(formData.university_id) : null,
        institute_id: formData.institute_id ? Number(formData.institute_id) : null,
      });
      if (response.success) {
        toast({
          title: "Success",
          description: "Scholarship created successfully",
        });
        setIsAddScholarshipOpen(false);
        resetForm();
        fetchScholarships();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create scholarship",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating scholarship:', error);
      toast({
        title: "Error",
        description: "Failed to create scholarship",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Update scholarship
  const handleUpdateScholarship = async () => {
    if (!selectedScholarship) return;
    
    setSubmitting(true);
    try {
      const response = await apiService.updateScholarship(selectedScholarship.id, {
        ...formData,
        university_id: formData.university_id ? Number(formData.university_id) : null,
        institute_id: formData.institute_id ? Number(formData.institute_id) : null,
      });
      if (response.success) {
        toast({
          title: "Success",
          description: "Scholarship updated successfully",
        });
        setIsEditScholarshipOpen(false);
        setSelectedScholarship(null);
        resetForm();
        fetchScholarships();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update scholarship",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating scholarship:', error);
      toast({
        title: "Error",
        description: "Failed to update scholarship",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete scholarship
  const handleDeleteScholarship = async (scholarshipId: number) => {
    if (!confirm('Are you sure you want to delete this scholarship? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await apiService.deleteScholarship(scholarshipId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Scholarship deleted successfully",
        });
        fetchScholarships();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete scholarship",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting scholarship:', error);
      toast({
        title: "Error",
        description: "Failed to delete scholarship",
        variant: "destructive",
      });
    }
  };

  // No status in spec; keep placeholder if needed later
  const getStatusBadge = (_status: string) => null;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'government':
        return <Badge className="bg-blue-100 text-blue-800">Government</Badge>;
      case 'private':
        return <Badge className="bg-green-100 text-green-800">Private</Badge>;
      case 'university':
        return <Badge className="bg-purple-100 text-purple-800">University</Badge>;
      case 'institute':
        return <Badge className="bg-orange-100 text-orange-800">Institute</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getLevelBadge = (_: string) => null;

  const formatCurrency = (_amount: number, _currency: string) => '';

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
    setFormData({
      title: scholarship.title || '',
      description: scholarship.description || '',
      type: scholarship.type || '',
      university_id: scholarship.university_id?.toString() || '',
      institute_id: scholarship.institute_id?.toString() || '',
      eligibility: scholarship.eligibility || '',
      deadline: scholarship.deadline || '',
      apply_link: scholarship.apply_link || ''
    });
    setIsEditScholarshipOpen(true);
  };

  const handleViewScholarship = (scholarship: any) => {
    setSelectedScholarship(scholarship);
    setIsViewScholarshipOpen(true);
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
                  <Input 
                    id="title" 
                    placeholder="Enter scholarship title" 
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>
                
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="university">University</SelectItem>
                      <SelectItem value="institute">Institute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.type === 'university' && (
                <div>
                    <Label htmlFor="university">University</Label>
                    <Select value={formData.university_id} onValueChange={(value) => handleInputChange('university_id', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select university" />
                    </SelectTrigger>
                    <SelectContent>
                        {universities.map((inst: any) => (
                          <SelectItem key={inst.id} value={inst.id.toString()}>
                            {inst.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                )}
                {formData.type === 'institute' && (
                <div>
                    <Label htmlFor="university">University</Label>
                    <Select value={formData.university_id} onValueChange={(value) => handleInputChange('university_id', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select university" />
                    </SelectTrigger>
                    <SelectContent>
                        {universities.map((inst: any) => (
                          <SelectItem key={inst.id} value={inst.id.toString()}>
                            {inst.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-4">
                      <Label htmlFor="institute">Institute</Label>
                      <Select value={formData.institute_id} onValueChange={(value) => handleInputChange('institute_id', value)} disabled={!formData.university_id}>
                        <SelectTrigger>
                          <SelectValue placeholder={!formData.university_id ? 'Select university first' : 'Select institute'} />
                        </SelectTrigger>
                        <SelectContent>
                          {institutesOnly.filter((inst: any) => inst.university_id === Number(formData.university_id)).map((inst: any) => (
                            <SelectItem key={inst.id} value={inst.id.toString()}>
                              {inst.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                  </Select>
                </div>
                </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input 
                    id="start-date" 
                    type="date" 
                    value={(formData as any).start_date || ''}
                    onChange={(e) => handleInputChange('start_date' as any, e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input 
                    id="deadline" 
                    type="date" 
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="apply-link">Apply Link</Label>
                  <Input 
                    id="apply-link" 
                    placeholder="https://..." 
                    value={formData.apply_link}
                    onChange={(e) => handleInputChange('apply_link', e.target.value)}
                  />
                </div>
                </div>
              
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Enter scholarship description" 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="eligibility">Eligibility Criteria</Label>
                <Textarea 
                  id="eligibility" 
                  placeholder="Enter eligibility criteria" 
                  rows={2}
                  value={formData.eligibility}
                  onChange={(e) => handleInputChange('eligibility', e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {
                setIsAddScholarshipOpen(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleCreateScholarship} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Scholarship'
                )}
              </Button>
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
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="university">University</SelectItem>
                <SelectItem value="institute">Institute</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Scholarships Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading scholarships...</span>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {scholarships.map((scholarship) => (
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
                  <span className="truncate">{scholarship.institute?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <BookOpen className="h-4 w-4" />
                  <span className="truncate">{scholarship.description?.slice(0, 80) || 'No description'}</span>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-gray-600" />
                      <a className="text-blue-600 hover:underline" href={scholarship.apply_link} target="_blank" rel="noreferrer">Apply</a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span>Public link</span>
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
      )}

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
                  <Input 
                    id="edit-title" 
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-institute">Institute</Label>
                  <Select value={formData.institute_id} onValueChange={(value) => handleInputChange('institute_id', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {institutes.map((institute) => (
                        <SelectItem key={institute.id} value={institute.id.toString()}>
                          {institute.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
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
                
                
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-deadline">Application Deadline</Label>
                  <Input 
                    id="edit-deadline" 
                    type="date" 
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-apply-link">Apply Link</Label>
                  <Input 
                    id="edit-apply-link" 
                    value={formData.apply_link}
                    onChange={(e) => handleInputChange('apply_link', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3} 
                />
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => {
              setIsEditScholarshipOpen(false);
              setSelectedScholarship(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateScholarship} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Scholarship'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScholarshipManagement;



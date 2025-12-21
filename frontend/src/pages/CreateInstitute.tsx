import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CreateInstitute = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);
  const [universities, setUniversities] = useState<any[]>([]);
  const [formData, setFormData] = useState({
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
    contact_phone: '',
    university_id: ''
  });

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await apiService.getUniversitiesOptions();
      if (response.success) {
        setUniversities(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast({
        title: 'Validation Error',
        description: 'Institute name and email are required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.university_id) {
      toast({
        title: 'Validation Error',
        description: 'Please select a university',
        variant: 'destructive',
      });
      return;
    }

    try {
      setCreating(true);
      const payload = {
        ...formData,
        university_id: Number(formData.university_id)
      };
      
      const response = await apiService.createInstitute(payload);
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Institute created successfully',
        });
        navigate('/admin-dashboard/institutes');
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to create institute',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Failed to create institute:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to create institute';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin-dashboard/institutes')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Institutes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Register New Institute</CardTitle>
          <CardDescription>Add a new educational institution to the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="university-select">Attach to University *</Label>
                <Select value={formData.university_id} onValueChange={(value) => handleChange('university_id', value)}>
                  <SelectTrigger id="university-select">
                    <SelectValue placeholder="Select a university" />
                  </SelectTrigger>
                  <SelectContent>
                    {universities.map((u: any) => (
                      <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Institute Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter institute name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    placeholder="Enter website URL"
                  />
                </div>
                <div>
                  <Label htmlFor="established">Established</Label>
                  <Input
                    id="established"
                    value={formData.established}
                    onChange={(e) => handleChange('established', e.target.value)}
                    placeholder="Enter establishment year"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Enter full address"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter institute description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accreditation">Accreditation</Label>
                  <Input
                    id="accreditation"
                    value={formData.accreditation}
                    onChange={(e) => handleChange('accreditation', e.target.value)}
                    placeholder="Enter accreditation info"
                  />
                </div>
                <div>
                  <Label htmlFor="students">Number of Students</Label>
                  <Input
                    id="students"
                    type="number"
                    value={formData.students}
                    onChange={(e) => handleChange('students', parseInt(e.target.value) || 0)}
                    placeholder="Enter number of students"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => handleChange('rating', parseFloat(e.target.value) || 0)}
                    placeholder="Enter rating (0-5)"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-person">Contact Person</Label>
                  <Input
                    id="contact-person"
                    value={formData.contact_person}
                    onChange={(e) => handleChange('contact_person', e.target.value)}
                    placeholder="Enter contact person name"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input
                    id="contact-phone"
                    value={formData.contact_phone}
                    onChange={(e) => handleChange('contact_phone', e.target.value)}
                    placeholder="Enter contact phone number"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin-dashboard/institutes')}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? 'Creating...' : 'Create Institute'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateInstitute;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CreateUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);
  const [institutes, setInstitutes] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    category: 'undergraduate',
    role: 'student',
    institute_id: null as number | null,
    university_id: null as number | null,
    RecStatus: 'active'
  });

  useEffect(() => {
    fetchInstitutes();
    fetchUniversities();
  }, []);

  const fetchInstitutes = async () => {
    try {
      const response = await apiService.getInstitutesOptions();
      if (response.success) {
        setInstitutes(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch institutes:', error);
    }
  };

  const fetchUniversities = async () => {
    try {
      const response = await apiService.getUniversitiesOptions();
      if (response.success) {
        setUniversities(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch universities:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: 'Validation Error',
        description: 'Name, Email, and Password are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setCreating(true);
      const response = await apiService.createUser(formData);
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'User created successfully',
        });
        navigate('/admin-dashboard/users');
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to create user',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Failed to create user:', error);
      const serverError = error?.response?.data;
      if (serverError?.errors) {
        const validationErrors = Object.values(serverError.errors).flat().join(', ');
        toast({
          title: 'Validation Error',
          description: validationErrors as string,
          variant: 'destructive',
        });
      } else {
        const errorMessage = serverError?.message || 'Failed to create user. Please try again.';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
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
          onClick={() => navigate('/admin-dashboard/users')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
          <CardDescription>Create a new user account with appropriate permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="postgraduate">Postgraduate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="institute">Institute</Label>
                  <Select
                    value={formData.institute_id?.toString() || 'none'}
                    onValueChange={(value) => handleChange('institute_id', value === 'none' ? null : parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select institute" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Institute</SelectItem>
                      {institutes.map((institute: any) => (
                        <SelectItem key={institute.id} value={institute.id.toString()}>
                          {institute.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="university">University</Label>
                  <Select
                    value={formData.university_id?.toString() || 'none'}
                    onValueChange={(value) => handleChange('university_id', value === 'none' ? null : parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select university" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No University</SelectItem>
                      {universities.map((u: any) => (
                        <SelectItem key={u.id} value={u.id.toString()}>
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleChange('role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="institute_admin">Institute Admin</SelectItem>
                      <SelectItem value="university_admin">University Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="recStatus">RecStatus</Label>
                  <Select
                    value={formData.RecStatus || 'active'}
                    onValueChange={(value) => handleChange('RecStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin-dashboard/users')}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateUser;

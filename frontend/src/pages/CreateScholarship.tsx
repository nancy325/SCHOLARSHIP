import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CreateScholarship = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [institutes, setInstitutes] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    university_id: '',
    institute_id: '',
    eligibility: '',
    deadline: '',
    apply_link: '',
    start_date: ''
  });

  const currentUser = apiService.getStoredUser();
  const role = (currentUser as any)?.role;

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
      console.error('Error fetching institutes:', error);
    }
  };

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      if (field === 'institute_id') {
        const next: any = { ...prev, institute_id: value };
        if (value) {
          next.type = 'institute';
          const inst = institutes.find((i: any) => String(i.id) === String(value));
          if (inst?.university_id) {
            next.university_id = String(inst.university_id);
          }
        }
        return next;
      }
      if (field === 'type') {
        if (value === 'university') {
          return { ...prev, type: value, institute_id: '' };
        }
        if (value === 'institute') {
          return { ...prev, type: value };
        }
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.type) {
      toast({
        title: 'Validation Error',
        description: 'Title and Type are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);
      const selectedInstitute = institutes.find((i: any) => String(i.id) === String(formData.institute_id));
      const derivedType = formData.institute_id ? 'institute' : (formData.university_id ? 'university' : formData.type);
      
      const payload: any = {
        ...formData,
        type: derivedType,
        university_id: formData.university_id ? Number(formData.university_id) : (selectedInstitute?.university_id ?? null),
        institute_id: formData.institute_id ? Number(formData.institute_id) : null,
      };

      const response = await apiService.createScholarship(payload);

      if (response.success) {
        toast({
          title: 'Success',
          description: 'Scholarship created successfully',
        });
        navigate('/admin-dashboard/scholarships');
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to create scholarship',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating scholarship:', error);
      toast({
        title: 'Error',
        description: 'Failed to create scholarship',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin-dashboard/scholarships')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Scholarships
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Scholarship</CardTitle>
          <CardDescription>Add a new scholarship opportunity to the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Scholarship Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter scholarship title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {role !== 'university_admin' && role !== 'institute_admin' && (
                        <>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </>
                      )}
                      <SelectItem value="university">University</SelectItem>
                      <SelectItem value="institute">Institute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div>
                    <Label htmlFor="institute">Institute</Label>
                    <Select value={formData.institute_id} onValueChange={(value) => handleInputChange('institute_id', value)} disabled={!formData.university_id}>
                      <SelectTrigger>
                        <SelectValue placeholder={!formData.university_id ? 'Select university first' : 'Select institute'} />
                      </SelectTrigger>
                      <SelectContent>
                        {institutes.filter((inst: any) => inst.university_id === Number(formData.university_id)).map((inst: any) => (
                          <SelectItem key={inst.id} value={inst.id.toString()}>
                            {inst.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
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

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin-dashboard/scholarships')}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateScholarship;

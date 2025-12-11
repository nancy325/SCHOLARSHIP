import React, { useEffect, useState } from 'react';
import { apiService } from '@/services/api';
import { Plus, Mail, Phone, Globe, MapPin, GraduationCap, MoreHorizontal, Eye, Edit, Trash2, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UniversityManagement = () => {
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [accreditationFilter, setAccreditationFilter] = useState<'all' | 'accredited' | 'not_accredited'>('all');
  const [selectedUniversity, setSelectedUniversity] = useState<any | null>(null);
  const [newUniversity, setNewUniversity] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    description: '',
    established: '',
    accreditation: '',
  });

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUniversities({ per_page: 1000 });
      if (response.success) {
        setUniversities(response.data || []);
      } else {
        setUniversities([]);
      }
    } catch (e) {
      console.error('Failed to fetch universities', e);
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUniversities = universities.filter((u) => {
    const term = searchTerm.toLowerCase();
    const matchesTerm =
      !term ||
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.address?.toLowerCase().includes(term);
    const matchesAcc =
      accreditationFilter === 'all' ||
      (accreditationFilter === 'accredited' ? !!u.accreditation : !u.accreditation);
    return matchesTerm && matchesAcc;
  });

  const handleCreate = async () => {
    try {
      setCreating(true);
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
        setIsCreateOpen(false);
        setNewUniversity({
          name: '',
          email: '',
          phone: '',
          website: '',
          address: '',
          description: '',
          established: '',
          accreditation: '',
        });
        fetchUniversities();
        alert('University created successfully');
      } else {
        alert(resp.message || 'Failed to create university');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to create university');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenEdit = (uni: any) => {
    setSelectedUniversity(uni);
    setNewUniversity({
      name: uni.name || '',
      email: uni.email || '',
      phone: uni.phone || '',
      website: uni.website || '',
      address: uni.address || '',
      description: uni.description || '',
      established: uni.established || '',
      accreditation: uni.accreditation || '',
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedUniversity) return;
    try {
      setUpdating(true);
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
      const resp = await apiService.updateUniversity(selectedUniversity.id, payload);
      if (resp.success) {
        setIsEditOpen(false);
        setSelectedUniversity(null);
        setNewUniversity({
          name: '',
          email: '',
          phone: '',
          website: '',
          address: '',
          description: '',
          established: '',
          accreditation: '',
        });
        fetchUniversities();
        alert('University updated successfully');
      } else {
        alert(resp.message || 'Failed to update university');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to update university');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (uni: any) => {
    if (!window.confirm(`Delete ${uni.name}?`)) return;
    try {
      setDeletingId(uni.id);
      const resp = await apiService.deleteUniversity(uni.id);
      if (resp.success) {
        fetchUniversities();
        alert('University deleted successfully');
      } else {
        alert(resp.message || 'Failed to delete university');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to delete university');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">University Management</h3>
          <p className="text-sm text-gray-600">Manage partner universities and their profiles</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create University
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New University</DialogTitle>
              <DialogDescription>Add a university to the platform</DialogDescription>
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
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={creating}>
                {creating ? 'Creating...' : 'Create University'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={accreditationFilter} onValueChange={(v: any) => setAccreditationFilter(v)}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Filter by accreditation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="accredited">Accredited</SelectItem>
                <SelectItem value="not_accredited">Not Accredited</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <div className="text-sm text-gray-500">Loading universities...</div>
          </div>
        ) : filteredUniversities.length > 0 ? (
          filteredUniversities.map((university: any) => (
            <Card key={university.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{university.name}</CardTitle>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <Badge className="bg-blue-100 text-blue-800">University</Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setSelectedUniversity(university); setIsViewOpen(true); }}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenEdit(university)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(university)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deletingId === university.id ? 'Deleting...' : 'Delete'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{university.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{university.phone || 'N/A'}</span>
                  </div>
                  {university.website && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Globe className="h-4 w-4" />
                      <a href={university.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {university.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{university.address || 'N/A'}</span>
                  </div>
                  {university.description && (
                    <div className="text-sm text-gray-600 line-clamp-2">
                      {university.description}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {university.established ? `Est. ${university.established}` : ''}
                    </div>
                    <div className="text-xs text-gray-500">
                      {university.created_at ? new Date(university.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  {university.accreditation && (
                    <div className="text-xs text-gray-500">
                      Accreditation: {university.accreditation}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <div className="text-sm text-gray-500">No universities found</div>
          </div>
        )}
      </div>

      {/* View University */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>University Details</DialogTitle>
            <DialogDescription>Overview of the selected university</DialogDescription>
          </DialogHeader>
          {selectedUniversity && (
            <div className="grid gap-3">
              <div>
                <Label>Name</Label>
                <div className="text-sm font-medium">{selectedUniversity.name}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Email</Label>
                  <div className="text-sm">{selectedUniversity.email}</div>
                </div>
                <div>
                  <Label>Phone</Label>
                  <div className="text-sm">{selectedUniversity.phone || 'N/A'}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Website</Label>
                  <div className="text-sm break-all">{selectedUniversity.website || 'N/A'}</div>
                </div>
                <div>
                  <Label>Established</Label>
                  <div className="text-sm">{selectedUniversity.established || 'N/A'}</div>
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <div className="text-sm">{selectedUniversity.address || 'N/A'}</div>
              </div>
              <div>
                <Label>Description</Label>
                <div className="text-sm whitespace-pre-wrap">{selectedUniversity.description || 'N/A'}</div>
              </div>
              <div>
                <Label>Accreditation</Label>
                <div className="text-sm">{selectedUniversity.accreditation || 'N/A'}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit University */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl w-full max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit University</DialogTitle>
            <DialogDescription>Update university information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-nu-name">University Name *</Label>
                <Input id="edit-nu-name" value={newUniversity.name} onChange={(e) => setNewUniversity({ ...newUniversity, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="edit-nu-email">Email *</Label>
                <Input id="edit-nu-email" type="email" value={newUniversity.email} onChange={(e) => setNewUniversity({ ...newUniversity, email: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-nu-phone">Phone</Label>
                <Input id="edit-nu-phone" value={newUniversity.phone} onChange={(e) => setNewUniversity({ ...newUniversity, phone: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="edit-nu-website">Website</Label>
                <Input id="edit-nu-website" value={newUniversity.website} onChange={(e) => setNewUniversity({ ...newUniversity, website: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-nu-address">Address</Label>
              <Textarea id="edit-nu-address" rows={2} value={newUniversity.address} onChange={(e) => setNewUniversity({ ...newUniversity, address: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="edit-nu-description">Description</Label>
              <Textarea id="edit-nu-description" rows={3} value={newUniversity.description} onChange={(e) => setNewUniversity({ ...newUniversity, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-nu-established">Established</Label>
                <Input id="edit-nu-established" value={newUniversity.established} onChange={(e) => setNewUniversity({ ...newUniversity, established: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="edit-nu-accreditation">Accreditation</Label>
                <Input id="edit-nu-accreditation" value={newUniversity.accreditation} onChange={(e) => setNewUniversity({ ...newUniversity, accreditation: e.target.value })} />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updating}>
              {updating ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UniversityManagement;


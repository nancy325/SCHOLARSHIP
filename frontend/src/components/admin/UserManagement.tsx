import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle
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

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isViewUserOpen, setIsViewUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [institutes, setInstitutes] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    category: 'undergraduate',
    is_admin: false,
    institute_id: null
  });
  const [editUser, setEditUser] = useState({
    name: '',
    email: '',
    password: '',
    category: 'undergraduate',
    is_admin: false,
    institute_id: null
  });

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
    fetchInstitutes();
  }, [searchTerm, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUsers({
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page: pagination.current_page
      });

      if (response.success) {
        setUsers(response.data.data || []);
        setPagination({
          current_page: response.data.current_page || 1,
          last_page: response.data.last_page || 1,
          total: response.data.total || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstitutes = async () => {
    try {
      const response = await apiService.getInstitutes();
      if (response.success) {
        setInstitutes(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch institutes:', error);
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await apiService.createUser(newUser);
      if (response.success) {
        setIsAddUserOpen(false);
        setNewUser({
          name: '',
          email: '',
          password: '',
          category: 'undergraduate',
          is_admin: false,
          institute_id: null
        });
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  // No need for client-side filtering since API handles it
  const filteredUsers = users;

  const getStatusBadge = (category: string) => {
    switch (category) {
      case 'undergraduate':
        return <Badge className="bg-green-100 text-green-800">Undergraduate</Badge>;
      case 'graduate':
        return <Badge className="bg-blue-100 text-blue-800">Graduate</Badge>;
      case 'high-school':
        return <Badge className="bg-yellow-100 text-yellow-800">High School</Badge>;
      case 'diploma':
        return <Badge className="bg-purple-100 text-purple-800">Diploma</Badge>;
      case 'postgraduate':
        return <Badge className="bg-indigo-100 text-indigo-800">Postgraduate</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const getRoleBadge = (isAdmin: boolean) => {
    if (isAdmin) {
      return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
    }
    return <Badge variant="outline">Student</Badge>;
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      password: '',
      category: user.category,
      is_admin: user.is_admin,
      institute_id: user.institute_id
    });
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      const updateData = { ...editUser };
      if (!updateData.password) {
        delete updateData.password; // Don't send empty password
      }
      
      const response = await apiService.updateUser(selectedUser.id, updateData);
      if (response.success) {
        setIsEditUserOpen(false);
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleViewUser = async (user: any) => {
    try {
      const response = await apiService.getUser(user.id);
      if (response.success) {
        setSelectedUser(response.data);
        setIsViewUserOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      // Fallback to the user data we already have
    setSelectedUser(user);
    setIsViewUserOpen(true);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Prevent admin from deleting themselves
    if (currentUser.id === userId) {
      alert('You cannot delete your own account. Please ask another admin to delete your account.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await apiService.deleteUser(userId);
        if (response.success) {
          fetchUsers(); // Refresh the list
        } else {
          alert(response.message || 'Failed to delete user');
        }
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">User Management</h3>
          <p className="text-sm text-gray-600">Manage all registered users and their accounts</p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account with appropriate permissions.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter full name" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter email address" 
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter password" 
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newUser.category} 
                    onValueChange={(value) => setNewUser({...newUser, category: value})}
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
              <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="institute">Institute</Label>
                  <Select 
                    value={newUser.institute_id?.toString() || 'none'} 
                    onValueChange={(value) => setNewUser({...newUser, institute_id: value === 'none' ? null : parseInt(value)})}
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
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_admin"
                    checked={newUser.is_admin}
                    onChange={(e) => setNewUser({...newUser, is_admin: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="is_admin">Admin User</Label>
              </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser}>Create User</Button>
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
                placeholder="Search users by name, email, or institute..."
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
                <SelectItem value="undergraduate">Undergraduate</SelectItem>
                <SelectItem value="graduate">Graduate</SelectItem>
                <SelectItem value="high-school">High School</SelectItem>
                <SelectItem value="diploma">Diploma</SelectItem>
                <SelectItem value="postgraduate">Postgraduate</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-sm text-gray-500">Loading users...</div>
              </div>
            ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">User</th>
                  <th className="text-left py-3 px-4 font-medium">Contact</th>
                  <th className="text-left py-3 px-4 font-medium">Institute</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Role</th>
                  {/* <th className="text-left py-3 px-4 font-medium">Applications</th> */}
                  <th className="text-left py-3 px-4 font-medium">Last Login</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="font-medium">{user.institute?.name || 'No Institute'}</div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {user.institute?.address || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(user.category)}
                    </td>
                    <td className="py-3 px-4">
                      {getRoleBadge(user.is_admin)}
                    </td>
                    {/* <td className="py-3 px-4">
                      <div className="text-center">
                        <div className="font-medium">{user.applications?.length || 0}</div>
                        <div className="text-sm text-gray-500">submitted</div>
                      </div>
                    </td> */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="text-sm">{new Date(user.updated_at).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">Registered: {new Date(user.created_at).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewUser(user)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-8">
                        <div className="text-sm text-gray-500">No users found</div>
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={isViewUserOpen} onOpenChange={setIsViewUserOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>View complete user information</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <div className="text-sm font-medium">{selectedUser.name}</div>
                </div>
                <div>
                  <Label>Email</Label>
                  <div className="text-sm font-medium">{selectedUser.email}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>User ID</Label>
                  <div className="text-sm font-medium">{selectedUser.id}</div>
                </div>
                <div>
                  <Label>Role</Label>
                  <div>{getRoleBadge(selectedUser.is_admin)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <div>{getStatusBadge(selectedUser.category)}</div>
                </div>
                <div>
                  <Label>Institute</Label>
                  <div className="text-sm font-medium">{selectedUser.institute?.name || 'No Institute'}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* <div>
                  <Label>Applications</Label>
                  <div className="text-sm font-medium">{selectedUser.applications?.length || 0}</div>
                </div> */}
                <div>
                  <Label>Institute Address</Label>
                  <div className="text-sm font-medium">{selectedUser.institute?.address || 'N/A'}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Registration Date</Label>
                  <div className="text-sm font-medium">{new Date(selectedUser.created_at).toLocaleDateString()}</div>
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <div className="text-sm font-medium">{new Date(selectedUser.updated_at).toLocaleDateString()}</div>
                </div>
              </div>
              {selectedUser.applications && selectedUser.applications.length > 0 && (
                <div>
                  <Label>Recent Applications</Label>
                  <div className="space-y-2 mt-2">
                    {selectedUser.applications.slice(0, 3).map((app: any, index: number) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                        <div className="font-medium">{app.scholarship?.title}</div>
                        <div className="text-gray-600">Status: {app.status}</div>
                        <div className="text-gray-600">Submitted: {new Date(app.created_at).toLocaleDateString()}</div>
                      </div>
                    ))}
                </div>
              </div>
              )}
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsViewUserOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and permissions</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input 
                  id="edit-name" 
                  value={editUser.name || ''}
                  onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  value={editUser.email || ''}
                  onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-password">New Password (optional)</Label>
                <Input 
                  id="edit-password" 
                  type="password" 
                  placeholder="Leave blank to keep current password"
                  value={editUser.password || ''}
                  onChange={(e) => setEditUser({...editUser, password: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select 
                  value={editUser.category || 'undergraduate'} 
                  onValueChange={(value) => setEditUser({...editUser, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-institute">Institute</Label>
                <Select 
                  value={editUser.institute_id?.toString() || 'none'} 
                  onValueChange={(value) => setEditUser({...editUser, institute_id: value === 'none' ? null : parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
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
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-is_admin"
                  checked={editUser.is_admin || false}
                  onChange={(e) => setEditUser({...editUser, is_admin: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="edit-is_admin">Admin User</Label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>Update User</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;

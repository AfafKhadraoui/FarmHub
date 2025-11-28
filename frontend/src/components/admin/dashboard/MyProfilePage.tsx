'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../../../services/profile.services';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone, Building2, MapPin, Shield } from 'lucide-react';

export default function MyProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  // Fetch profile
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => profileService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
      alert('Profile updated successfully!');
    },
    onError: (error: any) => {
      alert('Failed to update profile: ' + (error.response?.data?.error || error.message));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData); // Debug log
    updateMutation.mutate(formData);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any form submission
    console.log('Edit button clicked'); // Debug log
    setIsEditing(true);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any form submission
    console.log('Cancel clicked'); // Debug log
    setIsEditing(false);
    // Reset form to original profile data
    if (profile) {
      setFormData({
        name: profile.name,
        phone: profile.phone || '',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">
          Failed to load profile. Please make sure you're logged in.
        </p>
        <button
          onClick={() => window.location.href = '/login'}
          className="mt-4 text-blue-600 underline"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="p-8 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{profile?.name}</h1>
            <p className="text-green-100 flex items-center gap-2 mt-2">
              <Shield className="w-4 h-4" />
              {profile?.role === 'admin' ? 'Farm Administrator' : 
               profile?.role === 'worker' ? 'Farm Worker' : 'Platform Admin'}
            </p>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Personal Information</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                value={profile?.email}
                disabled
                className="pl-10 bg-gray-50"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className="pl-10"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            {!isEditing ? (
              <Button
                type="button"
                onClick={handleEditClick}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </form>
      </Card>

      {/* Farm Information (if user has farm) */}
      {profile?.farm && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Farm Information</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Farm Name</p>
                <p className="font-semibold text-lg">{profile.farm.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold">{profile.farm.location}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Account Info */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Account Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">User ID</span>
            <span className="font-mono text-sm">{profile?.id}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Role</span>
            <span className="font-semibold capitalize">{profile?.role}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Member Since</span>
            <span className="font-medium">
              {new Date(profile?.createdAt || '').toLocaleDateString()}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
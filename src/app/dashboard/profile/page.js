"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { supabase } from "@/lib/supabase/client";
import { User, Mail, Calendar, Shield, Save } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    avatar_url: ''
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        if (user) {
          setUser(user);
          setProfile({
            full_name: user.user_metadata?.full_name || '',
            email: user.email || '',
            avatar_url: user.user_metadata?.avatar_url || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
          avatar_url: profile.avatar_url
        }
      });

      if (error) throw error;

      // Refresh user data
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // TODO: Add success toast notification
      
    } catch (error) {
      console.error('Error updating profile:', error);
      // TODO: Add error toast notification
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-4"></div>
          <div className="grid gap-6">
            <div className="h-40 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information and avatar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                {profile.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt="Profile avatar" />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {profile.full_name?.charAt(0)?.toUpperCase() || profile.email?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="space-y-2">
                <label htmlFor="avatar-url" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Avatar URL</label>
                <Input
                  id="avatar-url"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={profile.avatar_url}
                  onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Enter a URL to your profile image
                </p>
              </div>
            </div>

            <div className="border-t my-6"></div>

            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="full-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Full Name</label>
              <Input
                id="full-name"
                type="text"
                placeholder="Enter your full name"
                value={profile.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
              />
            </div>

            {/* Email Field (Read-only) */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email Address</label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-muted cursor-not-allowed"
              />
              <p className="text-sm text-muted-foreground">
                Email address cannot be changed from this page
              </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>
              View your account details and security information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </div>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Member Since
                </div>
                <p className="text-sm text-muted-foreground">
                  {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Account Status</div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user?.email_confirmed_at 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {user?.email_confirmed_at ? "Verified" : "Unverified"}
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Last Sign In</div>
                <p className="text-sm text-muted-foreground">
                  {user?.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Unknown'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
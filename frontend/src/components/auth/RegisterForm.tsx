// src/components/auth/RegisterForm.tsx

'use client';

import { AuthPanelLeft } from '@/components/auth/AuthPanelLeft';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { RegisterData } from '@/types/auth.types';
import { RoleSelector } from './RoleSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, MapPin, Building2, Hash, Mail, Lock, User, Phone } from 'lucide-react';
import { authService } from '@/services/auth.service';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'admin' | 'worker'>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [farmCodeValidation, setFarmCodeValidation] = useState<{
    isValidating: boolean;
    isValid: boolean;
    farmName: string;
  }>({
    isValidating: false,
    isValid: false,
    farmName: '',
  });

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    farmName: '',
    farmLocation: '',
    farmCode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFarmCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.toUpperCase();
    setFormData(prev => ({ ...prev, farmCode: code }));
    if (fieldErrors.farmCode) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.farmCode;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.name) {
      errors.name = 'Full name is required';
    }
    if (role === 'admin') {
      if (!formData.farmName) errors.farmName = 'Farm name is required';
      if (!formData.farmLocation) errors.farmLocation = 'Farm location is required';
    } else {
      if (!formData.farmCode) {
        errors.farmCode = 'Farm code is required';
      }
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      let response;
      if (role === 'admin') {
        response = await authService.registerAdmin({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          farmName: formData.farmName,
          farmLocation: formData.farmLocation,
        });
      } else {
        response = await authService.registerWorker({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          farmCode: formData.farmCode,
        });
      }
      authService.saveAuthData(response.token, response.user);
      window.location.href = '/workspace/dashboard';
    } catch (error: any) {
      setError(error.response?.data?.error || 'Registration failed');
      if (error.response?.data?.details) {
        setFieldErrors(error.response.data.details);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <AuthPanelLeft mode="register" />

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#333333] mb-2">Create Your Account</h2>
            <p className="text-[#666666]">Join FarmHub today</p>
          </div>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <RoleSelector selectedRole={role} onRoleChange={setRole} />

            <div>
              <Label htmlFor="name" className="text-[#333333] font-medium">Full Name</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="pl-12 h-14 bg-[#f8f8f8] border-[#e0e0e0] rounded-xl"
                />
              </div>
              {fieldErrors.name && (
                <p className="text-sm text-[#dc3545] mt-1">{fieldErrors.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="text-[#333333] font-medium">Email Address</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="pl-12 h-14 bg-[#f8f8f8] border-[#e0e0e0] rounded-xl"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-sm text-[#dc3545] mt-1">{fieldErrors.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone" className="text-[#333333] font-medium">
                Phone Number <span className="text-[#999999] text-xs font-normal">(optional)</span>
              </Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="pl-12 h-14 bg-[#f8f8f8] border-[#e0e0e0] rounded-xl"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="text-[#333333] font-medium">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="pl-12 pr-12 h-14 bg-[#f8f8f8] border-[#e0e0e0] rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#333333]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-sm text-[#dc3545] mt-1">{fieldErrors.password}</p>
              )}
              <p className="text-xs text-[#999999] mt-1">Must be at least 8 characters</p>
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-[#333333] font-medium">Confirm Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="pl-12 pr-12 h-14 bg-[#f8f8f8] border-[#e0e0e0] rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#333333]"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-sm text-[#dc3545] mt-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>
            {role === 'admin' ? (
              <>
                <div>
                  <Label htmlFor="farmName" className="text-[#333333] font-medium">Farm Name</Label>
                  <div className="relative mt-1.5">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                    <Input
                      id="farmName"
                      name="farmName"
                      type="text"
                      value={formData.farmName}
                      onChange={handleChange}
                      placeholder="Enter your farm name"
                      className="pl-12 h-14 bg-[#f8f8f8] border-[#e0e0e0] rounded-xl"
                    />
                  </div>
                  {fieldErrors.farmName && (
                    <p className="text-sm text-[#dc3545] mt-1">{fieldErrors.farmName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="farmLocation" className="text-[#333333] font-medium">Farm Location</Label>
                  <div className="relative mt-1.5">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                    <Input
                      id="farmLocation"
                      name="farmLocation"
                      type="text"
                      value={formData.farmLocation}
                      onChange={handleChange}
                      placeholder="Enter farm location"
                      className="pl-12 h-14 bg-[#f8f8f8] border-[#e0e0e0] rounded-xl"
                    />
                  </div>
                  {fieldErrors.farmLocation && (
                    <p className="text-sm text-[#dc3545] mt-1">{fieldErrors.farmLocation}</p>
                  )}
                </div>
              </>
            ) : (
              <div>
                <Label htmlFor="farmCode" className="text-[#333333] font-medium">Farm Code</Label>
                <div className="relative mt-1.5">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                  <Input
                    id="farmCode"
                    name="farmCode"
                    type="text"
                    value={formData.farmCode}
                    onChange={handleFarmCodeChange}
                    placeholder="Enter farm code (e.g., FARM-ABC123)"
                    className="pl-12 h-14 bg-[#f8f8f8] border-[#e0e0e0] rounded-xl uppercase"
                    maxLength={11}
                  />
                </div>
                {fieldErrors.farmCode && (
                  <p className="text-sm text-[#dc3545] mt-1">{fieldErrors.farmCode}</p>
                )}
                {farmCodeValidation.isValidating && (
                  <p className="text-sm text-[#666666] mt-1 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Validating farm code...
                  </p>
                )}
                {farmCodeValidation.isValid && farmCodeValidation.farmName && (
                  <p className="text-sm text-[#28a745] mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Valid! Joining {farmCodeValidation.farmName}
                  </p>
                )}
                <p className="text-xs text-[#999999] mt-1">Get this code from your farm admin</p>
              </div>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#5cb85c] hover:bg-[#4ca74c] text-white font-semibold rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e0e0e0]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#999999]">OR</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 h-12 border border-[#e0e0e0] rounded-xl hover:bg-[#f8f8f8] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-[#333333]">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 h-12 border border-[#e0e0e0] rounded-xl hover:bg-[#f8f8f8] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 23 23">
                <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              <span className="text-sm font-medium text-[#333333]">Microsoft</span>
            </button>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-[#666666]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#5cb85c] font-semibold hover:text-[#4ca74c]">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

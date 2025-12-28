// src/components/auth/LoginForm.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { RoleSelector } from './RoleSelector';
import { AuthPanelLeft } from '@/components/auth/AuthPanelLeft'; 

export function LoginForm() {
  const { login, isLoading } = useAuth();

  const [role, setRole] = useState<'admin' | 'worker'>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }
    // Only send email/password (no role)
    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    if (!result.success) {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <AuthPanelLeft mode="login" />

      {/* Right Panel - Login Form */}
      <div className="flex-1 lg:ml-[40%] flex items-center justify-center p-8 bg-white min-h-screen">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#333333] mb-2">Login to Your Account</h2>
            <p className="text-[#666666]">Enter your credentials to continue</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Toggle */}
            <RoleSelector selectedRole={role} onRoleChange={setRole} />
            {/* Email */}
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
                  placeholder="your@email.com"
                  className="pl-12 h-14 bg-[#f8f8f8] border-[#e0e0e0] rounded-xl"
                />
              </div>
            </div>

            {/* Password */}
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
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" /> }
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#e0e0e0] text-[#5cb85c] focus:ring-[#5cb85c]"
                />
                <span className="text-sm text-[#666666]">Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#5cb85c] hover:bg-[#4ca74c] text-white font-semibold rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login to Dashboard'
              )}
            </Button>
          </form>

          {/* Divider */}


          {/* OAuth Buttons */}


          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#666666]">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#5cb85c] font-semibold hover:text-[#4ca74c]">
                Sign up
              </Link>
            </p>
              <p className="text-sm text-[#666666]">
              <Link
                href="/"
                className="text-[#5cb85c] font-semibold hover:text-[#4ca74c]"
              >
                 Back to Home
              </Link>
              </p>
          </div>
        </div>
      </div>
    </div>
  );
}

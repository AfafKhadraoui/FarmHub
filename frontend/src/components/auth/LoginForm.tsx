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
import { AuthPanelLeft } from '@/components/auth/AuthPanelLeft'; // <-- IMPORT HERE!

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
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
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
            <div className="inline-flex w-full rounded-2xl bg-[#f0f0f0] p-1">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-xl transition-all ${
                  role === 'admin'
                    ? 'bg-[#5cb85c] text-white shadow-sm border-2 border-[#333333]'
                    : 'bg-transparent text-[#666666] hover:text-[#333333] border-2 border-transparent'
                }`}
              >
                Farm Owner
              </button>
              <button
                type="button"
                onClick={() => setRole('worker')}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-xl transition-all ${
                  role === 'worker'
                    ? 'bg-[#5cb85c] text-white shadow-sm border-2 border-[#333333]'
                    : 'bg-transparent text-[#666666] hover:text-[#333333] border-2 border-transparent'
                }`}
              >
                Worker
              </button>
            </div>

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
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
              <Link
                href="/forgot-password"
                className="text-sm text-[#5cb85c] hover:text-[#4ca74c] font-medium"
              >
                Forgot Password?
              </Link>
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
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e0e0e0]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#999999]">OR</span>
            </div>
          </div>

          {/* OAuth Buttons */}
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

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#666666]">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#5cb85c] font-semibold hover:text-[#4ca74c]">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

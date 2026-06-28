'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successfully logged in!');
      router.push('/pos');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Successfully logged in with Google!');
      router.push('/pos');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center py-0 px-4"
      style={{
        background: 'linear-gradient(135deg, #fff8fb 0%, #fdf5ff 35%, #f6efff 70%, #f1ebff 100%)',
      }}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full bg-pink-300/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-violet-300/20 blur-[100px]" />
        <div className="absolute left-1/2 top-1/3 h-[250px] w-[250px] rounded-full bg-indigo-200/20 blur-[90px]" />
      </div>

      <div className="relative z-5 w-full max-w-md">
        {/* Logo */}
        <div className="mb-1 flex flex-col items-center gap-0">
          <img src="/logo.png" alt="STYLESYNC" style={{ height: '180px' }} className="w-auto" />
        </div>

        <div className="rounded-3xl border border-white/40 bg-white/85 p-8 shadow-[0_25px_60px_rgba(0,0,0,.08)] backdrop-blur-xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-500">Sign in to continue managing your salon.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/70" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@stylesync.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:ring-offset-0 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/70" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-12 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:ring-offset-0 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-primary"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded-md border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-500">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="h-12 w-full rounded-xl gap-2 font-semibold text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] hover:shadow-xl active:scale-[0.99]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-[3px] border-white/30 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
                OR
              </span>
            </div>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              className="h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-primary/40 transition-all text-gray-700 shadow-none"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="mr-3 h-5 w-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              className="h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-primary/40 transition-all text-gray-700 shadow-none"
              onClick={() => console.log('Microsoft login')}
            >
              <svg className="mr-3 h-5 w-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#f25022" d="M1 1h10v10H1z" />
                <path fill="#00a4ef" d="M13 1h10v10H13z" />
                <path fill="#7fba00" d="M1 13h10v10H1z" />
                <path fill="#ffb900" d="M13 13h10v10H13z" />
              </svg>
              Microsoft
            </Button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-primary hover:opacity-80">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

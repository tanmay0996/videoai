'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import FormCard from '../components/FormCard';
import AnimatedBackground from '../components/AnimatedBackground';
import Navbar from '../components/Navbar';

// 🔹 IMPORT signIn helper
import { signIn } from 'next-auth/react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    // 🔹 Use signIn() instead of raw fetch
    const res = await signIn('credentials', {
      redirect: false,           // stay in JS-land and inspect result
      email: data.email,
      password: data.password,
      callbackUrl: '/video',     // where to go on success
    });

    setIsLoading(false);

    if (res?.error) {
      console.error('Login error:', res.error);  // log for debugging
      toast.error('Login failed', { description: res.error });
    } else {
      toast.success('Login successful!', {
        description: 'Welcome back to VideoAI!',
      });
      // 🔹 Navigate to the protected page
      router.push(res?.url || '/video');
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4">
      <AnimatedBackground />
      <Navbar />

      <div className="w-full max-w-md relative z-10">
        <FormCard title="Welcome Back" subtitle="Sign in to your VideoAI account">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" action="javascript:void(0)">
            {/* Email */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email Address
              </Label>
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="Enter your email"
                className="mt-2 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 transition-colors"
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </Label>
              <div className="relative mt-2">
                <Input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 transition-colors pr-12"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
            </motion.div>

            {/* Forgot Password Link */}
            <motion.div className="text-right" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <Link href="#" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                Forgot your password?
              </Link>
            </motion.div>

            {/* Submit Button */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 font-semibold transition-all duration-300"
              >
                {isLoading ? (
                  <motion.div className="flex items-center space-x-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </motion.div>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </span>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Sign-up Link */}
          <motion.div className="mt-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </motion.div>
        </FormCard>
      </div>
    </main>
  );
}

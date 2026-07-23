import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, GraduationCap, Lock, User, Building2 } from 'lucide-react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../context/authStore';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { departmentCode: 'CSE', username: '', password: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.login(data);
      if (res.success) {
        const { faculty, token, isHOD, redirectTo } = res.data;
        if (!isHOD) {
          toast.error('Access denied. HOD login required.');
          return;
        }
        login(
          {
            ...faculty,
            isHOD: true,
            roles: faculty.roles?.map((fr) => fr.role?.slug || fr) || [],
            departmentCode: faculty.department?.code,
          },
          token
        );
        toast.success(`Welcome back, ${faculty.name?.split(' ')[0]}!`);
        navigate(redirectTo || '/hod/dashboard', { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      {/* Background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="glass-light rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-glow mb-4">
              <GraduationCap size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Department Portal</h1>
            <p className="text-sm text-gray-500 mt-1">Engineering College ERP</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Department Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Department Code
              </label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
                <input
                  {...register('departmentCode', {
                    required: 'Department code is required',
                    maxLength: { value: 20, message: 'Too long' },
                  })}
                  placeholder="e.g. CSE, ECE, MECH"
                  className={clsx(
                    'input-field !pl-10',
                    errors.departmentCode && 'border-red-400 focus:ring-red-400'
                  )}
                />
              </div>
              {errors.departmentCode && (
                <p className="mt-1 text-xs text-red-500">{errors.departmentCode.message}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
                <input
                  {...register('username', {
                    required: 'Username is required',
                    minLength: { value: 3, message: 'At least 3 characters' },
                  })}
                  placeholder="Your username"
                  autoComplete="username"
                  className={clsx(
                    'input-field !pl-10',
                    errors.username && 'border-red-400 focus:ring-red-400'
                  )}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'At least 6 characters' },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  autoComplete="current-password"
                  className={clsx(
                    'input-field !pl-10 !pr-10',
                    errors.password && 'border-red-400 focus:ring-red-400'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-indigo-50 rounded-2xl">
            <p className="text-xs font-semibold text-indigo-700 mb-1.5 uppercase tracking-wide">HOD Login Credentials</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>Username: <code className="bg-white px-1.5 py-0.5 rounded text-indigo-600 font-mono">hod_cse</code> (CSE Dept)</p>
              <p>Password: <code className="bg-white px-1.5 py-0.5 rounded text-indigo-600 font-mono">hod@cse123</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { User, Mail, KeyRound, ShieldAlert } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('Isaac Agya Koomson');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      if (data?.user && !data?.session) {
        setSuccessMsg(
          'Registration complete! If email confirmation is enabled on your Supabase project, check your email to verify your account, then log in.'
        );
        return;
      }

      router.push('/today');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-[#262634] bg-[#121217] shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-lg font-bold text-[#F7F5F0]">
          Initialize 180 Cycle
        </CardTitle>
        <CardDescription className="text-xs text-[#8A8882]">
          Set up your operating system profile and start Day 1
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 p-2.5 rounded-md bg-red-950/40 border border-red-900/60 text-xs text-red-400">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="space-y-3 p-3 rounded-md bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300">
              <p>{successMsg}</p>
              <Link href="/login" className="inline-block text-[#C9A84C] underline font-medium">
                Go to Log In &rarr;
              </Link>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#A3A099]">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-[#5A5954]" />
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Isaac Agya Koomson"
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#A3A099]">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-[#5A5954]" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="isaac@kia180.com"
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#A3A099]">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-[#5A5954]" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="pl-9"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold text-xs py-2.5 h-10 mt-2"
            disabled={loading}
          >
            {loading ? 'Setting up Profile...' : 'Begin 180 Transformation'}
          </Button>

          <div className="text-center text-[11px] text-[#7A7872] pt-2">
            Already have an active cycle?{' '}
            <Link href="/login" className="text-[#C9A84C] hover:underline font-medium">
              Log in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

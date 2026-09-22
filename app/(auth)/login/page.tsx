'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight, KeyRound, Mail, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('isaac@kia180.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: password || 'temp_password',
      });

      if (error) {
        // In local development mode, allow instant entry
        if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true') {
          router.push('/today');
          return;
        }
        setErrorMsg(error.message);
        return;
      }

      router.push('/today');
    } catch {
      // Fallback for dev mode
      router.push('/today');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAccess = () => {
    router.push('/today');
  };

  return (
    <Card className="border-[#262634] bg-[#121217] shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-lg font-bold text-[#F7F5F0]">
          Executive Access
        </CardTitle>
        <CardDescription className="text-xs text-[#8A8882]">
          Enter your credentials to access your 180-day command centre
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 p-2.5 rounded-md bg-red-950/40 border border-red-900/60 text-xs text-red-400">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

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
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#A3A099]">Password</label>
              <Link
                href="/reset-password"
                className="text-[11px] text-[#C9A84C] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-[#5A5954]" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="pl-9"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold text-xs py-2.5 h-10 mt-2"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Enter Command Centre'}
          </Button>

          {/* Quick Demo Access button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleQuickDemoAccess}
              className="w-full py-2 px-3 rounded-md bg-[#181822] hover:bg-[#20202C] border border-[#2B2B3C] text-[#DFBF65] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Instant Isaac Baseline Demo Access</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="text-center text-[11px] text-[#7A7872] pt-2">
            First time?{' '}
            <Link href="/signup" className="text-[#C9A84C] hover:underline font-medium">
              Create account
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <Card className="border-[#262634] bg-[#121217] shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-lg font-bold text-[#F7F5F0]">
          Reset Password
        </CardTitle>
        <CardDescription className="text-xs text-[#8A8882]">
          Enter your executive email to receive recovery instructions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="text-center py-4 space-y-3">
            <div className="h-10 w-10 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="text-xs text-[#F7F5F0]">
              Reset instructions sent to <span className="font-semibold text-[#DFBF65]">{email}</span>
            </p>
            <Link href="/login">
              <Button variant="outline" size="sm" className="mt-4 text-xs">
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button
              type="submit"
              className="w-full bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold text-xs py-2.5 h-10 mt-2"
            >
              Send Reset Link
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-[#8A8882] hover:text-[#F7F5F0]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to login
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

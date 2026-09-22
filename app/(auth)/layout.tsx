import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0C] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle executive glow backgrounds */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Watermark */}
      <div className="mb-8 text-center">
        <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#8C6D23] items-center justify-center font-bold text-black text-xl shadow-lg shadow-amber-950/40 mb-3">
          KIA
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[#F7F5F0]">
          KIA 180
        </h1>
        <p className="text-xs text-[#8A8882] mt-1">
          Personal Growth & Execution Operating System
        </p>
      </div>

      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

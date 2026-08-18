'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { LogOut } from 'lucide-react';

interface AccountClientProps {
  locale: string;
}

export function AccountClient({ locale }: AccountClientProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isPtBr = locale.toLowerCase() === 'pt-br';

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.push(`/${locale}/login`);
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      alert('Failed to sign out.');
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="pt-2">
      <button
        onClick={handleSignOut}
        disabled={isLoggingOut}
        className="w-full py-4 rounded-2xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-heading font-extrabold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <LogOut className="w-4 h-4" />
        <span>{isLoggingOut ? (isPtBr ? 'Saindo...' : 'Signing out...') : (isPtBr ? 'SAIR DA CONTA' : 'LOG OUT')}</span>
      </button>
    </div>
  );
}

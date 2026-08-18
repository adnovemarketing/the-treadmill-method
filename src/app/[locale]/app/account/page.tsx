import React from 'react';
import { redirect } from 'next/navigation';
import { MemberNav } from '@/components/member/MemberNav';
import { createSupabaseServerAppClient } from '@/lib/supabase/server';
import { checkAndLinkUserEntitlement } from '@/lib/entitlement';
import { AccountClient } from '@/components/member/AccountClient';
import { User, Mail, HelpCircle, ShieldCheck } from 'lucide-react';

interface AccountPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale = 'en-gb' } = await params;
  const isPtBr = locale.toLowerCase() === 'pt-br';

  const supabase = await createSupabaseServerAppClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect(`/${locale}/login`);
  }

  const user = data.user;
  const entitlement = await checkAndLinkUserEntitlement(user.id, user.email || '');

  if (!entitlement.hasEntitlement) {
    redirect(`/${locale}/no-access`);
  }

  // Fetch first_name from public.profiles if exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, email')
    .eq('id', user.id)
    .maybeSingle();

  const userEmail = user.email || profile?.email || 'N/A';
  const firstName = profile?.first_name || null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-between selection:bg-brand-lime selection:text-zinc-950">
      <MemberNav locale={locale} />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full w-fit">
            {isPtBr ? 'DETALHES DA CONTA' : 'ACCOUNT PROFILE'}
          </span>
          <h1 className="text-2xl md:text-3xl font-heading font-black text-zinc-50 uppercase tracking-tight">
            {isPtBr ? 'Sua Conta de Membro' : 'Your Member Account'}
          </h1>
          <p className="text-xs text-zinc-400">
            {isPtBr
              ? 'Gerencie seus dados de acesso e suporte.'
              : 'View your account credentials and support access.'}
          </p>
        </div>

        {/* Credentials Card */}
        <div className="bg-zinc-900/40 border border-zinc-900 p-6 rounded-3xl flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
            <div className="w-10 h-10 rounded-full bg-brand-lime/10 border border-brand-lime/30 flex items-center justify-center text-brand-lime font-heading font-black">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-heading font-bold text-zinc-100">
                {firstName ? `${firstName}` : isPtBr ? 'Membro Ativo' : 'Active Member'}
              </h3>
              <span className="text-[10px] font-heading font-bold text-brand-teal uppercase tracking-wider">
                {isPtBr ? 'Acesso Confirmado' : 'Paid Entitlement Active'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between bg-zinc-950 p-4 rounded-2xl border border-zinc-900">
              <div className="flex items-center gap-2 text-zinc-400">
                <Mail className="w-4 h-4 text-brand-teal" />
                <span>Email</span>
              </div>
              <span className="font-heading font-extrabold text-zinc-100">{userEmail}</span>
            </div>

            <div className="flex items-center justify-between bg-zinc-950 p-4 rounded-2xl border border-zinc-900">
              <div className="flex items-center gap-2 text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-brand-lime" />
                <span>Status</span>
              </div>
              <span className="font-heading font-bold text-brand-lime">Verified Entitled Customer</span>
            </div>
          </div>
        </div>

        {/* Support Link */}
        <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-2xl flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-brand-teal shrink-0" />
            <div>
              <h4 className="font-heading font-bold text-zinc-200">
                {isPtBr ? 'Precisa de ajuda com sua conta?' : 'Need support with your account?'}
              </h4>
              <p className="text-[10px] text-zinc-500">
                {isPtBr ? 'Fale com nossa equipe de atendimento.' : 'Contact our member support desk.'}
              </p>
            </div>
          </div>
          <a
            href="mailto:support@thetreadmillmethod.com"
            className="text-brand-lime font-heading font-bold text-xs hover:underline shrink-0"
          >
            {isPtBr ? 'Contatar Suporte' : 'Contact Support'}
          </a>
        </div>

        {/* Client Logout Component */}
        <AccountClient locale={locale} />
      </main>
    </div>
  );
}

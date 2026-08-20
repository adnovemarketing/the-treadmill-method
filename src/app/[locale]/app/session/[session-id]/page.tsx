import React from 'react';
import { redirect } from 'next/navigation';
import { MemberNav } from '@/components/member/MemberNav';
import { createSupabaseServerAppClient } from '@/lib/supabase/server';
import { checkAndLinkUserEntitlement } from '@/lib/entitlement';
import { getUserPersonalisedProfile } from '@/lib/personalisationServer';
import { getUserProgrammeProgress } from '@/lib/progressServer';
import { getSessionById, isSessionInProgramme } from '@/core/programmes/helpers';
import { getAdaptiveGuidance } from '@/core/programmes/adaptive';
import { SessionDetailClient } from '@/components/member/SessionDetailClient';

interface SessionPageProps {
  params: Promise<{ locale: string; 'session-id': string }>;
}

export default async function SessionDetailPage({ params }: SessionPageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale || 'en-gb';
  const sessionId = resolvedParams['session-id'];

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

  const personalisation = await getUserPersonalisedProfile(user.id, locale);
  if (!personalisation.success || !personalisation.plan) {
    redirect(`/${locale}/no-access`);
  }

  const plan = personalisation.plan;
  const profileId = personalisation.profileId!;

  // 1. Check if session exists in library
  const session = getSessionById(sessionId);
  if (!session) {
    redirect(`/${locale}/app`);
  }

  // 2. Validate session belongs to user's assigned programme
  if (!isSessionInProgramme(sessionId, plan.programme)) {
    redirect(`/${locale}/app`);
  }

  // 3. Check if session is already completed by user
  const progressRecords = await getUserProgrammeProgress(user.id);
  const isAlreadyCompleted = progressRecords.some((r) => r.programme_session_id === sessionId);
  const guidance = getAdaptiveGuidance(progressRecords, locale);
  const contextualNotice = isAlreadyCompleted ? null : guidance.contextualNotice;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-between selection:bg-brand-lime selection:text-zinc-950">
      <MemberNav locale={locale} />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8">
        <SessionDetailClient
          session={session}
          userId={user.id}
          profileId={profileId}
          isAlreadyCompleted={isAlreadyCompleted}
          contextualNotice={contextualNotice}
          locale={locale}
        />
      </main>
    </div>
  );
}

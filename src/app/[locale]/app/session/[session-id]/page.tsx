import React from 'react';
import { redirect } from 'next/navigation';
import { MemberNav } from '@/components/member/MemberNav';
import { createSupabaseServerAppClient } from '@/lib/supabase/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { checkAndLinkUserEntitlement } from '@/lib/entitlement';
import { getUserPersonalisedProfile } from '@/lib/personalisationServer';
import {
  getUserProgrammeProgress,
  getUserAllProgressRecords,
  getUserPostProgrammeProgress,
  getUserActivePostProgrammeCycle,
} from '@/lib/progressServer';
import { getSessionById, isSessionInProgramme } from '@/core/programmes/helpers';
import { getAdaptiveGuidance } from '@/core/programmes/adaptive';
import { getPostProgrammeCycleSessions } from '@/core/programmes/postProgramme';
import { SessionDetailClient } from '@/components/member/SessionDetailClient';

interface SessionPageProps {
  params: Promise<{ locale: string; 'session-id': string }>;
  searchParams: Promise<{ cycleId?: string }>;
}

export default async function SessionDetailPage({ params, searchParams }: SessionPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const locale = resolvedParams.locale || 'en-gb';
  const sessionId = resolvedParams['session-id'];
  const cycleId = resolvedSearchParams.cycleId;

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

  const allRecords = await getUserAllProgressRecords(user.id);
  const guidance = getAdaptiveGuidance(allRecords, locale);

  let postContext = null;
  let isAlreadyCompleted = false;

  // Post-Day-21 execution context: cycleId validation via server authority
  if (cycleId) {
    const adminSupabase = getSupabaseServerClient();
    const { data: cycle, error: cycleErr } = await adminSupabase
      .from('post_programme_cycles')
      .select('*')
      .eq('id', cycleId)
      .eq('user_id', user.id)
      .single();

    if (cycleErr || !cycle || cycle.status !== 'active') {
      redirect(`/${locale}/app`);
    }

    const postRecords = await getUserPostProgrammeProgress(user.id);
    const cycleCompletions = postRecords.filter((r) => r.cycle_id === cycle.id);
    const completedPositions = new Set(cycleCompletions.map((r) => r.session_position));
    const expectedPosition = completedPositions.size + 1;

    if (expectedPosition > 3) {
      redirect(`/${locale}/app/next`);
    }

    const cycleSessions = getPostProgrammeCycleSessions(cycle.programme, cycle.action_type);
    const expectedItem = cycleSessions[expectedPosition - 1];

    if (!expectedItem || expectedItem.programmeSession.id !== sessionId) {
      redirect(`/${locale}/app/session/${expectedItem?.programmeSession.id || sessionId}?cycleId=${cycle.id}`);
    }

    postContext = {
      cycleId: cycle.id,
      cycleNumber: cycle.cycle_number,
      actionType: cycle.action_type,
      sessionPosition: expectedPosition,
      durationMinutes: expectedItem.plannedDurationMinutes,
    };
  } else {
    // Check if initial 21-Day core session is already completed
    const progressRecords = await getUserProgrammeProgress(user.id);
    isAlreadyCompleted = progressRecords.some((r) => r.programme_session_id === sessionId);

    // If user complete 9/9 and hasn't passed cycleId, check if active cycle exists to redirect
    const activeCycle = await getUserActivePostProgrammeCycle(user.id);
    if (activeCycle) {
      redirect(`/${locale}/app`);
    }
  }

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
          postContext={postContext}
          locale={locale}
        />
      </main>
    </div>
  );
}

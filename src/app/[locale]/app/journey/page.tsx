import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MemberNav } from '@/components/member/MemberNav';
import { createSupabaseServerAppClient } from '@/lib/supabase/server';
import { checkAndLinkUserEntitlement } from '@/lib/entitlement';
import { getUserPersonalisedProfile } from '@/lib/personalisationServer';
import { getUserProgrammeProgress } from '@/lib/progressServer';
import { getProgrammeDefinition } from '@/core/programmes/helpers';
import { CheckCircle2, Play, ChevronRight } from 'lucide-react';

interface JourneyPageProps {
  params: Promise<{ locale: string }>;
}

export default async function JourneyPage({ params }: JourneyPageProps) {
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

  const personalisation = await getUserPersonalisedProfile(user.id, locale);
  if (!personalisation.success || !personalisation.plan) {
    redirect(`/${locale}/no-access`);
  }

  const plan = personalisation.plan;
  const programmeDef = getProgrammeDefinition(plan.programme);

  const progressRecords = await getUserProgrammeProgress(user.id);
  const completedSet = new Set(progressRecords.map((r) => r.programme_session_id));

  // Determine next walk session ID
  let nextWalkId: string | null = null;
  for (const week of programmeDef.weeks) {
    for (const session of week.sessions) {
      if (!completedSet.has(session.id)) {
        nextWalkId = session.id;
        break;
      }
    }
    if (nextWalkId) break;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-between selection:bg-brand-lime selection:text-zinc-950">
      <MemberNav locale={locale} />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full w-fit">
            {isPtBr ? 'JORNADA DE 21 DIAS' : '21-DAY JOURNEY'}
          </span>
          <h1 className="text-2xl md:text-3xl font-heading font-black text-zinc-50 uppercase tracking-tight">
            {programmeDef.name} — {isPtBr ? 'Grade de Treinos' : 'Programme Roadmap'}
          </h1>
          <p className="text-xs text-zinc-400 max-w-2xl">
            {programmeDef.tagline}
          </p>
        </div>

        {/* 3 Weeks Roadmap */}
        <div className="flex flex-col gap-8">
          {programmeDef.weeks.map((week) => (
            <div key={week.week} className="flex flex-col gap-4">
              <div className="flex items-center gap-3 border-b border-zinc-900 pb-2">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-heading font-black text-xs text-brand-lime">
                  W0{week.week}
                </div>
                <h2 className="text-sm md:text-base font-heading font-black text-zinc-100 uppercase tracking-wide">
                  {isPtBr ? `Semana ${week.week}` : `Week ${week.week}`} — {week.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {week.sessions.map((session) => {
                  const isCompleted = completedSet.has(session.id);
                  const isNext = session.id === nextWalkId;

                  return (
                    <Link
                      key={session.id}
                      href={`/${locale}/app/session/${session.id}`}
                      className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all duration-200 hover:-translate-y-1 ${
                        isCompleted
                          ? 'bg-zinc-900/30 border-zinc-900 text-zinc-400'
                          : isNext
                          ? 'bg-gradient-to-b from-zinc-900 to-zinc-950 border-brand-lime/50 shadow-lg shadow-lime-500/5 text-zinc-50'
                          : 'bg-zinc-950 border-zinc-900 text-zinc-300 hover:border-zinc-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-heading font-extrabold uppercase tracking-wider text-zinc-500">
                          {isPtBr ? `Treino ${session.sessionNumber}` : `Session ${session.sessionNumber}`}
                        </span>

                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-heading font-bold text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded-full border border-brand-teal/30">
                            <CheckCircle2 className="w-3 h-3" />
                            {isPtBr ? 'Concluído' : 'Completed'}
                          </span>
                        ) : isNext ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-heading font-extrabold text-brand-lime bg-brand-lime/10 px-2 py-0.5 rounded-full border border-brand-lime/30 animate-pulse">
                            <Play className="w-2.5 h-2.5 fill-current" />
                            {isPtBr ? 'Próximo Treino' : 'Next Walk'}
                          </span>
                        ) : (
                          <span className="text-[9px] font-heading font-bold text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded-full">
                            {isPtBr ? 'Futuro' : 'Upcoming'}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3
                          className={`text-sm font-heading font-extrabold tracking-wide uppercase ${
                            isNext ? 'text-brand-lime' : isCompleted ? 'text-zinc-400' : 'text-zinc-100'
                          }`}
                        >
                          {session.title}
                        </h3>
                        <p className="text-[11px] text-zinc-400 mt-1 leading-normal line-clamp-2">
                          {session.summary}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-zinc-900/60 text-xs font-heading font-bold">
                        <span className="text-zinc-400">{session.durationMinutes} min</span>
                        <span className="inline-flex items-center text-zinc-500 hover:text-zinc-200 gap-1 text-[10px]">
                          {isPtBr ? 'Detalhes' : 'Details'}
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

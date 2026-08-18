import React from 'react';
import { redirect } from 'next/navigation';
import { MemberNav } from '@/components/member/MemberNav';
import { createSupabaseServerAppClient } from '@/lib/supabase/server';
import { checkAndLinkUserEntitlement } from '@/lib/entitlement';
import { getUserPersonalisedProfile } from '@/lib/personalisationServer';
import { PersonalStrategyType } from '@/core/types/personalisation';
import { Compass, CheckCircle2 } from 'lucide-react';

interface StrategyPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PersonalStrategyPage({ params }: StrategyPageProps) {
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

  const strategyKey = personalisation.plan.personal_strategy;
  const labels = personalisation.labels!;

  const STRATEGY_CONTENT: Record<
    PersonalStrategyType,
    { title: string; subtitle: string; bodyParagraphs: string[] }
  > = {
    minimum_session_rule: {
      title: 'The Minimum Session Rule',
      subtitle: 'A busy day does not have to become a missed day.',
      bodyParagraphs: [
        'When you genuinely cannot complete your planned session, complete the first 10 minutes rather than automatically skipping the walk.',
        'If you still need to stop afterwards, stop.',
        'A shorter walk can help keep the routine alive.',
      ],
    },
    variety_without_complexity: {
      title: 'Variety Without Complexity',
      subtitle: 'Your walking programme does not need to feel identical every day.',
      bodyParagraphs: [
        'Consider pairing appropriate Easy sessions with music, an audiobook, a podcast or something else you enjoy.',
        'Changes between Easy, Comfortable and Brisk effort also introduce natural variety.',
      ],
    },
    walking_appointments: {
      title: 'Walking Appointments',
      subtitle: 'Do not wait until the day itself to decide whether you will walk.',
      bodyParagraphs: [
        'Use your preferred walking time and place your planned sessions in your diary like appointments.',
        'When the time arrives, the decision has already been made.',
      ],
    },
    comfort_first: {
      title: 'Comfort First',
      subtitle: 'There is no prize for pushing through new or worsening pain.',
      bodyParagraphs: [
        'Keep your walking controlled and use the effort guidance in your programme.',
        'If walking causes new pain, worsens existing pain or creates symptoms that concern you, stop and seek appropriate professional advice where needed.',
      ],
    },
    never_miss_twice: {
      title: 'Never Miss Twice',
      subtitle: 'Life happens. Missing one planned session does not mean you have failed.',
      bodyParagraphs: [
        'Try not to let one missed walk automatically become two.',
        'Simply resume with the next planned session.',
      ],
    },
  };

  const strategy = STRATEGY_CONTENT[strategyKey] || STRATEGY_CONTENT.never_miss_twice;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-between selection:bg-brand-lime selection:text-zinc-950">
      <MemberNav locale={locale} />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full w-fit">
            {isPtBr ? 'SUA ESTRATÉGIA PERSONALIZADA' : 'MY PERSONAL STRATEGY'}
          </span>
          <h1 className="text-2xl md:text-3xl font-heading font-black text-zinc-50 uppercase tracking-tight">
            {strategy.title}
          </h1>
          <p className="text-xs text-zinc-400 font-heading font-bold">
            {strategy.subtitle}
          </p>
        </div>

        {/* Core Strategy Content Card */}
        <div className="w-full bg-gradient-to-b from-zinc-900/80 to-zinc-900/30 border border-brand-teal/30 p-6 md:p-8 rounded-3xl flex flex-col gap-5 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-36 h-36 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Compass className="w-5 h-5 text-brand-teal shrink-0" />
            <span className="text-xs font-heading font-extrabold text-brand-lime uppercase tracking-wider">
              {labels.personalStrategyLabel}
            </span>
          </div>

          <div className="flex flex-col gap-4 text-xs text-zinc-300 leading-relaxed font-normal">
            {strategy.bodyParagraphs.map((paragraph, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-zinc-950/60 p-4 rounded-2xl border border-zinc-900">
                <CheckCircle2 className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-200 leading-relaxed">{paragraph}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

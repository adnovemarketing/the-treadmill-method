'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play } from 'lucide-react';
import { AdaptiveRecommendation } from '@/core/programmes/adaptive';
import { startPostProgrammeCycleAction } from '@/app/[locale]/app/session/actions';

interface AfterDay21CtaProps {
  recommendation: AdaptiveRecommendation;
  locale: string;
}

export function AfterDay21Cta({ recommendation, locale }: AfterDay21CtaProps) {
  const router = useRouter();
  const isPtBr = locale.toLowerCase() === 'pt-br';
  const [isStarting, setIsStarting] = useState(false);

  const handleStartCycle = async () => {
    if (isStarting) return;
    setIsStarting(true);

    try {
      const res = await startPostProgrammeCycleAction();
      if (res.success && res.cycleId && res.nextSessionId) {
        router.push(`/${locale}/app/session/${res.nextSessionId}?cycleId=${res.cycleId}`);
        router.refresh();
      } else {
        alert(res.error || 'Failed to start cycle.');
      }
    } catch (err: unknown) {
      console.error(err);
      alert('An error occurred starting post-programme cycle.');
    } finally {
      setIsStarting(false);
    }
  };

  let ctaText = isPtBr ? 'REPETIR SEMANA 3' : 'REPEAT WEEK 3';
  if (recommendation === 'maintain') {
    ctaText = isPtBr ? 'CONTINUAR ROTINA ATUAL' : 'CONTINUE CURRENT ROUTINE';
  } else if (recommendation === 'progress') {
    ctaText = isPtBr ? 'INICIAR PROGRESSÃO GRADUAL' : 'START A GRADUAL PROGRESSION';
  }

  return (
    <button
      onClick={handleStartCycle}
      disabled={isStarting}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-lime text-zinc-950 hover:bg-brand-lime-hover font-heading font-bold text-sm tracking-wide px-8 py-4 rounded-2xl transition-all shadow-lg shadow-lime-500/10 cursor-pointer mt-2 disabled:opacity-50"
    >
      <Play className="w-4 h-4 fill-current" />
      <span>{isStarting ? (isPtBr ? 'Carregando...' : 'Starting...') : ctaText}</span>
    </button>
  );
}

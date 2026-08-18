'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProgrammeSession } from '@/core/programmes/library';
import { EFFORT_SCALE } from '@/core/programmes/effortScale';
import { Play, CheckCircle2, ArrowLeft, Clock, Heart, Sparkles } from 'lucide-react';
import { recordSessionCompletionAction } from '@/app/[locale]/app/session/actions';

interface SessionDetailClientProps {
  session: ProgrammeSession;
  userId: string;
  profileId: string;
  isAlreadyCompleted: boolean;
  locale: string;
}

export function SessionDetailClient({
  session,
  userId,
  profileId,
  isAlreadyCompleted,
  locale,
}: SessionDetailClientProps) {
  const router = useRouter();
  const isPtBr = locale.toLowerCase() === 'pt-br';

  const [hasStarted, setHasStarted] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  // Check-in state
  const [difficulty, setDifficulty] = useState<'Easy' | 'Good' | 'Hard'>('Good');
  const [couldContinue, setCouldContinue] = useState<'Yes' | 'Maybe' | 'No'>('Yes');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleOpenCheckIn = () => {
    setShowCheckInModal(true);
  };

  const handleSubmitCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await recordSessionCompletionAction({
        userId,
        profileId,
        sessionId: session.id,
        difficulty,
        couldContinue,
        note: note.trim(),
      });

      if (res.success) {
        setShowCheckInModal(false);
        router.push(`/${locale}/app`);
        router.refresh();
      } else {
        alert(res.error || 'Failed to complete session.');
      }
    } catch (err: unknown) {
      console.error(err);
      alert('An error occurred submitting check-in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="w-fit text-xs font-heading font-bold text-zinc-400 hover:text-zinc-100 flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isPtBr ? 'Voltar' : 'Back'}</span>
      </button>

      {/* Header Info */}
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-900 p-6 md:p-8 rounded-3xl flex flex-col gap-4 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-4">
          <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full border border-brand-lime/30">
            {isPtBr ? `SEMANA ${session.week} · TREINO ${session.sessionNumber}` : `WEEK ${session.week} · SESSION ${session.sessionNumber}`}
          </span>

          <div className="flex items-center gap-3 text-xs font-heading font-bold text-zinc-300">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-teal" />
              {session.durationMinutes} min
            </span>
            <span className="text-brand-lime">Effort: {session.effort}</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-black text-zinc-50 uppercase tracking-tight">
            {session.title}
          </h1>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            {session.summary}
          </p>
        </div>

        {/* CTA Controls */}
        <div className="pt-2">
          {isAlreadyCompleted ? (
            <div className="w-full bg-brand-teal/10 border border-brand-teal/30 p-4 rounded-2xl flex items-center gap-3 text-brand-teal text-xs font-heading font-bold">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>
                {isPtBr
                  ? 'Você já concluiu este treino! Pode visualizá-lo sempre que desejar.'
                  : 'You have completed this session! You can review its structure anytime.'}
              </span>
            </div>
          ) : !hasStarted ? (
            <button
              onClick={handleStart}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-lime text-zinc-950 hover:bg-brand-lime-hover font-heading font-bold text-sm tracking-wide px-8 py-4 rounded-2xl transition-all shadow-lg shadow-lime-500/10 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isPtBr ? 'INICIAR SESSÃO' : 'START SESSION'}</span>
            </button>
          ) : (
            <button
              onClick={handleOpenCheckIn}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-teal text-zinc-950 hover:opacity-90 font-heading font-bold text-sm tracking-wide px-8 py-4 rounded-2xl transition-all shadow-lg shadow-teal-500/10 cursor-pointer animate-pulse"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isPtBr ? 'CONCLUIR SESSÃO' : 'COMPLETE SESSION'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Walking Blocks Breakdown */}
      <div className="bg-zinc-900/40 border border-zinc-900 p-6 rounded-3xl flex flex-col gap-4">
        <h2 className="text-sm font-heading font-extrabold text-zinc-100 uppercase tracking-wide flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-lime" />
          {isPtBr ? 'ESTRUTURA DO TREINO' : 'WALKING BLOCKS BREAKDOWN'}
        </h2>

        <div className="flex flex-col gap-3">
          {session.blocks.map((block, idx) => (
            <div
              key={idx}
              className="bg-zinc-950 border border-zinc-900/80 p-4 rounded-2xl flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-heading font-black text-xs text-brand-lime shrink-0">
                  0{idx + 1}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">{block.name}</h4>
                  <span className="text-[10px] text-zinc-500">{block.effort}</span>
                </div>
              </div>
              <span className="text-xs font-heading font-extrabold text-brand-lime shrink-0">
                {block.durationMinutes} min
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Effort Guidance Card */}
      <div className="bg-zinc-900/20 border border-zinc-900 p-6 rounded-3xl flex flex-col gap-4">
        <h3 className="text-xs font-heading font-extrabold text-zinc-300 uppercase tracking-wide flex items-center gap-2">
          <Heart className="w-4 h-4 text-brand-teal" />
          {isPtBr ? 'GUIA DE INTENSIDADE & ESFORÇO' : 'EFFORT SCALE GUIDANCE'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-900 flex flex-col gap-1">
            <span className="font-heading font-bold text-brand-lime">{EFFORT_SCALE.easy.name} ({EFFORT_SCALE.easy.rpeScale})</span>
            <p className="text-[10px] text-zinc-400 leading-normal">{EFFORT_SCALE.easy.description}</p>
          </div>
          <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-900 flex flex-col gap-1">
            <span className="font-heading font-bold text-brand-teal">{EFFORT_SCALE.comfortable.name} ({EFFORT_SCALE.comfortable.rpeScale})</span>
            <p className="text-[10px] text-zinc-400 leading-normal">{EFFORT_SCALE.comfortable.description}</p>
          </div>
          <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-900 flex flex-col gap-1">
            <span className="font-heading font-bold text-zinc-100">{EFFORT_SCALE.brisk.name} ({EFFORT_SCALE.brisk.rpeScale})</span>
            <p className="text-[10px] text-zinc-400 leading-normal">{EFFORT_SCALE.brisk.description}</p>
          </div>
        </div>
      </div>

      {/* POST-SESSION CHECK-IN MODAL */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex flex-col gap-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-1 text-center">
              <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full w-fit mx-auto">
                {isPtBr ? 'CHECK-IN PÓS-TREINO' : 'POST-SESSION CHECK-IN'}
              </span>
              <h3 className="text-xl font-heading font-black text-zinc-50 uppercase tracking-tight mt-1">
                {isPtBr ? 'Como foi sua caminhada?' : 'How did this session feel?'}
              </h3>
            </div>

            <form onSubmit={handleSubmitCheckIn} className="flex flex-col gap-4 text-xs">
              {/* Question 1: Difficulty */}
              <div className="flex flex-col gap-2">
                <label className="font-heading font-extrabold text-zinc-300">
                  {isPtBr ? 'Percepção de esforço:' : 'Perceived difficulty:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Easy', 'Good', 'Hard'] as const).map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setDifficulty(opt)}
                      className={`py-3 px-2 rounded-xl font-heading font-bold text-xs border transition-all cursor-pointer ${
                        difficulty === opt
                          ? 'bg-brand-lime text-zinc-950 border-brand-lime'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {opt === 'Easy' ? (isPtBr ? 'Fácil' : 'Easy') : opt === 'Good' ? (isPtBr ? 'Bom' : 'Good') : (isPtBr ? 'Difícil' : 'Hard')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Could Continue */}
              <div className="flex flex-col gap-2">
                <label className="font-heading font-extrabold text-zinc-300">
                  {isPtBr
                    ? 'Conseguiria continuar por mais alguns minutos confortavelmente?'
                    : 'Could you comfortably have continued for another few minutes?'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Yes', 'Maybe', 'No'] as const).map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setCouldContinue(opt)}
                      className={`py-3 px-2 rounded-xl font-heading font-bold text-xs border transition-all cursor-pointer ${
                        couldContinue === opt
                          ? 'bg-brand-teal text-zinc-950 border-brand-teal'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {opt === 'Yes' ? (isPtBr ? 'Sim' : 'Yes') : opt === 'Maybe' ? (isPtBr ? 'Talvez' : 'Maybe') : (isPtBr ? 'Não' : 'No')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Note */}
              <div className="flex flex-col gap-1.5">
                <label className="font-heading font-bold text-zinc-400 text-[11px]">
                  {isPtBr ? 'Observação opcional (curta):' : 'Optional short note:'}
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={300}
                  placeholder={isPtBr ? 'Ex: Me senti com ótima energia...' : 'e.g. Felt great energy today...'}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-brand-lime resize-none h-20"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="w-1/3 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-zinc-200 font-heading font-bold text-xs cursor-pointer"
                >
                  {isPtBr ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-3 rounded-xl bg-brand-lime text-zinc-950 hover:bg-brand-lime-hover font-heading font-bold text-xs cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? (isPtBr ? 'Salvando...' : 'Saving...') : (isPtBr ? 'REGISTRAR TREINO' : 'SUBMIT & COMPLETE')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

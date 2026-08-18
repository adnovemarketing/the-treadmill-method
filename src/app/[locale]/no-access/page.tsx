import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { ShieldAlert, ArrowLeft, Mail } from 'lucide-react';

interface NoAccessPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NoAccessPage({ params }: NoAccessPageProps) {
  const { locale = 'en-gb' } = await params;
  const isPtBr = locale.toLowerCase() === 'pt-br';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-between selection:bg-brand-lime selection:text-zinc-950">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md bg-zinc-900/40 border border-zinc-900 p-6 md:p-8 rounded-3xl text-center flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Icon Badge */}
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-widest text-amber-400 font-heading font-extrabold uppercase bg-amber-500/10 px-3 py-1 rounded-full w-fit mx-auto">
              {isPtBr ? 'COMPRA NÃO ENCONTRADA' : 'NO ACTIVE PURCHASE'}
            </span>

            <h1 className="text-xl md:text-2xl font-heading font-black text-zinc-100 tracking-tight uppercase mt-2">
              {isPtBr ? 'Acesso Não Confirmado' : 'No Purchase Found'}
            </h1>

            <p className="text-xs text-zinc-300 font-semibold leading-relaxed mt-1">
              {isPtBr
                ? 'Não encontramos uma compra ativa para este e-mail.'
                : "We couldn't find an active purchase for this email."}
            </p>

            <p className="text-xs text-zinc-400 leading-relaxed mt-1">
              {isPtBr
                ? 'Por favor, entre utilizando exatamente o mesmo e-mail informado no momento do checkout.'
                : 'Please sign in using the same email address you used at checkout.'}
            </p>
          </div>

          <div className="w-full flex flex-col gap-3 mt-2">
            <Link
              href={`/${locale}/login`}
              className="w-full bg-brand-lime text-zinc-950 hover:bg-brand-lime-hover font-heading font-bold text-xs tracking-wide py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-lime-400/10"
            >
              <ArrowLeft className="w-4 h-4" />
              {isPtBr ? 'Voltar para o Login' : 'Return to Sign In'}
            </Link>

            <a
              href="mailto:support@thetreadmillmethod.com"
              className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isPtBr ? 'Falar com o Suporte' : 'Contact Support'}</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

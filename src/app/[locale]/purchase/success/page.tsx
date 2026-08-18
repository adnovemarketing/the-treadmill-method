import React from 'react';
import { Header } from '@/components/common/Header';
import { getStripeServerClient } from '@/lib/stripeServer';
import { CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

import { getSupabaseServerClient } from '@/lib/supabaseServer';

interface SuccessPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string | string[] }>;
}

export default async function PurchaseSuccessPage({
  params,
  searchParams,
}: SuccessPageProps) {
  const { locale = 'en-gb' } = await params;
  const resolvedSearchParams = await searchParams;
  const rawSessionId = resolvedSearchParams?.session_id;
  const sessionId = Array.isArray(rawSessionId)
    ? rawSessionId[0]?.trim()
    : rawSessionId?.trim();

  let isValidSession = false;
  let customerEmail: string | null = null;

  if (sessionId && typeof sessionId === 'string') {
    // 1. Primary Check: Retrieve Checkout Session from Stripe SDK
    try {
      const stripe = getStripeServerClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (
        session &&
        (session.payment_status === 'paid' ||
          session.status === 'complete' ||
          session.payment_status === 'no_payment_required')
      ) {
        isValidSession = true;
        customerEmail =
          session.customer_details?.email ||
          session.customer_email ||
          (typeof session.customer === 'object' &&
          session.customer &&
          'email' in session.customer
            ? (session.customer as { email?: string }).email
            : null) ||
          null;
      }
    } catch (err: unknown) {
      console.error(
        '[Purchase Success Stripe Verification Warning]:',
        err instanceof Error ? err.message : 'Stripe retrieval failed'
      );
    }

    // 2. Secondary / Fallback Check: Check authoritative public.purchases table in Supabase
    if (!isValidSession) {
      try {
        const supabase = getSupabaseServerClient();
        const { data: purchase } = await supabase
          .from('purchases')
          .select('id, payment_status, profile_id')
          .eq('stripe_checkout_session_id', sessionId)
          .maybeSingle();

        if (
          purchase &&
          ['paid', 'completed', 'active', 'succeeded'].includes(
            purchase.payment_status?.toLowerCase() || ''
          )
        ) {
          isValidSession = true;

          if (!customerEmail && purchase.profile_id) {
            const { data: profile } = await supabase
              .from('quiz_profiles')
              .select('email')
              .eq('id', purchase.profile_id)
              .maybeSingle();
            if (profile?.email) {
              customerEmail = profile.email;
            }
          }
        }
      } catch (dbErr: unknown) {
        console.error(
          '[Purchase Success DB Verification Error]:',
          dbErr instanceof Error ? dbErr.message : 'Database check failed'
        );
      }
    }
  }

  const isPtBr = locale.toLowerCase() === 'pt-br';


  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-between selection:bg-brand-lime selection:text-zinc-950">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-lg bg-zinc-900/40 border border-zinc-900 p-6 md:p-10 rounded-3xl text-center flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-lime/5 rounded-full blur-3xl pointer-events-none" />

          {isValidSession ? (
            <>
              {/* Success Badge */}
              <div className="w-16 h-16 rounded-full bg-brand-lime/10 border border-brand-lime/30 flex items-center justify-center text-brand-lime shadow-lg shadow-lime-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full w-fit mx-auto">
                  {isPtBr ? 'PAGAMENTO CONFIRMADO' : 'PAYMENT VERIFIED'}
                </span>

                <h1 className="text-2xl md:text-3xl font-heading font-black text-zinc-50 tracking-tight uppercase mt-2">
                  {isPtBr
                    ? 'Seu Método de Esteira está pronto'
                    : 'Your Treadmill Method Is Ready'}
                </h1>

                <p className="text-xs md:text-sm text-zinc-300 font-semibold leading-relaxed mt-1">
                  {isPtBr
                    ? 'Use o e-mail da sua compra para acessar seu programa.'
                    : 'Use the email address from your purchase to access your programme.'}
                </p>

                {customerEmail && (
                  <p className="text-[11px] text-zinc-500 mt-1">
                    {isPtBr
                      ? `E-mail da compra: ${customerEmail}`
                      : `Purchase email: ${customerEmail}`}
                  </p>
                )}
              </div>

              {/* Access CTA Button */}
              <a
                href={`/${locale}/login${customerEmail ? `?email=${encodeURIComponent(customerEmail)}` : ''}`}
                className="w-full bg-brand-lime text-zinc-950 hover:bg-brand-lime-hover font-heading font-bold text-xs tracking-wide py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-lime-400/10"
              >
                {isPtBr ? 'Acessar Meu Programa' : 'Access My Programme'}
              </a>

              {/* Status Info Box */}
              <div className="w-full bg-zinc-950 border border-zinc-900 p-4 rounded-2xl flex items-center gap-3 text-left">
                <ShieldCheck className="w-5 h-5 text-brand-teal shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-heading font-extrabold text-zinc-300 uppercase tracking-wider">
                    {isPtBr ? 'ACESSO AO PLANO' : 'PROGRAMME ACCESS'}
                  </span>
                  <span className="text-[10px] text-zinc-400 leading-normal">
                    {isPtBr
                      ? 'Seu perfil foi vinculado com sucesso ao seu pedido. Clique no botão acima para receber seu link de acesso seguro.'
                      : 'Your quiz profile is securely linked to your purchase. Click above to request your secure access link.'}
                  </span>
                </div>
              </div>

            </>
          ) : (
            <>
              {/* Invalid / Unverified Session State */}
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] tracking-widest text-amber-400 font-heading font-extrabold uppercase bg-amber-500/10 px-3 py-1 rounded-full w-fit mx-auto">
                  {isPtBr ? 'VERIFICAÇÃO DE SESSÃO' : 'SESSION UNVERIFIED'}
                </span>

                <h1 className="text-xl md:text-2xl font-heading font-black text-zinc-100 tracking-tight uppercase mt-2">
                  {isPtBr ? 'Sessão Não Verificada' : 'Unable to Verify Checkout'}
                </h1>

                <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                  {isPtBr
                    ? 'Não foi possível confirmar os detalhes do pagamento para esta sessão. Se você concluiu o pagamento, verifique seu e-mail.'
                    : 'We could not verify payment details for this session ID. If you completed a payment, please check your email or contact support.'}
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

import React from 'react';
import { Header } from '@/components/common/Header';
import { getStripeServerClient } from '@/lib/stripeServer';
import { CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface SuccessPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}

export default async function PurchaseSuccessPage({
  params,
  searchParams,
}: SuccessPageProps) {
  const { locale = 'en-gb' } = await params;
  const { session_id } = await searchParams;

  let isValidSession = false;
  let customerEmail: string | null = null;

  if (session_id && typeof session_id === 'string') {
    try {
      const stripe = getStripeServerClient();
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (
        session &&
        (session.payment_status === 'paid' || session.status === 'complete')
      ) {
        isValidSession = true;
        customerEmail =
          session.customer_details?.email || session.customer_email || null;
      }
    } catch (err: unknown) {
      console.error('[Purchase Success Verification Error]:', err);
      isValidSession = false;
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
                    ? 'Seu pagamento foi recebido. Estamos preparando seu programa personalizado.'
                    : "Your payment has been received. We're preparing your personalised programme."}
                </p>

                {customerEmail && (
                  <p className="text-[11px] text-zinc-500 mt-1">
                    {isPtBr
                      ? `Confirmação enviada para: ${customerEmail}`
                      : `Receipt and confirmation sent to: ${customerEmail}`}
                  </p>
                )}
              </div>

              {/* Status Info Box */}
              <div className="w-full bg-zinc-950 border border-zinc-900 p-4 rounded-2xl flex items-center gap-3 text-left">
                <ShieldCheck className="w-5 h-5 text-brand-teal shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-heading font-extrabold text-zinc-300 uppercase tracking-wider">
                    {isPtBr ? 'ACESSO AO PLANO' : 'PROGRAMME PREPARATION'}
                  </span>
                  <span className="text-[10px] text-zinc-400 leading-normal">
                    {isPtBr
                      ? 'Seu perfil foi vinculado com sucesso ao seu pedido. Você receberá os guias e atualizações no seu e-mail.'
                      : 'Your quiz profile is securely linked to your purchase. Access details and guides are being dispatched.'}
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

"use client";

import React, { useState } from "react";

import { useParams, useSearchParams } from "next/navigation";
import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Mail, CheckCircle2, Loader2, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params.locale as string) || "en-gb";

  const prefilledEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(prefilledEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (str: string) => {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  };

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateEmail(email)) {
      setError(
        locale === "pt-br"
          ? "Por favor, digite um e-mail válido."
          : "Please enter a valid email address."
      );
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin;
      const baseUrl = siteUrl.replace(/\/$/, "");

      const redirectUrl = `${baseUrl}/${locale}/auth/callback`;

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (otpError) {
        console.error('[Magic Link Auth Error]:', otpError.message);
        setError(
          locale === "pt-br"
            ? "Não foi possível enviar o link de acesso. Verifique o e-mail ou tente novamente em alguns instantes."
            : "Unable to send sign-in link. Please verify your email or try again in a few moments."
        );
        return;
      }

      setSentSuccess(true);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Magic Link Exception]:', errMsg);
      setError(
        locale === "pt-br"
          ? "Erro ao enviar o link de acesso. Tente novamente."
          : "Failed to send login link. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPtBr = locale.toLowerCase() === "pt-br";
  const isValid = validateEmail(email);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-between selection:bg-brand-lime selection:text-zinc-950">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md bg-zinc-900/40 border border-zinc-900 p-6 md:p-8 rounded-3xl text-center flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-lime/5 rounded-full blur-3xl pointer-events-none" />

          {/* Icon Badge */}
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-brand-lime shadow-inner">
            <KeyRound className="w-7 h-7" />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-heading font-black text-zinc-50 tracking-tight uppercase">
              {isPtBr ? "Acesse Seu Método de Esteira" : "Access Your Treadmill Method"}
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed mt-1">
              {isPtBr
                ? "Enviaremos um link de acesso seguro para o e-mail utilizado na sua compra."
                : "We'll send a secure sign-in link to the email address used for your purchase."}
            </p>
          </div>

          {sentSuccess ? (
            <div className="w-full bg-brand-lime/10 border border-brand-lime/20 p-5 rounded-2xl flex flex-col items-center gap-3 animate-fadeIn">
              <CheckCircle2 className="w-8 h-8 text-brand-lime" />
              <div className="flex flex-col gap-1 text-center">
                <span className="text-xs font-bold text-zinc-100">
                  {isPtBr ? "Link Enviado com Sucesso!" : "Check Your Email!"}
                </span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {isPtBr
                    ? `Enviamos um link de login seguro para `
                    : `We sent a secure magic link to `}
                  <strong className="text-brand-lime font-semibold">{email}</strong>.
                  {isPtBr
                    ? ` Abra seu e-mail e clique no link para acessar.`
                    : ` Open your inbox and click the link to sign in.`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSentSuccess(false)}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 underline mt-2 transition-colors cursor-pointer"
              >
                {isPtBr ? "Tentar outro e-mail" : "Use a different email"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendMagicLink} className="w-full flex flex-col gap-4">
              <div className="relative text-left">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={isPtBr ? "Seu e-mail da compra" : "Your purchase email address"}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-brand-lime focus:ring-1 focus:ring-brand-lime rounded-xl pl-12 pr-4 py-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-all disabled:opacity-50"
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 font-semibold bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center animate-shake">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={cn(
                  "w-full font-heading font-bold text-sm tracking-wide py-6 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2",
                  isValid && !isSubmitting
                    ? "bg-brand-lime text-zinc-950 hover:bg-brand-lime-hover"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                    <span>{isPtBr ? "Enviando link..." : "Sending link..."}</span>
                  </>
                ) : isPtBr ? (
                  "Enviar Meu Link Seguro"
                ) : (
                  "Email Me My Secure Link"
                )}
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

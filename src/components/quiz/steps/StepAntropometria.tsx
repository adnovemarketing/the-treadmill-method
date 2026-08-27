"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useQuizStore } from "@/core/store/quizStore";
import { QuizStep } from "@/core/types/quiz";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/core/i18n/translations";
import { useLocale } from "@/core/i18n/useLocale";
import { cn } from "@/lib/utils";
import { VISUAL_ASSETS } from "@/config/visualAssets";

interface StepProps {
  onNext: (nextStep: QuizStep) => void;
}

type HeightUnit = "cm" | "ft";
type WeightUnitMode = "kg" | "st_lbs" | "lbs";

export function StepAntropometria({ onNext }: StepProps) {
  const { data, updateData } = useQuizStore();
  const locale = useLocale();
  const t = useTranslations(locale);

  // Default active height toggle to [FT/IN] on initial load
  const [heightUnit, setHeightUnit] = useState<HeightUnit>(
    data.heightUnit === "cm" ? "cm" : "ft"
  );

  // Default active weight unit mode
  const [weightUnitMode, setWeightUnitMode] = useState<WeightUnitMode>(
    data.weightUnit === "kg" ? "kg" : "st_lbs"
  );

  // Helper conversions for initial values
  const initHeightInches = () => {
    if (!data.height) return { ft: "", in: "", cm: "" };
    if (data.heightUnit === "cm" || data.height > 30) {
      const totalInches = Math.round(data.height / 2.54);
      const f = Math.floor(totalInches / 12);
      const i = totalInches % 12;
      return { ft: String(f), in: String(i), cm: String(Math.round(data.height)) };
    } else {
      const totalInches = Math.round(data.height * 12);
      const f = Math.floor(totalInches / 12);
      const i = totalInches % 12;
      const cm = Math.round(totalInches * 2.54);
      return { ft: String(f), in: String(i), cm: String(cm) };
    }
  };

  const initWeightValues = (val: number | null) => {
    if (!val) return { kg: "", lbs: "", st: "", stLbs: "" };
    if (data.weightUnit === "kg") {
      const totalLbs = Math.round(val * 2.20462);
      const st = Math.floor(totalLbs / 14);
      const stLbs = totalLbs % 14;
      return {
        kg: String(val),
        lbs: String(totalLbs),
        st: String(st),
        stLbs: String(stLbs),
      };
    } else {
      const totalLbs = Math.round(val);
      const kg = Math.round(totalLbs / 2.20462);
      const st = Math.floor(totalLbs / 14);
      const stLbs = totalLbs % 14;
      return {
        kg: String(kg),
        lbs: String(totalLbs),
        st: String(st),
        stLbs: String(stLbs),
      };
    }
  };

  const initialH = initHeightInches();
  const initialW = initWeightValues(data.weight);
  const initialTW = initWeightValues(data.targetWeight);

  // Height state
  const [heightFeet, setHeightFeet] = useState<string>(initialH.ft);
  const [heightInches, setHeightInches] = useState<string>(initialH.in);
  const [heightCm, setHeightCm] = useState<string>(initialH.cm);

  // Current Weight state
  const [weightKg, setWeightKg] = useState<string>(initialW.kg);
  const [weightLbs, setWeightLbs] = useState<string>(initialW.lbs);
  const [weightSt, setWeightSt] = useState<string>(initialW.st);
  const [weightStLbs, setWeightStLbs] = useState<string>(initialW.stLbs);

  // Target Weight state
  const [targetWeightKg, setTargetWeightKg] = useState<string>(initialTW.kg);
  const [targetWeightLbs, setTargetWeightLbs] = useState<string>(initialTW.lbs);
  const [targetWeightSt, setTargetWeightSt] = useState<string>(initialTW.st);
  const [targetWeightStLbs, setTargetWeightStLbs] = useState<string>(initialTW.stLbs);

  const [error, setError] = useState<string | null>(null);

  // Conversões de Altura ao alternar toggles
  const toggleHeightUnit = (unit: HeightUnit) => {
    if (unit === heightUnit) return;
    if (unit === "cm") {
      const f = parseFloat(heightFeet) || 0;
      const i = parseFloat(heightInches) || 0;
      const totalInches = f * 12 + i;
      const cm = Math.round(totalInches * 2.54);
      setHeightCm(cm > 0 ? String(cm) : "");
    } else {
      const cmVal = parseFloat(heightCm) || 0;
      const totalInches = Math.round(cmVal / 2.54);
      const f = Math.floor(totalInches / 12);
      const i = totalInches % 12;
      setHeightFeet(f > 0 ? String(f) : "");
      setHeightInches(i >= 0 && cmVal > 0 ? String(i) : "");
    }
    setHeightUnit(unit);
  };

  // Conversões de Peso ao alternar toggles
  const toggleWeightUnitMode = (newMode: WeightUnitMode) => {
    if (newMode === weightUnitMode) return;

    // Resolve current weight total pounds and kg from active view
    let currentLbs = 0;
    if (weightUnitMode === "kg") {
      currentLbs = Math.round((parseFloat(weightKg) || 0) * 2.20462);
    } else if (weightUnitMode === "st_lbs") {
      currentLbs = (parseFloat(weightSt) || 0) * 14 + (parseFloat(weightStLbs) || 0);
    } else {
      currentLbs = Math.round(parseFloat(weightLbs) || 0);
    }

    let targetLbs = 0;
    if (weightUnitMode === "kg") {
      targetLbs = Math.round((parseFloat(targetWeightKg) || 0) * 2.20462);
    } else if (weightUnitMode === "st_lbs") {
      targetLbs = (parseFloat(targetWeightSt) || 0) * 14 + (parseFloat(targetWeightStLbs) || 0);
    } else {
      targetLbs = Math.round(parseFloat(targetWeightLbs) || 0);
    }

    // Convert to target view
    if (newMode === "kg") {
      const wKg = Math.round(currentLbs / 2.20462);
      const tKg = Math.round(targetLbs / 2.20462);
      setWeightKg(wKg > 0 ? String(wKg) : "");
      setTargetWeightKg(tKg > 0 ? String(tKg) : "");
    } else if (newMode === "st_lbs") {
      const wSt = Math.floor(currentLbs / 14);
      const wL = currentLbs % 14;
      const tSt = Math.floor(targetLbs / 14);
      const tL = targetLbs % 14;
      setWeightSt(wSt > 0 ? String(wSt) : "");
      setWeightStLbs(currentLbs > 0 ? String(wL) : "");
      setTargetWeightSt(tSt > 0 ? String(tSt) : "");
      setTargetWeightStLbs(targetLbs > 0 ? String(tL) : "");
    } else {
      setWeightLbs(currentLbs > 0 ? String(currentLbs) : "");
      setTargetWeightLbs(targetLbs > 0 ? String(targetLbs) : "");
    }

    setWeightUnitMode(newMode);
  };

  const isValid = () => {
    // Validar Altura
    if (heightUnit === "cm") {
      const hVal = parseFloat(heightCm);
      if (isNaN(hVal) || hVal < 100 || hVal > 250) return false;
    } else {
      const fVal = parseFloat(heightFeet);
      const iVal = parseFloat(heightInches) || 0;
      if (isNaN(fVal) || fVal < 3 || fVal > 8 || iVal < 0 || iVal >= 12) return false;
    }

    // Validar Pesos
    if (weightUnitMode === "kg") {
      const wVal = parseFloat(weightKg);
      const tVal = parseFloat(targetWeightKg);
      if (isNaN(wVal) || isNaN(tVal) || wVal < 30 || wVal > 250 || tVal < 30 || tVal > 250) return false;
    } else if (weightUnitMode === "st_lbs") {
      const wSt = parseFloat(weightSt);
      const wIb = parseFloat(weightStLbs) || 0;
      const tSt = parseFloat(targetWeightSt);
      const tIb = parseFloat(targetWeightStLbs) || 0;
      if (isNaN(wSt) || isNaN(tSt)) return false;
      const wTotal = wSt * 14 + wIb;
      const tTotal = tSt * 14 + tIb;
      if (wTotal < 65 || wTotal > 550 || tTotal < 65 || tTotal > 550) return false;
    } else {
      const wVal = parseFloat(weightLbs);
      const tVal = parseFloat(targetWeightLbs);
      if (isNaN(wVal) || isNaN(tVal) || wVal < 65 || wVal > 550 || tVal < 65 || tVal > 550) return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!isValid()) {
      setError(t.quiz.steps.antropometria.errorInvalid);
      return;
    }

    setError(null);

    let finalHeight: number;
    let finalHeightUnit: "cm" | "ft" = heightUnit;

    if (heightUnit === "cm") {
      finalHeight = parseFloat(heightCm);
    } else {
      const f = parseFloat(heightFeet) || 0;
      const i = parseFloat(heightInches) || 0;
      const totalInches = f * 12 + i;
      finalHeight = parseFloat((totalInches / 12).toFixed(2));
    }

    let finalWeight: number;
    let finalTargetWeight: number;
    let finalWeightUnit: "kg" | "lb";

    if (weightUnitMode === "kg") {
      finalWeight = parseFloat(weightKg);
      finalTargetWeight = parseFloat(targetWeightKg);
      finalWeightUnit = "kg";
    } else if (weightUnitMode === "st_lbs") {
      const wSt = parseFloat(weightSt) || 0;
      const wIb = parseFloat(weightStLbs) || 0;
      const tSt = parseFloat(targetWeightSt) || 0;
      const tIb = parseFloat(targetWeightStLbs) || 0;
      finalWeight = wSt * 14 + wIb;
      finalTargetWeight = tSt * 14 + tIb;
      finalWeightUnit = "lb";
    } else {
      finalWeight = parseFloat(weightLbs);
      finalTargetWeight = parseFloat(targetWeightLbs);
      finalWeightUnit = "lb";
    }

    updateData({
      heightUnit: finalHeightUnit,
      weightUnit: finalWeightUnit,
      height: finalHeight,
      weight: finalWeight,
      targetWeight: finalTargetWeight,
    });

    onNext("important-event");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
      {/* Coluna Esquerda: Texto e Inputs */}
      <div className="md:col-span-7 flex flex-col gap-5">
        <div className="text-left md:text-left">
          <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full">
            {t.quiz.steps.antropometria.badge}
          </span>
          <h2 className="text-xl md:text-2xl font-heading font-extrabold text-zinc-50 mt-3 leading-tight uppercase">
            {t.quiz.steps.antropometria.title}
          </h2>
          <p className="text-xs text-zinc-400 mt-2">
            {t.quiz.steps.antropometria.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-1">
          {/* Altura (Height Selector with FT/IN default active) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-semibold text-zinc-300">{t.quiz.steps.antropometria.heightLabel}</label>
              <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-900">
                <button
                  type="button"
                  onClick={() => toggleHeightUnit("cm")}
                  className={cn(
                    "px-2 py-0.5 text-[9px] font-black rounded-md transition-all cursor-pointer",
                    heightUnit === "cm" ? "bg-zinc-900 text-brand-lime" : "text-zinc-500"
                  )}
                >
                  CM
                </button>
                <button
                  type="button"
                  onClick={() => toggleHeightUnit("ft")}
                  className={cn(
                    "px-2 py-0.5 text-[9px] font-black rounded-md transition-all cursor-pointer",
                    heightUnit === "ft" ? "bg-zinc-900 text-brand-lime" : "text-zinc-500"
                  )}
                >
                  FT/IN
                </button>
              </div>
            </div>

            {heightUnit === "cm" ? (
              <input
                type="number"
                step="any"
                value={heightCm}
                onChange={(e) => {
                  setHeightCm(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="170"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-brand-lime rounded-xl px-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-colors animate-[fadeIn_0.3s_ease]"
              />
            ) : (
              <div className="grid grid-cols-2 gap-3 animate-[fadeIn_0.3s_ease]">
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="3"
                    max="8"
                    value={heightFeet}
                    onChange={(e) => {
                      setHeightFeet(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="5"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-brand-lime rounded-xl pl-4 pr-9 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-colors"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500 pointer-events-none">ft</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="11"
                    value={heightInches}
                    onChange={(e) => {
                      setHeightInches(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="7"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-brand-lime rounded-xl pl-4 pr-9 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-colors"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500 pointer-events-none">in</span>
                </div>
              </div>
            )}
          </div>

          {/* Peso Atual (Weight Selector with KG, ST / LBS, LBS toggles) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-semibold text-zinc-300">{t.quiz.steps.antropometria.weightLabel}</label>
              <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-900">
                <button
                  type="button"
                  onClick={() => toggleWeightUnitMode("kg")}
                  className={cn(
                    "px-2 py-0.5 text-[9px] font-black rounded-md transition-all cursor-pointer",
                    weightUnitMode === "kg" ? "bg-zinc-900 text-brand-lime" : "text-zinc-500"
                  )}
                >
                  KG
                </button>
                <button
                  type="button"
                  onClick={() => toggleWeightUnitMode("st_lbs")}
                  className={cn(
                    "px-2 py-0.5 text-[9px] font-black rounded-md transition-all cursor-pointer",
                    weightUnitMode === "st_lbs" ? "bg-zinc-900 text-brand-lime" : "text-zinc-500"
                  )}
                >
                  ST / LBS
                </button>
                <button
                  type="button"
                  onClick={() => toggleWeightUnitMode("lbs")}
                  className={cn(
                    "px-2 py-0.5 text-[9px] font-black rounded-md transition-all cursor-pointer",
                    weightUnitMode === "lbs" ? "bg-zinc-900 text-brand-lime" : "text-zinc-500"
                  )}
                >
                  LBS
                </button>
              </div>
            </div>

            {weightUnitMode === "kg" ? (
              <input
                type="number"
                step="any"
                value={weightKg}
                onChange={(e) => {
                  setWeightKg(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="75"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-brand-lime rounded-xl px-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-colors"
              />
            ) : weightUnitMode === "st_lbs" ? (
              <div className="grid grid-cols-2 gap-3 animate-[fadeIn_0.3s_ease]">
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    value={weightSt}
                    onChange={(e) => {
                      setWeightSt(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="11"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-brand-lime rounded-xl pl-4 pr-9 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-colors"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500 pointer-events-none">st</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="13"
                    value={weightStLbs}
                    onChange={(e) => {
                      setWeightStLbs(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="11"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-brand-lime rounded-xl pl-4 pr-9 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-colors"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500 pointer-events-none">lbs</span>
                </div>
              </div>
            ) : (
              <input
                type="number"
                step="any"
                value={weightLbs}
                onChange={(e) => {
                  setWeightLbs(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="165"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-brand-lime rounded-xl px-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-colors"
              />
            )}
          </div>

          {/* Peso Meta */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-semibold text-zinc-300">{t.quiz.steps.antropometria.targetWeightLabel}</label>
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-wide">
                {weightUnitMode === "kg" ? "KG" : weightUnitMode === "st_lbs" ? "ST / LBS" : "LBS"}
              </span>
            </div>

            {weightUnitMode === "kg" ? (
              <input
                type="number"
                step="any"
                value={targetWeightKg}
                onChange={(e) => {
                  setTargetWeightKg(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="68"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-brand-lime rounded-xl px-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-colors"
              />
            ) : weightUnitMode === "st_lbs" ? (
              <div className="grid grid-cols-2 gap-3 animate-[fadeIn_0.3s_ease]">
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    value={targetWeightSt}
                    onChange={(e) => {
                      setTargetWeightSt(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="10"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-brand-lime rounded-xl pl-4 pr-9 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-colors"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500 pointer-events-none">st</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="13"
                    value={targetWeightStLbs}
                    onChange={(e) => {
                      setTargetWeightStLbs(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="10"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-brand-lime rounded-xl pl-4 pr-9 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-colors"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500 pointer-events-none">lbs</span>
                </div>
              </div>
            ) : (
              <input
                type="number"
                step="any"
                value={targetWeightLbs}
                onChange={(e) => {
                  setTargetWeightLbs(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="150"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-brand-lime rounded-xl px-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-colors"
              />
            )}
          </div>

          {error && (
            <p className="text-xs text-red-500 font-semibold bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center animate-shake">
              {error}
            </p>
          )}
        </div>

        <Button
          onClick={handleNext}
          className="w-full mt-2 bg-brand-lime text-zinc-950 hover:bg-brand-lime-hover font-heading font-bold text-sm tracking-wide py-6 rounded-2xl transition-all cursor-pointer"
        >
          {t.quiz.steps.antropometria.cta}
        </Button>
      </div>

      {/* Coluna Direita: Ilustração Balança Premium (Layout D) */}
      <div className="md:col-span-5 hidden md:flex flex-col justify-end p-6 bg-zinc-950/40 rounded-2xl border border-zinc-900/60 aspect-square relative overflow-hidden group select-none">
        <Image
          src={VISUAL_ASSETS.lifestyle.currentWeightScale}
          alt={locale === "pt-br" ? "IMC calculado cientificamente" : "Scientific BMI calculations"}
          fill
          sizes="33vw"
          className="object-contain object-bottom transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        <div className="relative z-10 flex flex-col gap-1">
          <span className="text-[10px] font-heading font-black text-brand-lime uppercase tracking-widest">
            {locale === "pt-br" ? "MÉTRICAS EXATAS" : "BODY COMPOSITION"}
          </span>
          <span className="text-[9px] text-zinc-300 font-medium leading-normal">
            {locale === "pt-br" ? "IMC calculado cientificamente" : "Scientific BMI calculations"}
          </span>
        </div>
      </div>
    </div>
  );
}

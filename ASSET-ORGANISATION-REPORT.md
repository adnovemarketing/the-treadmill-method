# Relatório de Reorganização de Assets e Estrutura do Projeto

**Data:** 05/08/2026  
**Projeto:** Quiz Vencedor (`adnovemarketing/quiz-vencedor-b`)  

---

## 1. Árvore Final das Pastas Alteradas

### 1.1 Brand-System (Na raiz do projeto)
```
Brand-System/
├── 01-Character-Bible.md
├── 02-Prompt-Bible.md
├── 03-Asset-Map.xlsx
├── 04-Art-Direction.md
└── 05-Naming-Convention.md
```

### 1.2 Estrutura Oficial dos Personagens (`public/assets/characters/`)
```
public/assets/characters/
├── david/
│   ├── after/
│   │   └── david-after.png
│   ├── before/
│   │   └── david-before.png
│   ├── comparison/
│   ├── interaction/
│   ├── lifestyle/
│   └── walking/
│       └── david-walking-natural.png
├── denise/
│   ├── after/
│   │   └── denise-after.png
│   ├── before/
│   │   └── denise-before.png
│   ├── comparison/
│   ├── interaction/
│   ├── lifestyle/
│   └── walking/
│       └── denise-walking-natural.png
├── emma/
│   ├── after/
│   │   └── emma-after.png
│   ├── before/
│   │   └── emma-before.png
│   ├── comparison/
│   ├── interaction/
│   ├── lifestyle/
│   └── walking/
│       └── emma-walking-natural.png
└── sarah/
    ├── after/
    │   └── sarah-after.png
    ├── before/
    │   └── sarah-before.png
    ├── comparison/
    ├── interaction/
    ├── lifestyle/
    └── walking/
        └── sarah-walking-natural.png
```

### 1.3 Pasta Legado (`Source-Assets/Legacy-Site-Images/`)
```
Source-Assets/
└── Legacy-Site-Images/
```
*(Pasta preparada na raiz para receber arquivos descontinuados em etapas futuras de substituição)*

---

## 2. Registro Detalhado das Movimentações

### 2.1 Brand System
Os 5 documentos originais em `src/Brand-System/` foram movidos para a raiz `Brand-System/` mantendo 100% dos seus conteúdos intactos:
- `src/Brand-System/01-Character-Bible.md` -> `Brand-System/01-Character-Bible.md`
- `src/Brand-System/02-Prompt-Bible.md` -> `Brand-System/02-Prompt-Bible.md`
- `src/Brand-System/03-Asset-Map.xlsx` -> `Brand-System/03-Asset-Map.xlsx`
- `src/Brand-System/04-Art-Direction.md` -> `Brand-System/04-Art-Direction.md`
- `src/Brand-System/05-Naming-Convention.md` -> `Brand-System/05-Naming-Convention.md`

### 2.2 Personagens (Organizados e Renomeados)
- `public/assets/characters/david/after.png` -> `public/assets/characters/david/after/david-after.png`
- `public/assets/characters/david/before.png` -> `public/assets/characters/david/before/david-before.png`
- `public/assets/characters/david/walking-natural.png` -> `public/assets/characters/david/walking/david-walking-natural.png`
- `public/assets/characters/denise/after.png` -> `public/assets/characters/denise/after/denise-after.png`
- `public/assets/characters/denise/before.png` -> `public/assets/characters/denise/before/denise-before.png`
- `public/assets/characters/denise/walking-natural.png` -> `public/assets/characters/denise/walking/denise-walking-natural.png`
- `public/assets/characters/emma/after.png` -> `public/assets/characters/emma/after/emma-after.png`
- `public/assets/characters/emma/before.png` -> `public/assets/characters/emma/before/emma-before.png`
- `public/assets/characters/emma/walking-natural.png` -> `public/assets/characters/emma/walking/emma-walking-natural.png`
- `public/assets/characters/sarah/after.png` -> `public/assets/characters/sarah/after/sarah-after.png`
- `public/assets/characters/sarah/before.png` -> `public/assets/characters/sarah/before/sarah-before.png`
- `public/assets/characters/sarah/walking-natural.png` -> `public/assets/characters/sarah/walking/sarah-walking-natural.png`

### 2.3 Pastas Removidas
- `src/Brand-System` (removida após transferência dos arquivos para a raiz)
- `public/assets/placeholders` (pasta vazia removida na limpeza segura)
- `public/assets/ui` (pasta vazia removida na limpeza segura)

---

## 3. Auditoria de Imagens Antigas do Site (`public/assets/images/`)

Foram auditados **37 arquivos** em `public/assets/images/`. Todos estão centralizados em `src/config/visualAssets.ts` e/ou utilizados no Quiz e Relatório. **Nenhum arquivo antigo foi apagado ou movido**, preservando totalmente o funcionamento do site:

1. `characters/character-man-38-uk.webp.png` (Mapeado em `VISUAL_ASSETS.characters.man38`)
2. `characters/character-man-52-uk.webp.png` (Mapeado em `VISUAL_ASSETS.characters.man52`)
3. `characters/character-man-66-uk.webp.png` (Mapeado em `VISUAL_ASSETS.characters.man66`)
4. `characters/character-woman-35-uk.webp.png` (Mapeado em `VISUAL_ASSETS.characters.woman35`)
5. `characters/character-woman-48-uk.webp.png` (Mapeado em `VISUAL_ASSETS.characters.woman48`)
6. `characters/character-woman-63-uk.webp.png` (Mapeado em `VISUAL_ASSETS.characters.woman63`)
7. `demographics/age-20-29-uk.webp.png` (Em uso em `StepAgeSelection.tsx`)
8. `demographics/age-30-39-uk.webp.png` (Em uso em `StepAgeSelection.tsx`)
9. `demographics/age-40-49-uk.webp.png` (Em uso em `StepAgeSelection.tsx`)
10. `demographics/age-50-59-uk.webp.png` (Em uso em `StepAgeSelection.tsx`)
11. `demographics/age-60-plus-uk.webp.png` (Em uso em `StepAgeSelection.tsx`)
12. `demographics/gender-female-uk.webp.png` (Em uso em `StepGenderSelection.tsx`)
13. `demographics/gender-male-uk.webp.png` (Em uso em `StepGenderSelection.tsx`)
14. `health/health-consultation-uk.webp.png` (Em uso em `StepInjuryTriage.tsx`)
15. `lifestyle/balanced-meal-uk.webp.png` (Em uso em `StepDailyNutrition.tsx`)
16. `lifestyle/body-types-diverse-uk.webp.png` (Em uso em `StepGenderSelection.tsx`)
17. `lifestyle/current-weight-scale-uk.webp.png` (Em uso em `StepAntropometria.tsx`)
18. `lifestyle/exercise-motivation-uk.webp.png` (Em uso em `StepMindsetBlockers.tsx`)
19. `lifestyle/height-measurement-uk.webp.png` (Mapeado em `VISUAL_ASSETS.lifestyle.heightMeasurement`)
20. `lifestyle/important-life-events-uk.webp.png` (Em uso em `StepImportantEvent.tsx`)
21. `lifestyle/sleep-duration-uk.webp.png` (Em uso em `StepSleepQuality.tsx`)
22. `lifestyle/training-time-afternoon-uk.webp.png` (Mapeado em `VISUAL_ASSETS.lifestyle.trainingTimeAfternoon`)
23. `lifestyle/training-time-evening-uk.webp.png` (Mapeado em `VISUAL_ASSETS.lifestyle.trainingTimeEvening`)
24. `lifestyle/training-time-morning-uk.webp.png` (Mapeado em `VISUAL_ASSETS.lifestyle.trainingTimeMorning`)
25. `lifestyle/water-intake-uk.webp.png` (Em uso em `StepWaterIntake.tsx`)
26. `lifestyle/weight-goal-progress-uk.webp.png` (Em uso em `StepOnboardingBasics.tsx`)
27. `lifestyle/work-activity-moderately-active-uk.webp.png` (Em uso em `StepDailyActivity.tsx`)
28. `lifestyle/work-activity-mostly-seated-uk.webp.png` (Mapeado em `VISUAL_ASSETS.lifestyle.workActivityMostlySeated`)
29. `lifestyle/work-activity-very-active-uk.webp.png` (Mapeado em `VISUAL_ASSETS.lifestyle.workActivityVeryActive`)
30. `treadmill/social-proof-walking-group-uk.webp.png` (Em uso em `StepTreadmillFrequency.tsx`)
31. `treadmill/training-location-gym-uk.webp.png` (Mapeado em `VISUAL_ASSETS.treadmill.locationGym`)
32. `treadmill/training-location-home-uk.webp.png` (Mapeado em `VISUAL_ASSETS.treadmill.locationHome`)
33. `treadmill/treadmill-experience-man-uk.webp.png` (Em uso em `StepCardioLevel.tsx` e `report/page.tsx`)
34. `treadmill/treadmill-incline-walking-uk.webp.png` (Em uso em `StepInclineProfile.tsx` e `report/page.tsx`)
35. `treadmill/treadmill-intensity-brisk-uk.webp.png` (Mapeado em `VISUAL_ASSETS.treadmill.intensityBrisk`)
36. `treadmill/treadmill-intensity-light-uk.webp.png` (Mapeado em `VISUAL_ASSETS.treadmill.intensityLight`)
37. `treadmill/treadmill-intensity-moderate-uk.webp.png` (Mapeado em `VISUAL_ASSETS.treadmill.intensityModerate`)

### Arquivos sem referência
Nenhum. Todos os 37 arquivos possuem referência no código ou no manifesto `visualAssets.ts`.

### Arquivos ambíguos
Nenhum arquivo ambíguo encontrado.

---

## 4. Resultados das Validações

- **TypeScript (`npx tsc --noEmit`)**: ✅ **Sucesso (0 erros)**
- **Next.js Production Build (`npm run build`)**: ✅ **Sucesso (Compilado em 10.1s, TS em 8.7s)**
- **ESLint (`npm run lint`)**: ⚠️ **3 erros pré-existentes reportados** (Relacionados ao arquivo `checkout/page.tsx` com `setState` em efeito e tipagens `any` em `QuizContainer.tsx` e `analytics.ts` — nenhum erro decorrente da reorganização de arquivos).

---

## 5. Recomendações para a Subsequente Substituição de Imagens

1. **Atualizar `src/config/visualAssets.ts`**: Quando novos assets visuais forem introduzidos, substitua gradualmente as chaves do manifesto apontando para as subpastas em `public/assets/characters/`.
2. **Migração para Legado**: Ao substituir uma imagem antiga por um novo asset oficial dos personagens, mova o arquivo antigo correspondente de `public/assets/images/` para `Source-Assets/Legacy-Site-Images/`.
3. **Conversão Futura para WebP**: Conforme especificado, os PNGs atuais dos personagens foram mantidos em PNG. No momento da substituição visual, pode-se realizar a otimização/conversão em lote.

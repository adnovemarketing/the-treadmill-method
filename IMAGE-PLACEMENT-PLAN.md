# Plano de Mapeamento e Alocação de Imagens (IMAGE-PLACEMENT-PLAN.md)

Este documento estabelece o mapeamento oficial de alocação de imagens dos personagens para todas as páginas e componentes do projeto `quiz-vencedor`.

---

## Regras de Mapeamento Aplicadas

1. **Exclusividade de Assets Novas**: Utilização restrita aos novos arquivos existentes em `public/assets/characters/`.
2. **Hierarquia de Prioridade**: 
   $$\text{Character After} \longrightarrow \text{Lifestyle} \longrightarrow \text{Walking} \longrightarrow \text{Interaction}$$
3. **Preservação Operacional**: Este plano é estritamente analítico e documental. Nenhuma linha de código ou arquivo de imagem foi alterado nesta etapa.

---

## Mapeamento por Página e Componente

### 1. Landing Page (`/` / `/[locale]`)

- **Página**: Landing Page (`/[locale]/page.tsx`)
- **Componente**: `HeroSection` (Banner Principal Desktop & Mobile)
- **Arquivo da imagem**: `sarah-after.png`
- **Caminho completo**: `public/assets/characters/sarah/after/sarah-after.png`
- **Motivo da escolha**: Exibe o resultado 'After' de maior impacto visual da personagem principal no primeiro contato do usuário com o método.

---

### 2. Funil do Quiz (`/[locale]/quiz`)

#### 2.1 Componente: `StepGenderSelection.tsx` (Seleção de Gênero e Perfil)
- **Página**: Quiz (`/[locale]/quiz`)
- **Componente**: `StepGenderSelection` (Opções de Perfil Feminino / Masculino)
- **Arquivo da imagem**: `sarah-after.png` / `david-after.png`
- **Caminho completo**: `public/assets/characters/sarah/after/sarah-after.png` e `public/assets/characters/david/after/david-after.png`
- **Motivo da escolha**: Representa a transformação de alto padrão para os perfis feminino e masculino na etapa de seleção.

#### 2.2 Componente: `StepAgeSelection.tsx` (Faixa Etária)
- **Página**: Quiz (`/[locale]/quiz`)
- **Componente**: `StepAgeSelection` (Cards de Faixa Etária)
- **Arquivo da imagem**: `sarah-after.png` / `emma-after.png` / `denise-after.png`
- **Caminho completo**: `public/assets/characters/sarah/after/sarah-after.png`, `public/assets/characters/emma/after/emma-after.png` e `public/assets/characters/denise/after/denise-after.png`
- **Motivo da escolha**: Associa a transformação 'After' das personagens às faixas etárias jovem (Sarah), adulta (Emma) e madura (Denise).

#### 2.3 Componente: `StepOnboardingBasics.tsx` (Metas Iniciais e Perda de Peso)
- **Página**: Quiz (`/[locale]/quiz`)
- **Componente**: `StepOnboardingBasics` (Card Visual da Meta)
- **Arquivo da imagem**: `sarah-after.png`
- **Caminho completo**: `public/assets/characters/sarah/after/sarah-after.png`
- **Motivo da escolha**: Ilustra o objetivo final de emagrecimento 'After' alinhado às metas iniciais de perda de peso.

#### 2.4 Componente: `StepAntropometria.tsx` (Dados Físicos e Balança)
- **Página**: Quiz (`/[locale]/quiz`)
- **Componente**: `StepAntropometria` (Ilustração de Peso/Altura)
- **Arquivo da imagem**: `sarah-walking-natural.png`
- **Caminho completo**: `public/assets/characters/sarah/walking/sarah-walking-natural.png`
- **Motivo da escolha**: Exibe a personagem em movimento de caminhada ativa durante a avaliação antropométrica.

#### 2.5 Componente: `StepDailyActivity.tsx` (Nível de Atividade Diária)
- **Página**: Quiz (`/[locale]/quiz`)
- **Componente**: `StepDailyActivity` (Rotina e Trabalho)
- **Arquivo da imagem**: `emma-walking-natural.png`
- **Caminho completo**: `public/assets/characters/emma/walking/emma-walking-natural.png`
- **Motivo da escolha**: Representa a mobilidade e o movimento do corpo no dia a dia através da caminhada natural da Emma.

#### 2.6 Componente: `StepDailyNutrition.tsx` (Hábitos Alimentares)
- **Página**: Quiz (`/[locale]/quiz`)
- **Componente**: `StepDailyNutrition` (Card de Alimentação Equilibrada)
- **Arquivo da imagem**: `denise-after.png`
- **Caminho completo**: `public/assets/characters/denise/after/denise-after.png`
- **Motivo da escolha**: Conecta a imagem 'After' de boa forma física aos benefícios da nutrição balanceada.

#### 2.7 Componente: `StepCardioLevel.tsx` (Condicionamento Cardíaco e Esteira)
- **Página**: Quiz (`/[locale]/quiz`)
- **Componente**: `StepCardioLevel` (Nível Cardiovascular)
- **Arquivo da imagem**: `david-walking-natural.png`
- **Caminho completo**: `public/assets/characters/david/walking/david-walking-natural.png`
- **Motivo da escolha**: Demonstra o treino de caminhada na esteira para aferição do nível de condicionamento.

#### 2.8 Componente: `StepTreadmillFrequency.tsx` (Frequência Semanal)
- **Página**: Quiz (`/[locale]/quiz`)
- **Componente**: `StepTreadmillFrequency` (Consistência de Treino)
- **Arquivo da imagem**: `david-walking-natural.png`
- **Caminho completo**: `public/assets/characters/david/walking/david-walking-natural.png`
- **Motivo da escolha**: Ilustra a rotina consistente de caminhada semanal com o personagem David.

#### 2.9 Componente: `StepInclineProfile.tsx` (Perfil de Inclinação)
- **Página**: Quiz (`/[locale]/quiz`)
- **Componente**: `StepInclineProfile` (Uso de Inclinação na Esteira)
- **Arquivo da imagem**: `sarah-walking-natural.png`
- **Caminho completo**: `public/assets/characters/sarah/walking/sarah-walking-natural.png`
- **Motivo da escolha**: Exemplifica a postura correta da caminhada natural com variação de inclinação.

#### 2.10 Componente: `StepInjuryTriage.tsx` (Triagem Articular e Saúde)
- **Página**: Quiz (`/[locale]/quiz`)
- **Componente**: `StepInjuryTriage` (Avaliação de Articulações)
- **Arquivo da imagem**: `david-after.png`
- **Caminho completo**: `public/assets/characters/david/after/david-after.png`
- **Motivo da escolha**: Apresenta a condição corporal fortalecida e pós-recuperação 'After' livre de dores.

#### 2.11 Componente: `StepSleepQuality.tsx` (Sono e Recuperação)
- **Página**: Quiz (`/[locale]/quiz`)
- **Componente**: `StepSleepQuality` (Qualidade de Sono)
- **Arquivo da imagem**: `denise-after.png`
- **Caminho completo**: `public/assets/characters/denise/after/denise-after.png`
- **Motivo da escolha**: Associa a imagem 'After' de corpo revigorado à importância da recuperação do sono.

#### 2.12 Componente: `StepWaterIntake.tsx` (Hidratação Diária)
- **Página**: Quiz (`/[locale]/quiz`)
- **Componente**: `StepWaterIntake` (Meta de Consumo de Água)
- **Arquivo da imagem**: `emma-after.png`
- **Caminho completo**: `public/assets/characters/emma/after/emma-after.png`
- **Motivo da escolha**: Destaca a imagem 'After' com definição e vitalidade atreladas à boa hidratação.

#### 2.13 Componente: `StepMindsetBlockers.tsx` (Motivação e Mindset)
- **Página**: Quiz (`/[locale]/quiz`)
- **Componente**: `StepMindsetBlockers` (Superação de Obstáculos)
- **Arquivo da imagem**: `emma-after.png`
- **Caminho completo**: `public/assets/characters/emma/after/emma-after.png`
- **Motivo da escolha**: Inspira a superação das barreiras mentais através do resultado físico 'After' alcançado.

#### 2.14 Componente: `StepImportantEvent.tsx` (Meta de Evento Especial)
- **Página**: Quiz (`/[locale]/quiz`)
- **Componente**: `StepImportantEvent` (Contagem Regressiva para Evento)
- **Arquivo da imagem**: `denise-walking-natural.png`
- **Caminho completo**: `public/assets/characters/denise/walking/denise-walking-natural.png`
- **Motivo da escolha**: Reflete o progresso contínuo de caminhada em direção à data da meta pessoal.

#### 2.15 Componente: `StepEducationalTransition.tsx` (Transição Educativa)
- **Página**: Quiz (`/[locale]/quiz`)
- **Componente**: `StepEducationalTransition` (Explicação do Método)
- **Arquivo da imagem**: `sarah-after.png`
- **Caminho completo**: `public/assets/characters/sarah/after/sarah-after.png`
- **Motivo da escolha**: Reafirma o objetivo final 'After' durante a apresentação da metodologia de treino.

#### 2.16 Componente: `StepLoadingCalculation.tsx` (Processamento do Plano)
- **Página**: Quiz (`/[locale]/quiz`)
- **Componente**: `StepLoadingCalculation` (Tela de Carregamento)
- **Arquivo da imagem**: `sarah-after.png`
- **Caminho completo**: `public/assets/characters/sarah/after/sarah-after.png`
- **Motivo da escolha**: Mantém alto engajamento visual exibindo o resultado 'After' durante a síntese dos dados do usuário.

#### 2.17 Componente: `StepReportProjection.tsx` (Projeção do Plano de Caminhada)
- **Página**: Quiz (`/[locale]/quiz`)
- **Componente**: `StepReportProjection` (Gráfico/Card de Projeção)
- **Arquivo da imagem**: `sarah-after.png`
- **Caminho completo**: `public/assets/characters/sarah/after/sarah-after.png`
- **Motivo da escolha**: Mostra a projeção direta do resultado 'After' esperado ao concluir o plano de 4 semanas.

#### 2.18 Componente: `StepEmailCapture.tsx` (Captura de E-mail)
- **Página**: Quiz (`/[locale]/quiz`)
- **Componente**: `StepEmailCapture` (Formulário de Acesso ao Relatório)
- **Arquivo da imagem**: `emma-after.png`
- **Caminho completo**: `public/assets/characters/emma/after/emma-after.png`
- **Motivo da escolha**: Potencializa a conversão de e-mail ao apresentar o resultado visual 'After' definitivo.

---

### 3. Página do Relatório VSL (`/[locale]/report`)

- **Página**: Relatório VSL (`/[locale]/report/page.tsx`)
- **Componente**: `ReportPlanCard` (Card de Apresentação do Plano Personalizado)
- **Arquivo da imagem**: `sarah-after.png`
- **Caminho completo**: `public/assets/characters/sarah/after/sarah-after.png`
- **Motivo da escolha**: Ancora a entrega do relatório na imagem de maior sucesso e transformação 'After' do método.

---

### 4. Página de Checkout e Oferta (`/[locale]/checkout`)

#### 4.1 Benefício 1: Plano Sob Medida
- **Página**: Checkout (`/[locale]/checkout/page.tsx`)
- **Componente**: `BenefitCardPersonalised`
- **Arquivo da imagem**: `sarah-after.png`
- **Caminho completo**: `public/assets/characters/sarah/after/sarah-after.png`
- **Motivo da escolha**: Associa a máxima personalização do método à transformação física perfeita 'After'.

#### 4.2 Benefício 2: Métricas e Progresso
- **Página**: Checkout (`/[locale]/checkout/page.tsx`)
- **Componente**: `BenefitCardProgress`
- **Arquivo da imagem**: `emma-after.png`
- **Caminho completo**: `public/assets/characters/emma/after/emma-after.png`
- **Motivo da escolha**: Ilustra a evolução metabólica e o acompanhamento através da imagem 'After' da Emma.

#### 4.3 Benefício 3: Qualquer Esteira / Treino
- **Página**: Checkout (`/[locale]/checkout/page.tsx`)
- **Componente**: `BenefitCardHomeGym`
- **Arquivo da imagem**: `david-walking-natural.png`
- **Caminho completo**: `public/assets/characters/david/walking/david-walking-natural.png`
- **Motivo da escolha**: Mostra a praticidade do treino com o personagem David em movimento de caminhada.

#### 4.4 Benefício 4: Rotina Flexível
- **Página**: Checkout (`/[locale]/checkout/page.tsx`)
- **Componente**: `BenefitCardFlexible`
- **Arquivo da imagem**: `denise-after.png`
- **Caminho completo**: `public/assets/characters/denise/after/denise-after.png`
- **Motivo da escolha**: Demonstra que a flexibilidade de horário proporciona resultados 'After' em qualquer faixa de idade.

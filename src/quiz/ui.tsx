import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import type { Option } from './questions';

export const STEP_LABELS = ['Objetivo', 'Região', 'Cidade', 'Investimento', 'Início', 'Contato'];

/** Etapas numeradas no topo do cartão: a atual em dourado, as feitas em azul. */
export function Stepper({ current, labels = STEP_LABELS }: { current: number; labels?: string[] }) {
  return (
    <ol className="flex items-start justify-between gap-1" aria-label="Etapas do quiz">
      {labels.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none" aria-current={active ? 'step' : undefined}>
            <div className="flex flex-col items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors sm:h-10 sm:w-10 ${
                  active
                    ? 'bg-brand-gold text-white'
                    : done
                      ? 'bg-brand-accent text-white'
                      : 'border border-slate-200 text-brand-muted'
                }`}
              >
                {done ? <Check size={16} /> : n}
              </span>
              <span
                className={`hidden text-[10px] font-semibold uppercase tracking-widest md:block ${
                  active ? 'text-brand-gold' : 'text-brand-muted'
                }`}
              >
                {label}
              </span>
            </div>
            {n < labels.length && (
              <span className={`mx-1.5 h-px flex-1 md:mb-6 ${done ? 'bg-brand-accent' : 'bg-slate-200'}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function ProgressFooter({ current, total = STEP_LABELS.length }: { current: number; total?: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="flex shrink-0 items-center gap-4 border-t border-slate-100 px-5 py-3 sm:px-10 sm:py-5">
      <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest text-brand-muted">
        Etapa {current} de {total}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-brand-accent transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-semibold tabular-nums text-brand-accent">{pct}%</span>
    </div>
  );
}

export function QuestionHeader({ title, hint }: { title: ReactNode; hint?: ReactNode }) {
  return (
    <div className="mx-auto max-w-xl shrink-0 text-center">
      <h2 className="font-serif text-[1.6rem] font-bold leading-tight tracking-tight text-brand-accent sm:text-3xl">{title}</h2>
      {hint && <p className="mt-2 text-sm leading-snug text-brand-muted sm:mt-3 sm:text-base">{hint}</p>}
    </div>
  );
}

/**
 * Uma resposta em círculo com legenda, como na referência. O círculo acompanha a altura da
 * tela (dvh), para a pergunta inteira caber sem rolar até num celular baixo.
 */
export function OptionCircle<V extends string>({
  option,
  selected,
  onClick,
  sublabel,
  stacked,
}: {
  option: Option<V>;
  selected: boolean;
  onClick: () => void;
  sublabel?: string;
  /** Opções empilhadas numa coluna: o círculo divide a altura com as outras duas. */
  stacked?: boolean;
}) {
  const Icon = option.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="group flex w-full flex-col items-center gap-2 rounded-2xl p-1 outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/30"
    >
      <span
        className={`relative flex shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
          stacked ? 'size-[clamp(4rem,11.5dvh,6.75rem)] sm:size-[clamp(4rem,9dvh,6rem)]' : 'size-[var(--quiz-circle,clamp(4.25rem,13dvh,7.5rem))]'
        } ${
          selected
            ? 'bg-brand-gold/15 ring-4 ring-brand-gold'
            : 'bg-brand-beige ring-1 ring-slate-200 group-hover:ring-brand-gold/60'
        }`}
      >
        {option.image ? (
          <img
            src={option.image}
            alt=""
            className={option.photo ? 'h-full w-full rounded-full object-cover' : 'h-[74%] w-[74%] object-contain'}
          />
        ) : (
          Icon && <Icon strokeWidth={1.5} className="h-[48%] w-[48%] text-brand-accent" />
        )}
        {selected && (
          <span className="absolute -right-0.5 -top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold text-white shadow">
            <Check size={14} strokeWidth={3} />
          </span>
        )}
      </span>
      <span className="text-center text-sm font-medium leading-tight text-slate-900 sm:text-base">
        {option.label}
        {sublabel && <span className="block text-xs font-normal text-brand-muted">{sublabel}</span>}
      </span>
    </button>
  );
}

// 3 colunas numa grade de 6: cada opção ocupa 2, e quando a última linha tem só duas
// (5 opções) a primeira delas começa na coluna 2, centralizando a linha como na referência.
const COLS = {
  2: 'grid-cols-2 gap-x-3',
  // Com 3 por linha o círculo também respeita a largura (24vw), senão encosta no vizinho.
  3: 'grid-cols-6 gap-x-4 [--quiz-circle:min(clamp(4.25rem,13dvh,7.5rem),24vw)] [&>*]:col-span-2 [&>*:nth-child(4):nth-last-child(2)]:col-start-2',
  4: 'grid-cols-2 gap-x-3 sm:grid-cols-4',
} as const;

export function OptionGrid({ cols = 2, children }: { cols?: keyof typeof COLS; children: ReactNode }) {
  return (
    <div className={`grid ${COLS[cols]} w-full max-w-xl items-start justify-items-center gap-y-[clamp(0.5rem,2.2dvh,1.5rem)]`}>
      {children}
    </div>
  );
}

export function ContinueButton({
  disabled,
  onClick,
  children = 'Continuar',
  type = 'button',
}: {
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-accent px-10 py-3.5 font-semibold text-white shadow-lg shadow-brand-accent/20 transition-all hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none sm:py-4"
    >
      {children} <ArrowRight size={18} />
    </button>
  );
}

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-muted transition-colors hover:text-brand-accent"
    >
      <ArrowLeft size={14} /> Voltar
    </button>
  );
}

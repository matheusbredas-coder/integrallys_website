import { useState } from 'react';
import { CITIES, MAP_VIEWBOX, type CityId } from './grande-vitoria-map';

const VITORIA = CITIES.find((c) => c.id === 'vitoria')!;

/** O centro geométrico de Vila Velha cai em cima de uma divisa (a cidade é uma faixa fina). */
const LABEL_AT: Partial<Record<CityId, [number, number]>> = { 'vila-velha': [338, 728] };

/**
 * Mapa da Grande Vitória em que cada cidade é tocável.
 *
 * O desenho de referência era uma imagem, e numa imagem o navegador não sabe onde termina
 * cada cidade — por isso os contornos vêm do IBGE e são desenhados aqui. Vitória é pequena
 * no mapa, então ganha um círculo de toque invisível maior que ela.
 */
export function CityMap({
  selected,
  onSelect,
}: {
  selected: CityId | null | undefined;
  onSelect: (id: CityId) => void;
}) {
  const [hover, setHover] = useState<CityId | null>(null);

  const fillOf = (id: CityId) =>
    id === selected ? 'var(--color-brand-gold)' : id === hover ? 'rgb(227 188 60 / 0.22)' : '#ffffff';

  return (
    <svg
      viewBox={MAP_VIEWBOX}
      role="group"
      aria-label="Mapa da Grande Vitória"
      className="h-full w-full select-none"
    >
      {CITIES.map((c) => (
        <path
          key={c.id}
          d={c.d}
          fill={fillOf(c.id)}
          stroke="var(--color-brand-accent)"
          strokeWidth={3}
          strokeLinejoin="round"
          className="cursor-pointer transition-[fill] duration-200 outline-none"
          role="button"
          tabIndex={0}
          aria-label={c.name}
          aria-pressed={c.id === selected}
          onClick={() => onSelect(c.id)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(c.id)}
          onPointerEnter={() => setHover(c.id)}
          onPointerLeave={() => setHover(null)}
        />
      ))}

      <circle
        cx={VITORIA.label[0]}
        cy={VITORIA.label[1]}
        r={42}
        fill="transparent"
        className="cursor-pointer"
        aria-hidden="true"
        onClick={() => onSelect('vitoria')}
        onPointerEnter={() => setHover('vitoria')}
        onPointerLeave={() => setHover(null)}
      />

      {CITIES.map((c) => (
        <text
          key={c.id}
          x={(LABEL_AT[c.id] ?? c.label)[0]}
          y={(LABEL_AT[c.id] ?? c.label)[1]}
          textAnchor="middle"
          dominantBaseline="middle"
          className="pointer-events-none font-sans font-semibold"
          fontSize={c.id === 'vitoria' ? 26 : 32}
          fill="var(--color-brand-accent)"
          stroke="#ffffff"
          strokeWidth={7}
          paintOrder="stroke"
        >
          {c.name}
        </text>
      ))}
    </svg>
  );
}

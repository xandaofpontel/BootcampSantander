import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  CircleX,
  Goal,
  PiggyBank,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { PageHero } from '@/components/shared/PageHero'
import type { SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { calcMonthlySavings } from '@/utils/simulation'

const statusConfig = {
  viable: {
    label: 'Meta viável',
    icon: CheckCircle2,
    className: 'text-emerald-500',
  },
  needs_adjustment: {
    label: 'Requer ajustes',
    icon: CircleAlert,
    className: 'text-amber-500',
  },
  unfeasible: {
    label: 'Fora do prazo',
    icon: CircleX,
    className: 'text-red-500',
  },
} as const

function SimulationHistoryItem({
  simulation,
}: {
  simulation: SimulationRecord
}) {
  const navigate = useNavigate()
  const monthlySavings = calcMonthlySavings(simulation)
  const feasibility = simulation.insight?.feasibility
  const status = feasibility ? statusConfig[feasibility.status] : null
  const StatusIcon = status?.icon
  const insightSections: { title: string; items: string[] }[] =
    simulation.insight
      ? [
          { title: 'Sugestões', items: simulation.insight.suggestions.items },
          { title: 'Renda extra', items: simulation.insight.extraIncome.items },
          {
            title: 'Investimentos',
            items: simulation.insight.investment.items,
          },
        ]
      : []

  return (
    <article className="bg-card rounded-2xl p-5 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.12)] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <Goal size={18} className="text-primary" />
            <h2 className="text-foreground truncate text-lg font-semibold">
              {simulation.goalName}
            </h2>
          </div>
          <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <span className="flex items-center gap-1.5">
              <Wallet size={15} /> {simulation.goalAmount}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarClock size={15} /> {simulation.goalDeadline} meses
            </span>
            <span className="flex items-center gap-1.5">
              <PiggyBank size={15} /> R${' '}
              {monthlySavings.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              /mês disponíveis
            </span>
          </div>
        </div>

        <button
          type="button"
          className="text-primary flex shrink-0 cursor-pointer items-center gap-2 self-start text-sm font-semibold hover:opacity-80"
          onClick={() => void navigate(`/resultado/${simulation.id}`)}
        >
          Ver resultado <ArrowRight size={17} />
        </button>
      </div>

      <div className="border-border mt-5 border-t pt-4">
        {feasibility && status && StatusIcon ? (
          <div className="flex gap-3">
            <StatusIcon
              size={20}
              className={`${status.className} mt-0.5 shrink-0`}
            />
            <div>
              <p className={`text-sm font-semibold ${status.className}`}>
                {status.label}
              </p>
              <p className="text-muted-foreground mt-1 text-sm leading-6">
                {feasibility.content}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Sparkles size={17} className="text-primary" />
            Diagnóstico ainda não disponível. Abra o resultado para gerar a
            análise.
          </div>
        )}
      </div>

      {simulation.insight && (
        <details className="border-border mt-4 border-t pt-4">
          <summary className="text-foreground cursor-pointer text-sm font-semibold">
            Ver diagnóstico completo
          </summary>
          <div className="text-muted-foreground mt-4 grid gap-4 text-sm leading-6 sm:grid-cols-2">
            <p className="sm:col-span-2">
              <strong className="text-foreground">Diagnóstico:</strong>{' '}
              {simulation.insight.diagnosis.content}
            </p>
            {insightSections.map(({ title, items }) => (
              <div key={title}>
                <strong className="text-foreground">{title}</strong>
                <ul className="mt-1 list-inside list-disc">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="sm:col-span-2">
              <strong className="text-foreground">Motivação:</strong>{' '}
              {simulation.insight.motivation.content}
            </p>
          </div>
        </details>
      )}
    </article>
  )
}

export function SimulationHistoryPage() {
  const { getAllFormData } = useSimulationStorage()
  const simulations = getAllFormData().reverse()

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de simulações"
        subtitle="Revise suas metas, acompanhe seus diagnósticos e retome seu planejamento."
      />

      {simulations.length > 0 ? (
        <div className="grid gap-4">
          {simulations.map((simulation) => (
            <SimulationHistoryItem
              key={simulation.id}
              simulation={simulation}
            />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-2xl px-6 py-14 text-center shadow-[4px_4px_18px_0px_rgba(0,0,0,0.12)]">
          <Goal size={32} className="text-primary mx-auto mb-4" />
          <h2 className="text-foreground text-lg font-semibold">
            Nenhuma simulação ainda
          </h2>
          <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-6">
            Crie sua primeira meta financeira para acompanhar os resultados e
            receber um diagnóstico personalizado.
          </p>
        </div>
      )}
    </main>
  )
}

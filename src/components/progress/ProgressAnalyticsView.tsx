import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  CheckCircle2,
  Dumbbell,
  Droplets,
  Flame,
  Sparkles,
  Scale,
  Award,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { analyticsService, DayAnalytics } from '../../services/analyticsService';
import { aiInsightsService } from '../../services/aiInsightsService';

interface ProgressAnalyticsViewProps {
  onNavigate: (route: string) => void;
}

export const ProgressAnalyticsView: React.FC<ProgressAnalyticsViewProps> = ({ onNavigate }) => {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [activeTooltip, setActiveTooltip] = useState<DayAnalytics | null>(null);

  const { days, summary } = analyticsService.getAnalyticsData(range);
  const insights = aiInsightsService.getInsights();

  // Find max values for proportional bar heights
  const maxReps = Math.max(...days.map((d) => d.repsCompleted), 50);
  const maxWater = Math.max(...days.map((d) => d.waterGlasses), 12);
  const maxPoints = Math.max(...days.map((d) => d.pointsEarned), 150);

  return (
    <div className="space-y-8">
      {/* Header and Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Progress Analytics & Trends
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Data-driven training frequency, repetition volume, hydration consistency, and recovery insights.
          </p>
        </div>

        {/* Date Filter Segmented Controls */}
        <div className="flex items-center gap-1 p-1 bg-[#111622] border border-slate-800 rounded-xl">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors font-mono ${
                range === r
                  ? 'bg-lime-400 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Top Summary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111622] border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-400 mb-1">Session Completion Rate</div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {summary.completionRate}%
          </div>
          <div className="text-[11px] text-lime-400 mt-1 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{summary.totalWorkouts} sessions logged</span>
          </div>
        </div>

        <div className="bg-[#111622] border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-400 mb-1">Total Reps Evaluated</div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {summary.totalReps}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Compound volume across period</div>
        </div>

        <div className="bg-[#111622] border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-400 mb-1">Avg Protein Consistency</div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {summary.avgProtein}g / day
          </div>
          <div className="text-[11px] text-lime-400 mt-1">Target is 120g/day</div>
        </div>

        <div className="bg-[#111622] border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="text-xs text-slate-400 mb-1">Hydration Adherence</div>
          <div className="text-2xl font-bold text-cyan-400 font-mono tabular-nums">
            {summary.avgHydrationPercent}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">~2.2 liters daily average</div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Activity & Rep Volume Charts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Chart 1: Workout Repetition Volume */}
          <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Daily Workout Repetition Volume</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verified repetitions performed during scheduled training days.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="w-2.5 h-2.5 rounded-sm bg-lime-400" />
                <span className="text-slate-300">Reps</span>
              </div>
            </div>

            {/* Interactive Responsive SVG / CSS Bar Chart */}
            <div className="pt-6">
              <div className="h-48 flex items-end gap-2 sm:gap-4 relative border-b border-slate-800 pb-2">
                {days.slice(-14).map((day, idx) => {
                  const heightPercent = maxReps > 0 ? (day.repsCompleted / maxReps) * 100 : 0;
                  const isHovered = activeTooltip?.date === day.date;
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                      onMouseEnter={() => setActiveTooltip(day)}
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
                      {/* Bar */}
                      <div
                        className={`w-full max-w-[32px] rounded-t transition-all ${
                          day.repsCompleted > 0
                            ? isHovered
                              ? 'bg-lime-300 shadow-md shadow-lime-400/30'
                              : 'bg-lime-400/80 hover:bg-lime-400'
                            : 'bg-slate-800/40 h-1'
                        }`}
                        style={{ height: day.repsCompleted > 0 ? `${Math.max(8, heightPercent)}%` : '4px' }}
                      />

                      {/* Tooltip */}
                      {isHovered && (
                        <div className="absolute bottom-full mb-2 z-20 bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-[11px] whitespace-nowrap shadow-xl">
                          <div className="font-bold text-lime-400 font-mono">{day.date}</div>
                          <div>{day.repsCompleted} Reps completed</div>
                          <div className="text-slate-400">{day.proteinGrams}g Protein · {day.waterGlasses} glasses</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* X Axis Labels */}
              <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-2">
                {days.slice(-14).map((day, idx) => (
                  <span key={idx} className="flex-1 text-center truncate">
                    {day.dayLabel}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Chart 2: Daily Points & Accountability History */}
          <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Daily Points Earned</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Consistent habit points from training, nutrition, hydration, and sleep.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">
                {summary.totalPoints} Total Pts
              </span>
            </div>

            <div className="pt-6">
              <div className="h-44 flex items-end gap-2 sm:gap-4 border-b border-slate-800 pb-2">
                {days.slice(-14).map((day, idx) => {
                  const heightPercent = maxPoints > 0 ? (day.pointsEarned / maxPoints) * 100 : 0;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                      <div
                        className="w-full max-w-[28px] bg-amber-400/80 hover:bg-amber-400 rounded-t transition-all"
                        style={{ height: `${Math.max(6, heightPercent)}%` }}
                        title={`${day.date}: ${day.pointsEarned} points`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-2">
                {days.slice(-14).map((day, idx) => (
                  <span key={idx} className="flex-1 text-center truncate">
                    {day.dayLabel}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Insights Panel & Bodyweight History */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Insights Panel */}
          <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-lime-400" />
              <h3 className="text-base font-bold text-white">AI Coach Analysis</h3>
            </div>

            <div className="space-y-3">
              {insights.map((ins) => (
                <div key={ins.id} className="p-3.5 bg-[#171E2E] rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <div className="font-bold text-lime-300">{ins.title}</div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{ins.message}</p>
                  {ins.actionableStep && (
                    <div className="text-lime-400 font-semibold text-[10px] uppercase font-mono">
                      Next Step: {ins.actionableStep}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bodyweight Trend Card */}
          <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-lime-400" />
                <h3 className="text-base font-bold text-white">Bodyweight Trend</h3>
              </div>
              <span className="text-xs font-mono text-lime-400 font-bold tabular-nums">
                {days[days.length - 1]?.weightKg || 74.2} kg
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Steady mass progression observed across the logged period. Weekly fluctuations within 0.3 kg are within nominal glycogen hydration margins.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('/tracker')}
                className="w-full py-2 bg-[#171E2E] hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded-lg font-medium transition-colors"
              >
                Log New Weight Check-in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

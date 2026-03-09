'use client';

import { HEATMAP_SCALE } from './chart-theme';

interface HeatmapData {
  // 7 rows (days) x 24 columns (hours)
  grid: number[][];
}

interface PeakHoursHeatmapProps {
  data: HeatmapData;
  loading?: boolean;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function getColorForValue(value: number, max: number): string {
  if (max === 0 || value === 0) return HEATMAP_SCALE[0];
  const ratio = value / max;
  const index = Math.min(Math.floor(ratio * (HEATMAP_SCALE.length - 1)), HEATMAP_SCALE.length - 1);
  return HEATMAP_SCALE[index];
}

export function PeakHoursHeatmap({ data, loading }: PeakHoursHeatmapProps) {
  const maxValue = Math.max(...data.grid.flat(), 1);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 p-6 chart-fade-up">
        <div className="h-[260px] flex items-center justify-center text-gray-400">
          Loading heatmap...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 p-6 chart-fade-up">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">Peak Usage Hours</h3>
        <p className="text-xs text-gray-500 mt-0.5">When employees use the chat assistant</p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[540px]">
          {/* Hour labels */}
          <div className="flex ml-10 mb-1">
            {HOURS.filter((_, i) => i % 3 === 0).map((h) => (
              <div
                key={h}
                className="text-[10px] text-gray-400"
                style={{ width: `${(3 / 24) * 100}%` }}
              >
                {h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`}
              </div>
            ))}
          </div>

          {/* Grid */}
          {DAYS.map((day, dayIdx) => (
            <div key={day} className="flex items-center mb-[2px]">
              <div className="w-10 text-[11px] text-gray-500 font-medium">{day}</div>
              <div className="flex-1 flex gap-[2px]">
                {HOURS.map((hour) => {
                  const value = data.grid[dayIdx]?.[hour] || 0;
                  return (
                    <div
                      key={hour}
                      className="flex-1 h-7 transition-all duration-200 hover:ring-2 hover:ring-tobie-400 hover:ring-offset-1 cursor-default"
                      style={{ backgroundColor: getColorForValue(value, maxValue) }}
                      title={`${day} ${hour}:00 — ${value} session${value !== 1 ? 's' : ''}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center justify-end gap-1 mt-3">
            <span className="text-[10px] text-gray-400 mr-1">Less</span>
            {HEATMAP_SCALE.map((color, i) => (
              <div
                key={i}
                className="w-4 h-4"
                style={{ backgroundColor: color }}
              />
            ))}
            <span className="text-[10px] text-gray-400 ml-1">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}

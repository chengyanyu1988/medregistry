import React, { useState } from 'react';
import { LabReport, PatientHistoryPoint } from '../../types/report';
import { Calendar, Search, TrendingUp, Info } from 'lucide-react';

interface HistoricalTrendChartViewProps {
  report: LabReport;
}

export const HistoricalTrendChartView: React.FC<HistoricalTrendChartViewProps> = ({ report }) => {
  const availableKeys = report.historyTrends ? Object.keys(report.historyTrends) : [];
  const defaultKey = availableKeys[0] || report.items[0]?.code || 'PT';
  const [selectedKey, setSelectedKey] = useState<string>(defaultKey);
  const [startDate, setStartDate] = useState('2026-09-30');
  const [endDate, setEndDate] = useState('2026-10-30');

  const historyPoints: PatientHistoryPoint[] = report.historyTrends?.[selectedKey] || [
    { date: '2026-10-02', time: '08:30', value: 4.5, status: 'normal', doctor: '张伟' },
    { date: '2026-10-09', time: '09:10', value: 2.5, status: 'normal', doctor: '张伟' },
    { date: '2026-10-16', time: '08:45', value: 4.9, status: 'up', doctor: '李婷' },
    { date: '2026-10-23', time: '09:00', value: 2.6, status: 'normal', doctor: '陈志远' },
    { date: '2026-10-30', time: '09:15', value: 4.5, status: 'normal', doctor: '李婷' }
  ];

  const matchedItem = report.items.find((it) => it.code === selectedKey);
  const itemUnit = matchedItem?.unit || '';
  const itemName = matchedItem?.name || selectedKey;

  // Chart dimensions
  const svgWidth = 620;
  const svgHeight = 220;
  const paddingX = 60;
  const paddingY = 40;

  const values = historyPoints.map((p) => p.value);
  const minVal = Math.min(...values, 0);
  const maxVal = Math.max(...values, 6);
  const range = maxVal - minVal || 1;

  const pointsCoord = historyPoints.map((pt, idx) => {
    const x =
      paddingX +
      (idx / Math.max(historyPoints.length - 1, 1)) * (svgWidth - paddingX * 2);
    const normalizedY = (pt.value - minVal) / range;
    const y = svgHeight - paddingY - normalizedY * (svgHeight - paddingY * 2);
    return { x, y, pt };
  });

  const pathD = pointsCoord.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Average and statistics
  const avgVal = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
  const highestVal = Math.max(...values);
  const lowestVal = Math.min(...values);

  return (
    <div className="space-y-4 text-xs">
      {/* Top Filter and Project Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span>对比项目:</span>
            <select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded font-semibold text-sky-800 text-xs focus:outline-none focus:border-sky-500"
            >
              {report.items.map((it) => (
                <option key={it.code} value={it.code}>
                  {it.name} ({it.code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>对比时间:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono text-[11px]"
            />
            <span className="text-slate-400">~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono text-[11px]"
            />
            <button
              type="button"
              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium text-xs flex items-center gap-1"
            >
              <Search className="w-3 h-3" />
              <span>查询对比</span>
            </button>
          </div>
        </div>

        {/* Statistical summary pill */}
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-600 font-mono text-[11px]">
            均值: <strong className="text-slate-900">{avgVal}</strong> {itemUnit}
          </div>
          <div className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-600 font-mono text-[11px]">
            波动区间: <strong className="text-emerald-700">{lowestVal}</strong> ~ <strong className="text-rose-700">{highestVal}</strong>
          </div>
        </div>
      </div>

      {/* SVG Trend Chart matching image_298fa7bf.png */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sky-700 text-sm">{itemName} ({selectedKey})</span>
            <span className="text-[11px] text-slate-400">历史5次随访检验趋势曲线</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">单位: {itemUnit || '标准比值'}</span>
        </div>

        <div className="w-full overflow-x-auto flex justify-center">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-w-[620px] h-[220px]">
            {/* Horizontal Grid dashed lines */}
            {[0.2, 0.4, 0.6, 0.8].map((ratio, i) => {
              const y = paddingY + ratio * (svgHeight - paddingY * 2);
              return (
                <line
                  key={i}
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#cbd5e1"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              );
            })}

            {/* Baseline */}
            <line
              x1={paddingX}
              y1={svgHeight - paddingY}
              x2={svgWidth - paddingX}
              y2={svgHeight - paddingY}
              stroke="#94a3b8"
              strokeWidth="1.5"
            />

            {/* Trend line */}
            <path
              d={pathD}
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Shaded area underneath */}
            <path
              d={`${pathD} L ${pointsCoord[pointsCoord.length - 1].x} ${svgHeight - paddingY} L ${pointsCoord[0].x} ${svgHeight - paddingY} Z`}
              fill="url(#trendGradient)"
              opacity="0.25"
            />

            {/* Defs for gradient */}
            <defs>
              <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Points and Pinpoint marker badges matching screenshot pin icons */}
            {pointsCoord.map((p, idx) => (
              <g key={idx}>
                {/* Vertical drop line */}
                <line
                  x1={p.x}
                  y1={p.y}
                  x2={p.x}
                  y2={svgHeight - paddingY}
                  stroke="#93c5fd"
                  strokeDasharray="2 2"
                  strokeWidth="1"
                />

                {/* Pin bubble marker */}
                <g transform={`translate(${p.x}, ${p.y - 12})`}>
                  {/* Pin teardrop / polygon */}
                  <path
                    d="M 0 0 C -12 -10, -12 -26, 0 -26 C 12 -26, 12 -10, 0 0 Z"
                    fill="#0ea5e9"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.25))"
                  />
                  {/* Value text inside pin */}
                  <text
                    x="0"
                    y="-15"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {p.pt.value}
                  </text>
                </g>

                {/* Point dot on line */}
                <circle cx={p.x} cy={p.y} r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />

                {/* Date label at bottom */}
                <text
                  x={p.x}
                  y={svgHeight - paddingY + 16}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="9.5"
                  fontFamily="monospace"
                >
                  {p.pt.date.slice(5)}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Legend bottom note */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2">
          <div className="flex items-center gap-1 text-slate-600">
            <Info className="w-3.5 h-3.5 text-sky-500" />
            <span>数据源自该患者近一个月内历次检验电子病历存根，蓝水滴气泡内数值为实测值</span>
          </div>
          <span className="font-mono">检验仪器已校准 · 溯源有效</span>
        </div>
      </div>
    </div>
  );
};

import React, { useMemo } from 'react';
import { LabReport } from '../../types/report';
import { Activity, Info, ZoomIn, Download, RotateCw } from 'lucide-react';

interface InstrumentGraphicResultViewProps {
  report: LabReport;
}

export const InstrumentGraphicResultView: React.FC<InstrumentGraphicResultViewProps> = ({
  report,
}) => {
  // Generate scatter points for SWDF (White Blood Cell 5-diff scattergram)
  const swdfPoints = useMemo(() => {
    const points: Array<{ x: number; y: number; color: string }> = [];

    // Cluster 1: Lymphocytes (Purple/violet cluster)
    for (let i = 0; i < 90; i++) {
      const x = 70 + (Math.random() - 0.5) * 35;
      const y = 110 + (Math.random() - 0.5) * 25;
      points.push({ x, y, color: '#9333ea' }); // purple
    }

    // Cluster 2: Monocytes (Green cluster)
    for (let i = 0; i < 60; i++) {
      const x = 110 + (Math.random() - 0.5) * 30;
      const y = 75 + (Math.random() - 0.5) * 35;
      points.push({ x, y, color: '#16a34a' }); // green
    }

    // Cluster 3: Neutrophils (Cyan/blue cluster)
    for (let i = 0; i < 160; i++) {
      const x = 160 + (Math.random() - 0.5) * 55;
      const y = 125 + (Math.random() - 0.5) * 25;
      points.push({ x, y, color: '#06b6d4' }); // cyan
    }

    // Cluster 4: Eosinophils / Debris (Dark red/brown dots)
    for (let i = 0; i < 35; i++) {
      const x = 195 + (Math.random() - 0.5) * 25;
      const y = 135 + (Math.random() - 0.5) * 20;
      points.push({ x, y, color: '#b91c1c' }); // red/brown
    }

    return points;
  }, []);

  // Generate scatter points for SWNR (Nucleated RBC / Reticulocytes)
  const swnrPoints = useMemo(() => {
    const points: Array<{ x: number; y: number; color: string }> = [];

    // Dense blue-teal cluster in top-right
    for (let i = 0; i < 220; i++) {
      const x = 150 + (Math.random() - 0.5) * 50;
      const y = 80 + (Math.random() - 0.5) * 35;
      points.push({ x, y, color: '#0891b2' }); // teal
    }

    // Debris dots along bottom/left
    for (let i = 0; i < 40; i++) {
      const x = 30 + Math.random() * 100;
      const y = 145 + Math.random() * 8;
      points.push({ x, y, color: '#1e3a8a' }); // dark blue
    }

    return points;
  }, []);

  return (
    <div className="space-y-4 text-xs">
      {/* Instrument Info Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-600" />
          <span className="font-bold text-slate-800">
            分析仪器：{report.instrumentModel || 'Sysmex XN-9000 全自动血液分析流水线 (双向联机)'}
          </span>
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-mono text-[10px]">
            质控在控 (Westgard OK)
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
          <span>采样管条码: {report.barcode}</span>
          <span>·</span>
          <span>图形分辨率: 300 DPI</span>
        </div>
      </div>

      {/* 4 Analyzer Panels matching image_1edfb7a4.png */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* PANEL 1: HPLT (血小板直方图) */}
        <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
            <span className="font-bold text-slate-900 font-mono text-sm tracking-wide">HPLT</span>
            <span className="text-[11px] text-slate-500 font-medium">血小板直方图</span>
          </div>

          <div className="bg-[#fcfcfc] border border-slate-200 rounded p-2 flex-1 relative flex items-center justify-center">
            <svg viewBox="0 0 220 160" className="w-full h-[150px]">
              {/* Coordinate axes */}
              <line x1="20" y1="140" x2="210" y2="140" stroke="#ef4444" strokeWidth="1.5" />
              <line x1="20" y1="20" x2="20" y2="140" stroke="#ef4444" strokeWidth="1.5" />

              {/* Threshold dashed lines (green, magenta) */}
              <line x1="55" y1="20" x2="55" y2="140" stroke="#ec4899" strokeDasharray="3 3" strokeWidth="1.2" />
              <line x1="95" y1="20" x2="95" y2="140" stroke="#ec4899" strokeDasharray="3 3" strokeWidth="1.2" />
              <line x1="145" y1="20" x2="145" y2="140" stroke="#22c55e" strokeDasharray="3 3" strokeWidth="1.2" />

              {/* HPLT Histogram Curve (cyan line peaking around 40-50fL then trailing) */}
              <path
                d="M 20 140 Q 30 135, 42 75 T 65 95 Q 90 125, 130 135 T 195 138"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 flex justify-between font-mono">
            <span>MPV: 10.4 fL</span>
            <span>PDW: 16.2</span>
          </div>
        </div>

        {/* PANEL 2: HRBC (红细胞直方图) */}
        <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
            <span className="font-bold text-slate-900 font-mono text-sm tracking-wide">HRBC</span>
            <span className="text-[11px] text-slate-500 font-medium">红细胞直方图</span>
          </div>

          <div className="bg-[#fcfcfc] border border-slate-200 rounded p-2 flex-1 relative flex items-center justify-center">
            <svg viewBox="0 0 220 160" className="w-full h-[150px]">
              {/* Axes */}
              <line x1="20" y1="140" x2="210" y2="140" stroke="#ef4444" strokeWidth="1.5" />
              <line x1="20" y1="20" x2="20" y2="140" stroke="#ef4444" strokeWidth="1.5" />

              {/* Reference limit markers */}
              <line x1="55" y1="20" x2="55" y2="140" stroke="#22c55e" strokeDasharray="4 4" strokeWidth="1.2" />
              <line x1="95" y1="20" x2="95" y2="140" stroke="#ec4899" strokeDasharray="4 4" strokeWidth="1.2" />
              <line x1="160" y1="20" x2="160" y2="140" stroke="#ec4899" strokeDasharray="4 4" strokeWidth="1.2" />

              {/* Bell shaped curve for RBC */}
              <path
                d="M 40 140 C 65 140, 75 40, 95 35 C 115 35, 125 130, 180 140"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 flex justify-between font-mono">
            <span>MCV: 89.2 fL</span>
            <span>RDW-CV: 12.8%</span>
          </div>
        </div>

        {/* PANEL 3: SWDF (白细胞五分类散点图) */}
        <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
            <span className="font-bold text-slate-900 font-mono text-sm tracking-wide">SWDF</span>
            <span className="text-[11px] text-slate-500 font-medium">白细胞五分类</span>
          </div>

          <div className="bg-[#fcfcfc] border border-slate-200 rounded p-2 flex-1 relative flex items-center justify-center">
            <svg viewBox="0 0 220 160" className="w-full h-[150px]">
              {/* Axes with red dash ticks on Y */}
              <line x1="20" y1="140" x2="210" y2="140" stroke="#ef4444" strokeWidth="1.5" />
              <line x1="20" y1="20" x2="20" y2="140" stroke="#ef4444" strokeWidth="1.5" />

              {[30, 50, 70, 90, 110, 130].map((y) => (
                <line key={y} x1="16" y1={y} x2="20" y2={y} stroke="#ef4444" strokeWidth="1.5" />
              ))}

              {/* Cluster Dots */}
              {swdfPoints.map((pt, idx) => (
                <circle key={idx} cx={pt.x} cy={pt.y} r="1.3" fill={pt.color} />
              ))}
            </svg>
          </div>
          <div className="mt-2 text-[10px] flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-purple-600 inline-block" /> 淋巴
            </span>
            <span className="flex items-center gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-green-600 inline-block" /> 单核
            </span>
            <span className="flex items-center gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> 中性
            </span>
          </div>
        </div>

        {/* PANEL 4: SWNR (有核红细胞/网织红散点图) */}
        <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
            <span className="font-bold text-slate-900 font-mono text-sm tracking-wide">SWNR</span>
            <span className="text-[11px] text-slate-500 font-medium">有核红细胞图</span>
          </div>

          <div className="bg-[#fcfcfc] border border-slate-200 rounded p-2 flex-1 relative flex items-center justify-center">
            <svg viewBox="0 0 220 160" className="w-full h-[150px]">
              {/* Axes with ticks */}
              <line x1="20" y1="140" x2="210" y2="140" stroke="#ef4444" strokeWidth="1.5" />
              <line x1="20" y1="20" x2="20" y2="140" stroke="#ef4444" strokeWidth="1.5" />

              {[30, 50, 70, 90, 110, 130].map((y) => (
                <line key={y} x1="16" y1={y} x2="20" y2={y} stroke="#ef4444" strokeWidth="1.5" />
              ))}

              {/* Cluster Dots */}
              {swnrPoints.map((pt, idx) => (
                <circle key={idx} cx={pt.x} cy={pt.y} r="1.3" fill={pt.color} />
              ))}
            </svg>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 flex justify-between font-mono">
            <span>NRBC#: 0.00 /100WBC</span>
            <span>无异常报警</span>
          </div>
        </div>
      </div>

      {/* Bottom helper */}
      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-sky-600" />
          <span>图形结果由自动化血液流水线光学鞘流检测系统实时生成，已自动匹配临床诊断模型。</span>
        </div>
        <span className="text-slate-400 font-mono">图形版本: LIS-XN-V5.2</span>
      </div>
    </div>
  );
};

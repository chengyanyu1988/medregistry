import React from 'react';
import { TestItemDetail } from '../../types/report';
import { X, AlertCircle, TrendingUp, TrendingDown, ShieldAlert, CheckCircle2, Stethoscope } from 'lucide-react';

interface ClinicalSignificanceModalProps {
  item: TestItemDetail | null;
  onClose: () => void;
}

export const ClinicalSignificanceModal: React.FC<ClinicalSignificanceModalProps> = ({
  item,
  onClose,
}) => {
  if (!item) return null;

  const { clinicalSignificance } = item;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="bg-linear-to-r from-sky-700 to-indigo-800 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white/10 rounded-lg">
              <Stethoscope className="w-4 h-4 text-sky-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <span>临床检验意义解读</span>
                <span className="px-2 py-0.5 rounded bg-sky-600/60 text-[11px] font-mono">
                  {item.code}
                </span>
              </h3>
              <p className="text-[11px] text-sky-100">
                {item.name}（参考区间: {item.referenceRange} {item.unit}）
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-sky-200 hover:text-white rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Current result badge */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-slate-500 font-medium">当前患者检验结果：</span>
              <span className="font-mono text-base font-bold text-slate-900 ml-1.5">
                {item.result} {item.unit}
              </span>
            </div>
            <div>
              {item.status === 'up' && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>高于正常参考限</span>
                </span>
              )}
              {item.status === 'down' && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-700 border border-sky-200 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>低于正常参考限</span>
                </span>
              )}
              {item.status === 'critical' && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white flex items-center gap-1 animate-pulse">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>危急值预警</span>
                </span>
              )}
              {item.status === 'normal' && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>处于参考区间内</span>
                </span>
              )}
            </div>
          </div>

          {/* Overview */}
          <div>
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5 text-xs">
              <AlertCircle className="w-3.5 h-3.5 text-sky-600" />
              <span>检验生理及病理学概述</span>
            </h4>
            <div className="p-3 bg-sky-50/60 rounded-lg border border-sky-100 text-slate-700 leading-relaxed">
              {clinicalSignificance?.overview || `${item.name}（${item.code}）是临床常规检验指标，用于评估患者器官功能状态与生理代谢水平。`}
            </div>
          </div>

          {/* High Causes */}
          {clinicalSignificance?.highCauses && clinicalSignificance.highCauses.length > 0 && (
            <div>
              <h4 className="font-bold text-rose-800 mb-1.5 flex items-center gap-1.5 text-xs">
                <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                <span>指标升高常见临床诱因</span>
              </h4>
              <ul className="space-y-1.5 pl-1">
                {clinicalSignificance.highCauses.map((cause, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700">
                    <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Low Causes */}
          {clinicalSignificance?.lowCauses && clinicalSignificance.lowCauses.length > 0 && (
            <div>
              <h4 className="font-bold text-sky-800 mb-1.5 flex items-center gap-1.5 text-xs">
                <TrendingDown className="w-3.5 h-3.5 text-sky-600" />
                <span>指标降低常见临床诱因</span>
              </h4>
              <ul className="space-y-1.5 pl-1">
                {clinicalSignificance.lowCauses.map((cause, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700">
                    <span className="w-4 h-4 rounded-full bg-sky-100 text-sky-700 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Clinical Recommendations */}
          {clinicalSignificance?.recommendations && clinicalSignificance.recommendations.length > 0 && (
            <div>
              <h4 className="font-bold text-emerald-800 mb-1.5 flex items-center gap-1.5 text-xs">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                <span>检验医师临床建议与随访注意</span>
              </h4>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 space-y-1">
                {clinicalSignificance.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold text-xs transition-colors shadow-2xs"
          >
            已阅读并关闭
          </button>
        </div>
      </div>
    </div>
  );
};

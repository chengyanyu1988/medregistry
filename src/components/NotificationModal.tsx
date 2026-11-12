import React from 'react';
import { X, Bell, AlertTriangle, Clock, CheckCircle2, ShieldCheck } from './MenuIcon';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      title: '危急值警报：急诊心内科肌钙蛋白I超标',
      desc: '患者李振华标本测定值 12.8 ng/mL，已通知临床医生，等待临床签收确认。',
      time: '5分钟前',
      type: 'danger',
    },
    {
      id: '2',
      title: '试剂临期预警：高敏肌钙蛋白I试剂盒',
      desc: '当前批次 20260215 效期剩余 28 天，请及时协调领用或调配。',
      time: '35分钟前',
      type: 'warning',
    },
    {
      id: '3',
      title: '标本前处理拦截：门诊送检溶血标本',
      desc: '标本条码 202610150014 严重脂血，已触发自动退回重抽申请。',
      time: '1小时前',
      type: 'info',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-slate-900 text-sm">系统待办与消息提醒 (3)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-xl border text-xs space-y-1 transition-all ${
                n.type === 'danger'
                  ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                  : n.type === 'warning'
                  ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                  : 'bg-sky-50/60 border-sky-200 text-sky-950'
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1.5">
                  {n.type === 'danger' && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
                  {n.type === 'warning' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                  {n.type === 'info' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />}
                  {n.title}
                </span>
                <span className="text-[10px] opacity-60 font-mono">{n.time}</span>
              </div>
              <p className="text-[11px] opacity-80 leading-relaxed">{n.desc}</p>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs">
          <button className="text-slate-500 hover:text-slate-800">全部标记为已读</button>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800"
          >
            知道了
          </button>
        </div>
      </div>
    </div>
  );
};

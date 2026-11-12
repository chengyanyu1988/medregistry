import React, { useState } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from './MenuIcon';

interface LoginPageProps {
  onLoginSuccess?: (username: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      showToast('请输入工号/账号和密码');
      return;
    }

    const currentAcc = username.trim();
    showToast(`登录成功！欢迎进入实验室工作台 [${currentAcc}]`);
    setTimeout(() => {
      if (onLoginSuccess) {
        onLoginSuccess(currentAcc);
      }
    }, 500);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans antialiased">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-8 right-8 z-50 animate-bounceIn">
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-900 text-white text-xs shadow-2xl border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* 1. Left Half: Luminous Medical Laboratory Cover & Full Platform Information */}
      <div className="relative hidden lg:flex lg:w-1/2 h-full overflow-hidden bg-gradient-to-br from-[#0c2238] via-[#0f2c4a] to-[#143a60] flex-col justify-between p-10 xl:p-14 text-white select-none">
        {/* Luminous cyan & blue tech ambient glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* 100% Clean, Text-Free Background Image: showing doctor, automated pipeline, and glowing holographic screens with ZERO baked-in text */}
        <div
          className="absolute inset-0 bg-no-repeat bg-cover z-0 opacity-100"
          style={{
            backgroundImage: `url('/assets/aistudio/login_bg_clean.png')`,
            backgroundPosition: 'right center',
            backgroundSize: 'cover',
          }}
        />

        {/* Subtle soft gradient ensuring comfortable text contrast without darkening the laboratory and doctor */}
        <div className="absolute inset-y-0 left-0 w-[40%] bg-gradient-to-r from-[#0c2238]/50 via-[#0c2238]/20 to-transparent z-0 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#0a1d30]/40 to-transparent z-0 pointer-events-none" />

        {/* Top Header Logo & Platform Name */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-slate-700/70 shadow-lg backdrop-blur-md flex items-center justify-center text-cyan-400 shrink-0">
            <svg className="w-6 h-6 stroke-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l3-8 4 16 3-10 2 4h3" />
            </svg>
          </div>
          <div>
            <h1 className="text-white text-base sm:text-lg font-bold tracking-wide">医疗管控智能平台</h1>
            <p className="text-slate-300 text-xs font-normal">智慧医学检验实验室信息管理系统 (LIS)</p>
          </div>
        </div>

        {/* Center Hero Marketing Text (Restored as requested: outer text kept) */}
        <div className="relative z-10 my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-medium backdrop-blur-md mb-6 shadow-xs">
            <span className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px] font-bold text-cyan-400">✨</span>
            <span>ISO 15189 认可医学实验室认证平台</span>
          </div>

          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
            全流程智慧检验与
          </h2>
          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 leading-tight mt-1 mb-6">
            医疗管控一体化平台
          </h2>

          <p className="text-slate-300/90 text-sm sm:text-base leading-relaxed max-w-xl font-normal mb-8">
            连接全院全自动化免疫流水线、血液形态学图像分析与微生物质谱鉴定系统，实现标本从采样、核收、上机分析到危急值闭环全生命周期智能化管理。
          </p>

          {/* 3 Status indicators */}
          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-medium text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse" />
              <span>流水线设备在线</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>数据双向三级防泄漏</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>区域医联体14家联网</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer inside Left Banner */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Smart Clinical Lab Information & Quality Control System</span>
          <span>Version 4.8.2-Release</span>
        </div>
      </div>

      {/* 2. Right Half: Crisp White Login Card */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative overflow-y-auto">
        {/* Top Right Status Indicator */}
        <div className="self-end flex items-center gap-2 text-emerald-600 text-xs font-medium bg-emerald-50/80 border border-emerald-100 px-3.5 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>网络与专线状态正常</span>
        </div>

        {/* Main Login Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">用户登录</h2>
          <p className="text-slate-500 text-sm mb-8">请输入您的职工工号与系统密码以进入实验室工作台</p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Field 1: 工号 / 登录账号 */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                工号 / 登录账号
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4.5 h-4.5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all"
                  required
                />
              </div>
            </div>

            {/* Field 2: 登录密码 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700">
                  登录密码
                </label>
                <button
                  type="button"
                  onClick={() => showToast('初始密码或重置请联系医院信息科 (分机 8088)')}
                  className="text-xs text-slate-400 hover:text-sky-600 transition-colors"
                >
                  初始密码或重置请联系信息科
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                />
                <span>记住此工作站账号</span>
              </label>
              <span className="text-slate-400 font-normal">内网CA证书自动校验</span>
            </div>

            {/* Submit Button matching screenshot: Cyan blue rounded button with arrow icon */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-[#008ce6] hover:bg-[#007ccf] active:bg-[#0066b3] text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span>登 录</span>
            </button>
          </form>
        </div>

        {/* Bottom Right Footer */}
        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>国家医疗卫生信息安全等级保护三级认证</span>
          </div>
          <span>医院信息科提供运维支持 · 分机 8088</span>
        </div>
      </div>
    </div>
  );
};

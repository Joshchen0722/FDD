
import React, { useState } from 'react';
import { Staff, ShiftType, Rule } from '../types';

interface RulesPanelProps {
  staff: Staff[];
  shifts: ShiftType[];
  rules: Rule[];
  onRuleToggle: (id: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

type TabType = 'rules' | 'staff' | 'shifts';

const RulesPanel: React.FC<RulesPanelProps> = ({
  staff,
  shifts,
  rules,
  onRuleToggle,
  onGenerate,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('rules');

  const tabs = [
    { id: 'rules', label: '排班規則', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
    { id: 'staff', label: '人員名單', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'shifts', label: '班別設定', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-full lg:w-[420px] overflow-hidden">
      {/* 頂部導覽與分頁切換 */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 bg-indigo-600 rounded-full"></div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">系統設定</h1>
          </div>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-widest">
            v2.0 Stable
          </span>
        </div>
        
        <div className="flex p-1 bg-slate-100 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-black transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 內容區域 */}
      <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
        {activeTab === 'rules' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">自動化邏輯與約束</h2>
              <span className="text-[10px] font-bold text-slate-400">啟用數: {rules.filter(r => r.isEnabled).length}</span>
            </div>
            {rules.map((rule) => (
              <div 
                key={rule.id}
                className={`group relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  rule.isEnabled 
                    ? 'bg-indigo-50/30 border-indigo-100 shadow-sm' 
                    : 'bg-white border-slate-100 opacity-60 grayscale hover:grayscale-0'
                }`}
                onClick={() => onRuleToggle(rule.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 h-5 w-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    rule.isEnabled ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                  }`}>
                    {rule.isEnabled && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className={`text-sm font-black ${rule.isEnabled ? 'text-indigo-950' : 'text-slate-600'}`}>
                      {rule.title}
                    </h3>
                    <p className={`text-xs mt-1 leading-relaxed ${rule.isEnabled ? 'text-indigo-700/60' : 'text-slate-400'}`}>
                      {rule.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">人員與指定休假</h2>
              <span className="text-[10px] font-bold text-slate-400">總人數: {staff.length}</span>
            </div>
            {staff.map(s => (
              <div key={s.id} className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-100 hover:shadow-sm transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-800">{s.name}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                      s.role === '正職' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {s.role}
                    </span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-300 tracking-tighter">REF_{s.id.padStart(3, '0')}</div>
                </div>
                
                {s.specificOffDates.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {s.specificOffDates.map(date => (
                      <span key={date} className="text-[9px] font-bold bg-rose-50 text-rose-500 border border-rose-100 px-1.5 py-0.5 rounded">
                        {date.split('-').slice(1).join('/')}
                      </span>
                    ))}
                    <span className="text-[9px] font-bold text-rose-300 self-center ml-1">指定休假</span>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 italic mt-2">無指定休假，系統自動分配</p>
                )}

                {s.preferences.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-50">
                    <p className="text-[10px] text-slate-500 font-medium leading-tight">
                      <span className="text-indigo-400 font-black mr-1">偏好</span>
                      {s.preferences[0]}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'shifts' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">勤務時段配置</h2>
            {shifts.map(shift => (
              <div key={shift.id} className="group relative p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm ${shift.color}`}>
                    {shift.id.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-black text-slate-800">{shift.name}</p>
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md">運行中</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs font-bold text-slate-500">{shift.startTime} — {shift.endTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400 py-8">
              <p className="text-[10px] font-black uppercase tracking-widest">目前僅開放三班制</p>
              <p className="text-[9px] font-medium mt-1">如需新增班別請聯繫系統管理員</p>
            </div>
          </div>
        )}
      </div>

      {/* 底部動作列 */}
      <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-12px_40px_rgba(0,0,0,0.03)]">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-2xl font-black text-sm tracking-widest uppercase shadow-2xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 ${
            isLoading 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 hover:-translate-y-0.5'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>AI 計算中...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>生成 1 月份班表</span>
            </>
          )}
        </button>
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="flex -space-x-1.5">
            {[1,2,3].map(i => <div key={i} className="w-4 h-4 rounded-full border-2 border-white bg-slate-200" />)}
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
            SmartShift AI Engine • <span className="text-emerald-500">Active</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RulesPanel;

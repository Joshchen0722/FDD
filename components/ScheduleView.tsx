
import React from 'react';
import { Staff, ShiftType, DaySchedule } from '../types';

interface ScheduleViewProps {
  schedules: DaySchedule[];
  staff: Staff[];
  shifts: ShiftType[];
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ schedules, staff, shifts }) => {
  if (schedules.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 border border-slate-100">
          <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800">準備好生成 1 月份班表了嗎？</h2>
        <p className="text-slate-500 mt-2 max-w-sm">
          點擊左側「自動生成」按鈕，AI 將根據法規與人員需求，在幾秒內產出最優排程。
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* 標題與圖例 */}
      <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">2024年 1月 勤務排班表</h2>
          <p className="text-sm text-slate-500 font-medium">每人月休 10 天 | 班距 11 小時檢核通過</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-[11px] font-bold px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg border border-orange-100">早C (07:00)</div>
          <div className="flex items-center gap-2 text-[11px] font-bold px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">晚B (15:00)</div>
          <div className="flex items-center gap-2 text-[11px] font-bold px-3 py-1.5 bg-slate-800 text-white rounded-lg shadow-sm">夜B (23:00)</div>
          <div className="flex items-center gap-2 text-[11px] font-bold px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg border border-rose-100">定休/排休</div>
        </div>
      </div>

      {/* 班表主體 - 捲動區域 */}
      <div className="flex-1 overflow-auto no-scrollbar">
        <table className="w-full border-collapse table-fixed min-w-[1200px]">
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr className="bg-slate-50">
              <th className="w-32 p-4 text-left border-b border-r border-slate-200 sticky left-0 z-30 bg-slate-50">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">人員 \ 日期</span>
              </th>
              {schedules.map((day) => {
                const dateObj = new Date(day.date);
                const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                return (
                  <th key={day.date} className={`w-12 p-2 border-b border-r border-slate-200 text-center ${isWeekend ? 'bg-rose-50/50' : ''}`}>
                    <div className={`text-[10px] font-bold ${isWeekend ? 'text-rose-500' : 'text-slate-400'}`}>
                      {dateObj.toLocaleDateString('zh-TW', { weekday: 'short' })}
                    </div>
                    <div className={`text-sm font-black ${isWeekend ? 'text-rose-600' : 'text-slate-700'}`}>
                      {dateObj.getDate()}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {staff.map((person) => (
              <tr key={person.id} className="group hover:bg-indigo-50/30 transition-colors">
                {/* 固定左側人名列 */}
                <td className="p-4 border-b border-r border-slate-200 sticky left-0 z-10 bg-white group-hover:bg-indigo-50/50 transition-colors">
                  <div className="font-black text-slate-800">{person.name}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{person.role}</div>
                </td>
                
                {/* 每日班次格子 */}
                {schedules.map((day) => {
                  const assignment = day.assignments.find(a => a.staffId === person.id);
                  const shift = assignment ? shifts.find(s => s.id === assignment.shiftId) : null;
                  const isSpecificOff = person.specificOffDates.includes(day.date);
                  const dateObj = new Date(day.date);
                  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

                  return (
                    <td 
                      key={day.date} 
                      className={`p-1 border-b border-r border-slate-100 text-center transition-all ${
                        isWeekend ? 'bg-rose-50/20' : ''
                      } ${assignment ? '' : 'bg-slate-50/30'}`}
                    >
                      {shift ? (
                        <div className={`h-10 flex items-center justify-center rounded-xl text-[11px] font-black shadow-sm border ${
                          shift.id === '早C' ? 'bg-white border-orange-200 text-orange-700' :
                          shift.id === '晚B' ? 'bg-white border-blue-200 text-blue-700' :
                          'bg-slate-800 border-slate-900 text-white'
                        }`}>
                          {shift.id}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-10">
                          {isSpecificOff ? (
                            <span className="text-[10px] font-black text-rose-400 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">定休</span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-300">休</span>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* 底部數據摘要 */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        <span>* 定休：指定不排班日期 | 休：系統自動配額排休</span>
        <div className="flex gap-4">
          <span>平日人力：早1 晚2 夜1</span>
          <span>週五及假日：早2 晚2 夜1</span>
        </div>
      </div>
    </div>
  );
};

export default ScheduleView;


import React, { useState } from 'react';
import RulesPanel from './components/RulesPanel';
import ScheduleView from './components/ScheduleView';
import { Staff, ShiftType, Rule, DaySchedule } from './types';
import { generateAisSchedule } from './services/geminiService';

const INITIAL_STAFF: Staff[] = [
  { id: '1', name: '江孟庭', role: '正職', maxHoursPerWeek: 40, preferences: [], specificOffDates: ['2024-01-10', '2024-01-11', '2024-01-12'] },
  { id: '2', name: '蕭維宏', role: '正職', maxHoursPerWeek: 40, preferences: ['柯宗男休假時負責夜櫃'], specificOffDates: ['2024-01-18', '2024-01-19'] },
  { id: '3', name: '宋婕安', role: '正職', maxHoursPerWeek: 40, preferences: ['星期六只能排早班'], specificOffDates: ['2024-01-25', '2024-01-26', '2024-01-27'] },
  { id: '4', name: '林家懋', role: '正職', maxHoursPerWeek: 40, preferences: [], specificOffDates: [] },
  { id: '5', name: '楊XENO', role: '正職', maxHoursPerWeek: 40, preferences: [], specificOffDates: ['2024-01-06', '2024-01-07', '2024-01-08'] },
  { id: '6', name: '柯宗男', role: '正職', maxHoursPerWeek: 40, preferences: ['專責夜櫃'], specificOffDates: ['2024-01-12', '2024-01-13', '2024-01-14', '2024-01-15'] },
  { id: '7', name: '陳紅秀', role: 'PT', maxHoursPerWeek: 20, preferences: ['1/22之後無法上班'], specificOffDates: ['2024-01-01', '2024-01-02', '2024-01-23', '2024-01-24', '2024-01-25', '2024-01-26', '2024-01-27', '2024-01-28', '2024-01-29', '2024-01-30', '2024-01-31'] },
];

const INITIAL_SHIFTS: ShiftType[] = [
  { id: '早C', name: '早C', category: '早', startTime: '07:00', endTime: '15:30', color: 'bg-orange-100 border-orange-400 text-orange-800' },
  { id: '晚B', name: '晚B', category: '晚', startTime: '15:00', endTime: '23:30', color: 'bg-blue-100 border-blue-400 text-blue-800' },
  { id: '夜B', name: '夜B', category: '夜', startTime: '23:00', endTime: '07:30', color: 'bg-slate-800 border-slate-900 text-white' },
];

const INITIAL_RULES: Rule[] = [
  { id: 'r1', category: 'operational', title: '三班人力配額', description: '一至四(早1晚2夜1)；五及週末(早2晚2夜1)', isEnabled: true },
  { id: 'r2', category: 'personal', title: '強制全員月休10天', description: '包含夜班專責同仁，系統將自動補足休假天數', isEnabled: true },
  { id: 'r3', category: 'personal', title: '夜班優先指派鏈', description: '柯宗男 > 蕭維宏 (僅此兩位)', isEnabled: true },
  { id: 'r4', category: 'law', title: '勞基法強制作息', description: '上班不超過6天、班次間隔至少11小時', isEnabled: true },
  { id: 'r5', category: 'personal', title: '每月連休兩天', description: '每位同仁每月至少安排一次連續兩天的休假 (Double Off)', isEnabled: true },
  { id: 'r6', category: 'personal', title: '避免頻繁作息切換', description: '不建議頻繁變動班別，避免 早→晚→早→晚 這種跳動式排班', isEnabled: true },
];

const App: React.FC = () => {
  const [staff] = useState<Staff[]>(INITIAL_STAFF);
  const [shifts] = useState<ShiftType[]>(INITIAL_SHIFTS);
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRuleToggle = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, isEnabled: !r.isEnabled } : r));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    const result = await generateAisSchedule(staff, shifts, rules, "2024-01-01", 31);
    
    if (result) {
      setSchedule(result.schedules);
    } else {
      alert("AI 排班生成失敗，請稍後再試。");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      <RulesPanel 
        staff={staff}
        shifts={shifts}
        rules={rules}
        onRuleToggle={handleRuleToggle}
        onGenerate={handleGenerate}
        isLoading={isLoading}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold italic shadow-md">S</div>
            <span className="font-bold text-slate-800 tracking-tight text-lg">SmartShift <span className="text-indigo-600">AI</span></span>
          </div>
          <div className="flex items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            January 2024 Schedule Planning
          </div>
        </header>
        
        <ScheduleView 
          schedules={schedule}
          staff={staff}
          shifts={shifts}
        />
      </div>
    </div>
  );
};

export default App;


export interface Staff {
  id: string;
  name: string;
  role: '正職' | 'PT';
  maxHoursPerWeek: number;
  preferences: string[];
  specificOffDates: string[]; // 格式: "YYYY-MM-DD"
}

export interface ShiftType {
  id: string;
  name: string;
  category: '早' | '中' | '晚' | '夜';
  startTime: string;
  endTime: string;
  color: string;
}

export interface Rule {
  id: string;
  category: 'law' | 'personal' | 'operational';
  title: string;
  description: string;
  isEnabled: boolean;
}

export interface ScheduledShift {
  shiftId: string;
  staffId: string;
}

export interface DaySchedule {
  date: string;
  assignments: ScheduledShift[];
}

export interface ScheduleResponse {
  schedules: DaySchedule[];
}

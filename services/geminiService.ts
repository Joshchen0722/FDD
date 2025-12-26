
import { GoogleGenAI, Type } from "@google/genai";
import { Staff, ShiftType, Rule, ScheduleResponse } from "../types";

export const generateAisSchedule = async (
  staff: Staff[],
  shifts: ShiftType[],
  rules: Rule[],
  startDate: string,
  days: number = 31
): Promise<ScheduleResponse | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    你是一位極其嚴謹的排班管理專家。現在要生成 2024 年 1 月的班表，請務必嚴格遵守以下「紅線規則」。
    
    【🔴 最高優先級：禁止晚接早 / 夜接早】
    這是目前的系統嚴重錯誤，請務必「逐日檢查」：
    1. 班距限制：任何人若前一天排「夜B」(23:00-07:30) 或「晚B」(15:00-23:30)，隔天「絕對絕對禁止」排「早C」(07:00-15:30)。
    2. 特別針對 蕭維宏 (ID: 2)：
       - 因為他經常代班夜班，請確保：若他某日排了「夜B」，隔天他必須是「休假」或繼續「夜B」。
       - 嚴禁出現：蕭維宏 1月X日(夜B) -> 1月X+1日(早C) 這種排法。
       - 嚴禁出現：蕭維宏 1月X日(晚B) -> 1月X+1日(早C) 這種排法。
    
    【核心約束】：
    1. 每人月休 10 天：包含人員名單中的 specificOffDates，剩餘天數請系統自動補足休假，確保每人總休假天數剛好為 10 天。
    2. 6 休 1：禁止任何人連續上班超過 6 天。
    3. 每月連休：正職人員每月必須安排至少一次「連續兩天休假 (Double Off)」。
    
    【夜班 (夜B) 唯一指派鏈】：
    每日的「夜B」僅能由以下兩人擔任：
    - 首選：柯宗男 (ID: 6)。
    - 次選：蕭維宏 (ID: 2) (僅在柯排休時)。
    - 注意：如果蕭維宏接了夜班，他隔天的早班必須被移除改為休假。
    
    【每日人力需求】：
    - 週一至週四：早C * 1, 晚B * 2, 夜B * 1。
    - 週五、週六、週日：早C * 2, 晚B * 2, 夜B * 1。
    
    【人員特殊需求】：
    ${JSON.stringify(staff, null, 2)}
    - 宋婕安 (ID: 3)：星期六固定只能排「早C」，不可排晚班或夜班。
    - 陳紅秀 (ID: 7)：1/22 之後全部標記為休假。
    
    【最後檢查指令】：
    在輸出 JSON 之前，請對蕭維宏 (ID: 2) 的 31 天班次進行二次人工模擬校驗。如果有任何一天出現「夜/晚接早」或「連七」，請立即修改。請確保輸出的排班表是邏輯完美的。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            schedules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  assignments: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        shiftId: { type: Type.STRING },
                        staffId: { type: Type.STRING }
                      },
                      required: ["shiftId", "staffId"]
                    }
                  }
                },
                required: ["date", "assignments"]
              }
            }
          },
          required: ["schedules"]
        }
      }
    });

    if (!response.text) return null;
    return JSON.parse(response.text) as ScheduleResponse;
  } catch (error) {
    console.error("Schedule generation failed:", error);
    return null;
  }
};

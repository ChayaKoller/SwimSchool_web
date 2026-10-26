import { z } from "zod";
 
type LessonTimeRow = { value: string };
 

export const lessonTimesField = z.array(z.object({ value: z.string() }));
 
// רשימת מועדים: לפחות אחד, כל שורה מלאה, בלי כפילויות.
// משותף לטופס הקבוצה (רשימה ידנית) ולחלון "הוספת שיעורים"
export function checkLessonTimes(times: LessonTimeRow[], ctx: z.RefinementCtx) {
  if (times.length === 0) {
    ctx.addIssue({ code: "custom", path: ["lessonTimes"], message: "יש להוסיף לפחות שיעור אחד" });
    return;
  }
 
  const seen = new Set<string>();
  times.forEach((time, index) => {
    const path = ["lessonTimes", index, "value"];
    if (!time.value) {
      ctx.addIssue({ code: "custom", path, message: "יש לבחור תאריך ושעה" });
    } else if (seen.has(time.value)) {
      ctx.addIssue({ code: "custom", path, message: "כבר קיים שיעור בתאריך ובשעה האלה" });
    }
    seen.add(time.value);
  });
}
 
// חלון "הוספת שיעורים"
export const addLessonsSchema = z
  .object({
    lessonTimes: lessonTimesField,
    isMakeup: z.boolean(),
  })
  .superRefine((data, ctx) => checkLessonTimes(data.lessonTimes, ctx));
 
export type AddLessonsFormValues = z.infer<typeof addLessonsSchema>;
 
// חלון "הזזת שיעור"
export const moveLessonSchema = z.object({
  startTime: z.string().min(1, { error: "יש לבחור תאריך ושעה" }),
});
 
export type MoveLessonFormValues = z.infer<typeof moveLessonSchema>;
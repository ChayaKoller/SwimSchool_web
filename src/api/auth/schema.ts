import {z} from "zod";
import {password,REQUIRED,requiredEmail} from "../../lib/validation"

export  const loginSchema=z.object({
 email:requiredEmail,
 password:password

})
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { error: REQUIRED }),
    newPassword: password,
    confirmPassword: z.string().min(1, { error: REQUIRED }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "הסיסמאות אינן תואמות",
    path: ["confirmPassword"],
  });

export type  loginSchemaData=z.infer<typeof loginSchema>;
export type  changePasswordSchemaData=z.infer<typeof changePasswordSchema>;



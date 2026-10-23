import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { useChangePassword } from "../api/auth/hook";
import { changePasswordSchema, type changePasswordSchemaData } from "../api/auth/schema";
import FormError from "../components/form/FormError";
import FormField from "../components/form/FormField";
import PasswordField from "../components/form/PasswordField";
import { useServerErrors } from "../components/form/useServerErrors";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";

// קוד שגיאה מהשרת -> השדה שמתחתיו תוצג ההודעה. מחוץ לקומפוננטה, כדי שלא ייווצר מחדש בכל רינדור
const CODE_TO_FIELD = { WRONG_PASSWORD: "currentPassword" } as const;

const ChangePasswordPage = () => {
  const { signIn } = useAuth();
  const toast = useToast();
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<changePasswordSchemaData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });
  const { formError, handleServerError } = useServerErrors(setError, CODE_TO_FIELD);

  const onHandleSubmit = (data: changePasswordSchemaData) => {
    // confirmPassword נשאר בדפדפן. לשרת שולחים רק את שתי הסיסמאות
    changePassword.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: (response) => {
          signIn(response); // ה-Token הישן כבר לא תקף אחרי החלפת סיסמה
          toast.success("הסיסמה הוחלפה");
          reset();
        },
        onError: handleServerError,
      },
    );
  };

  return (
    <>
      <PageHeader title="החלפת סיסמה" />

      <Card className="max-w-lg">
        <form onSubmit={handleSubmit(onHandleSubmit)} noValidate className="flex flex-col gap-5">
          <FormField label="סיסמה נוכחית" required htmlFor="currentPassword" error={errors.currentPassword?.message}>
            <PasswordField
              {...register("currentPassword")}
              id="currentPassword"
              autoComplete="current-password"
              invalid={!!errors.currentPassword}
              aria-describedby="currentPassword-description"
            />
          </FormField>

          <FormField
            label="סיסמה חדשה"
            required
            htmlFor="newPassword"
            error={errors.newPassword?.message}
            hint="לפחות 8 תווים, ובהם אות אחת וספרה אחת"
          >
            <PasswordField
              {...register("newPassword")}
              id="newPassword"
              autoComplete="new-password"
              invalid={!!errors.newPassword}
              aria-describedby="newPassword-description"
            />
          </FormField>

          <FormField label="אימות הסיסמה החדשה" required htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
            <PasswordField
              {...register("confirmPassword")}
              id="confirmPassword"
              autoComplete="new-password"
              invalid={!!errors.confirmPassword}
              aria-describedby="confirmPassword-description"
            />
          </FormField>

          <FormError message={formError} />

          <div className="flex justify-end border-t border-line/15 pt-5">
            <Button type="submit" isLoading={changePassword.isPending} icon={<KeyRound />}>
              החלפת סיסמה
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
};

export default ChangePasswordPage;
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useChangePassword } from "../api/auth/hook";
import { changePasswordSchema, type changePasswordSchemaData } from "../api/auth/schema";
import FormError from "../components/form/FormError";
import FormField from "../components/form/FormField";
import NewPasswordFields from "../components/form/NewPasswordFields";
import PasswordField from "../components/form/PasswordField";
import { useServerErrors } from "../components/form/useServerErrors";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";


const CODE_TO_FIELD = { WRONG_PASSWORD: "currentPassword" } as const;

const ChangePasswordPage = () => {
  const { signIn } = useAuth();
  const toast = useToast();
  const changePassword = useChangePassword();
  const methods = useForm<changePasswordSchemaData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = methods;
  const { formError, handleServerError } = useServerErrors(setError, CODE_TO_FIELD);

  const onHandleSubmit = (data: changePasswordSchemaData) => {
    
    changePassword.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: (response) => {
          signIn(response); 
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
        <FormProvider {...methods}>
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

            <NewPasswordFields label="סיסמה חדשה" />

            <FormError message={formError} />

            <div className="flex justify-end border-t border-line/15 pt-5">
              <Button type="submit" isLoading={changePassword.isPending} icon={<KeyRound />}>
                החלפת סיסמה
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </>
  );
};

export default ChangePasswordPage;
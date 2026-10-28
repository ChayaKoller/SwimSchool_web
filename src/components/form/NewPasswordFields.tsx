import { useFormContext } from "react-hook-form";
import FormField from "./FormField";
import PasswordField from "./PasswordField";


type NewPasswordValues = { newPassword: string; confirmPassword: string };

export type NewPasswordFieldsProps = {
    label: string;
};


export default function NewPasswordFields({ label }: NewPasswordFieldsProps) {
    const {
        register,
        formState: { errors },
    } = useFormContext<NewPasswordValues>();

    return (
        <>
            <FormField
                label={label}
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

            <FormField label="אימות הסיסמה" required htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
                <PasswordField
                    {...register("confirmPassword")}
                    id="confirmPassword"
                    autoComplete="new-password"
                    invalid={!!errors.confirmPassword}
                    aria-describedby="confirmPassword-description"
                />
            </FormField>
        </>
    );
}
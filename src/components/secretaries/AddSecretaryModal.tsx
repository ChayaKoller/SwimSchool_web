import { FormProvider, useForm } from "react-hook-form"
import { secretaryFormSchema, toCreateSecretaryRequest, type SecretaryFormValues } from "../../api/secretaries/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateSecretary } from "../../api/secretaries/hook"
import { useToast } from "../../context/useToast"
import { useServerErrors } from "../form/useServerErrors"
import Modal from "../ui/Modal"
import FormError from "../form/FormError"
import NewPasswordFields from "../form/NewPasswordFields"
import TextField from "../form/TextField"
import FormField from "../form/FormField"
import { createFieldProps } from "../form/fieldProps"
import Button from "../ui/Button"
import { UserPlus } from "lucide-react"

export type AddSecretaryModalProps = {
    onClose: () => void
}
const CODE_TO_FIELD = { DUPLICATE_EMAIL: "email", DUPLICATE_USER_IDENTITY: "identityNumber" } as const
const FORM_ID = "add-secretary-form"
export default function AddSecretaryModal({ onClose }: AddSecretaryModalProps) {
    const methods = useForm<SecretaryFormValues>({ resolver: zodResolver(secretaryFormSchema), defaultValues: { identityNumber: "", fullName: "", email: "", phone: "", newPassword: "", confirmPassword: "" } })
    const { setError, register, handleSubmit, formState: { errors ,isSubmitting} } = methods
    const fieldProps = createFieldProps(register, errors);
    const create = useCreateSecretary()
    const { formError, handleServerError } = useServerErrors(setError, CODE_TO_FIELD)
    const toast = useToast()
    const onSubmit = async (values: SecretaryFormValues) => {
        try {
            const secretary = await create.mutateAsync(toCreateSecretaryRequest(values));
            toast.success(`${secretary.fullName} נוספה. אפשר למסור לה את האימייל והסיסמה`);
            onClose();
        } catch (error) {
            handleServerError(error);
        }
    };
    return (<Modal
        isOpen
        onClose={onClose}
        title="הוספת מזכירה חדשה"
        footer={
            <>
                <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
                    ביטול
                </Button>
                <Button type="submit" form={FORM_ID} isLoading={isSubmitting} icon={<UserPlus />}>
                    רישום
                </Button>
            </>
        }>
        <FormProvider {...methods}>
            <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
                <FormField required label='ת"ז' htmlFor="identityNumber" error={errors.identityNumber?.message}>
                    <TextField inputMode="numeric" maxLength={9} autoComplete="off" {...fieldProps("identityNumber")} />
                </FormField>

                <FormField required label="שם מלא" htmlFor="fullName" error={errors.fullName?.message}>
                    <TextField autoComplete="off" {...fieldProps("fullName")} />
                </FormField>

                <FormField
                    required
                    label="אימייל"
                    htmlFor="email"
                    error={errors.email?.message}
                    hint="זה שם המשתמש שלה לכניסה למערכת"
                >
                    <TextField type="email" dir="ltr" autoComplete="off" className="text-end" {...fieldProps("email")} />
                </FormField>

                <FormField required label="טלפון" htmlFor="phone" error={errors.phone?.message}>
                    <TextField type="tel" dir="ltr" autoComplete="off" className="text-end" {...fieldProps("phone")} />
                </FormField>

                <NewPasswordFields label="סיסמה ראשונית" />

                <FormError message={formError} />
            </form>
        </FormProvider>
    </Modal>

    )

}
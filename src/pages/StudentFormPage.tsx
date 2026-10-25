import { useNavigate, useParams } from "react-router";
import StudentForm from "../components/students/StudentForm";
import { useCreateStudent, useStudent, useUpdateStudent } from "../api/students/hook";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import { isNotFound } from "../api/apiError";
import ErrorState from "../components/ui/ErrorState";
import PageHeader from "../components/layout/PageHeader";
import { toCreateStudentRequest, toStudentFormValues, toUpdateStudentRequest, type studentFormData } from "../api/students/schema";
import useGoBack from "../lib/useGoBack";
import { useToast } from "../context/useToast";

export default function StudentFormPage() {
    const { id } = useParams();
    const studentId = id === undefined ? undefined : Number(id);
    const isEdit = studentId !== undefined;
    const student = useStudent(studentId);
    const toast = useToast();

    const createStudent = useCreateStudent();
    const updateStudent = useUpdateStudent();
    const navigate = useNavigate();
    const goBack = useGoBack("/students");
    async function handleCreate(values: studentFormData) {
        const created = await createStudent.mutateAsync(toCreateStudentRequest(values));
        toast.success("התלמידה נוספה בהצלחה");
        navigate(`/students/${created.id}`, { replace: true });
    }

    async function handleUpdate(values: studentFormData) {
        await updateStudent.mutateAsync({ id: studentId!, body: toUpdateStudentRequest(values) });
        toast.success("הפרטים נשמרו");
        navigate(`/students/${studentId}`, { replace: true });
    }
    if (isEdit && student.isPending) return <LoadingState />;
    if (isEdit && student.isError) {
        return isNotFound(student.error) ? <EmptyState title="התלמידה לא נמצאה" /> : <ErrorState error={student.error} />;
    }



    return (
        <div className="mx-auto max-w-3xl">
            <PageHeader title={isEdit ? `עריכת תלמידה ${student.data?.fullName}` : "תלמידה חדשה"} />
            <StudentForm
                key={studentId ?? "new"}
                isEdit={isEdit}
                defaultValues={student.data ? toStudentFormValues(student.data) : { isActive: true }}
                onSubmit={isEdit ? handleUpdate : handleCreate}
                onCancel={goBack}
            />
        </div>
    );
}

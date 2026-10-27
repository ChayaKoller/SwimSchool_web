import { ArrowLeftRight, ArrowRight, Pencil, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { isNotFound } from "../api/apiError";
import { useStudent, useUpdateStudent } from "../api/students/hook";
import { studentFormSchema, toStudentFormValues, toUpdateStudentRequest } from "../api/students/schema";
import EnrollModal from "../components/enrollment/EnrollModal";
import PageHeader from "../components/layout/PageHeader";
import StudentGroupsTable from "../components/students/StudentGroupsTable";
import StudentReportsTable from "../components/students/StudentReportsTable";
import TransferStudentModal from "../components/students/TransferStudentModal";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import DetailList from "../components/ui/DetailList";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";
import { ageFrom, formatDate } from "../lib/format";
import { healthFundLabels } from "../lib/labels";
import useGoBack from "../lib/useGoBack";
import type { StudentGroupDto } from "../types/typesDtos";
import PaymentModal from "../components/enrollment/PaymentModal";
import CancelEnrollmentDialog from "../components/enrollment/CancelEnrollmentDialog";
import DeleteStudentDialog from "../components/students/DeleteStudentDialog";

export default function StudentDetailsPage() {
    const { id } = useParams();
    const studentId = Number(id);
    const student = useStudent(studentId);
    const navigate = useNavigate();
    const goBack = useGoBack("/students");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const updateStudent = useUpdateStudent();
    const toast = useToast();
    const [enrollOpen, setEnrollOpen] = useState(false);
    const [payingRow, setPayingRow] = useState<StudentGroupDto | null>(null);
    const [cancelingRow, setCancelingRow] = useState<StudentGroupDto | null>(null);
    const [transferOpen, setTransferOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const { user } = useAuth();
    const isTeacher = user?.role === "Teacher";

    const backButton = (
        <Button variant="ghost" onClick={goBack} icon={<ArrowRight />} className="-ms-3 mb-2 self-start">
            חזרה לרשימה
        </Button>
    );

    if (student.isPending) return <LoadingState label="טוען את פרטי התלמידה" />;

    if (student.isError) {
        return isNotFound(student.error) ? (
            <EmptyState
                title="התלמידה לא נמצאה"
                description="ייתכן שהיא נמחקה או הועברה למורה אחרת."
                action={
                    <Button variant="secondary" onClick={() => navigate("/students")}>
                        לרשימת התלמידות
                    </Button>
                }
            />
        ) : (
            <ErrorState error={student.error} onRetry={() => student.refetch()} />
        );
    }

    const s = student.data;

    const detailItems = [
        { label: "תעודת זהות", value: <span className="tabular-nums">{s.identityNumber}</span> },
        { label: "טלפון", value: <span dir="ltr" className="tabular-nums">{s.phone}</span> },
        { label: "אימייל", value: s.email && <span dir="ltr">{s.email}</span> },
        { label: "תאריך לידה", value: `${formatDate(s.birthDate)} (גיל ${ageFrom(s.birthDate)})` },
        { label: "קופת חולים", value: healthFundLabels[s.healthFund] },
        { label: "המורה האחראית", value: s.responsibleTeacherName },
        { label: "בקשת שיבוץ", value: s.placementRequest },
    ];



    return (
        <div className="flex flex-col">
            {backButton}

            <PageHeader
                title={s.fullName}
                actions={<div className="flex flex-wrap items-center gap-2">
                    <Button variant="secondary" icon={<Pencil />} onClick={() => navigate(`/students/${s.id}/edit`)}>
                        עריכה
                    </Button>
                    <Button
                        icon={<UserPlus />}
                        onClick={() => setEnrollOpen(true)}
                        disabled={!s.isActive}
                    >
                        רישום לקבוצה
                    </Button>
                    {isTeacher && (
                        <Button variant="secondary" icon={<ArrowLeftRight />} onClick={() => setTransferOpen(true)}>
                            העברה למורה אחרת
                        </Button>
                    )}
                    {isTeacher && (
                        <Button variant="secondary" icon={<Trash2 />} onClick={() => setDeleteOpen(true)}>
                            מחיקה
                        </Button>
                    )}
                </div>
                }
            />
            <div className="-mt-3 mb-6 flex flex-wrap items-center gap-2">
                <Badge tone="info">{healthFundLabels[s.healthFund]}</Badge>
                {!s.isActive && <Badge tone="neutral">בארכיון</Badge>}
                {!s.isActive && (
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-page px-4 py-3">
                        <p className="text-sm text-ink/80">התלמידה בארכיון ולא מופיעה ברשימה הרגילה.</p>
                        <Button variant="primary" onClick={() => setConfirmOpen(true)}>
                            החזרה לפעילות
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-8">
                <Card title="פרטים">
                    <DetailList items={detailItems} />
                </Card>


                <StudentGroupsTable
                    groups={s.groups}
                    onUpdatePayment={setPayingRow}
                    onCancel={setCancelingRow}
                    onEnroll={() => setEnrollOpen(true)}
                />
                <StudentReportsTable studentId={s.id} />
                <ConfirmDialog
                    isOpen={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    onConfirm={() => {
                        const values = studentFormSchema.parse({ ...toStudentFormValues(s), isActive: true });
                        updateStudent.mutate(
                            { id: s.id, body: toUpdateStudentRequest(values) },
                            {
                                onSuccess: () => {
                                    toast.success(`${s.fullName} חזרה לפעילות`);
                                    setConfirmOpen(false);
                                },
                            },
                        );
                    }}
                    title="החזרה לפעילות"
                    message={`להחזיר את ${s.fullName} לפעילות? הרישומים לקבוצות שבוטלו בהעברה לארכיון לא חוזרים, ואפשר לרשום אותה מחדש.`}
                    confirmText="החזרה לפעילות"
                    tone="primary"
                    isLoading={updateStudent.isPending}
                />
            </div>
            {enrollOpen && (
                <EnrollModal
                    onClose={() => setEnrollOpen(false)}
                    student={{ id: s.id, fullName: s.fullName }}
                />
            )}
            {transferOpen && (
                <TransferStudentModal
                    onClose={() => setTransferOpen(false)}
                    student={{ id: s.id, fullName: s.fullName }}
                />
            )}
            {payingRow && (
                <PaymentModal
                    onClose={() => setPayingRow(null)}
                    enrollment={payingRow}
                    student={{ id: s.id, fullName: s.fullName }} />
            )}

            {cancelingRow && (
                <CancelEnrollmentDialog
                    onClose={() => setCancelingRow(null)}
                    enrollment={cancelingRow}
                    student={{ id: s.id, fullName: s.fullName }}
                />
            )}
            {deleteOpen && (
                <DeleteStudentDialog
                    onClose={() => setDeleteOpen(false)}
                    student={{ id: s.id, fullName: s.fullName }}
                    isOpen
                />
            )}


        </div>
    );
}
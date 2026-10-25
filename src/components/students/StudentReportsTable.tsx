import type { ReportDto } from "../../types/typesDtos";
import { useStudentReports } from "../../api/students/hook";
import { formatDateTime, formatMoney } from "../../lib/format";
import { healthFundLabels, treatmentTypeLabels } from "../../lib/labels";
import DataTable, { type Column } from "../ui/DataTable";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";
import EmptyState from "../ui/EmptyState";

type StudentReportsTableProps = {
  studentId: number;
};

const columns: Column<ReportDto>[] = [
  { key: "issuedAt", header: "הונפק", render: (r) => <span className="tabular-nums">{formatDateTime(r.issuedAt)}</span> },
  { key: "payer", header: "משלם", render: (r) => r.insuranceCompany ?? healthFundLabels[r.healthFund] },
  { key: "treatmentType", header: "סוג", render: (r) => treatmentTypeLabels[r.treatmentType] },
  { key: "count", header: "טיפולים", render: (r) => <span className="tabular-nums">{r.lessonDates.length}</span> },
  {
    key: "totalAmount",
    header: 'סה"כ',
    render: (r) => <span className="font-semibold text-line tabular-nums">{formatMoney(r.totalAmount)}</span>,
  },
];

export default function StudentReportsTable({ studentId }: StudentReportsTableProps) {
  const reports = useStudentReports(studentId);

  function renderContent() {
    if (reports.isPending) return <LoadingState label="טוען דוחות" />;

    if (reports.isError) return <ErrorState error={reports.error} onRetry={() => reports.refetch()} />;

    if (reports.data.length === 0) return <EmptyState title="עוד לא הופקו דוחות" />;

    return <DataTable columns={columns} rows={reports.data} getRowKey={(r) => r.id} />;
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-ink">דוחות</h2>
      {renderContent()}
    </section>
  );
}
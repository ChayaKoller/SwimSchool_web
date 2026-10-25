import { Link } from "react-router";
import type { StudentGroupDto } from "../../types/typesDtos";
import { formatMoney } from "../../lib/format";
import { seasonLabels } from "../../lib/labels";
import DataTable, { type Column } from "../ui/DataTable";
import Badge from "../ui/Badge";
import EmptyState from "../ui/EmptyState";

type StudentGroupsTableProps = {
  groups: StudentGroupDto[];
};

const balanceOf = (g: StudentGroupDto) => g.amountDue - g.amountPaid;

const columns: Column<StudentGroupDto>[] = [
  {
    key: "groupName",
    header: "קבוצה",
    render: (g) => (
      <Link
        to={`/groups/${g.groupId}`}
        onClick={(e) => e.stopPropagation()}
        className="font-semibold text-primary-text underline-offset-2 hover:underline"
      >
        {g.groupName}
      </Link>
    ),
  },
  { key: "season", header: "עונה ושנה", render: (g) => `${seasonLabels[g.season]} ${g.year}` },
  { key: "amountDue", header: "לתשלום", render: (g) => <span className="tabular-nums">{formatMoney(g.amountDue)}</span> },
  { key: "amountPaid", header: "שולם", render: (g) => <span className="tabular-nums">{formatMoney(g.amountPaid)}</span> },
  {
    key: "balance",
    header: "יתרה",
    render: (g) =>
      balanceOf(g) === 0 ? (
        <Badge tone="success">שולם ✓</Badge>
      ) : (
        <span className="font-semibold text-danger tabular-nums">{formatMoney(balanceOf(g))}</span>
      ),
  },
];

export default function StudentGroupsTable({ groups }: StudentGroupsTableProps) {
  const totalOwed = groups.reduce((sum, g) => sum + balanceOf(g), 0);

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-ink">קבוצות ותשלומים</h2>

      {groups.length === 0 ? (
        <EmptyState title="התלמידה לא רשומה לאף קבוצה" />
      ) : (
        <DataTable
          columns={columns}
          rows={groups}
          getRowKey={(g) => g.enrollmentId}
          footer={
            <>
              סה"כ חוב:
              <span className={totalOwed === 0 ? "text-success" : "text-danger tabular-nums"}>
                {totalOwed === 0 ? "אין חוב ✓" : formatMoney(totalOwed)}
              </span>
            </>
          }
        />
      )}
    </section>
  );
}
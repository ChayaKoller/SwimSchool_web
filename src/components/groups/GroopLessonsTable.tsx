import { Pencil, Trash2 } from "lucide-react";
import { formatLessonTime, isFuture } from "../../lib/format";
import type { LessonDto } from "../../types/typesDtos";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import DataTable, { type Column } from "../ui/DataTable";

export type GroupLessonsTableProps = {
    lessons: LessonDto[];
    canManage: boolean;
    onMove: (lesson: LessonDto) => void;
    onDelete: (lesson: LessonDto) => void;
};

type BadgeTone = "success" | "warning" | "neutral";


function lessonStatus(lesson: LessonDto): { tone: BadgeTone; label: string } {
    if (isFuture(lesson.startTime)) return { tone: "neutral", label: "עתידי" };
    if (lesson.tookPlace) return { tone: "success", label: "התקיים" };
    return { tone: "warning", label: "טרם סומן" };
}


const baseColumns: Column<LessonDto>[] = [
    {
        key: "startTime",
        header: "מועד",
        render: (l) => <span className="whitespace-nowrap text-line tabular-nums">{formatLessonTime(l.startTime)}</span>,
    },
    {
        key: "isMakeup",
        header: "סוג",
        render: (l) => (l.isMakeup ? <Badge tone="info">השלמה</Badge> : <span className="text-slate-500">רגיל</span>),
    },
    {
        key: "status",
        header: "מצב",
        render: (l) => {
            const status = lessonStatus(l);
            return <Badge tone={status.tone}>{status.label}</Badge>;
        },
    },
];


function actionsColumn(onMove: (lesson: LessonDto) => void, onDelete: (lesson: LessonDto) => void,): Column<LessonDto> {
    return {
        key: "actions",
        header: "פעולות",
        render: (l) =>
            l.tookPlace ? null : (
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        icon={<Pencil />}
                        aria-label={`הזזת השיעור של ${formatLessonTime(l.startTime)}`}
                        onClick={() => onMove(l)}
                        className="min-h-8 px-2.5"
                    >
                        הזזה
                    </Button>
                    <Button
                        variant="ghost"
                        icon={<Trash2 />}
                        aria-label={`מחיקת השיעור של ${formatLessonTime(l.startTime)}`}
                        onClick={() => onDelete(l)}
                        className="min-h-8 px-2.5 text-danger hover:bg-danger/10"
                    >
                        מחיקה
                    </Button>
                </div>
            ),
    };
}
export default function GroupLessonsTable({ lessons, canManage, onMove, onDelete }: GroupLessonsTableProps) {
    const columns = canManage ? [...baseColumns, actionsColumn(onMove, onDelete)] : baseColumns;

    return (
        <DataTable columns={columns} rows={lessons} getRowKey={(l) => l.lessonId} />
    )

}

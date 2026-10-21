import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import Modal from "../components/ui/Modal";
import Spinner from "../components/ui/Spinner";
import { useToast } from "../context/useToast";
 
export default function DevPlaygroundPage() {
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
 
  function fakeSave() {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("נשמר בהצלחה");
    }, 1500);
  }
 
  function fakeDelete() {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsConfirmOpen(false);
      toast.success("נמחק");
    }, 1500);
  }
 
  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-3xl font-black text-ink">עמוד ניסיון</h1>
 
      <Card title="כפתורים">
        <div className="flex flex-wrap gap-3">
          <Button icon={<Plus />} onClick={fakeSave} isLoading={isSaving}>
            שמירה
          </Button>
          <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
            פתיחת חלון
          </Button>
          <Button variant="danger" icon={<Trash2 />} onClick={() => setIsConfirmOpen(true)}>
            מחיקה
          </Button>
          <Button variant="ghost" disabled>
            נעול
          </Button>
        </div>
      </Card>
 
      <Card title="הודעות קופצות">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => toast.success("התלמידה נרשמה")}>
            הצלחה
          </Button>
          <Button variant="secondary" onClick={() => toast.error("הקבוצה מלאה")}>
            שגיאה
          </Button>
          <Button variant="secondary" onClick={() => toast.info("השיעור הוזז")}>
            מידע
          </Button>
        </div>
      </Card>
 
      <Card title="תגיות וטעינה" actions={<Badge tone="info">כותרת עם פעולה</Badge>}>
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="success">פעילה</Badge>
          <Badge tone="warning">לא שילמה</Badge>
          <Badge tone="danger">בוטלה</Badge>
          <Badge tone="info">מכבי</Badge>
          <Badge>בארכיון</Badge>
          <span className="text-primary">
            <Spinner size="sm" />
          </span>
          <Spinner />
        </div>
      </Card>
 
      <LoadingState label="טוען תלמידות" />
 
      <EmptyState
        title="אין תלמידות עדיין"
        description="כשתירשם התלמידה הראשונה, היא תופיע כאן."
        action={<Button icon={<Plus />}>רישום תלמידה</Button>}
      />
 
      <ErrorState error={new Error("בדיקה")} onRetry={() => toast.info("ניסיון חוזר")} />
 
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="חלון לדוגמה"
        footer={<Button onClick={() => setIsModalOpen(false)}>סגירה</Button>}
      >
        <p>זה התוכן של החלון. אפשר לסגור ב-Esc, ב-X או בכפתור למטה.</p>
      </Modal>
 
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={fakeDelete}
        title="מחיקת תלמידה"
        message="בטוחה שאת רוצה למחוק את התלמידה? אי אפשר לבטל את זה."
        confirmText="מחיקה"
        isLoading={isSaving}
      />
    </main>
  );
}
import { Link  } from "react-router";
import EmptyState from "../components/ui/EmptyState";

export default function NotFoundPage() {
  return (
    <EmptyState
      title="העמוד לא נמצא"
      description="ייתכן שהכתובת שגויה, או שהעמוד הוסר."
      action={<Link to="/">חזרה לדף הבית</Link>}
    />
  );
}
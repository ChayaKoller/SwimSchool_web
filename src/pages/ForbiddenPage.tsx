import { Link  } from "react-router";
import EmptyState from "../components/ui/EmptyState";

export default function ForbiddenPage() {
  return (
    <EmptyState
      title="עמוד זה הוא למורה בלבד"
      description="אין לך הרשאה."
      action={<Link to="/">חזרה לדף הבית</Link>}
    />
  );
}
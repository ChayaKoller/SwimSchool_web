
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

export default function ErrorPage() {
  return (
   
    <EmptyState
      title="שגיאה בטעינה "
      description="מרענן"
      
      action={<Button onClick={()=>window.location.reload()}>חזרה לדף הבית</Button>}
    />
    
  );
}
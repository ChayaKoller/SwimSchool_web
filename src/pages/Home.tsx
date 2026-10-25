import PageHeader from "../components/layout/PageHeader";
import { useAuth } from "../context/useAuth"

export default function Home(){
const {user}=useAuth();

    return(
        <><PageHeader title={user?.fullName ?? ""}></PageHeader></>
    

   )


}
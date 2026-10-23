
import { RouterProvider } from "react-router";
import DevPlaygroundPage from "./pages/DevPlaygroundPage";
import { router } from "./routes/router";

export default function App() {
  return  <RouterProvider router={router}/>
}

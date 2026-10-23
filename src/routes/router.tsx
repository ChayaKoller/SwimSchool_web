import { LogIn } from "lucide-react";
import { createBrowserRouter } from "react-router";


import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import SchedulePage from "../pages/SchedulePage.tsx        ";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import NotFoundPage from "../pages/NotFoundPage";
import ErrorPage from "../pages/ErrorPage";

import AppLayout from "../components/layout/AppLayout";
import RequireAuth from "./RequireAuth";
import RequireRole from "./RequireRole";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/account/password",
            element: <ChangePasswordPage />,
          },
          {
            element: <RequireRole role="Teacher" />,
            children: [
              {
                path: "/schedule",
                element: <SchedulePage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
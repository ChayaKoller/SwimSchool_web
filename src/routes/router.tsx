
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
import StudentsPage from "../pages/StudentPage";
import StudentFormPage from "../pages/StudentFormPage";
import StudentDetailsPage from "../pages/StudentDetailsPage";
import GroupsPage from "../pages/GroupsPage";
import GroupFormPage from "../pages/GroupPageForm";
import GroupDetailsPage from "../pages/GroupDetailsPage";

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
          {
            path: "/students",
            element: <StudentsPage />

          },
          {
            path: "/students/new",
            element: <StudentFormPage />

          },
          {
            path: "/students/:id",
            element: <StudentDetailsPage />

          },
          {
            path: "/students/:id/edit",
            element: <StudentFormPage />
          },
          { path: "groups", element: <GroupsPage /> },
          { path: "groups/new", element: <GroupFormPage /> },
          { path: "groups/:id", element: <GroupDetailsPage /> },
          { path: "groups/:id/edit", element: <GroupFormPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
import ProtectedRoute from "@/components/shared/protected-route";
import EscalasPage from "@/pages/escalas";
import MembrosPage from "@/pages/membros";
import NotFound from "@/pages/not-found";
import RepertorioPage from "@/pages/repertorio";
import { Suspense, lazy } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";

const DashboardLayout = lazy(
  () => import("@/components/layout/dashboard-layout")
);
const SignInPage = lazy(() => import("@/pages/auth/signin"));
const SignUpPage = lazy(() => import("@/pages/auth/signup"));
const Home = lazy(() => import("@/pages/home"));

export default function AppRouter() {
  const dashboardRoutes = [
    {
      path: "/",
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          element: (
            <ProtectedRoute>
              <EscalasPage />
            </ProtectedRoute>
          ),
          index: true,
        },
        {
          path: "/membros",
          element: (
            <ProtectedRoute>
              <MembrosPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/repertorio",
          element: (
            <ProtectedRoute>
              <RepertorioPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ];

  const publicRoutes = [
    {
      path: "/home",
      element: <Home />,
      index: true,
    },
    {
      path: "/login",
      element: <SignInPage />,
    },
    {
      path: "/cadastrar",
      element: <SignUpPage />,
    },
    {
      path: "/404",
      element: <NotFound />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ];

  const routes = useRoutes([...dashboardRoutes, ...publicRoutes]);

  return routes;
}

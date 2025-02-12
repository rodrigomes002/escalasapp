import { Outlet } from "react-router";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Container } from "@mui/material";

export default function Layout() {
  return (
    <DashboardLayout>
      <Container>
        <Outlet />
      </Container>
    </DashboardLayout>
  );
}

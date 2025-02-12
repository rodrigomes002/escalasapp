import Box from "@mui/material/Box";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider, type Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import Escalas from "./Escalas";

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Pricipal",
  },
  {
    segment: "dashboard",
    title: "Minhas escalas",
    icon: <DashboardIcon />,
  },
  {
    kind: "divider",
  },
  {
    segment: "integrations",
    title: "Repertório",
    icon: <LayersIcon />,
  },
  {
    kind: "header",
    title: "Admin",
  },
  {
    segment: "reports",
    title: "Cadastros",
    icon: <BarChartIcon />,
    children: [
      {
        segment: "sales",
        title: "Membros",
        icon: <DescriptionIcon />,
      },
      {
        segment: "traffic",
        title: "Usuários",
        icon: <DescriptionIcon />,
      },
    ],
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }: { pathname: string }) {
  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          pb: 2,
        }}
      >
        <Escalas></Escalas>
      </Box>
    </Box>
  );
}

interface DemoProps {
  window?: () => Window;
}

export default function DashboardLayoutBasic(props: DemoProps) {
  const { window } = props;

  const router = useDemoRouter("/dashboard");

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // preview-start
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}

import { Outlet } from "react-router";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import type { Navigation } from "@toolpad/core/AppProvider";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import GroupIcon from "@mui/icons-material/Group";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Principal",
  },
  {
    title: "Escalas",
    icon: <CalendarMonthIcon />,
  },
  {
    segment: "members",
    title: "Membros",
    icon: <GroupIcon />,
  },
  {
    segment: "repertorio",
    title: "Repertório",
    icon: <LibraryMusicIcon />,
  },
];

const BRANDING = {
  // logo: <img src="https://mui.com/static/logo.png" alt="Escalas logo" />,
  title: "Escalas",
};

export default function App() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />
    </ReactRouterAppProvider>
  );
}

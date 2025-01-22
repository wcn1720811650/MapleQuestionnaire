import * as React from 'react';
import { extendTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import StarIcon from '@mui/icons-material/Star';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import AllQuestionnaires from "../component/questionnaire/allQuestionnaires"
import StarQuestionnaires from "../component/questionnaire/starQuestionnaires"
import RecycleBin from "../component/questionnaire/recycleBin"
const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'allQuestionnaires',
    title: 'All Questionnaires',
    icon: <AssignmentIcon />,
    path: '/allQuestionnaires',
  },
  {
    segment: 'starQuestionnaires',
    title: 'Star Questionnaires',
    icon: <StarIcon />,
  },
  {
    segment: 'recycleBin',
    title: 'Recycle Bin',
    icon: <StarIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'sales',
        title: 'Sales',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'traffic',
        title: 'Traffic',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'integrations',
    title: 'Integrations',
    icon: <LayersIcon />,
  },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
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

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}


export default function DashboardLayoutBasic(props) {
  const { window } = props;

  const router = useDemoRouter('/allQuestionnaires');

  // Remove this const when copying and pasting into your project.
  const demoWindow = window ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <PageContainer>
            {router.pathname === '/allQuestionnaires' && <AllQuestionnaires />}
            {router.pathname === '/starQuestionnaires' && <StarQuestionnaires />}
            {router.pathname === '/recycleBin' && <RecycleBin />}

        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}

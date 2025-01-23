import * as React from 'react';
import { extendTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import BarChartIcon from '@mui/icons-material/BarChart';
import StarIcon from '@mui/icons-material/Star';
import CreateIcon from '@mui/icons-material/Create';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import Avatar from '@mui/material/Avatar';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import AllQuestionnaires from "../component/questionnaire/allQuestionnaires"
import StarQuestionnaires from "../component/questionnaire/starQuestionnaires"
import RecycleBin from "../component/questionnaire/recycleBin"
import CreateQuestionnaire from "../component/questionnaire/createQuestionnaire"
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Logo from '../images/logo/logo.jpg'
import Group from "../component/management/group";
import Customer from "../component/management/customer";
import Report from '../component/analytics/report';
const NAVIGATION = [
  {
    kind: 'header',
    title: 'Actions',
  },
  {
    segment: 'createQuestionnaire',
    title: 'Create Questionnaire',
    icon: <CreateIcon />,
  },
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
    icon: <DeleteIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Management',
  },
  {
    segment: 'customer',
    title: 'My Customers',
    icon: <PersonIcon />,
  },
  {
    segment: 'group',
    title: 'My Groups',
    icon: <GroupIcon />,
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'report',
    title: 'Reports',
    icon: <BarChartIcon />,
  },
 
];

const demoTheme = extendTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
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

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

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

function CustomAppTitle() {
  return (
    <div>
      <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
        <img 
          src={Logo}
          style={{ width: '100%', maxWidth: 50 }}
          alt='logo'
        >
        </img>
        <div> Maple Questionnaire</div>
        <div style={{marginLeft:"1180px"}}>
          <Avatar alt="" src="" />
        </div>
      </div>
    </div>
  );
}


export default function DashboardLayoutBasic(props) {
  const { window } = props;

  const router = useDemoRouter('/allQuestionnaires');

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout
        slots={{
          appTitle: CustomAppTitle,
        }}
      >
        <PageContainer>
            {router.pathname === '/allQuestionnaires' && <AllQuestionnaires />}
            {router.pathname === '/starQuestionnaires' && <StarQuestionnaires />}
            {router.pathname === '/recycleBin' && <RecycleBin />}
            {router.pathname === '/createQuestionnaire' && <CreateQuestionnaire />}
            {router.pathname === '/group' && <Group />}
            {router.pathname === '/customer' && <Customer />}
            {router.pathname === '/report' && <Report />}

        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}

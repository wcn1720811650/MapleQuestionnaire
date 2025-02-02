import * as React from 'react';
import {useState, useEffect } from 'react'; 
import { extendTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import BarChartIcon from '@mui/icons-material/BarChart';
import StarIcon from '@mui/icons-material/Star';
import CreateIcon from '@mui/icons-material/Create';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import AllQuestionnaires from "../component/questionnaire/allQuestionnaires";
import StarQuestionnaires from "../component/questionnaire/starQuestionnaires";
import RecycleBin from "../component/questionnaire/recycleBin";
import CreateQuestionnaire from "../component/questionnaire/createQuestionnaire";
import Logo from '../images/logo/logo.jpg';
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

const fetchUserInfo = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  try {
    const response = await fetch('/api/user-info', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

function CustomAppTitle() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userInfo, setUserInfo] = useState({ email: 'Loading...', role: 'Normal User' }); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo().then((data) => {
      if (data) {
        setUserInfo(data); 
      }
      setIsLoading(false); 
    });
  }, []);

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      localStorage.removeItem('token');

      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <img
          src={Logo}
          style={{ width: '100%', maxWidth: 50 }}
          alt='logo'
        />
        <div> Maple Questionnaire</div>
        <div style={{ marginLeft: "1180px" }}>
          <IconButton
            onMouseEnter={handleMouseEnter}
            sx={{ p: 0 }}
          >
            <Avatar alt="User Avatar" src={userInfo.avatar} />
          </IconButton>

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleMouseLeave}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{
              mt: 1,
              '& .MuiPaper-root': {
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                minWidth: '200px',
                padding: '8px',
              },
            }}
            disableRestoreFocus
          >
            <Box onMouseLeave={handleMouseLeave}>
              <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {userInfo.email}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {userInfo.name}
                </Typography>
              </Box>

              <Box sx={{ p: 1 }}>
                <Button
                  fullWidth
                  sx={{ justifyContent: 'flex-start', color: 'text.primary' }}
                >
                  Information
                </Button>
                <Button
                  fullWidth
                  sx={{ justifyContent: 'flex-start', color: 'error.main' }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </Popover>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayoutBasic() {

  const router = useDemoRouter('/allQuestionnaires');
  const demoWindow = typeof window !== 'undefined' ? window : undefined;

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
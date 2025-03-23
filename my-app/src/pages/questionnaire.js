import * as React from 'react';
import {useState, useEffect } from 'react'; 
import { extendTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import BarChartIcon from '@mui/icons-material/BarChart';
import StarIcon from '@mui/icons-material/Star';
import CreateIcon from '@mui/icons-material/Create';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import GroupIcon from '@mui/icons-material/Group';
import { Modal } from '@mui/material';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import AllQuestionnaires from "../component/questionnaire/myQuestionnaires";
import StarQuestionnaires from "../component/questionnaire/starQuestionnaires";
import RecycleBin from "../component/questionnaire/recycleBin";
import CreateQuestionnaire from "../component/questionnaire/createQuestionnaire";
import PublicQuestionnaires from '../component/questionnaire/publicQuestionnaires';
import MyGroup from '../component/management/group/myGroup';
import Logo from '../images/logo/logo.jpg';
import Customer from "../component/management/customer/customer";
import Report from '../component/analytics/report';
import Chatbot from '../component/Chatbot'; 
import CreateGroup from '../component/management/group/createGroup';
import UserQuestionnaire from '../component/questionnaire/UserQuestionnaires'
import QuestionnaireQuiz from "../component/questionnaire/QuestionnaireQuiz"
import MySuggestions from '../component/management/MySuggestions';

export default function DashboardLayoutBasic() {

  const demoWindow = typeof window !== 'undefined' ? window : undefined;
  const [role, setRole] = useState('');
  
  const router = useDemoRouter('/publicQuestionnaires')


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role);
    }
  }, []);
const NAVIGATION = [
  ...(role === 'manager' ? [
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
    segment: 'myQuestionnaires',
    title: 'My Questionnaires',
    icon: <AssignmentIcon />,
    path: '/myQuestionnaires',
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
  ] : []),
    {
    segment: 'publicQuestionnaires',
    title: 'Public Questionnaires',
    icon: <LibraryBooksIcon />,
    },

  ...(role !== 'manager' ? [
    {
      segment: 'userQuestionnaires',
      title: 'User Questionnaires',
      icon: <LibraryBooksIcon />,
    }
  ] : []),
  {
    kind: 'divider',
  },
  ...(role === 'manager' ? [
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
    segment: 'createGroup',
    title: 'Create Groups',
    icon: <GroupAddIcon />,
  },
  {
    segment: 'myGroup',
    title: 'My Groups',
    icon: <GroupIcon />,
  },
  {
    segment:'mySuggestions',
    title: 'My Suggestions',
    icon: <BarChartIcon />,
  },
  ]: []),
  ...(role === 'user' ? [
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'report',
    title: 'Reports',
    icon: <BarChartIcon />,
  },
  ]: []),
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
  const [userInfo, setUserInfo] = useState({ email: 'Loading...', role: 'Normal User', name: '', avatar: '', phoneNumber: '' }); 
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
                  onClick={handleOpenModal}
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
          <Modal
            open={isModalOpen} 
            onClose={handleCloseModal} 
            aria-labelledby="user-info-modal"
            aria-describedby="user-info-modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: '8px',
              }}
            >
              <Typography variant="h6" id="user-info-modal" sx={{ mb: 2 }}>
                User Information
              </Typography>
              <Typography variant="body1" id="user-info-modal-description">
                <strong>Email:</strong> {userInfo.email}
              </Typography>
              <Typography variant="body1">
                <strong>Name:</strong> {userInfo.name}
              </Typography>
              <Typography variant="body1">
                <strong>Role:</strong> {userInfo.role}
              </Typography>
              <Typography variant="body1">
              <strong>Phone:</strong> {userInfo.phoneNumber || 'N/A'}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleCloseModal}>Close</Button>
              </Box>
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
}


  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >

      <Chatbot />

      <DashboardLayout
        slots={{
          appTitle: CustomAppTitle,
        }}
      >
        <PageContainer>
          {router.pathname === '/myQuestionnaires' && <AllQuestionnaires />}
          {router.pathname === '/starQuestionnaires' && <StarQuestionnaires />}
          {router.pathname === '/recycleBin' && <RecycleBin />}
          {router.pathname === '/createQuestionnaire' && <CreateQuestionnaire />}
          {router.pathname === '/publicQuestionnaires' && <PublicQuestionnaires />}
          {router.pathname === '/createGroup' && <CreateGroup />}
          {router.pathname === '/customer' && <Customer role={role} />}
          {router.pathname === '/report' && <Report />}
          {router.pathname === '/myGroup' && <MyGroup />}
          {router.pathname === '/userQuestionnaires' && <UserQuestionnaire />}
          {router.pathname === '/quiz/:id' && <QuestionnaireQuiz />}
          {router.pathname === '/mySuggestions' && <MySuggestions />}

        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
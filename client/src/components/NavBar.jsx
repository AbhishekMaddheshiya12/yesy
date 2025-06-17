import React, { useState } from 'react';
import { 
  Box, Button, IconButton, Paper, Typography, Drawer, 
  List, ListItem, ListItemIcon, ListItemText, Divider, 
  Avatar, useTheme, useMediaQuery 
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  Code as CodeIcon,
  Forum as DiscussIcon,
  Info as AboutUsIcon,
  ExitToApp as LogoutIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { userExist } from '../redux/reducers/auth';
import image from '../assets/Logo.png';

function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogOut = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/user/logout', { withCredentials: true });
      if (data.success) {
        dispatch(userExist(false));
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { text: 'Problems', icon: <CodeIcon />, path: '/home' },
    { text: 'Discuss', icon: <DiscussIcon />, path: '/discuss' },
    { text: 'About Us', icon: <AboutUsIcon />, path: '/aboutUs' },
    { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
    { text: 'Logout', icon: <LogoutIcon />, action: handleLogOut }
  ];

  const drawer = (
    <Box 
      sx={{ 
        width: 250,
        background: 'white',
        height: '100%',
        zIndex: 1000
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img 
          src={image} 
          alt="Logo" 
          style={{ 
            width: 40, 
            height: 40,
            borderRadius: '50%',
            marginRight: 10,
            border: '2px solid #e94560'
          }} 
        />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
          CodeHub
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      <List>
        {navItems.map((item, index) => (
          <React.Fragment key={item.text}>
            <ListItem 
              button 
              onClick={() => {
                item.action ? item.action() : navigate(item.path);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon sx={{ color: 'black',fontWeight: 'bold' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText  sx={{color: 'black',fontWeight: 'bold' }}
                primary={item.text} 
              />
            </ListItem>
            {index < navItems.length - 1 && <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 1300 }}>
      <Paper 
        elevation={4} 
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 20px',
          borderRadius: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={image} 
            alt="Logo" 
            style={{ 
              width: 32, 
              height: 32,
              marginRight: 10,
              cursor: 'pointer',
            }} 
            onClick={() => navigate('/')}
          />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'white',
              cursor: 'pointer',
              display: { xs: 'none', md: 'block' }
            }}
            onClick={() => navigate('/')}
          >
            CodeHub
          </Typography>
        </Box>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: '5px', alignItems: 'center' }}>
          {navItems.slice(0, -1).map((item) => (
            <Button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                color: 'black',
                fontWeight: 'medium',
                textTransform: 'none',
                fontSize: '0.9rem',
                '&:hover': {
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease',
                minWidth: 'auto',
                px: 2
              }}
              startIcon={isMobile ? null : item.icon}
            >
              {item.text}
            </Button>
          ))}
          <IconButton
            onClick={handleLogOut}
            sx={{
              color: 'black',
              '&:hover': {
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>


        <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              color: 'black',
              '&:hover': {
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Paper>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box',
            width: 250,
            borderRight: 'none'
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default NavBar;
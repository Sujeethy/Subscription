import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

const NavbarContainer = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#fff',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  borderBottom: '1px solid #ccc',
}));

const NavbarButton = styled(Button)(({ theme }) => ({
  color: '#000',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
}));

const Navbar = () => {
  return (
    <NavbarContainer position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: 'block', md: 'none' }, color: '#000' }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            <NavbarButton><Link to="/">Subscriptions</Link></NavbarButton>
            <NavbarButton><Link to="/report">Reports</Link></NavbarButton>
            <NavbarButton><Link>Add Customer</Link></NavbarButton>
            <NavbarButton><Link>Add Products</Link></NavbarButton>
          </Box>
          <Box sx={{ display: { xs: 'block', md: 'none' }, flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#000' }}>
              Navbar
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </NavbarContainer>
  );
};

export default Navbar;

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
} from '@mui/material';
import csLogo from '../assets/cslogo.svg';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = () => {

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: '#fafafa',
        color: 'black',
        borderBottom: '1px solid #e0e0e0',
        minHeight: 48,
        justifyContent: 'center',
      }}
    >
      <Toolbar sx={{ minHeight: 48, px: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component="img" src={csLogo} alt="Creditsafe Logo" sx={{ height: 36, width: 'auto', mr: 1 }} />
          <Box sx={{ ml: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: '#222',
                fontWeight: 400,
                fontSize: 18,
                lineHeight: 1.1,
              }}
            >
              Data<br />Studio
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#fff',
              borderRadius: 1,
              px: 1,
              py: 0.5,
              boxShadow: 'none',
              fontSize: 14,
              fontWeight: 500,
              border: '1px solid #e0e0e0',
            }}
          >
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                fontSize: 16,
                mr: 0.5,
                fontWeight: 700,
                fontFamily: 'monospace',
                background: '#eee',
                borderRadius: 0.5,
                px: 0.5,
              }}
            >
              A
            </Box>
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                fontSize: 16,
                fontWeight: 700,
                fontFamily: 'monospace',
                background: '#eee',
                borderRadius: 0.5,
                px: 0.5,
                ml: 0.2,
              }}
            >
              文
            </Box>
            <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
              English (UK)
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;



import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import type { ChatMessage } from '../store/chatSlice';
import { addMessage } from '../store/chatSlice';
import { v4 as uuidv4 } from 'uuid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { fetchBotReply } from '../services/chatbotService';
import { useTheme } from '@mui/material/styles';

const ChatPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 370, height: 520 });
  const popupRef = useRef<HTMLDivElement>(null);
  const messages = useSelector((state: RootState) => state.chat.messages);
  const dispatch = useDispatch<AppDispatch>();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  // Resizing logic
  const isResizing = useRef<{ type: null | 'left' | 'top' | 'corner', startX: number, startY: number, startW: number, startH: number }>({ type: null, startX: 0, startY: 0, startW: 0, startH: 0 });

  const onMouseDown = (type: 'left' | 'top' | 'corner') => (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = {
      type,
      startX: e.clientX,
      startY: e.clientY,
      startW: dimensions.width,
      startH: dimensions.height,
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isResizing.current.type) return;
    let newWidth = dimensions.width;
    let newHeight = dimensions.height;
    if (isResizing.current.type === 'left' || isResizing.current.type === 'corner') {
      const dx = isResizing.current.startX - e.clientX;
      newWidth = Math.min(Math.max(isResizing.current.startW + dx, 320), 600);
    }
    if (isResizing.current.type === 'top' || isResizing.current.type === 'corner') {
      const dy = isResizing.current.startY - e.clientY;
      newHeight = Math.min(Math.max(isResizing.current.startH + dy, 420), 700);
    }
    setDimensions({ width: newWidth, height: newHeight });
  };

  const onMouseUp = () => {
    isResizing.current.type = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      text: input,
    };
    dispatch(addMessage(userMsg));
    setInput('');
    setLoading(true);
    try {
      const botText = await fetchBotReply(input);
      const botMsg: ChatMessage = {
        id: uuidv4(),
        sender: 'bot',
        text: botText,
      };
      dispatch(addMessage(botMsg));
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    if (messages.length === 0) {
      const defaultMsg: ChatMessage = {
        id: uuidv4(),
        sender: 'bot',
        text: 'Hello, how may I help you?',
      };
      dispatch(addMessage(defaultMsg));
    }
  };

  // Animation styles
  const popupAnimation = {
    opacity: open ? 1 : 0,
    transform: open ? 'translateY(0)' : 'translateY(40px)',
    transition: 'opacity 0.4s cubic-bezier(.4,1.3,.5,1), transform 0.4s cubic-bezier(.4,1.3,.5,1)',
    pointerEvents: open ? 'auto' : 'none',
  };

  if (!open) {
    return (
      <button
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: theme.palette.secondary.main,
          color: 'white',
          border: 'none',
          borderRadius: 24,
          width: 56,
          height: 56,
          fontSize: 28,
          cursor: 'pointer',
          zIndex: 1300,
          boxShadow: '0 4px 16px rgba(228,31,19,0.15)',
          transition: 'background 0.2s, box-shadow 0.2s, transform 0.2s',
          outline: 'none',
        }}
        onClick={handleOpen}
        onMouseOver={e => (e.currentTarget.style.background = theme.palette.secondary.dark)}
        onMouseOut={e => (e.currentTarget.style.background = theme.palette.secondary.main)}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        aria-label="Open chatbot"
      >
        <SmartToyIcon style={{ color: 'white', fontSize: 32, verticalAlign: 'middle' }} />
      </button>
    );
  }

  return (
    <Box
      ref={popupRef}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: dimensions.width,
        height: dimensions.height,
        minWidth: 320,
        minHeight: 420,
        maxWidth: 600,
        maxHeight: 700,
        bgcolor: 'background.paper',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        borderRadius: 4,
        border: `1.5px solid ${theme.palette.grey[200]}`,
        zIndex: 1300,
        p: 0,
        display: 'flex',
        flexDirection: 'column',
        ...popupAnimation,
        overflow: 'hidden',
        userSelect: isResizing.current.type ? 'none' : 'auto',
      }}
    >
      {/* Custom resize handles */}
      <Box onMouseDown={onMouseDown('left')} sx={{ position: 'absolute', left: 0, top: 16, bottom: 16, width: 8, cursor: 'ew-resize', zIndex: 1400, background: 'transparent' }} />
      <Box onMouseDown={onMouseDown('top')} sx={{ position: 'absolute', top: 0, left: 16, right: 16, height: 8, cursor: 'ns-resize', zIndex: 1400, background: 'transparent' }} />
      <Box onMouseDown={onMouseDown('corner')} sx={{ position: 'absolute', top: 0, left: 0, width: 16, height: 16, cursor: 'nwse-resize', zIndex: 1400, background: 'transparent' }} />
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 0,
        background: `linear-gradient(90deg, ${theme.palette.secondary.main} 60%, ${theme.palette.secondary.light} 100%)`,
        color: theme.palette.secondary.contrastText,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        py: 1.2,
        px: 2,
        position: 'relative',
        boxShadow: '0 2px 8px rgba(228,31,19,0.10)',
        minHeight: 54,
      }}>
        <SmartToyIcon sx={{ color: theme.palette.secondary.contrastText, fontSize: 28, mr: 1 }} />
        <Box fontWeight="bold" sx={{ flex: 1, textAlign: 'center', fontSize: 21, letterSpacing: 1.2 }}>Chatbot</Box>
        <IconButton size="small" onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: theme.palette.secondary.contrastText, opacity: 0.7, '&:hover': { opacity: 1 } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      {/* Chat messages */}
      <List sx={{
        flex: 1,
        minHeight: 0,
        maxHeight: '100%',
        overflowY: 'auto',
        mb: 0,
        px: 2,
        pt: 2,
      }}>
        {messages.map((msg) => (
          <ListItem key={msg.id} alignItems="flex-start" disableGutters sx={{
            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
            mb: 1.2,
          }}>
            {msg.sender === 'bot' ? (
              <SmartToyIcon sx={{ color: theme.palette.secondary.main, mr: 1, mt: 0.5, fontSize: 24 }} />
            ) : (
              <PersonIcon sx={{ color: theme.palette.grey[500], ml: 1, mt: 0.5, fontSize: 24 }} />
            )}
            <ListItemText
              primary={msg.text}
              secondary={msg.sender === 'user' ? 'You' : 'Bot'}
              sx={{
                textAlign: msg.sender === 'user' ? 'right' : 'left',
                bgcolor: msg.sender === 'bot' ? theme.palette.grey[50] : theme.palette.grey[50],
                border: msg.sender === 'bot' ? `1px solid ${theme.palette.grey[200]}` : `1px solid ${theme.palette.grey[50]}`,
                borderRadius: 2.5,
                px: 2,
                py: 1.2,
                maxWidth: '80%',
                display: 'inline-block',
                color: theme.palette.text.primary,
                fontSize: 15,
                boxShadow: msg.sender === 'bot' ? '0 1px 5px rgba(20,40,80,0.04)' : '1px 2px 5px rgba(20,40,80,0.08)',
                transition: 'background 0.2s, color 0.2s',
              }}
            />
          </ListItem>
        ))}
      </List>
      {/* Input area */}
      <Box sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        px: 2,
        pb: 2,
        pt: 1,
        flexShrink: 0,
        bgcolor: 'background.paper',
      }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
          placeholder="Type your message..."
          disabled={loading}
          sx={{
            bgcolor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: '0 1px 4px rgba(20,40,80,0.04)',
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
            },
          }}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSend}
          disabled={loading}
          sx={{
            minWidth: 80,
            height: 40,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: 16,
            boxShadow: '0 2px 8px rgba(228,31,19,0.10)',
            transition: 'background 0.2s, box-shadow 0.2s',
            '&:hover': {
              background: theme.palette.secondary.dark,
              boxShadow: '0 4px 16px rgba(228,31,19,0.18)',
            },
          }}
        >
          Send
        </Button>
      </Box>
      {loading && <Box sx={{ textAlign: 'center', mt: -1, mb: 1, color: 'text.secondary', fontSize: 14 }}>Bot is typing...</Box>}
    </Box>
  );
};

export default ChatPopup;

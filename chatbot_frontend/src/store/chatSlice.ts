import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBotReply } from '../services/chatbotService';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
};

const sendMessage = createAsyncThunk<ChatMessage, string>(
  'chat/sendMessage',
  async (userText, { rejectWithValue }) => {
    try {
      const botText = await fetchBotReply(userText);
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'bot',
        text: botText,
      };
      return botMsg;
    } catch {
      return rejectWithValue('Error: Could not get response.');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
    },
    addBotMessage: (state, action) => {
      state.messages.push({
        id: crypto.randomUUID(),
        sender: 'bot',
        text: action.payload,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // Add user message immediately
        state.messages.push({
          id: crypto.randomUUID(),
          sender: 'user',
          text: action.meta.arg,
        });
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Unknown error';
      });
  },
});

export const { clearMessages, addBotMessage } = chatSlice.actions;
export default chatSlice.reducer;
export { sendMessage };
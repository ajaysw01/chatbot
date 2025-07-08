import axios from 'axios';

export async function fetchBotReply(message: string): Promise<string> {
  try {
    const res = await axios.post('http://localhost:8000/chat', { message });
    return res.data.reply || 'Sorry, I did not understand that.';
  } catch {
    return 'Error: Could not get response.';
  }
}
export async function fetchBotReply(message: string): Promise<string> {
  try {
    const res = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) {
      return 'Error: Could not get response.';
    }
    const data = await res.json();
    // Ollama backend returns { reply: ... }
    return data.reply || 'Sorry, I did not understand that.';
  } catch {
    return 'Error: Could not get response.';
  }
} 
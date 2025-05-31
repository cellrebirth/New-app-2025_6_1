import { MIIBO_API_KEYS, MIIBO_AGENT_IDS } from './config';

export async function sendMessageToMiibo(message, agentType = 'KOKORO1') {
  const apiKey = MIIBO_API_KEYS[agentType];
  const agentId = MIIBO_AGENT_IDS[agentType];
  
  if (!apiKey || !agentId) {
    console.error('API Key or Agent ID missing:', { agentType, hasApiKey: !!apiKey, hasAgentId: !!agentId });
    throw new Error(`Configuration missing for ${agentType}`);
  }

  try {
    const response = await fetch('https://api-mebo.dev/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: apiKey,
        agent_id: agentId,
        utterance: message,
        uid: `user_${agentType}`
      })
    });

    if (!response.ok) {
      return {
        isError: true,
        error: `HTTP error! status: ${response.status}`
      };
    }

    const data = await response.json();
    return data.bestResponse.utterance;
  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message
    });
    return {
      isError: true,
      error: error.message
    };
  }
}
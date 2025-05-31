import { MIIBO_API_KEY, MIIBO_AGENT_IDS } from '../config';

export async function kokorosp1(req, res) {
  const { agent_id, uid, utterance } = req.body;

  try {
    const response = await fetch('https://api.miibo.ai/v1/talk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': MIIBO_API_KEY,
      },
      body: JSON.stringify({
        agent_id: MIIBO_AGENT_IDS[agent_id],
        message: utterance,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json({ message: data.message });
  } catch (error) {
    console.error('Error in kokorosp1:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
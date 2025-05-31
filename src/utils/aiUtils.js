import { sendMessageToMiibo } from '../miiboClient';

export const sendToAI = async (message, selectedAI, userData, emotionData, atmosphereData) => {
  const { user_id, group_id } = userData;
  const recognitionId = `kg_${user_id}_${group_id}`;
  const emotionCoordinates = emotionData[emotionData.length - 1] || { x: 0, y: 0 };
  const atmosphereCoordinates = atmosphereData[atmosphereData.length - 1] || { x: 0, y: 0 };

  const fullMessage = `${message} 感情XY:(${emotionCoordinates.x},${emotionCoordinates.y}) 雰囲気XY:(${atmosphereCoordinates.x},${atmosphereCoordinates.y}) ${recognitionId}`;

  try {
    const response = await sendMessageToMiibo(fullMessage, selectedAI);
    return { message: response };
  } catch (error) {
    console.error('Error in sendToAI:', error);
    throw new Error(`AI response error: ${error.message}`);
  }
};
import { getRecentMessages } from '../services/message.service.js';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

/**
 * Get recent messages for a specific room/project
 */
export const getMessagesController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { roomId } = req.params;

    // Validate roomId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ error: 'Invalid roomId format' });
    }

    // Get messages from the last 24 hours
    const messages = await getRecentMessages(roomId);
    
    return res.status(200).json({ messages });
  } catch (err) {
    console.error('Error fetching messages:', err);
    return res.status(500).json({ error: err.message });
  }
};

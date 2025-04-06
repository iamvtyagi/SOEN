import Message from '../models/message.model.js';
import { encrypt, decrypt } from '../utils/encryption.js';
import mongoose from 'mongoose';

/**
 * Save a new message with encryption
 * @param {Object} messageData - The message data
 * @param {string} messageData.roomId - The room/project ID
 * @param {string} messageData.senderId - The sender's user ID
 * @param {string} messageData.message - The message text to encrypt and save
 * @returns {Object} - The saved message document
 */
export const saveMessage = async ({ roomId, senderId, message }) => {
  if (!roomId || !senderId || !message) {
    throw new Error('roomId, senderId, and message are required');
  }

  // Encrypt the message
  const { encryptedText, iv } = encrypt(message);

  // Create and save the message
  const newMessage = new Message({
    roomId,
    senderId,
    message: encryptedText,
    iv
  });

  await newMessage.save();
  return newMessage;
};

/**
 * Get messages for a room from the last 24 hours
 * @param {string} roomId - The room/project ID
 * @returns {Array} - Array of decrypted messages
 */
export const getRecentMessages = async (roomId) => {
  if (!roomId) {
    throw new Error('roomId is required');
  }

  // Calculate timestamp for 24 hours ago
  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);

  // Find messages from the last 24 hours for the specified room
  const messages = await Message.find({
    roomId,
    timestamp: { $gte: oneDayAgo }
  })
  .sort({ timestamp: 1 })
  .populate('senderId', 'email')
  .lean();

  // Decrypt all messages
  const decryptedMessages = messages.map(msg => {
    return {
      id: msg._id,
      senderId: msg.senderId._id,
      senderEmail: msg.senderId.email,
      message: decrypt(msg.message, msg.iv),
      timestamp: msg.timestamp
    };
  });

  return decryptedMessages;
};

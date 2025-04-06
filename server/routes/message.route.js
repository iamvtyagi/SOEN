import { Router } from 'express';
import { getMessagesController } from '../controllers/message.controller.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';
import { param } from 'express-validator';

const router = Router();

// Route to get messages for a specific room/project
router.get(
  '/room/:roomId',
  authMiddleware.authUser,
  [
    param('roomId')
      .isString()
      .withMessage('roomId must be a string')
      .bail()
  ],
  getMessagesController
);

export default router;

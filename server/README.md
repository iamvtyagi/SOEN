# Encrypted Chat Application

This application implements a secure real-time chat system with end-to-end encryption using the MERN stack and Socket.IO.

## Features

- 🔒 **Two-way Encryption**: All messages are encrypted before storage and decrypted when retrieved
- 💬 **Message Storage**: Messages are saved in MongoDB with encryption
- 📤 **Message Retrieval**: Fetch and decrypt messages from the last 24 hours
- 🔐 **Secure**: Uses AES-256-CBC encryption with random IV per message

## Setup

1. Copy `.env.example` to `.env` and set your environment variables:
   ```
   cp .env.example .env
   ```

2. Generate a secure 32-character encryption key:
   ```javascript
   // You can use this in Node.js to generate a key
   const crypto = require('crypto');
   console.log(crypto.randomBytes(16).toString('hex'));
   ```

3. Update the `.env` file with your encryption key:
   ```
   ENCRYPTION_KEY=your_32_character_key_here
   ```

## How It Works

### Message Encryption

Messages are encrypted using the Node.js built-in `crypto` module with AES-256-CBC algorithm. Each message uses a unique Initialization Vector (IV) for enhanced security.

```javascript
// Example of how encryption works
const { encrypt } = require('./utils/encryption');
const { encryptedText, iv } = encrypt('Hello, world!');
// Both encryptedText and iv are stored in the database
```

### Message Decryption

When messages are retrieved, they are automatically decrypted before being sent to the client.

```javascript
// Example of how decryption works
const { decrypt } = require('./utils/encryption');
const decryptedText = decrypt(encryptedText, iv);
// decryptedText = 'Hello, world!'
```

## API Endpoints

### Get Recent Messages

```
GET /messages/room/:roomId
```

Returns all messages from the last 24 hours for the specified room, with messages already decrypted.

## Socket Events

### Sending Messages

When a client sends a message via Socket.IO, the server:
1. Encrypts the message
2. Saves it to the database
3. Broadcasts it to other users in the room

```javascript
// Client-side example
socket.emit('project-message', {
  message: 'Hello everyone!',
  sender: userId
});
```

## Security Considerations

- The encryption key is stored in the `.env` file and should be kept secure
- Each message has its own IV to prevent pattern analysis
- The system uses AES-256-CBC, a strong encryption algorithm
- Messages are encrypted on the server before storage and decrypted when retrieved

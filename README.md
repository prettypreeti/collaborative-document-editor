# Collaborative Text Editor

A real-time collaborative text editor built with React, Node.js, and Socket.IO that allows multiple users to edit documents simultaneously.

## Features

✨ **Real-time Collaboration** - See changes from other users instantly
👥 **User Presence** - Know who's currently editing the document
📝 **Multiple Documents** - Create and manage multiple documents
💾 **Auto-save** - All changes are saved automatically
🎨 **Modern UI** - Beautiful, responsive design with dark mode support
📱 **Mobile Friendly** - Works perfectly on all devices
🔗 **Real-time Sync** - Changes sync across all connected users

## Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Socket.IO Client** - Real-time communication
- **CSS3** - Modern styling with animations

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **CORS** - Cross-origin resource sharing

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd collaborative-document-editor
   ```

2. **Install server dependencies**
   ```bash
   cd collaborative-editor-server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../collaborative-editor
   npm install
   ```

### Running the Application

1. **Start the server** (Terminal 1)
   ```bash
   cd collaborative-editor-server
   npm start
   ```
   The server will run on `http://localhost:5000`

2. **Start the client** (Terminal 2)
   ```bash
   cd collaborative-editor
   npm start
   ```
   The client will run on `http://localhost:3000`

3. **Open your browser**
   Navigate to `http://localhost:3000` to start using the collaborative editor.

## How to Use

### Getting Started
1. **Enter your name** - You'll be prompted to enter your name when you first visit
2. **Create or Join a Document** - Either create a new document or join an existing one
3. **Start Collaborating** - Begin typing and see changes from other users in real-time

### Creating a Document
1. Click the "+ Create New Document" button
2. Enter a unique document name
3. Click "Create Document"
4. Share the document name with others to collaborate

### Joining a Document
1. Click on any document from the list
2. You'll be taken to the editor
3. Start typing to collaborate with others

### Features
- **Real-time typing indicator** - See when others are typing
- **User list** - View all users currently in the document
- **Character and word count** - Track document statistics
- **Auto-save** - All changes are automatically saved
- **Responsive design** - Works on desktop, tablet, and mobile

## Project Structure

```
collaborative-document-editor/
├── collaborative-editor/          # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── LoginModal.js     # User authentication
│   │   │   ├── DocumentList.js   # Document management
│   │   │   ├── TextEditor.js     # Main editor component
│   │   │   └── UserList.js       # User presence display
│   │   ├── App.js               # Main application
│   │   └── App.css              # Global styles
│   └── package.json
└── collaborative-editor-server/   # Node.js backend
    ├── server.js                # Socket.IO server
    └── package.json
```

## API Endpoints

### Server Endpoints
- `GET /api/documents` - Get list of all documents
- `GET /api/documents/:id` - Get specific document content

### Socket.IO Events

#### Client to Server
- `join-document` - Join a specific document
- `text-change` - Send text changes to other users
- `cursor-move` - Update cursor position
- `create-document` - Create a new document
- `get-documents` - Request list of documents

#### Server to Client
- `document-content` - Receive document content when joining
- `text-updated` - Receive text changes from other users
- `user-joined` - Notification when user joins
- `user-left` - Notification when user leaves
- `document-list` - List of available documents

## Development

### Adding New Features
1. **Frontend**: Add new components in `src/components/`
2. **Backend**: Extend the Socket.IO server in `server.js`
3. **Styling**: Add CSS files for new components

### Testing
```bash
# Test the frontend
cd collaborative-editor
npm test

# Test the server
cd collaborative-editor-server
npm test
```

## Deployment

### Frontend Deployment
```bash
cd collaborative-editor
npm run build
```
Deploy the `build` folder to your hosting service.

### Backend Deployment
```bash
cd collaborative-editor-server
npm start
```
Deploy to a Node.js hosting service like Heroku, Vercel, or Railway.

## Environment Variables

Create a `.env` file in the server directory:
```env
PORT=5000
NODE_ENV=production
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Happy Collaborating! 🎉**

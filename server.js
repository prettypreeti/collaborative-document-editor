const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store documents in memory (in production, use a database)
const documents = new Map();
const userSessions = new Map();

// Initialize default document
documents.set('default', {
  content: 'Welcome to the collaborative text editor!\n\nStart typing to collaborate with others in real-time.',
  users: new Set()
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining a document
  socket.on('join-document', ({ documentId, username }) => {
    socket.join(documentId);
    
    // Create document if it doesn't exist
    if (!documents.has(documentId)) {
      documents.set(documentId, {
        content: '',
        users: new Set()
      });
    }

    const document = documents.get(documentId);
    document.users.add(username);
    userSessions.set(socket.id, { documentId, username });

    // Send current document content to the new user
    socket.emit('document-content', {
      content: document.content,
      users: Array.from(document.users)
    });

    // Notify other users about the new user
    socket.to(documentId).emit('user-joined', {
      username,
      users: Array.from(document.users)
    });

    console.log(`${username} joined document ${documentId}`);
  });

  // Handle text changes
  socket.on('text-change', ({ documentId, content, cursorPosition }) => {
    const document = documents.get(documentId);
    if (document) {
      document.content = content;
      
      // Broadcast the change to all other users in the document
      socket.to(documentId).emit('text-updated', {
        content,
        cursorPosition,
        userId: socket.id
      });
    }
  });

  // Handle cursor position updates
  socket.on('cursor-move', ({ documentId, cursorPosition, username }) => {
    socket.to(documentId).emit('cursor-updated', {
      cursorPosition,
      username,
      userId: socket.id
    });
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    const session = userSessions.get(socket.id);
    if (session) {
      const { documentId, username } = session;
      const document = documents.get(documentId);
      
      if (document) {
        document.users.delete(username);
        
        // Notify other users about the departure
        socket.to(documentId).emit('user-left', {
          username,
          users: Array.from(document.users)
        });
      }
      
      userSessions.delete(socket.id);
      console.log(`${username} left document ${documentId}`);
    }
  });

  // Handle document list request
  socket.on('get-documents', () => {
    const documentList = Array.from(documents.keys()).map(id => ({
      id,
      userCount: documents.get(id).users.size
    }));
    socket.emit('document-list', documentList);
  });

  // Handle new document creation
  socket.on('create-document', ({ documentId, username }) => {
    if (!documents.has(documentId)) {
      documents.set(documentId, {
        content: '',
        users: new Set()
      });
      
      socket.emit('document-created', { documentId });
      socket.to('lobby').emit('document-added', { 
        documentId, 
        userCount: 0 
      });
    } else {
      socket.emit('document-exists', { documentId });
    }
  });
});

// API endpoints
app.get('/api/documents', (req, res) => {
  const documentList = Array.from(documents.keys()).map(id => ({
    id,
    userCount: documents.get(id).users.size
  }));
  res.json(documentList);
});

app.get('/api/documents/:id', (req, res) => {
  const document = documents.get(req.params.id);
  if (document) {
    res.json({
      content: document.content,
      userCount: document.users.size
    });
  } else {
    res.status(404).json({ error: 'Document not found' });
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Collaborative editor server is ready!`);
});

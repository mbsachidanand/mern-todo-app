import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Environment variables
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:secret@127.0.0.1:27017/mern_app?authSource=admin';

// Database connection
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

// Connect to database
connectDB();

// Todo Schema with validation
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title cannot be empty'],
    maxlength: [500, 'Title cannot exceed 500 characters']
  },
  done: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual for time since creation
todoSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffInMinutes = Math.floor((now - created) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
});

const Todo = mongoose.model('Todo', todoSchema);

// Input validation middleware
function validateTodoInput(req, res, next) {
  const { title } = req.body;
  
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ 
      error: 'Title is required and must be a string' 
    });
  }
  
  const trimmedTitle = title.trim();
  if (trimmedTitle.length === 0) {
    return res.status(400).json({ 
      error: 'Title cannot be empty' 
    });
  }
  
  if (trimmedTitle.length > 500) {
    return res.status(400).json({ 
      error: 'Title cannot exceed 500 characters' 
    });
  }
  
  req.body.title = trimmedTitle;
  next();
}

// Error handling middleware
function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation Error', 
      details: Object.values(err.errors).map(e => e.message) 
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  res.status(500).json({ error: 'Internal server error' });
}

// Routes
app.get('/api/todos', async (req, res, next) => {
  try {
    const todos = await Todo.find()
      .sort({ createdAt: -1 })
      .limit(100); // Prevent loading too many todos
    res.json(todos);
  } catch (error) {
    next(error);
  }
});

app.post('/api/todos', validateTodoInput, async (req, res, next) => {
  try {
    const todo = await Todo.create(req.body);
    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
});

app.patch('/api/todos/:id', async (req, res, next) => {
  try {
    const { title, done, priority } = req.body;
    const updateData = {};
    
    if (title !== undefined) updateData.title = title.trim();
    if (done !== undefined) updateData.done = done;
    if (priority !== undefined) updateData.priority = priority;
    
    const updated = await Todo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/todos/:id', async (req, res, next) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

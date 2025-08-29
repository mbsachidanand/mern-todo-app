import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose, { ConnectOptions } from 'mongoose';
import { ITodo, TodoInput, TodoUpdate, ApiError, HealthResponse, RequestHandler } from './types/index.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Environment variables
const PORT: string = process.env.PORT || '4000';
const MONGODB_URI: string = process.env.MONGODB_URI || 'mongodb://admin:secret@127.0.0.1:27017/mern_app?authSource=admin';

// Database connection
async function connectDB(): Promise<void> {
  try {
    const options: ConnectOptions = {
      // Add any MongoDB connection options here
    };
    await mongoose.connect(MONGODB_URI, options);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error instanceof Error ? error.message : 'Unknown error');
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
todoSchema.virtual('timeAgo').get(function(this: ITodo): string {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
});

const Todo = mongoose.model<ITodo>('Todo', todoSchema);

// Input validation middleware
function validateTodoInput(req: Request, res: Response, next: NextFunction): void {
  const { title }: TodoInput = req.body;
  
  if (!title || typeof title !== 'string') {
    const error: ApiError = { 
      error: 'Title is required and must be a string' 
    };
    res.status(400).json(error);
    return;
  }
  
  const trimmedTitle = title.trim();
  if (trimmedTitle.length === 0) {
    const error: ApiError = { 
      error: 'Title cannot be empty' 
    };
    res.status(400).json(error);
    return;
  }
  
  if (trimmedTitle.length > 500) {
    const error: ApiError = { 
      error: 'Title cannot exceed 500 characters' 
    };
    res.status(400).json(error);
    return;
  }
  
  req.body.title = trimmedTitle;
  next();
}

// Error handling middleware
function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    const validationError = err as any;
    const details = Object.values(validationError.errors).map((e: any) => e.message);
    const error: ApiError = { 
      error: 'Validation Error', 
      details 
    };
    res.status(400).json(error);
    return;
  }
  
  if (err.name === 'CastError') {
    const error: ApiError = { error: 'Invalid ID format' };
    res.status(400).json(error);
    return;
  }
  
  const error: ApiError = { error: 'Internal server error' };
  res.status(500).json(error);
}

// Routes
const getTodos: RequestHandler = async (_req, res, next) => {
  try {
    const todos = await Todo.find()
      .sort({ createdAt: -1 })
      .limit(100); // Prevent loading too many todos
    res.json(todos);
  } catch (error) {
    next(error);
  }
};

const createTodo: RequestHandler = async (req, res, next) => {
  try {
    const todoData: TodoInput = req.body;
    const todo = await Todo.create(todoData);
    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
};

const updateTodo: RequestHandler = async (req, res, next) => {
  try {
    const { title, done, priority }: TodoUpdate = req.body;
    const updateData: TodoUpdate = {};
    
    if (title !== undefined) updateData.title = title.trim();
    if (done !== undefined) updateData.done = done;
    if (priority !== undefined) updateData.priority = priority;
    
    const updated = await Todo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      const error: ApiError = { error: 'Todo not found' };
      res.status(404).json(error);
      return;
    }
    
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteTodo: RequestHandler = async (req, res, next) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      const error: ApiError = { error: 'Todo not found' };
      res.status(404).json(error);
      return;
    }
    
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const healthCheck = (_req: Request, res: Response): void => {
  const response: HealthResponse = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
  res.json(response);
};

// Route handlers
app.get('/api/todos', getTodos);
app.post('/api/todos', validateTodoInput, createTodo);
app.patch('/api/todos/:id', updateTodo);
app.delete('/api/todos/:id', deleteTodo);
app.get('/api/health', healthCheck);

// 404 handler
app.use('*', (_req: Request, res: Response) => {
  const error: ApiError = { error: 'Route not found' };
  res.status(404).json(error);
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

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || '';
if (!mongoUri) {
	console.error('Missing MONGODB_URI in .env');
	process.exit(1);
}

await mongoose.connect(mongoUri);

const todoSchema = new mongoose.Schema({
	title: { type: String, required: true },
	done: { type: Boolean, default: false }
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

app.get('/api/todos', async (_req, res) => {
	const todos = await Todo.find().sort({ createdAt: -1 });
	res.json(todos);
});

app.post('/api/todos', async (req, res) => {
	const todo = await Todo.create({ title: req.body.title });
	res.status(201).json(todo);
});

app.patch('/api/todos/:id', async (req, res) => {
	const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
	res.json(updated);
});

app.delete('/api/todos/:id', async (req, res) => {
	await Todo.findByIdAndDelete(req.params.id);
	res.status(204).end();
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API on http://localhost:${port}`));

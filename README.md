# MERN Stack Todo Application

A full-stack todo application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- ✅ Add new todos
- ✅ Toggle todo completion status
- ✅ Delete todos
- ✅ Real-time updates
- ✅ Persistent data storage
- ✅ Clean, responsive UI
- ✅ Modern React with hooks
- ✅ RESTful API

## Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **CSS** - Inline styles for simplicity

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing

### Database
- **MongoDB** - NoSQL database

### Development
- **Nodemon** - Auto-restart for development
- **Concurrently** - Run multiple commands
- **ESLint** - Code quality

## Project Structure

```
mern-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx         # Main component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Styles
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── server/                 # Express backend
│   ├── src/
│   │   └── index.js        # Server entry point
│   ├── package.json        # Backend dependencies
│   └── .env               # Environment variables
├── package.json           # Root dependencies
└── README.md             # This file
```

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Docker (for MongoDB)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd mern-app
```

### 2. Set up MongoDB
Start MongoDB using Docker:
```bash
docker run -d --name mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  -v mongo_data:/data/db \
  mongo:6.0
```

### 3. Configure environment
Create `server/.env`:
```bash
MONGODB_URI="mongodb://admin:secret@127.0.0.1:27017/mern_app?authSource=admin"
PORT=4000
```

### 4. Install dependencies
```bash
npm install
npm --prefix server install
npm --prefix client install
```

### 5. Start development servers
```bash
npm run dev
```

This will start both:
- **Backend API**: http://localhost:4000
- **Frontend**: http://localhost:5173

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PATCH /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Development

### Available Scripts

```bash
npm run dev          # Start both client and server
npm run dev:server   # Start only the server
npm run dev:client   # Start only the client
```

### Database Connection

The application connects to MongoDB using Mongoose. Make sure your MongoDB instance is running and accessible via the connection string in `server/.env`.

## Deployment

### Backend Deployment
1. Set up environment variables for production
2. Deploy to platforms like Heroku, Railway, or Vercel
3. Update the MongoDB connection string for production

### Frontend Deployment
1. Build the React app: `npm --prefix client run build`
2. Deploy the `dist/` folder to platforms like Netlify, Vercel, or GitHub Pages
3. Update the API URL in the frontend for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

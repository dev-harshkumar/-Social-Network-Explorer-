# 🌐 Social Network Explorer

A full-stack web application that visualizes and analyzes social network connections using fundamental graph algorithms. Built with React.js, Express.js, and Tailwind CSS.

![Social Network Explorer](https://img.shields.io/badge/Status-Ready%20for%20Demo-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-20%2B-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.10-blue)

## 🚀 Features

### 🔍 Shortest Path Finding (BFS)
- Find the shortest connection between any two users in the network
- Uses **Breadth-First Search (BFS)** algorithm for optimal path discovery
- Displays the connection length in degrees of separation
- Real-time path visualization with user-friendly interface

### 🔄 Cycle Detection (DFS)
- Identify tight-knit friend groups through cycle detection
- Implements **Depth-First Search (DFS)** with recursion stack
- Detects circular relationships and friend loops
- Eliminates duplicate cycles for clean results

### 👑 Influence Rankings (PageRank)
- Calculate user influence using the **PageRank algorithm**
- Identifies the most connected and influential users
- Interactive rankings with visual progress bars
- Convergence-based calculation for accuracy

### 🎨 Modern UI/UX
- Beautiful, responsive design with Tailwind CSS
- Tabbed interface for easy navigation
- Real-time loading states and error handling
- Mobile-friendly responsive layout

## 🏗️ Architecture

```
social-network-explorer/
├── frontend/                 # React.js frontend
│   ├── src/
│   │   ├── App.jsx          # Main application component
│   │   ├── index.css        # Global styles
│   │   └── main.jsx         # Application entry point
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
├── backend/                 # Express.js backend
│   ├── index.js            # Server with graph algorithms
│   └── package.json        # Backend dependencies
└── README.md               # This file
```

## 🧮 Graph Algorithms

### 1. Breadth-First Search (BFS) - Shortest Path
```javascript
// Finds shortest path between two users
Time Complexity: O(V + E)
Space Complexity: O(V)
```
**How it works:**
- Explores graph level by level from source user
- Guarantees shortest path in unweighted graphs
- Uses queue data structure for frontier management

### 2. Depth-First Search (DFS) - Cycle Detection
```javascript
// Detects cycles using recursion stack
Time Complexity: O(V + E)
Space Complexity: O(V)
```
**How it works:**
- Maintains visited set and recursion stack
- Detects back edges indicating cycles
- Removes duplicate cycles for clean output

### 3. PageRank Algorithm - Influence Ranking
```javascript
// Iterative PageRank with damping factor 0.85
Time Complexity: O(k × (V + E)) where k = iterations
Space Complexity: O(V)
```
**How it works:**
- Models random surfer behavior on the graph
- Converges to stable influence distribution
- Handles dangling nodes (users with no outgoing connections)

## 🛠️ Tech Stack

### Frontend
- **React.js 18.3.1** - Component-based UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4.1.10** - Utility-first CSS framework
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js 5.1.0** - Web application framework
- **CORS** - Cross-origin resource sharing middleware

## 📊 Network Structure

The application uses a predefined social network graph:

```javascript
{
  Alice: ["Bob", "Charlie"],
  Bob: ["Alice", "David", "Charlie"], 
  Charlie: ["Alice", "Bob", "Elon"],
  David: ["Bob"],
  Elon: ["Charlie"]
}
```

**Network Statistics:**
- **5 users** in the network
- **5 bidirectional connections**
- **Maximum path length:** 3 degrees of separation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend will run on `http://localhost:3001`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:5173`

### API Endpoints
- `GET /users` - Get all users in the network
- `GET /graph` - Get the complete graph structure
- `POST /shortest-path` - Find shortest path between users
- `GET /cycles` - Detect friend loops/cycles
- `GET /pagerank` - Calculate influence rankings
- `GET /health` - Health check endpoint

## 🎯 Usage Examples

### Finding Shortest Path
```javascript
// Request
POST /shortest-path
{
  "from": "Alice",
  "to": "Elon"
}

// Response
{
  "path": ["Alice", "Charlie", "Elon"],
  "length": 2,
  "message": "Shortest path found with 2 degrees of separation"
}
```

### Getting Influence Rankings
```javascript
// Request
GET /pagerank

// Response
{
  "ranks": [
    ["Charlie", 0.374],
    ["Bob", 0.341], 
    ["Alice", 0.223],
    ["Elon", 0.031],
    ["David", 0.031]
  ],
  "message": "PageRank calculation completed successfully"
}
```

## 🔬 Algorithm Performance

| Algorithm | Time Complexity | Space Complexity | Use Case |
|-----------|----------------|------------------|----------|
| BFS | O(V + E) | O(V) | Shortest paths |
| DFS | O(V + E) | O(V) | Cycle detection |
| PageRank | O(k × (V + E)) | O(V) | Influence ranking |

Where V = vertices (users), E = edges (connections), k = iterations

## 🌟 Key Features Implemented

✅ **Complete Graph Algorithm Suite**
- BFS for shortest path finding
- DFS for cycle detection  
- PageRank for influence analysis

✅ **Production-Ready Backend**
- Input validation and error handling
- RESTful API design
- Comprehensive endpoint coverage

✅ **Modern Frontend Experience**
- Responsive tabbed interface
- Real-time loading states
- Error boundary handling
- Beautiful visual feedback

✅ **Code Quality**
- Clean, maintainable code structure
- Proper error handling
- Performance optimizations
- Comprehensive documentation

## 🚀 Deployment Ready

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy build/ directory to Vercel
```

### Backend (Render)
```bash
cd backend
# Push to GitHub
# Connect to Render for automatic deployment
```

## 🔮 Future Enhancements

- **Interactive Graph Visualization** with D3.js or Cytoscape.js
- **Dynamic Graph Editing** - Add/remove users and connections
- **Real-time Updates** with WebSockets
- **Advanced Algorithms** - Betweenness centrality, clustering coefficient
- **User Authentication** with persistent user profiles
- **Graph Database Integration** with Neo4j
- **Performance Analytics** dashboard

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Graph algorithm implementations inspired by classic computer science textbooks
- UI/UX design following modern web development best practices
- Built as a demonstration of practical graph algorithm applications

---

**Built with ❤️ using React, Express.js, and fundamental computer science algorithms** 
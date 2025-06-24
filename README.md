# 🌐 Social Network Explorer

A full-stack web application that visualizes and analyzes social network connections using fundamental graph algorithms. Built with React.js, Express.js, and Tailwind CSS.

![Social Network Explorer](https://img.shields.io/badge/Status-Ready%20for%20Demo-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-20%2B-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.10-blue)

## 🎬 Demo & Live Application

### 🌐 Live Demo
**[Try the Live Application →](https://social-network-explorer.vercel.app/)**

### 📹 Demo Video
**[Watch Demo Video →](https://drive.google.com/file/d/1KtP4jSYl8h-3QDfYXZANnMBRukbRX1jS/view?usp=sharing)**

*See the application in action: explore graph algorithms, visualize shortest paths, and discover friend loops in real-time!*

## 🚀 Features

### 🔍 Shortest Path Finding (BFS)
- Find the shortest connection between any two users in the network
- Uses **Breadth-First Search (BFS)** algorithm for optimal path discovery
- Step-by-step visualization of the algorithm execution
- Displays the connection length in degrees of separation
- Real-time path visualization with highlighted connections

### 🔄 Cycle Detection (DFS)
- Identify tight-knit friend groups through cycle detection
- Implements **Depth-First Search (DFS)** with recursion stack tracking
- Step-by-step visualization of the exploration process
- Detects circular relationships and friend loops
- Eliminates duplicate cycles for clean results

### 🎨 Interactive Visualization
- **Auto-play algorithm execution** - Watch algorithms run step-by-step automatically
- **SVG-based network graph** with positioned nodes and connections
- **Real-time highlighting** of visited nodes and active paths
- **Compact viewport design** - Everything fits perfectly within the browser window
- **Responsive layout** optimized for all screen sizes

### 🎨 Modern UI/UX
- Beautiful, responsive design with Tailwind CSS
- Tabbed interface for easy navigation between algorithms
- Real-time loading states and comprehensive error handling
- Gradient backgrounds and smooth animations
- Mobile-friendly responsive layout

## 🏗️ Architecture

```
social-network-explorer/
├── frontend/                 # React.js frontend
│   ├── src/
│   │   ├── App.jsx          # Main application component
│   │   ├── index.css        # Global styles with Tailwind
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
- **Step-by-step visualization** shows queue state, visited nodes, and level exploration

### 2. Depth-First Search (DFS) - Cycle Detection
```javascript
// Detects cycles using recursion stack
Time Complexity: O(V + E)
Space Complexity: O(V)
```
**How it works:**
- Maintains visited set and recursion stack
- Detects back edges indicating cycles
- **Step-by-step visualization** shows current path, recursion stack, and backtracking
- Removes duplicate cycles for clean output

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

## 📊 Enhanced Network Structure

The application uses an expanded social network graph with **17 users** and **32 connections**:

```javascript
{
  Alice: ["Bob", "Charlie", "Diana"],
  Bob: ["Alice", "David", "Charlie", "Eve"],
  Charlie: ["Alice", "Bob", "Elon", "Frank", "Grace"],
  David: ["Bob", "Eve", "Henry"],
  Elon: ["Charlie", "Frank", "Isabella"],
  Eve: ["Bob", "David", "Henry", "Jack"],
  Frank: ["Charlie", "Elon", "Grace", "Isabella", "Karen"],
  Grace: ["Charlie", "Frank", "Karen", "Luna"],
  Henry: ["David", "Eve", "Jack", "Mike"],
  Isabella: ["Elon", "Frank", "Karen", "Nina"],
  Jack: ["Eve", "Henry", "Mike", "Oliver"],
  Karen: ["Frank", "Grace", "Isabella", "Luna", "Nina"],
  Luna: ["Grace", "Karen", "Mike", "Nina"],
  Mike: ["Henry", "Jack", "Luna", "Oliver"],
  Nina: ["Isabella", "Karen", "Luna", "Oliver"],
  Oliver: ["Jack", "Mike", "Nina"],
  Diana: ["Alice"]
}
```

**Network Statistics:**
- **17 users** in the network
- **32 bidirectional connections**
- **Average connections:** 3.76 per user
- **Complex interconnected relationships** for realistic algorithm testing

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
- `GET /graph` - Get the complete graph structure with metadata
- `GET /stats` - Get network statistics
- `POST /shortest-path` - Find shortest path between users with step-by-step visualization
- `GET /cycles` - Detect friend loops/cycles with DFS visualization
- `GET /health` - Health check endpoint

## 🎯 Usage Examples

### Finding Shortest Path
```javascript
// Request
POST /shortest-path
{
  "from": "Alice",
  "to": "Nina"
}

// Response
{
  "path": ["Alice", "Charlie", "Karen", "Nina"],
  "length": 3,
  "steps": [
    {
      "level": 0,
      "queue": [["Alice"]],
      "visited": [],
      "exploring": ["Alice"],
      "message": "Level 0: Exploring Alice"
    },
    // ... more steps
  ],
  "message": "Shortest path found with 3 degrees of separation"
}
```

### Getting Cycle Detection
```javascript
// Request
GET /cycles

// Response
{
  "cycles": [
    ["Alice", "Bob", "Charlie", "Alice"],
    ["Bob", "David", "Eve", "Bob"],
    // ... more cycles
  ],
  "steps": [
    {
      "action": "visit",
      "node": "Alice",
      "path": ["Alice"],
      "message": "Visiting Alice, current path: Alice"
    },
    // ... more steps
  ],
  "count": 5,
  "message": "Found 5 friend loop(s)"
}
```

## 🔬 Algorithm Performance

| Algorithm | Time Complexity | Space Complexity | Use Case | Visualization |
|-----------|----------------|------------------|----------|---------------|
| BFS | O(V + E) | O(V) | Shortest paths | Queue state, level exploration |
| DFS | O(V + E) | O(V) | Cycle detection | Recursion stack, backtracking |

Where V = vertices (users), E = edges (connections)

## 🌟 Key Features Implemented

✅ **Interactive Graph Algorithm Visualization**
- BFS for shortest path finding with step-by-step queue visualization
- DFS for cycle detection with recursion stack tracking
- Auto-play functionality for watching algorithms execute

✅ **Production-Ready Backend**
- Input validation and comprehensive error handling
- RESTful API design with detailed step tracking
- Enhanced graph structure with 17 users and complex relationships

✅ **Modern Frontend Experience**
- Compact viewport design that fits entirely on screen
- SVG-based interactive network visualization
- Real-time algorithm step visualization
- Beautiful gradient backgrounds and animations

✅ **Code Quality**
- Clean, maintainable code structure
- Proper error handling and user feedback
- Performance optimizations for smooth animations
- Comprehensive documentation

## 🌐 Deployment

### Frontend (Vercel)
**Live URL:** [https://social-network-explorer-frontend.vercel.app](https://social-network-explorer-frontend.vercel.app)

```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Render)
**API URL:** [https://social-network-explorer-backend.onrender.com](https://social-network-explorer-backend.onrender.com)

```bash
cd backend
# Deploy to Render
```

## 🔮 Future Enhancements

- **Advanced Graph Algorithms** - Dijkstra's algorithm, A* search
- **Dynamic Graph Editing** - Add/remove users and connections in real-time
- **Algorithm Performance Comparison** - Side-by-side algorithm execution
- **Custom Network Import** - Upload your own social network data
- **3D Graph Visualization** with Three.js
- **Real-time Collaboration** with WebSockets
- **Graph Database Integration** with Neo4j

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
- Step-by-step visualization concept for educational purposes
- Built as a demonstration of practical graph algorithm applications

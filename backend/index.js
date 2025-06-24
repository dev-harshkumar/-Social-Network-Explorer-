import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Expanded social network graph with complex relationships
const graph = {
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
};

// Input validation middleware
const validateUser = (req, res, next) => {
  const { from, to } = req.body;

  if (!from || !to) {
    return res.status(400).json({
      error: "Both 'from' and 'to' users are required"
    });
  }

  if (!graph.hasOwnProperty(from)) {
    return res.status(400).json({
      error: `User '${from}' not found in the network`
    });
  }

  if (!graph.hasOwnProperty(to)) {
    return res.status(400).json({
      error: `User '${to}' not found in the network`
    });
  }

  next();
};

// Get all users in the network
app.get('/users', (req, res) => {
  try {
    const users = Object.keys(graph);
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get the graph structure with enhanced metadata
app.get('/graph', (req, res) => {
  try {
    const nodes = Object.keys(graph).map(user => ({
      id: user,
      connections: graph[user].length,
      neighbors: graph[user]
    }));

    const edges = [];
    const visited = new Set();

    Object.keys(graph).forEach(user => {
      graph[user].forEach(neighbor => {
        const edge = [user, neighbor].sort().join('-');
        if (!visited.has(edge)) {
          edges.push({ from: user, to: neighbor });
          visited.add(edge);
        }
      });
    });

    res.json({
      graph,
      nodes,
      edges,
      stats: {
        totalUsers: nodes.length,
        totalConnections: edges.length,
        averageConnections: (edges.length * 2 / nodes.length).toFixed(2),
        mostConnected: nodes.reduce((max, node) =>
          node.connections > max.connections ? node : max
        )
      }
    });
  } catch (error) {
    console.error('Error fetching graph:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Enhanced BFS with step-by-step visualization
app.post('/shortest-path', validateUser, (req, res) => {
  try {
    const { from, to } = req.body;

    if (from === to) {
      return res.json({
        path: [from],
        steps: [{ level: 0, queue: [[from]], visited: [], current: from, found: true }],
        message: "Source and destination are the same user"
      });
    }

    const queue = [[from]];
    const visited = new Set();
    const steps = [];
    let level = 0;

    while (queue.length > 0) {
      const currentQueueSize = queue.length;
      const levelNodes = [];

      for (let i = 0; i < currentQueueSize; i++) {
        const path = queue.shift();
        const currentNode = path[path.length - 1];

        if (currentNode === to) {
          steps.push({
            level,
            queue: queue.map(p => [...p]),
            visited: Array.from(visited),
            current: currentNode,
            path: [...path],
            found: true,
            message: `Target found! Path: ${path.join(' → ')}`
          });

          return res.json({
            path,
            length: path.length - 1,
            steps,
            message: `Shortest path found with ${path.length - 1} degrees of separation`
          });
        }

        if (visited.has(currentNode)) continue;
        visited.add(currentNode);
        levelNodes.push(currentNode);

        const neighbors = graph[currentNode] || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            queue.push([...path, neighbor]);
          }
        }
      }

      steps.push({
        level,
        queue: queue.map(p => [...p]),
        visited: Array.from(visited),
        exploring: levelNodes,
        found: false,
        message: `Level ${level}: Exploring ${levelNodes.join(', ')}`
      });

      level++;
    }

    res.json({
      path: [],
      steps,
      message: "No path found between the specified users"
    });
  } catch (error) {
    console.error('Error finding shortest path:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Enhanced DFS cycle detection with visualization
function detectCyclesWithSteps(startNode, targetCycles = 5) {
  const allCycles = [];
  const steps = [];
  const globalVisited = new Set();

  function dfsUtil(node, visited, recursionStack, path) {
    if (allCycles.length >= targetCycles) return;

    visited.add(node);
    recursionStack.add(node);

    steps.push({
      action: 'visit',
      node,
      path: [...path],
      visited: Array.from(visited),
      stack: Array.from(recursionStack),
      message: `Visiting ${node}, current path: ${path.join(' → ')}`
    });

    const neighbors = graph[node] || [];

    for (const neighbor of neighbors) {
      if (allCycles.length >= targetCycles) break;

      if (!visited.has(neighbor)) {
        dfsUtil(neighbor, visited, recursionStack, [...path, neighbor]);
      } else if (recursionStack.has(neighbor)) {
        // Found a cycle
        const cycleStartIndex = path.indexOf(neighbor);
        if (cycleStartIndex !== -1) {
          const cycle = [...path.slice(cycleStartIndex), neighbor];
          const cycleString = cycle.slice(0, -1).sort().join('-');

          if (!allCycles.some(existingCycle =>
            existingCycle.slice(0, -1).sort().join('-') === cycleString)) {
            allCycles.push(cycle);
            steps.push({
              action: 'cycle_found',
              cycle: [...cycle],
              node,
              path: [...path],
              message: `🔄 Cycle detected: ${cycle.join(' → ')}`
            });
          }
        }
      }
    }

    recursionStack.delete(node);
    steps.push({
      action: 'backtrack',
      node,
      path: [...path],
      stack: Array.from(recursionStack),
      message: `Backtracking from ${node}`
    });
  }

  // Start DFS from multiple nodes to find different cycles
  for (const node of Object.keys(graph)) {
    if (allCycles.length >= targetCycles) break;
    if (!globalVisited.has(node)) {
      const visited = new Set();
      dfsUtil(node, visited, new Set(), [node]);
      globalVisited.add(node);
    }
  }

  return { cycles: allCycles, steps };
}

app.get('/cycles', (req, res) => {
  try {
    const { cycles, steps } = detectCyclesWithSteps();

    res.json({
      cycles,
      steps,
      count: cycles.length,
      message: cycles.length > 0
        ? `Found ${cycles.length} friend loop(s)`
        : "No friend loops detected in the network"
    });
  } catch (error) {
    console.error('Error detecting cycles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// New endpoint for graph statistics
app.get('/stats', (req, res) => {
  try {
    const nodes = Object.keys(graph);
    const totalConnections = Object.values(graph).reduce((sum, connections) => sum + connections.length, 0) / 2;

    const connectionDistribution = {};
    nodes.forEach(node => {
      const count = graph[node].length;
      connectionDistribution[count] = (connectionDistribution[count] || 0) + 1;
    });

    const mostConnected = nodes.reduce((max, node) =>
      graph[node].length > graph[max].length ? node : max
    );

    const leastConnected = nodes.reduce((min, node) =>
      graph[node].length < graph[min].length ? node : min
    );

    res.json({
      totalUsers: nodes.length,
      totalConnections,
      averageConnections: (totalConnections * 2 / nodes.length).toFixed(2),
      mostConnected: {
        user: mostConnected,
        connections: graph[mostConnected].length
      },
      leastConnected: {
        user: leastConnected,
        connections: graph[leastConnected].length
      },
      connectionDistribution
    });
  } catch (error) {
    console.error('Error calculating stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    networkSize: Object.keys(graph).length
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /users',
      'GET /graph',
      'GET /stats',
      'POST /shortest-path',
      'GET /cycles',
      'GET /health'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unexpected error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Social Network Explorer Backend v2.0 running on port ${PORT}`);
  console.log(`📊 Network loaded with ${Object.keys(graph).length} users`);
  console.log(`🔗 Total connections: ${Object.values(graph).reduce((sum, connections) => sum + connections.length, 0) / 2}`);
});

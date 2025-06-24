import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://social-network-explorer-backend.onrender.com";

// Animation components
const AnimatedStep = ({ children, delay = 0 }) => (
  <div
    className="opacity-0 animate-fade-in"
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
  >
    {children}
  </div>
);

const LoadingDots = () => (
  <div className="flex space-x-1">
    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
  </div>
);

// Compact Graph Visualization Component
const GraphVisualization = ({ nodes, edges, highlightPath = [], highlightNodes = [], currentStep = 0 }) => {
  const positions = {
    Alice: { x: 80, y: 60 }, Bob: { x: 150, y: 90 }, Charlie: { x: 220, y: 60 },
    David: { x: 120, y: 150 }, Elon: { x: 280, y: 120 }, Eve: { x: 200, y: 150 },
    Frank: { x: 320, y: 90 }, Grace: { x: 360, y: 150 }, Henry: { x: 80, y: 210 },
    Isabella: { x: 280, y: 210 }, Jack: { x: 150, y: 240 }, Karen: { x: 400, y: 120 },
    Luna: { x: 440, y: 180 }, Mike: { x: 120, y: 270 }, Nina: { x: 360, y: 240 },
    Oliver: { x: 200, y: 300 }, Diana: { x: 30, y: 90 }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-2 h-80 overflow-hidden">
      <svg width="480" height="320" className="mx-auto">
        {/* Edges */}
        {edges.map((edge, index) => {
          const fromPos = positions[edge.from];
          const toPos = positions[edge.to];
          const isHighlighted = highlightPath.length >= 2 &&
            highlightPath.some((node, i) =>
              i < highlightPath.length - 1 &&
              ((highlightPath[i] === edge.from && highlightPath[i + 1] === edge.to) ||
                (highlightPath[i] === edge.to && highlightPath[i + 1] === edge.from))
            );

          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={fromPos.x} y1={fromPos.y}
              x2={toPos.x} y2={toPos.y}
              stroke={isHighlighted ? "#ef4444" : "#d1d5db"}
              strokeWidth={isHighlighted ? "3" : "1"}
              className={isHighlighted ? "animate-pulse" : ""}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const pos = positions[node.id];
          const isHighlighted = highlightNodes.includes(node.id);
          const isInPath = highlightPath.includes(node.id);

          return (
            <g key={node.id}>
              <circle
                cx={pos.x} cy={pos.y} r="12"
                fill={isInPath ? "#3b82f6" : isHighlighted ? "#fbbf24" : "#ffffff"}
                stroke={isInPath ? "#1d4ed8" : isHighlighted ? "#f59e0b" : "#6b7280"}
                strokeWidth="2"
                className={isHighlighted ? "animate-pulse" : ""}
              />
              <text
                x={pos.x} y={pos.y + 3}
                textAnchor="middle"
                className={`text-xs font-medium ${isInPath ? "fill-white" : "fill-gray-700"}`}
              >
                {node.id.length > 6 ? node.id.substring(0, 4) + '.' : node.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Enhanced BFS visualization with all steps
const BFSVisualization = ({ steps, currentStep }) => {
  if (!steps || steps.length === 0) return null;

  const step = steps[Math.min(currentStep, steps.length - 1)];

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-blue-800 text-sm">BFS Step {currentStep + 1}/{steps.length}</h4>
        <div className="text-xs text-blue-600">Level: {step.level}</div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <strong>Queue:</strong>
          <div className="bg-white p-1 rounded text-xs max-h-16 overflow-y-auto">
            {step.queue?.length > 0 ? step.queue.map((path, i) => (
              <div key={i} className="truncate">[{path.join('→')}]</div>
            )) : 'Empty'}
          </div>
        </div>
        <div>
          <strong>Visited:</strong>
          <div className="bg-white p-1 rounded text-xs">
            {step.visited?.join(', ') || 'None'}
          </div>
        </div>
      </div>

      <div className="bg-white p-2 rounded border text-xs">
        <strong>Action:</strong> {step.message}
      </div>
    </div>
  );
};

// Enhanced DFS visualization
const DFSVisualization = ({ steps, currentStep }) => {
  if (!steps || steps.length === 0) return null;

  const step = steps[Math.min(currentStep, steps.length - 1)];

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-yellow-800 text-sm">DFS Step {currentStep + 1}/{steps.length}</h4>
        <div className="text-xs text-yellow-600">Action: {step.action}</div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <strong>Current Path:</strong>
          <div className="bg-white p-1 rounded text-xs">
            {step.path?.join(' → ') || 'None'}
          </div>
        </div>
        <div>
          <strong>Stack:</strong>
          <div className="bg-white p-1 rounded text-xs">
            {step.stack?.join(', ') || 'Empty'}
          </div>
        </div>
      </div>

      <div className="bg-white p-2 rounded border text-xs">
        <strong>Action:</strong> {step.message}
      </div>
    </div>
  );
};

function App() {
  const [users, setUsers] = useState([]);
  const [from, setFrom] = useState("Alice");
  const [to, setTo] = useState("Nina");
  const [shortestPath, setShortestPath] = useState([]);
  const [pathSteps, setPathSteps] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [cycleSteps, setCycleSteps] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("path");
  const [visualizationStep, setVisualizationStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [usersRes, graphRes, statsRes] = await Promise.all([
          axios.get(`${API_BASE}/users`),
          axios.get(`${API_BASE}/graph`),
          axios.get(`${API_BASE}/stats`)
        ]);

        setUsers(usersRes.data.users);
        setGraphData({
          nodes: graphRes.data.nodes,
          edges: graphRes.data.edges
        });
        setStats(statsRes.data);
      } catch (error) {
        setError("Failed to load initial data. Please ensure the backend is running.");
      }
    };

    loadInitialData();
  }, []);

  // Auto-play visualization - always enabled
  useEffect(() => {
    if (!isPlaying) return;

    let maxSteps = 0;
    if (activeTab === "path" && pathSteps.length > 0) maxSteps = pathSteps.length;
    if (activeTab === "cycles" && cycleSteps.length > 0) maxSteps = cycleSteps.length;

    if (maxSteps === 0) return;

    const interval = setInterval(() => {
      setVisualizationStep(prev => {
        if (prev >= maxSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000); // Slower for better viewing

    return () => clearInterval(interval);
  }, [isPlaying, activeTab, pathSteps.length, cycleSteps.length]);

  const handleError = (error, operation) => {
    console.error(`Error in ${operation}:`, error);
    setError(`Failed to ${operation}. Please ensure the backend is running.`);
  };

  const findShortestPath = async () => {
    if (from === to) {
      setError("Source and destination cannot be the same!");
      return;
    }

    setLoading(true);
    setError("");
    setVisualizationStep(0);
    setIsPlaying(false);

    try {
      const response = await axios.post(`${API_BASE}/shortest-path`, { from, to });
      setShortestPath(response.data.path);
      setPathSteps(response.data.steps || []);
      if (response.data.path.length === 0) {
        setError("No path found between the selected users!");
      } else {
        // Auto-start visualization after finding path
        setTimeout(() => setIsPlaying(true), 500);
      }
    } catch (error) {
      handleError(error, "find shortest path");
    } finally {
      setLoading(false);
    }
  };

  const findCycles = async () => {
    setLoading(true);
    setError("");
    setVisualizationStep(0);
    setIsPlaying(false);

    try {
      const response = await axios.get(`${API_BASE}/cycles`);
      setCycles(response.data.cycles);
      setCycleSteps(response.data.steps || []);
      // Auto-start visualization
      setTimeout(() => setIsPlaying(true), 500);
    } catch (error) {
      handleError(error, "find cycles");
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError("");

  const getCurrentHighlightNodes = () => {
    if (activeTab === "cycles" && cycleSteps.length > 0 && visualizationStep < cycleSteps.length) {
      const step = cycleSteps[visualizationStep];
      return step.node ? [step.node] : [];
    }
    return [];
  };

  const resetVisualization = () => {
    setVisualizationStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-3 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Compact Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🌐 Social Network Explorer
          </h1>
          <p className="text-gray-600 text-sm">
            Interactive graph algorithms with live step-by-step visualization
          </p>
        </div>

        {/* Compact Statistics */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white rounded-lg shadow-lg p-2 text-center">
            <div className="text-xl font-bold text-blue-600">{stats.totalUsers || 0}</div>
            <div className="text-xs text-gray-600">Users</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-2 text-center">
            <div className="text-xl font-bold text-green-600">{stats.totalConnections || 0}</div>
            <div className="text-xs text-gray-600">Links</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-2 text-center">
            <div className="text-xl font-bold text-purple-600">{stats.averageConnections || 0}</div>
            <div className="text-xs text-gray-600">Avg</div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-3 flex items-center justify-between shadow-lg">
            <span className="flex items-center text-sm">
              <span className="text-lg mr-2">⚠️</span>
              {error}
            </span>
            <button
              onClick={clearError}
              className="text-red-700 hover:text-red-900 font-bold text-lg transition-colors"
            >
              ×
            </button>
          </div>
        )}

        {/* Main Content - Flex layout to use remaining space */}
        <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
          {/* Left Panel - Controls */}
          <div className="flex flex-col min-h-0">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-lg mb-4">
              <div className="flex border-b">
                <button
                  onClick={() => { setActiveTab("path"); resetVisualization(); }}
                  className={`px-4 py-2 font-semibold text-sm transition-colors flex-1 ${activeTab === "path"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  🔍 BFS Path Finding
                </button>
                <button
                  onClick={() => { setActiveTab("cycles"); resetVisualization(); }}
                  className={`px-4 py-2 font-semibold text-sm transition-colors flex-1 ${activeTab === "cycles"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  🔄 DFS Cycle Detection
                </button>
              </div>

              <div className="p-4 flex-1 overflow-y-auto">
                {/* Shortest Path Tab */}
                {activeTab === "path" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">From:</label>
                        <select
                          value={from}
                          onChange={(e) => setFrom(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          {users.map(user => (
                            <option key={user} value={user}>{user}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">To:</label>
                        <select
                          value={to}
                          onChange={(e) => setTo(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          {users.map(user => (
                            <option key={user} value={user}>{user}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={findShortestPath}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <LoadingDots />
                          <span className="ml-2">Finding...</span>
                        </div>
                      ) : (
                        "🔍 Find Shortest Path"
                      )}
                    </button>

                    {pathSteps.length > 0 && (
                      <BFSVisualization steps={pathSteps} currentStep={visualizationStep} />
                    )}

                    {shortestPath.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <h3 className="text-sm font-semibold text-green-800 mb-2">✅ Path Found:</h3>
                        <div className="flex items-center justify-center space-x-1 flex-wrap text-xs">
                          {shortestPath.map((user, index) => (
                            <div key={index} className="flex items-center">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                                {user}
                              </span>
                              {index < shortestPath.length - 1 && (
                                <span className="mx-1 text-gray-400">→</span>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-green-600 text-center mt-2">
                          🎯 Length: <strong>{shortestPath.length - 1}</strong> degrees
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Cycles Tab */}
                {activeTab === "cycles" && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-gray-600 mb-3 text-sm">Find tight-knit friend groups using DFS</p>
                      <button
                        onClick={findCycles}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 text-sm"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <LoadingDots />
                            <span className="ml-2">Analyzing...</span>
                          </div>
                        ) : (
                          "🔄 Find Friend Loops"
                        )}
                      </button>
                    </div>

                    {cycleSteps.length > 0 && (
                      <DFSVisualization steps={cycleSteps} currentStep={visualizationStep} />
                    )}

                    {cycles.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                          🔄 Found {cycles.length} Loop(s):
                        </h3>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {cycles.slice(0, 3).map((cycle, index) => (
                            <div key={index} className="bg-white p-2 rounded border">
                              <div className="flex items-center justify-center space-x-1 flex-wrap text-xs">
                                {cycle.map((user, userIndex) => (
                                  <div key={userIndex} className="flex items-center">
                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-medium">
                                      {user}
                                    </span>
                                    {userIndex < cycle.length - 1 && (
                                      <span className="mx-1 text-gray-400">→</span>
                                    )}
                                  </div>
                                ))}
                                <span className="mx-1 text-yellow-600">↺</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Visualization */}
          <div className="flex flex-col min-h-0">
            {/* Graph Visualization */}
            <div className="bg-white rounded-lg shadow-lg p-3 flex-1 min-h-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">🕸️ Network Graph</h3>
                <div className="flex items-center space-x-2 text-xs">
                  {isPlaying && (
                    <div className="flex items-center text-blue-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse mr-1"></div>
                      Playing...
                    </div>
                  )}
                  {((activeTab === "path" && pathSteps.length > 0) ||
                    (activeTab === "cycles" && cycleSteps.length > 0)) && (
                      <div className="text-gray-600">
                        Step {visualizationStep + 1}/{
                          activeTab === "path" ? pathSteps.length :
                            cycleSteps.length
                        }
                      </div>
                    )}
                </div>
              </div>

              <GraphVisualization
                nodes={graphData.nodes}
                edges={graphData.edges}
                highlightPath={activeTab === "path" ? shortestPath : []}
                highlightNodes={getCurrentHighlightNodes()}
                currentStep={visualizationStep}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

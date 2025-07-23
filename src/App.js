import React, { useState, useEffect } from 'react';

// Constants for grid dimensions
const GRID_ROWS = 20;
const GRID_COLS = 50;

// Initial node positions
const INITIAL_START_ROW = 10;
const INITIAL_START_COL = 5;
const INITIAL_END_ROW = 10;
const INITIAL_END_COL = 45;

// --- Helper Functions for Algorithms ---

// Core Dijkstra's algorithm logic
function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid);
  }
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}

// --- React Components ---

const Node = ({
  col,
  row,
  isFinish,
  isStart,
  isWall,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  const extraClassName = isFinish
    ? 'node-finish'
    : isStart
    ? 'node-start'
    : isWall
    ? 'node-wall'
    : '';

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    ></div>
  );
};

const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  
  // State to manage start/end node positions
  const [startNodeRow, setStartNodeRow] = useState(INITIAL_START_ROW);
  const [startNodeCol, setStartNodeCol] = useState(INITIAL_START_COL);
  const [endNodeRow, setEndNodeRow] = useState(INITIAL_END_ROW);
  const [endNodeCol, setEndNodeCol] = useState(INITIAL_END_COL);
  
  // State to track if we are moving the start or end node
  const [movingNode, setMovingNode] = useState(null); // 'start' or 'end'

  useEffect(() => {
    const grid = createInitialGrid();
    setGrid(grid);
  }, [startNodeRow, startNodeCol, endNodeRow, endNodeCol]); // Re-create grid if nodes move

  const createInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < GRID_COLS; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  const createNode = (col, row) => {
    return {
      col,
      row,
      isStart: row === startNodeRow && col === startNodeCol,
      isFinish: row === endNodeRow && col === endNodeCol,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };

  const handleMouseDown = (row, col) => {
    if (isVisualizing) return;
    if (row === startNodeRow && col === startNodeCol) {
      setMovingNode('start');
    } else if (row === endNodeRow && col === endNodeCol) {
      setMovingNode('end');
    } else {
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      setGrid(newGrid);
    }
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed || isVisualizing) return;
    if (movingNode === 'start') {
      setStartNodeRow(row);
      setStartNodeCol(col);
    } else if (movingNode === 'end') {
      setEndNodeRow(row);
      setEndNodeCol(col);
    } else {
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      setGrid(newGrid);
    }
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
    setMovingNode(null);
  };

  const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = { ...node, isWall: !node.isWall };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (!node.isStart && !node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className += ' node-visited';
        }
      }, 10 * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (!node.isStart && !node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className += ' node-shortest-path';
        }
      }, 50 * i);
    }
    setTimeout(() => setIsVisualizing(false), 50 * nodesInShortestPathOrder.length);
  };

  const visualizeDijkstra = () => {
    if (isVisualizing) return;
    setIsVisualizing(true);
    clearPath(); // Clear previous path visualizations
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[endNodeRow][endNodeCol];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };
  
  const clearPath = () => {
      for (let row = 0; row < grid.length; row++) {
          for (let col = 0; col < grid[0].length; col++) {
              const node = grid[row][col];
              if (!node.isStart && !node.isFinish && !node.isWall) {
                  document.getElementById(`node-${row}-${col}`).className = 'node';
              }
          }
      }
      // Reset node properties but keep walls
      const newGrid = grid.map(row => row.map(node => ({
          ...node,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
      })));
      setGrid(newGrid);
  }

  const clearBoard = () => {
    if (isVisualizing) return;
    clearPath();
    setStartNodeRow(INITIAL_START_ROW);
    setStartNodeCol(INITIAL_START_COL);
    setEndNodeRow(INITIAL_END_ROW);
    setEndNodeCol(INITIAL_END_COL);
    const newGrid = createInitialGrid();
    setGrid(newGrid);
  };

  return (
    <div className="flex flex-col">
      <nav className="bg-gray-800 p-4 flex items-center justify-center space-x-4 md:space-x-6">
        <h1 className="text-white text-xl md:text-2xl font-bold">Algo-Navigator</h1>
        <button
          onClick={visualizeDijkstra}
          disabled={isVisualizing}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-300"
        >
          Visualize Dijkstra
        </button>
        <button
          onClick={clearBoard}
          disabled={isVisualizing}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-300"
        >
          Clear Board
        </button>
      </nav>
      <div className="text-center my-4 text-gray-600">
        Click and drag the start (▶) and end (◉) nodes to move them. Click on the grid to add walls.
      </div>
      <div className="grid mx-auto mt-2" onMouseUp={handleMouseUp}>
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="grid-row">
            {row.map((node, nodeIdx) => (
              <Node
                key={nodeIdx}
                col={node.col}
                row={node.row}
                isFinish={node.isFinish}
                isStart={node.isStart}
                isWall={node.isWall}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseUp={handleMouseUp}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const Popup = ({ onContinue }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Welcome to Pathfinding Visualizer!</h2>
        <p>
          This project visualizes Dijkstra's algorithm, a popular algorithm for finding the shortest path between two nodes in a graph.
        </p>
        <h4>How it works:</h4>
        <ul>
          <li>Click and drag the start (▶) and end (◉) nodes to move them.</li>
          <li>Click on the grid to create walls, which the path cannot cross.</li>
          <li>Click "Visualize Dijkstra" to see the algorithm in action!</li>
        </ul>
        <button onClick={onContinue} className="continue-button">Continue</button>
      </div>
    </div>
  );
};


export default function App() {
  const [showPopup, setShowPopup] = useState(true);

  const handleContinue = () => {
    setShowPopup(false);
  };

  return (
    <>
      <style>{`
        body { margin: 0; font-family: sans-serif; }
        .grid { border-collapse: collapse; box-shadow: 0 8px 20px rgba(0,0,0,0.12); }
        .grid-row { display: flex; }
        .node {
          width: 25px;
          height: 25px;
          outline: 1px solid rgb(220, 238, 255);
          display: inline-block;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }
        .node:hover { background-color: #f0f8ff; }
        .node-start {
          background-color: #4caf50;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='5 3 19 12 5 21 5 3'%3E%3C/polygon%3E%3C/svg%3E");
          background-position: center;
          background-repeat: no-repeat;
          background-size: 60%;
          cursor: grab;
        }
        .node-finish {
          background-color: #f44336;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='white' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='4'%3E%3C/circle%3E%3C/svg%3E");
          background-position: center;
          background-repeat: no-repeat;
          background-size: 70%;
          cursor: grab;
        }
        .node-wall {
          background-color: #34495e;
          animation: wall-animation 0.3s ease-out forwards;
          border-radius: 2px;
        }
        @keyframes wall-animation {
          0% { transform: scale(0.7); }
          100% { transform: scale(1.0); }
        }
        .node-visited {
          animation-name: visitedAnimation;
          animation-duration: 1.5s;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
        @keyframes visitedAnimation {
          0% { transform: scale(0.3); background-color: #e74c3c; border-radius: 100%; }
          50% { background-color: #8e44ad; }
          75% { transform: scale(1.2); background-color: #3498db; }
          100% { transform: scale(1); background-color: #2980b9; }
        }
        .node-shortest-path {
          animation-name: shortestPath;
          animation-duration: 1.5s;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
        @keyframes shortestPath {
          0% { transform: scale(0.6); background-color: #f1c40f; }
          50% { transform: scale(1.2); background-color: #f1c40f; }
          100% { transform: scale(1); background-color: #f1c40f; }
        }
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .popup-content {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          text-align: center;
          max-width: 500px;
          animation: popup-animation 0.5s ease-out forwards;
        }
        
        @keyframes popup-animation {
          0% {
            transform: scale(0.7);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .popup-content h2 {
          margin-top: 0;
          color: #333;
        }

        .popup-content p, .popup-content ul {
          text-align: left;
          color: #666;
        }
        
        .popup-content h4 {
          text-align: left;
          color: #333;
          margin-top: 1rem;
        }
        
        .popup-content ul {
          list-style-position: inside;
          padding-left: 0;
        }

        .continue-button {
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          border: none;
          background-color: #4caf50;
          color: white;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s;
        }

        .continue-button:hover {
          background-color: #45a049;
        }
      `}</style>
      <script src="https://cdn.tailwindcss.com"></script>
      {showPopup ? <Popup onContinue={handleContinue} /> : <PathfindingVisualizer />}
    </>
  );
}
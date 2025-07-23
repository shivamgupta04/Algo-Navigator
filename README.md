# Algo-Navigator: Pathfinding Visualizer

Welcome to Algo-Navigator, an interactive web application designed to visualize pathfinding algorithms. This tool provides a hands-on experience with how algorithms like Dijkstra's find the shortest path between two points on a grid, navigating around obstacles.

## ✨ Features

- **Interactive Grid**: A fully interactive grid where you can define the start point, the end point, and obstacles (walls).
- **Dijkstra's Algorithm**: Implements Dijkstra's algorithm to find the shortest path.
- **Real-time Visualization**: Watch the algorithm explore the grid and then trace the shortest path with smooth, clear animations.
- **Draggable Nodes**: Easily move the start (▶) and end (◉) nodes by clicking and dragging them to new positions.
- **Wall Creation**: Click or drag your mouse across the grid to create or remove walls, creating complex mazes for the algorithm to solve.
- **Informative Welcome**: A welcome pop-up provides instructions and information about the project on the first load.
- **Control Buttons**: Simple controls to start the visualization, clear the discovered path, or reset the entire board.
- **Responsive Design**: The interface is built with Tailwind CSS for a clean and responsive experience on different screen sizes.

## 🛠️ Tech Stack

- **Frontend**: [React.js](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Core Logic**: JavaScript (ES6+)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.
- [Node.js](https://nodejs.org/) (which includes npm)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/algo-navigator.git](https://github.com/your-username/algo-navigator.git)
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd algo-navigator
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Run the application:**
    ```sh
    npm start
    ```
    The application will open in your default browser at `http://localhost:3000`.

## 📖 How to Use

1.  **Welcome Screen**: When you first open the app, you'll see a pop-up with instructions. Click "Continue" to proceed.
2.  **Set Up the Grid**:
    - The green "play" icon (▶) is your **start node**.
    - The red "target" icon (◉) is your **finish node**.
    - You can click and drag these nodes to any empty square on the grid.
3.  **Create Obstacles**:
    - Click on any empty grid cell to turn it into a **wall**.
    - Click and drag your mouse to draw multiple walls at once.
    - Clicking on an existing wall will remove it.
4.  **Visualize the Algorithm**:
    - Click the **"Visualize Dijkstra"** button to start the animation.
    - The algorithm will first explore neighboring nodes (visualized in blue).
    - Once the destination is reached, the shortest path will be highlighted in yellow.
5.  **Clear the Board**:
    - The **"Clear Board"** button will remove all walls and paths, resetting the grid to its initial state.


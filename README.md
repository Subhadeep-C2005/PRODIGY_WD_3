# PRODIGY_WD_03 - Tic-Tac-Toe

An interactive, responsive Tic-Tac-Toe web application developed as Task 03 for the Prodigy InfoTech Web Development Internship. 

## 🚀 Live Demo
**View the live deployed site here:** [https://prodigy-wd-3-ashy.vercel.app](https://prodigy-wd-3-ashy.vercel.app)

## ✨ Features
*   **Multiple Game Modes:** Choose between "2 Players" mode for local head-to-head play or "Vs Computer" mode to play against an AI.
*   **Unbeatable AI:** The computer opponent features an "Easy" difficulty (randomized moves) and a "Hard / Unbeatable" difficulty powered by the Minimax algorithm.
*   **Score Tracking:** Automatically tallies round wins for Player X, Player O (or Computer), and Draws.
*   **Data Persistence:** Game scores, selected game mode, AI difficulty, and theme preferences are automatically saved to the browser's local storage.
*   **Theme Customization:** Includes a built-in toggle to switch between dark and light modes seamlessly.
*   **Modern UI:** Features a cleanly designed game board using CSS Grid, complete with win-line highlighting, interactive hover states, and smooth pop animations.

## 🛠️ Technologies Used
*   **HTML5:** Semantic structure for the game board, status bar, and control buttons.
*   **CSS3:** Utilizes CSS variables for seamless theme switching and responsive design elements targeting mobile devices under 400px.
*   **JavaScript (Vanilla):** Handles the core game logic, the recursive Minimax algorithm for the AI, state management, and DOM updates.

## 📂 Project Structure
*   `index.html`: Contains the core HTML layout, including the mode selectors, scoreboards, and game grid.
*   `style.css`: Contains all styling, CSS variables for theming, and keyframe animations.
*   `app.js`: Contains the JavaScript logic for game state checking, AI movement, and local storage.

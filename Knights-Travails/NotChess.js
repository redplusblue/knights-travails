import { knightMoves } from "./KnightMoves.js";
import whitePawn from "./public/WhitePawn.svg";
import blackPawn from "./public/BlackPawn.svg";
import whiteKnight from "./public/WhiteKnight.svg";
import blackKnight from "./public/BlackKnight.svg";
import "./chessboard.css";
import "./sidebar.css";
import "./layout.css";

export const notChess = () => {
    let knightPosition;
    let pawnPositions = [];
    let statusScreen = document.getElementById("status");

    /**
     * Creates the chessboard and adds event listeners to the buttons.
     */
    const createBoard = () => {
        const board = document.getElementById("chessboard");
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const square = document.createElement("div");
                square.classList.add("square");
                // Cartesian coordinates
                square.id = `${7 - i},${j}`;
                if ((i + j) % 2 === 0) {
                    square.classList.add("white");
                } else {
                    square.classList.add("black");
                }
                board.appendChild(square);
            }
        }
        document.getElementById("knight-btn").disabled = true;
        document.getElementById("hunt-btn").disabled = true;
        document.getElementById("pawn-btn").addEventListener("click", () => {
            addPawn();
            statusScreen.innerHTML = "Click anywhere to add a pawn.";
            document.getElementById("pawn-btn").disabled = true;
        });
        document
            .getElementById("clear-btn")
            .addEventListener("click", clearBoard);
        document.getElementById("knight-btn").addEventListener("click", () => {
            addKnight();
            statusScreen.innerHTML = "Click on a square to add a knight.";
        });
        document.getElementById("hunt-btn").addEventListener("click", () => {
            statusScreen.innerHTML = "Time for the hunt!";
            hunt();
        });
        statusScreen.innerHTML = "Click the 'Pawn' button to add a pawn.";
    };

    /**
     * adds event listeners to the squares on the board to add pawns.
     */
    const addPawn = () => {
        const board = document.getElementById("chessboard");
        board.addEventListener("click", function (event) {
            const square = event.target;
            // Check if the square already has a pawn
            if (
                !square.querySelector(".pawn") &&
                !checkPawns() === true &&
                square.tagName !== "IMG"
            ) {
                // Create a new pawn element
                const pawn = document.createElement("div");
                pawn.classList.add("pawn");
                square.appendChild(pawn);

                // Set the color of the pawn based on the square color
                if (square.classList.contains("white")) {
                    pawn.innerHTML = `<img src="${whitePawn}">`;
                } else {
                    pawn.innerHTML = `<img src="${blackPawn}">`;
                }
                // Add the pawn to the pawnPositions array
                pawnPositions.push(square.id);
                // Allow the knight to be added
                document.getElementById("knight-btn").disabled = false;
                document.getElementById("pawn-btn").disabled = true;
                statusScreen.innerText =
                    "Click on the pawn to remove it, if you want to.\n" +
                    "If not, click the 'Knight' button to add a knight.";
                // Attach click event listener to the pawn element
                pawn.addEventListener("click", function () {
                    pawn.parentNode.removeChild(pawn);
                    statusScreen.innerHTML = "Click anywhere to add a pawn.";
                    // Remove the pawn from the pawnPositions array
                    pawnPositions.forEach((pawn, index) => {
                        if (pawn === square.id) {
                            pawnPositions.splice(index, 1);
                        }
                    });
                    if (pawnPositions.length === 0) {
                        document.getElementById("knight-btn").disabled = true;
                    }
                });
            }
        });
    };

    /**
     * Adds event listeners to the squares on the board to add a knight.
     * */
    const addKnight = () => {
        removeEventListeners();
        const board = document.getElementById("chessboard");
        board.addEventListener("click", function (event) {
            const square = event.target;
            // Check if the square already has a pawn
            if (
                !square.querySelector(".pawn") &&
                !square.querySelector(".knight") &&
                square.tagName !== "IMG" &&
                checkPawns()
                // Check if there are any pawns on the board
            ) {
                // Create a new knight element
                const knight = document.createElement("div");
                knight.classList.add("knight");
                square.appendChild(knight);

                // Set the color of the knight based on the square color
                if (square.classList.contains("white")) {
                    knight.innerHTML = `<img src="${whiteKnight}">`;
                } else {
                    knight.innerHTML = `<img src="${blackKnight}">`;
                }
                // Add the knight to the knightPositions array
                knightPosition = square.id;
                // Disable the knight button
                document.getElementById("knight-btn").disabled = true;
                document.getElementById("hunt-btn").disabled = false;
                statusScreen.innerText =
                    "Click on the knight to remove it, if you want to.\n" +
                    "If not, click the 'Hunt' button to start the hunt.";
                // Attach click event listener to the pawn element
                knight.addEventListener("click", function () {
                    knight.parentNode.removeChild(knight);
                    // Remove the knight from the knightPositions array
                    knightPosition = null;
                    statusScreen.innerHTML =
                        "Click on any square to add a knight.";
                    // Enable the knight button
                    document.getElementById("knight-btn").disabled = false;
                    document.getElementById("hunt-btn").disabled = true;
                });
            }
        });
    };

    // Clears the board
    const clearBoard = () => {
        document.getElementById("chessboard").innerHTML = "";
        removeEventListeners();
        createBoard();
        pawnPositions = [];
        knightPosition = null;
        document.getElementById("pawn-btn").disabled = false;
        document.getElementById("path").style.display = "none";
    };

    // Check if the board has pawns
    const checkPawns = () => {
        const pawns = document.querySelectorAll(".pawn");
        return true ? pawns.length > 0 : false;
    };

    // Clear all board event listeners
    const removeEventListeners = () => {
        const board = document.getElementById("chessboard");
        const squares = board.querySelectorAll(".square");

        // Create a new board element
        const newBoard = document.createElement("div");
        newBoard.id = "chessboard";

        // Add a copy of each square to the new board
        squares.forEach((square) => {
            const newSquare = square.cloneNode(true);
            newBoard.appendChild(newSquare);
        });

        // Replace the old board with the new board
        board.parentNode.replaceChild(newBoard, board);
    };

    const hunt = () => {
        document.getElementById("hunt-btn").disabled = true;
        pawnPositions.forEach((pawnPosition) => {
            let path = [];
            let knightPos = knightPosition.split(",");
            let pawnPos = pawnPosition.split(",");
            // Convert the knight and pawn positions to integers
            knightPos = knightPos.map((pos) => parseInt(pos));
            pawnPos = pawnPos.map((pos) => parseInt(pos));
            console.log(knightPos, pawnPos);
            if (knightPos[0] !== pawnPos[0] && knightPos[1] !== pawnPos[1]) {
                path = knightMoves(knightPos, pawnPos);
                console.log(path);
            }
            // If the knight can reach the pawn, highlight the path
            if (path) {
                document.getElementById("path").innerHTML = "Path: ";
                traversePath(path);
                knightPosition = pawnPosition;
                document.getElementById("path").style.display = "flex";
            }
        });
    };

    const traversePath = (path) => {
        // Set a delay of 1 seconds (1000ms) between each move
        const moveDelay = 1000;
        // Use a counter variable to keep track of the index of the current square in the path
        let i = 0;

        function moveKnight() {
            // Get the coordinate of the next square in the path
            const coordinate = path[i];

            // Get the knight and the current square
            const knight = document.querySelector(".knight");
            const currentSquare = knight.parentNode;

            // Get the next square and highlight it
            const nextSquare = document.getElementById(
                `${coordinate[0].toString()},${coordinate[1].toString()}`
            );
            document.getElementById(
                "path"
            ).innerText += `\n[${coordinate[0]}, ${coordinate[1]}]`;
            nextSquare.classList.add("highlighted");

            // If the next square contains a pawn, capture it and remove it from the board
            if (nextSquare.querySelector(".pawn")) {
                nextSquare.classList.add("captured");
                nextSquare
                    .querySelector(".pawn")
                    .parentNode.removeChild(nextSquare.querySelector(".pawn"));
                statusScreen.innerText = "We captured a pawn!";
            }

            // If the next square is white, display the white knight image, otherwise display the black knight image
            if (nextSquare.classList.contains("white")) {
                knight.innerHTML = `<img src="${whiteKnight}">`;
            } else {
                knight.innerHTML = `<img src="${blackKnight}">`;
            }

            // Move the knight to the next square and remove it from the current square
            nextSquare.appendChild(knight);
            // Increment the counter variable to move to the next square in the path
            i++;

            // If there are more squares in the path, set a timeout to move the knight to the next square
            if (i < path.length) {
                setTimeout(moveKnight, moveDelay);
            }
        }

        // Call the recursive function to start the movement of the knight
        moveKnight();
    };

    createBoard();
};

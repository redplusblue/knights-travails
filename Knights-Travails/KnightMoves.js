export function knightMoves(start, end) {
    if (start[0] === end[0] && start[1] === end[1]) {
        return [start];
    }
    // Define all possible moves of the knight
    const moves = [
        [-2, -1],
        [-1, -2],
        [1, -2],
        [2, -1],
        [2, 1],
        [1, 2],
        [-1, 2],
        [-2, 1],
    ];

    // Initialize the BFS queue with the starting square
    const queue = [[start]];

    // Initialize a set to keep track of visited squares
    const visited = new Set([start.toString()]);

    while (queue.length > 0) {
        // Dequeue the first path from the queue
        const path = queue.shift();

        // Get the current square from the end of the path
        const currSquare = path[path.length - 1];

        // Check if we have reached the target square
        if (currSquare[0] === end[0] && currSquare[1] === end[1]) {
            return path;
        }

        // Generate all possible next squares and add them to the queue
        for (const move of moves) {
            const newSquare = [
                currSquare[0] + move[0],
                currSquare[1] + move[1],
            ];

            // Check if the new square is within the bounds of the board
            // and has not been visited before
            if (
                newSquare[0] >= 0 &&
                newSquare[0] <= 7 &&
                newSquare[1] >= 0 &&
                newSquare[1] <= 7 &&
                !visited.has(newSquare.toString())
            ) {
                const newPath = [...path, newSquare];
                queue.push(newPath);
                visited.add(newSquare.toString());
            }
        }
    }

    // If we reach here, there is no valid path from start to end
    return null;
}


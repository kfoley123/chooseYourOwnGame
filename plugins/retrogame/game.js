let gameStep = 0;  // Variable to track game progress

// Function to reset the game
function resetGame() {
    gameStep = 0;  // Reset the game step to the start
    document.getElementById('game-content').innerHTML = `
        <h1>Welcome to the Game!</h1>
        <p>Beware the darkness that lies ahead...</p>
        <p>Do you wish to start?</p>
    `;
    document.getElementById('game-output').innerHTML = '';  // Clear game output

    // Show input and button again
    document.getElementById('user-input').style.display = 'block';
    document.getElementById('submit-action').style.display = 'block';
}

// Initial game setup
resetGame();

document.getElementById('submit-action').addEventListener('click', function() {
    var userInput = document.getElementById('user-input').value.toLowerCase();
    var output = document.getElementById('game-output');

    // Clear previous messages and input field on each click
    output.innerHTML = '';
    document.getElementById('user-input').value = '';  // Clear the input field

    if (gameStep === 0) {
        if (userInput === 'yes') {
            // Move to the next step of the game
            document.getElementById('game-content').innerHTML = `
                <p>You find yourself in a foggy forest at night.</p>
                <p>You come to a fork in the woods. Do you go left, right, or turn back?</p>
            `;
            gameStep++;  // Move to the next game step
        } else if (userInput === 'no') {
            output.innerHTML = 'Maybe next time... Game Over.';

            // Hide input and button during "Game Over" screen
            document.getElementById('user-input').style.display = 'none';
            document.getElementById('submit-action').style.display = 'none';

            setTimeout(resetGame, 3000);  // Restart the game after 3 seconds
        } else {
            output.innerHTML = 'You must be certain! You must say "yes" or "no".';
        }
    } else if (gameStep === 1) {
        if (userInput === 'left' || userInput === 'turn back') {
            document.getElementById('game-content').innerHTML = 'You have met a tragic end. Game Over.';

            // Hide input and button during "Game Over" screen
            document.getElementById('user-input').style.display = 'none';
            document.getElementById('submit-action').style.display = 'none';

            setTimeout(resetGame, 3000);  // Restart the game after 3 seconds
        } else if (userInput === 'right') {
            document.getElementById('game-content').innerHTML = 'You venture deeper into the woods, ready for your next challenge...';
        } else {
            output.innerHTML = 'Invalid choice. Please type "left", "right", or "turn back".';
        }
    }
});

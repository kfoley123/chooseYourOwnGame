let gameStep = 0;  // Variable to track game progress

// Function to reset the game
function resetGame() {
    gameStep = 0;  // Reset the game step to the start
    loadGameStep(gameStep);  // Load the initial step via AJAX

    // Show input and button again
    document.getElementById('user-input').style.display = 'block';
    document.getElementById('submit-action').style.display = 'block';
}

// Function to update the game content
async function loadGameStep(stepNumber) {
    try {
        const response = await fetch('/wp-admin/admin-ajax.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=get_story_step&step_number=${stepNumber}`
        });
        
        const result = await response.json();

        if (result.success) {
            const data = result.data;

            document.getElementById('game-content').innerHTML = `<p>${data.text}</p>`;

            const optionsHTML = data.options.map(option => 
                `<button onclick="makeChoice(${option.next_step})">${option.user_input}</button>`
            ).join('');

            document.getElementById('game-output').innerHTML = optionsHTML;
        }
    } catch (error) {
        console.error('Error loading game step:', error);
    }
}

// Initial game setup
resetGame();

document.getElementById('submit-action').addEventListener('click', function() {
    const userInput = document.getElementById('user-input').value.toLowerCase();
    const output = document.getElementById('game-output');

    // Clear previous messages and input field on each click
    output.innerHTML = '';
    document.getElementById('user-input').value = '';  // Clear the input field

    // Instead of managing steps directly, let AJAX handle it
    if (gameStep === 0) {
        if (userInput === 'yes') {
            gameStep++;  // Move to the next game step
            loadGameStep(gameStep);
        } else if (userInput === 'no') {
            output.innerHTML = 'Maybe next time... Game Over.';
            document.getElementById('user-input').style.display = 'none';
            document.getElementById('submit-action').style.display = 'none';
            setTimeout(resetGame, 3000);  // Restart the game after 3 seconds
        } else {
            output.innerHTML = 'You must be certain! You must say "yes" or "no".';
        }
    }
    // The AJAX logic will now handle steps after the initial response.
});

let gameStep = 0;  // Variable to track game progress
let gameOver = false;

// Function to reset the game
function resetGame() {
    gameStep = 0;  // Reset the game step to the start
    gameOver = false; // Reset the game over flag
    loadGameStep(gameStep);  // Load the initial step via AJAX

    // Show input and button again
    document.getElementById('user-input').style.display = 'block';
    document.getElementById('submit-action').style.display = 'block';
}

// Function to update the game content
async function loadGameStep(stepNumber) {
    if (gameOver) return; // Prevent loading new steps if the game is over
    console.log(`Loading game step: ${stepNumber}`); // Check the current step
    try {
        const response = await fetch('/wp-admin/admin-ajax.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=get_story_step&step_number=${stepNumber}`
        });

        console.log('Response status:', response.status); // Log response status
        const result = await response.json();
        console.log('AJAX response:', result); // Log the entire result

        if (result.success) {
            console.log('Game step loaded:', result.data); // Log the loaded step
            const data = result.data;

            // Ensure that data.text is defined
            if (data && data.text) {
                // Display the story text
                document.getElementById('game-content').innerHTML = `<p>${data.text}</p>`;
            } else {
                console.error('No text found for this step:', data);
            }

            // Create buttons for options and display them
            const optionsHTML = data.options.map(option => 
                `<button onclick="makeChoice(${option.next_step})">${option.user_input}</button>`
            ).join('');

            document.getElementById('game-output').innerHTML = optionsHTML;

            // Check if the current step is a game-over step
            if (data.is_game_over) {
                console.log("Game Over condition met");
                displayDeathScreen();  // Show the death screen if the step is a game-over
            }
        } else {
            console.error('Failed to load game step:', result.message);
        }
    } catch (error) {
        console.error('Error loading game step:', error);
    }
}

// Function to handle player's choice
function makeChoice(nextStep) {
    if (!gameOver) {
        gameStep = nextStep; // Update the game step based on the player's choice
        loadGameStep(gameStep); // Load the new game step
    }
}

// Function to display the death screen
function displayDeathScreen() {
    gameOver = true; // Set the game over flag
    console.log("death screen is working");
    const deathScreen = `
    <pre style="font-family: monospace; color: limegreen;">
                                           .""--.._
                                           []      \`'--.._
                                           ||__           \`'-,
                                         \`)||_ \`\`\`'--..         \\
                     _                    /|//}              \`\`--._  |
                  .' \` \`'              /////}                   \`\\/
                 /  .""".\\              //{///    
                /  /_  _\`\\            // \`||
                | |(_)(_)||          _//   ||
                | |  /\\  )|        _///\\   ||
                | |L====J |       / |/ |   ||
               /  /'-..-' /    .' \`  \\  |   ||
              /   |  :: | |_.- \`      |  \\  ||
             /|   \`\\-::.| |          \\   | ||
           / \` \`|   /    | |          |   / ||
         | \`    \\   |    / /          \\  |  ||
        |       \`\\_|    |/      ,.__. \\ |  ||
        /                     / \`    \`\\ ||  ||
       |           .         /        \\||  ||
       |                     |         |/  ||
       /         /           |         (   ||
      /          .           /          )  ||
     |            \\          |             ||
    /             |          /             ||
   |\\            /          |              ||
   \\ \`-._       |           /              ||
    \\ ,//\\    /\\           |              ||
     ///\\  \\  |             \\              ||
    |||| ) |__/             |              ||
    |||| \`.(                |              ||
    \`\\\\\` /                 /              ||
       /                   /              ||
      /                     |              ||
     |                      \\              ||
    /                        |             ||
  /\\                          \\            ||
/\\                            |            ||
\`-.___,-.      .-.        ___,'            ||
        Game Over!
        </pre>`;

    document.getElementById('game-content').innerHTML = deathScreen;

    // Hide input and button during "Game Over" screen
    document.getElementById('user-input').style.display = 'none';
    document.getElementById('submit-action').style.display = 'none';

    setTimeout(resetGame, 3000);  // Restart the game after 3 seconds
}

// Initial game setup
resetGame();

// Set up event listener for user input
document.getElementById('submit-action').addEventListener('click', function() {
    if (gameOver) return; // Prevent any action if the game is over
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
});

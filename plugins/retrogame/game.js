let gameStep = 0; // Initialize the starting step
let gameOver = false;

// Function to load the game step
async function loadGameStep(stepNumber = 0) {
    try {
        const response = await fetch('/wp-admin/admin-ajax.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=get_story_step&step_number=${stepNumber}`
        });

        const result = await response.json();

        if (result.success) {
            const data = result.data;

            // Display the game text
            document.getElementById('game-content').innerHTML = `<p>${data.text}</p>`;

            // Handle game-over state if specified by the backend
            if (data.is_game_over) {
                displayDeathScreen();  // Show the death screen if the step is a game-over
                
            }
        } else {
            console.error('Failed to load game step:', result.message);
        }
    } catch (error) {
        console.error('Error loading game step:', error);
    }
}

// Call the function to load the first step when the game starts
document.addEventListener('DOMContentLoaded', () => {
    loadGameStep(); // Load the first step (step 0)
});

// Function to handle the user's choice
async function makeChoice(userInput) {
    try {
        const response = await fetch('/wp-admin/admin-ajax.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=process_choice&user_input=${encodeURIComponent(userInput)}&current_step=${gameStep}`
        });

        const result = await response.json();

        if (result.success) {
            gameStep = result.data.next_step; // Update to the next game step from server response
            loadGameStep(gameStep); // Load the new game step
        } else {
            document.getElementById('game-output').innerHTML = 'Invalid command. Try again.';
        }
    } catch (error) {
        console.error('Error processing choice:', error);
    }
}

// Event listener for the submit button
document.getElementById('submit-action').addEventListener('click', () => {
    const userInput = document.getElementById('user-input').value;
    makeChoice(userInput);
    document.getElementById('user-input').value = ''; // Clear input field after submission
});


// Function to reset the game
function resetGame() {
    gameStep = 0;  // Reset the game step to the start
    gameOver = false; // Reset the game over flag
    loadGameStep(gameStep);  // Load the initial step via AJAX

    // Show input and button again
    document.getElementById('user-input').style.display = 'block';
    document.getElementById('submit-action').style.display = 'block';
}


// Function to display the death screen
function displayDeathScreen() {
    gameOver = true; // Set the game over flag

    // Clear previous content from game-content before displaying "Game Over"
    document.getElementById('game-content').innerHTML = '';

    const deathScreen = `
    <pre>
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

    // Delay resetting the game by 3 seconds (3000 milliseconds)
    setTimeout(() => {
        resetGame(); // Restart the game after the delay
    }, 3000);
}

// Initial game setup
resetGame();

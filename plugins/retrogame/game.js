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
            console.log(result.data);


            // Display the game text
            document.getElementById('game-content').innerHTML = `<p>${data.text}</p>`;

            // Handle game-over state if specified by the backend
            if (data.is_game_over) {
                displayDeathScreen();  // Show the death screen if the step is a game-over
                
            }
            if (data.image) {
                console.log(data.image);
                document.querySelector('#story-image').src = data.image;
                document.querySelector('#story-image').style.display = 'block';
            } else {
                document.querySelector('#story-image').style.display = 'none';
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

document.addEventListener('DOMContentLoaded', () => {
    resetGame(); // Start game

    const userInput = document.getElementById('user-input');
    const submitButton = document.getElementById('submit-action');

    // Function to handle submission logic
    const handleSubmission = () => {
        const inputText = userInput.value.trim();
        if (inputText) {
            makeChoice(inputText);
            userInput.value = ''; 
        }
    };

    // Add click event listener to the submit button
    submitButton.addEventListener('click', handleSubmission);

    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            handleSubmission(); 
        }
    });
});


// Function to handle the user's choice
async function makeChoice(userInput) {
    const gameOutputElement = document.getElementById('game-output');

    // Explicitly clear any existing messages or output at the start
    gameOutputElement.innerHTML = '';

    try {
        const response = await fetch('/wp-admin/admin-ajax.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=process_choice&user_input=${encodeURIComponent(userInput)}&current_step=${gameStep}`
        });

        const result = await response.json();

        if (result.success) {
            // Clear any lingering messages explicitly
            gameOutputElement.innerHTML = '';

            // Update the game step and load the new step
            gameStep = result.data.next_step;
            loadGameStep(gameStep);
        } else {
            // Display the specific invalid message
            if (result.data && result.data.invalid_message) {
                gameOutputElement.innerHTML = result.data.invalid_message;
            } else {
                gameOutputElement.innerHTML = 'Invalid input. Please try again.';
            }
        }
    } catch (error) {
        console.error('Error processing choice:', error);

        // Optionally display a generic error message
        gameOutputElement.innerHTML = 'An unexpected error occurred. Please try again.';
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
    document.body.classList.remove('game-over'); // Remove 'game-over' class from body
    loadGameStep(gameStep);  // Load the initial step via AJAX

    // Show input and button again
    document.getElementById('user-input').style.display = 'block';
    document.getElementById('submit-action').style.display = 'block';
}


// Function to display the death screen
function displayDeathScreen() {
    gameOver = true; // Set the game over flag
    document.body.classList.add('game-over');

    // Clear previous content from game-content before displaying "Game Over"
    document.getElementById('game-content').innerHTML = '';

   

    const deathScreen = `
    <div style="text-align: center;">
    <img src="./wp-content/plugins/retrogame/images/youDied.jpg" alt="Game Over Image" style="width: 400px; margin-bottom: 10px;">
        
    <pre>
    ▄████  ▄▄▄       ███▄ ▄███▓▓█████     ▒█████   ██▒   █▓▓█████  ██▀███        
    ██▒ ▀█▒▒████▄    ▓██▒▀█▀ ██▒▓█   ▀    ▒██▒  ██▒▓██░   █▒▓█   ▀ ▓██ ▒ ██▒      
   ▒██░▄▄▄░▒██  ▀█▄  ▓██    ▓██░▒███      ▒██░  ██▒ ▓██  █▒░▒███   ▓██ ░▄█ ▒      
   ░▓█  ██▓░██▄▄▄▄██ ▒██    ▒██ ▒▓█  ▄    ▒██   ██░  ▒██ █░░▒▓█  ▄ ▒██▀▀█▄        
   ░▒▓███▀▒ ▓█   ▓██▒▒██▒   ░██▒░▒████▒   ░ ████▓▒░   ▒▀█░  ░▒████▒░██▓ ▒██▒      
    ░▒   ▒  ▒▒   ▓▒█░░ ▒░   ░  ░░░ ▒░ ░   ░ ▒░▒░▒░    ░ ▐░  ░░ ▒░ ░░ ▒▓ ░▒▓░      
     ░   ░   ▒   ▒▒ ░░  ░      ░ ░ ░  ░     ░ ▒ ▒░    ░ ░░   ░ ░  ░  ░▒ ░ ▒░      
   ░ ░   ░   ░   ▒   ░      ░      ░      ░ ░ ░ ▒       ░░     ░     ░░   ░       
         ░       ░  ░       ░      ░  ░       ░ ░        ░     ░  ░   ░           
                                                        ░                         
                                                                                  
                                                                 
                                              
    </pre>
    </div>`;



    document.getElementById('game-content').innerHTML = deathScreen;
       // Hide input and button during "Game Over" screen
       document.getElementById('user-input').style.display = 'none';
       document.getElementById('submit-action').style.display = 'none';
   
       // Delay resetting the game by 3 seconds (3000 milliseconds)
       setTimeout(resetGame, 3000);
   }
   

// Initial game setup
document.addEventListener('DOMContentLoaded', () => {
    resetGame(); // Start game
});
document.getElementById('submit-action').addEventListener('click', function() {
    var userInput = document.getElementById('user-input').value.toLowerCase();
    var output = document.getElementById('game-output');

    if (userInput === 'left' || userInput === 'turn back') {
        output.innerHTML = 'You have met a tragic end. Game Over.';
    } else if (userInput === 'right') {
        output.innerHTML = 'You venture deeper into the woods, ready for your next challenge...';
    } else {
        output.innerHTML = 'Invalid choice. Please type "left", "right", or "turn back".';
    }
});

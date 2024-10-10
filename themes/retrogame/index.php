<?php
get_header(); ?>

<div class="terminal-game">
    <h1>Welcome to the Retro Adventure Game!</h1>
    <textarea id="game-text" rows="10" readonly>
    Welcome to the adventure game! Your journey begins now...
    </textarea>
    <br>
    <input class="playerInput" type="text" id="player-input" placeholder="Enter your command..." autofocus>
    <br><br>
    <input type="submit" id="submit-command" value="Submit">
</div>

<?php get_footer(); ?>

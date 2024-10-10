<?php
/**
 * Plugin Name: RetroGame
 * Description: A choose your own adventure game.
 * Version: 1.0
 * Author: Kortney Foley
 */

// Enqueue JavaScript
function retrogame_enqueue_scripts() {
    wp_enqueue_script('retrogame-js', plugins_url('/game.js', __FILE__), array('jquery'), null, true);
}
add_action('wp_enqueue_scripts', 'retrogame_enqueue_scripts');

// Shortcode to display the game
function retrogame_display_game() {
    ob_start();  // Start output buffering
    ?>
    <div id="game">
        <h1>Welcome to the Game!</h1>
        <p>Beware the darkness that lies ahead...</p>
        <p>You find yourself in a foggy forest at night. You come to a fork in the woods. Do you go left, right, or turn back?</p>
        <input type="text" id="user-input" placeholder="Type your action here...">
        <button id="submit-action">Submit</button>
        <div id="game-output"></div>
    </div>
    <?php
    return ob_get_clean();  // Return the buffered output
}
add_shortcode('retrogame', 'retrogame_display_game');  // Register the shortcode

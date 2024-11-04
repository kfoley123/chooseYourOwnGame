<?php
function get_story_step($step_number) {
    global $wpdb;
    $story_table = $wpdb->prefix . 'story_steps';
    $options_table = $wpdb->prefix . 'options';

    // Fetch the story step based on the step number
    $step = $wpdb->get_row($wpdb->prepare("SELECT * FROM $story_table WHERE step_number = %d", $step_number), ARRAY_A);
    
    if (!$step) {
        return null; // Return null if no step is found
    }

    // Fetch options for the current step
    $options = $wpdb->get_results($wpdb->prepare("SELECT * FROM $options_table WHERE step_id = %d", $step['id']), ARRAY_A);
    
    // Add options to the step data
    $step['options'] = $options;

    // Check if the current step is a game-over step
    $step['is_game_over'] = !empty($step['is_game_over']) && $step['is_game_over'] == 1;

    return $step;
}

add_action('wp_ajax_get_story_step', 'ajax_get_story_step');
add_action('wp_ajax_nopriv_get_story_step', 'ajax_get_story_step');

function ajax_get_story_step() {
    // Check if the step number is provided
    if (!isset($_POST['step_number'])) {
        wp_send_json_error('Missing step number.');
        wp_die();
    }

    $step_number = intval($_POST['step_number']);
    $step_data = get_story_step($step_number);

    // Check if the step data was found
    if ($step_data === null) {
        wp_send_json_error('Step not found.');
    } else {
        wp_send_json_success($step_data);
    }
    wp_die(); // Properly end the AJAX request
}

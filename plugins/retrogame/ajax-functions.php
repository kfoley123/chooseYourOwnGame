<?php
function get_story_step() {
    global $wpdb;
    $story_table = $wpdb->prefix . 'story_steps';

    // Get step number from the AJAX request; default to 0 if not provided
    $step_number = isset($_POST['step_number']) ? intval($_POST['step_number']) : 0;

    // Fetch the story step based on the step number
    $step = $wpdb->get_row($wpdb->prepare("SELECT * FROM $story_table WHERE step_number = %d", $step_number), ARRAY_A);
    
    if (!$step) {
        wp_send_json_error('Step not found.'); // Return error response if no step is found
        wp_die(); // Properly end the AJAX request
    }

    // Build the image URL dynamically based on your image folder location
    $image_path = !empty($step['image_path']) ? esc_url(plugin_dir_url(__FILE__) . 'images/' . $step['image_path']) : null;


    // Prepare the response
    $response = [
        'text' => $step['text'],
        'is_game_over' => !empty($step['is_game_over']) && $step['is_game_over'] == 1,
        'options' => json_decode($step['options'], true), // Decode the JSON options
        'image' => $image_path // Include the dynamically constructed image URL
    ];

    wp_send_json_success($response); // Send JSON success response
    wp_die(); // Properly end the AJAX request
}



// Add the action hook for AJAX requests
add_action('wp_ajax_get_story_step', 'get_story_step');
add_action('wp_ajax_nopriv_get_story_step', 'get_story_step');


function process_choice() {
    global $wpdb;
    $story_table = $wpdb->prefix . 'story_steps';

    // Get current step and user input from the AJAX request
    $current_step = isset($_POST['current_step']) ? intval($_POST['current_step']) : 0;
    $user_input = isset($_POST['user_input']) ? sanitize_text_field($_POST['user_input']) : '';

    // Fetch the current story step data
    $step = $wpdb->get_row($wpdb->prepare("SELECT * FROM $story_table WHERE step_number = %d", $current_step), ARRAY_A);

    if (!$step) {
        wp_send_json_error('Current step not found.');
        wp_die();
    }

    // Decode the options to find a match for user input
    $options = json_decode($step['options'], true);
    $next_step = null;
    $is_correct = false;

    foreach ($options as $option) {
        if (strtolower($option['input']) === strtolower($user_input)) {
            $next_step = $option['is_correct'] ? $option['next_step'] : 666; // Go to 666 if choice is incorrect
            $is_correct = $option['is_correct'];
            break;
        }
    }

    if ($next_step !== null) {
        wp_send_json_success(['next_step' => $next_step, 'is_game_over' => !$is_correct]);
    } else {
        // Fetch the invalid_message for the current step
        $invalid_message = isset($step['invalid_message']) ? $step['invalid_message'] : 'Invalid choice. Please try again.'; // Default message if not set
        wp_send_json_error(['invalid_message' => $invalid_message]); // Send it as part of the error response
    }

    wp_die();
}

add_action('wp_ajax_process_choice', 'process_choice');
add_action('wp_ajax_nopriv_process_choice', 'process_choice');
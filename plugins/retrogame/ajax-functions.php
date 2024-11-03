<?php

function get_story_step($step_number) {
    global $wpdb;
    $story_table = $wpdb->prefix . 'story_steps';
    $options_table = $wpdb->prefix . 'options';

    $step = $wpdb->get_row($wpdb->prepare("SELECT * FROM $story_table WHERE step_number = %d", $step_number), ARRAY_A);
    $options = $wpdb->get_results($wpdb->prepare("SELECT * FROM $options_table WHERE step_id = %d", $step['id']), ARRAY_A);
    
    $step['options'] = $options;
    return $step;
}

add_action('wp_ajax_get_story_step', 'ajax_get_story_step');
add_action('wp_ajax_nopriv_get_story_step', 'ajax_get_story_step');

function ajax_get_story_step() {
    if (!isset($_POST['step_number'])) {
        wp_send_json_error('Missing step number.');
        wp_die();
    }

    $step_number = intval($_POST['step_number']);
    $step_data = get_story_step($step_number);

    wp_send_json_success($step_data);
    wp_die();
}

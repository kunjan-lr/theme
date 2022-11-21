<?php
add_action('rest_api_init', 'register_rest_images' );
function register_rest_images(){
    register_rest_field( array('post','page','team-members'),
        'fimg_url',
        array(
            'get_callback'    => 'get_rest_featured_image',
            'update_callback' => null,
            'schema'          => null,
        )
    );
	register_meta( 'post', 'post_view_count', array(
        'type' => 'string',
        'description' => 'Post view counts',
        'single' => true,
        'show_in_rest' => true
    ));
	register_rest_field( array('post'),
	'author_url',
	array(
		'get_callback'    => 'get_author_profile_image',
		'update_callback' => null,
		'schema'          => null,
	)
	);
	register_rest_field( array('user'),
	'author_position',
	array(
		'get_callback'    => 'get_author_position',
		'update_callback' => null,
		'schema'          => null,
	)
	);
}

function get_rest_featured_image( $object, $field_name, $request ) {
    if( $object['featured_media'] ){
        $img = wp_get_attachment_image_src( $object['featured_media'], 'app-thumb' );
        return $img[0];
    }
    return false;
}

function get_author_profile_image( $object, $field_name, $request ) {
    if( $object['author'] ){
	
		$profile_image = esc_url( get_avatar_url( $object['author'], ['size' => 'full'] ) );
        return $profile_image;
    }
    return false;
}

function get_author_position( $user, $field_name, $request ) {
    if( $user['id'] ){	
		$position = get_user_meta( $user['id'], 'position' , true );
        return $position;
    }
    return false;
}

if ( ! function_exists( 'faq_cpt' ) ) {
 
    // register custom post type
    function faq_cpt() {
    
        // these are the labels in the admin interface, edit them as you like
        $labels = array(
            'name'                => _x( 'FAQs', 'Post Type General Name', 'tuts_faq' ),
            'singular_name'       => _x( 'FAQ', 'Post Type Singular Name', 'tuts_faq' ),
            'menu_name'           => __( 'FAQ', 'tuts_faq' ),
            'parent_item_colon'   => __( 'Parent Item:', 'tuts_faq' ),
            'all_items'           => __( 'All Items', 'tuts_faq' ),
            'view_item'           => __( 'View Item', 'tuts_faq' ),
            'add_new_item'        => __( 'Add New FAQ Item', 'tuts_faq' ),
            'add_new'             => __( 'Add New', 'tuts_faq' ),
            'edit_item'           => __( 'Edit Item', 'tuts_faq' ),
            'update_item'         => __( 'Update Item', 'tuts_faq' ),
            'search_items'        => __( 'Search Item', 'tuts_faq' ),
            'not_found'           => __( 'Not found', 'tuts_faq' ),
            'not_found_in_trash'  => __( 'Not found in Trash', 'tuts_faq' ),
        );
        $args = array(
            // use the labels above
            'labels'              => $labels,
            // we'll only need the title, the Visual editor and the excerpt fields for our post type
            'supports'            => array( 'title', 'editor', 'excerpt', ),
            // we're going to create this taxonomy in the next section, but we need to link our post type to it now
            'taxonomies'          => array( 'tuts_faq_tax' ),
            // make it public so we can see it in the admin panel and show it in the front-end
            'public'              => true,
            // show the menu item under the Pages item
            'menu_position'       => 20,
            // show archives, if you don't need the shortcode
            'has_archive'         => true,
            'show_in_rest'         => true,
        );
        register_post_type( 'faq', $args );
    
    }
    
    // hook into the 'init' action
    add_action( 'init', 'faq_cpt', 0 );     
}

function get_my_menu() {
    // Replace your menu name, slug or ID carefully
    return wp_get_nav_menu_items('Top Menu');
}

// Register Custom Post Type
function create_team_members() {

	$labels = array(
		'name'                  => _x( 'Team Members', 'Post Type General Name', 'cw-custom-post-types' ),
		'singular_name'         => _x( 'Team Member', 'Post Type Singular Name', 'cw-custom-post-types' ),
		'menu_name'             => __( 'Team Members', 'cw-custom-post-types' ),
		'name_admin_bar'        => __( 'Team Members', 'cw-custom-post-types' ),
		'archives'              => __( 'Team Member Archives', 'cw-custom-post-types' ),
		'parent_item_colon'     => __( 'Parent Team Member:', 'cw-custom-post-types' ),
		'all_items'             => __( 'All Team Members', 'cw-custom-post-types' ),
		'add_new_item'          => __( 'Add New Team Member', 'cw-custom-post-types' ),
		'add_new'               => __( 'Add New', 'cw-custom-post-types' ),
		'new_item'              => __( 'New Team Member', 'cw-custom-post-types' ),
		'edit_item'             => __( 'Edit Team Member', 'cw-custom-post-types' ),
		'update_item'           => __( 'Update Team Member', 'cw-custom-post-types' ),
		'view_item'             => __( 'View Team Member', 'cw-custom-post-types' ),
		'search_items'          => __( 'Search Team Member', 'cw-custom-post-types' ),
		'not_found'             => __( 'Not found', 'cw-custom-post-types' ),
		'not_found_in_trash'    => __( 'Not found in Trash', 'cw-custom-post-types' ),
		'featured_image'        => __( 'Featured Image', 'cw-custom-post-types' ),
		'set_featured_image'    => __( 'Set featured image', 'cw-custom-post-types' ),
		'remove_featured_image' => __( 'Remove featured image', 'cw-custom-post-types' ),
		'use_featured_image'    => __( 'Use as featured image', 'cw-custom-post-types' ),
		'insert_into_item'      => __( 'Insert into Team Member', 'cw-custom-post-types' ),
		'uploaded_to_this_item' => __( 'Uploaded to this Team Member', 'cw-custom-post-types' ),
		'items_list'            => __( 'Team Members list', 'cw-custom-post-types' ),
		'items_list_navigation' => __( 'Team Members list navigation', 'cw-custom-post-types' ),
		'filter_items_list'     => __( 'Filter Team Members list', 'cw-custom-post-types' ),
	);
	$args = array(
		'label'                 => __( 'Team Member', 'cw-custom-post-types' ),
		'description'           => __( 'Chalk and Ward Team Members', 'cw-custom-post-types' ),
		'labels'                => $labels,
		'hierarchical'          => false,
		'public'                => true,
		'show_ui'               => true,
		'show_in_menu'          => true,
		'menu_position'         => 20,
		'menu_icon'             => 'dashicons-groups',
		'show_in_admin_bar'     => true,
		'show_in_nav_menus'     => true,
		'can_export'            => true,
		'has_archive'           => true,		
		'exclude_from_search'   => false,
		'publicly_queryable'    => true,
		'capability_type'       => 'page',
        'supports'              => array( 'title', 'thumbnail', 'editor' ),
        'show_in_rest'          => true,
	);
	register_post_type( 'team-members', $args );

}
add_action( 'init', 'create_team_members', 0 );

add_action( 'rest_api_init', function () {
    register_rest_route( 'wp/v2', 'menu', array(
        'methods' => 'GET',
        'callback' => 'get_my_menu',
    ) );
} );

add_action( 'rest_api_init', 'register_api_hooks' );
function register_api_hooks() {
  register_rest_route(
    'custom-api', '/login/',
    array(
      'methods'  => 'POST',
      'callback' => 'login',
    )
  );
}

function login($request){
    $creds = array();
    $creds['user_login'] = $request["username"];
    $creds['user_password'] =  $request["password"];
    $creds['remember'] = true;
    $user = wp_signon( $creds, true );

    if ( is_wp_error($user) )
      echo $user->get_error_message();

    $id = $user->ID;
    $meta = get_user_meta($id);
	$user_info = get_userdata($id);

    return $user_info;
}

add_action('rest_api_init', 'wp_rest_user_endpoints');
/**
 * Register a new user
 *
 * @param  WP_REST_Request $request Full details about the request.
 * @return array $args.
 **/
function wp_rest_user_endpoints($request) {
  /**
   * Handle Register User request.
   */
  register_rest_route('wp/v2', 'users/register', array(
    'methods' => 'POST',
    'callback' => 'wc_rest_user_endpoint_handler',
  ));
}
function wc_rest_user_endpoint_handler($request = null) {
    
  $response = array();
  $parameters = $request->get_params();	
  $username = sanitize_text_field($parameters['username']);
  $email = sanitize_text_field($parameters['email']);
  $password = sanitize_text_field($parameters['password']);

  // $role = sanitize_text_field($parameters['role']);
  $error = new WP_Error();
  if (empty($username)) {
    $error->add(400, __("Username field 'username' is required.", 'wp-rest-user'), array('status' => 400));
    return $error;
  }
  if (empty($email)) {
    $error->add(401, __("Email field 'email' is required.", 'wp-rest-user'), array('status' => 400));
    return $error;
  }
  if (empty($password)) {
    $error->add(404, __("Password field 'password' is required.", 'wp-rest-user'), array('status' => 400));
    return $error;
  }

  $user_id = username_exists($username);
  if (!$user_id && email_exists($email) == false) {
    $user_id = wp_create_user($username, $password, $email);
    if (!is_wp_error($user_id)) {
      // Ger User Meta Data (Sensitive, Password included. DO NOT pass to front end.)
      $user = get_user_by('id', $user_id);
      // $user->set_role($role);
      $user->set_role('subscriber');
      // WooCommerce specific code
      if (class_exists('WooCommerce')) {
        $user->set_role('customer');
      }
      // Ger User Data (Non-Sensitive, Pass to front end.)
      $response['code'] = 200;
      $response['message'] = __("User '" . $username . "' Registration was Successful", "wp-rest-user");
    } else {
      return $user_id;
    }
  } else {
    $error->add(406, __("Email already exists, please try 'Reset Password'", 'wp-rest-user'), array('status' => 400));
    return $error;
  }
  return new WP_REST_Response($response, 123);
}
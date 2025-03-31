<?php
/**
 * Theme functions and definitions.
 *
 * @package Sinatra
 * @author  Sinatra Team <hello@sinatrawp.com>
 * @since   1.0.0
 */

/**
 * Main Sinatra class.
 *
 * @since 1.0.0
 */
final class Sinatra {

	/**
	 * Singleton instance of the class.
	 *
	 * @since 1.0.0
	 * @var object
	 */
	private static $instance;

	/**
	 * Theme version.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public $version = '1.3';

	/**
	 * Main Sinatra Instance.
	 *
	 * Insures that only one instance of Sinatra exists in memory at any one
	 * time. Also prevents needing to define globals all over the place.
	 *
	 * @since 1.0.0
	 * @return Sinatra
	 */
	public static function instance() {

		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof Sinatra ) ) {
			self::$instance = new Sinatra();

			self::$instance->constants();
			self::$instance->includes();
			self::$instance->objects();

			// Hook now that all of the Sinatra stuff is loaded.
			do_action( 'sinatra_loaded' );
		}
		return self::$instance;
	}

	/**
	 * Primary class constructor.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function __construct() {
	}

	/**
	 * Setup constants.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	private function constants() {

		if ( ! defined( 'SINATRA_THEME_VERSION' ) ) {
			define( 'SINATRA_THEME_VERSION', $this->version );
		}

		if ( ! defined( 'SINATRA_THEME_URI' ) ) {
			define( 'SINATRA_THEME_URI', get_parent_theme_file_uri() );
		}

		if ( ! defined( 'SINATRA_THEME_PATH' ) ) {
			define( 'SINATRA_THEME_PATH', get_parent_theme_file_path() );
		}
	}

	/**
	 * Include files.
	 *
	 * @since  1.0.0
	 * @return void
	 */
	public function includes() {

		require_once SINATRA_THEME_PATH . '/inc/common.php';
		require_once SINATRA_THEME_PATH . '/inc/deprecated.php';
		require_once SINATRA_THEME_PATH . '/inc/helpers.php';
		require_once SINATRA_THEME_PATH . '/inc/widgets.php';
		require_once SINATRA_THEME_PATH . '/inc/template-tags.php';
		require_once SINATRA_THEME_PATH . '/inc/template-parts.php';
		require_once SINATRA_THEME_PATH . '/inc/icon-functions.php';
		require_once SINATRA_THEME_PATH . '/inc/breadcrumbs.php';
		require_once SINATRA_THEME_PATH . '/inc/class-sinatra-dynamic-styles.php';

		// Core.
		require_once SINATRA_THEME_PATH . '/inc/core/class-sinatra-options.php';
		require_once SINATRA_THEME_PATH . '/inc/core/class-sinatra-enqueue-scripts.php';
		require_once SINATRA_THEME_PATH . '/inc/core/class-sinatra-fonts.php';
		require_once SINATRA_THEME_PATH . '/inc/core/class-sinatra-theme-setup.php';
		require_once SINATRA_THEME_PATH . '/inc/core/class-sinatra-db-updater.php';

		// Compatibility.
		require_once SINATRA_THEME_PATH . '/inc/compatibility/woocommerce/class-sinatra-woocommerce.php';
		require_once SINATRA_THEME_PATH . '/inc/compatibility/socialsnap/class-sinatra-socialsnap.php';
		require_once SINATRA_THEME_PATH . '/inc/compatibility/class-sinatra-wpforms.php';
		require_once SINATRA_THEME_PATH . '/inc/compatibility/class-sinatra-jetpack.php';
		require_once SINATRA_THEME_PATH . '/inc/compatibility/class-sinatra-endurance.php';
		require_once SINATRA_THEME_PATH . '/inc/compatibility/class-sinatra-beaver-themer.php';
		require_once SINATRA_THEME_PATH . '/inc/compatibility/class-sinatra-elementor.php';
		require_once SINATRA_THEME_PATH . '/inc/compatibility/class-sinatra-elementor-pro.php';
		require_once SINATRA_THEME_PATH . '/inc/compatibility/class-sinatra-hfe.php';

		if ( is_admin() ) {
			require_once SINATRA_THEME_PATH . '/inc/utilities/class-sinatra-plugin-utilities.php';
			require_once SINATRA_THEME_PATH . '/inc/admin/class-sinatra-admin.php';
		}

		// Customizer.
		require_once SINATRA_THEME_PATH . '/inc/customizer/class-sinatra-customizer.php';
	}

	/**
	 * Setup objects to be used throughout the theme.
	 *
	 * @since  1.0.0
	 * @return void
	 */
	public function objects() {

		sinatra()->options    = new Sinatra_Options();
		sinatra()->fonts      = new Sinatra_Fonts();
		sinatra()->icons      = new Sinatra_Icons();
		sinatra()->customizer = new Sinatra_Customizer();

		if ( is_admin() ) {
			sinatra()->admin = new Sinatra_Admin();
		}
	}
}

/**
 * The function which returns the one Sinatra instance.
 *
 * Use this function like you would a global variable, except without needing
 * to declare the global.
 *
 * Example: <?php $sinatra = sinatra(); ?>
 *
 * @since 1.0.0
 * @return object
 */
function sinatra() {
	return Sinatra::instance();
}

sinatra();


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = sanitize_text_field($_POST["name"]);
    $email = sanitize_email($_POST["email"]);
    $phone = sanitize_text_field($_POST["phone"]);
    $refNumber = sanitize_text_field($_POST["refNumber"]);
    $bagging = sanitize_float_field($_POST["bagging"]);
    $bags = sanitize_float_field($_POST["bags"]);
    $caps = sanitize_float_field($_POST["caps"]);
    $designEditing = sanitize_float_field($_POST["designEditing"]);
    $digitizing = sanitize_float_field($_POST["digitizing"]);
    $editingHours = sanitize_float_field($_POST["editingHours"]);
    $fleece = sanitize_float_field($_POST["fleece"]);
    $jackets = sanitize_float_field($_POST["jackets"]);
    $leather = sanitize_float_field($_POST["leather"]);
    $numOfColors = sanitize_text_field($_POST["numOfColors"]);
    $performance = sanitize_float_field($_POST["performance"]);
    $personalization = sanitize_text_field($_POST["personalization"]);
    $personalizationOne = sanitize_text_field($_POST["personalizationOne"]);
    $personalizationTwo = sanitize_text_field($_POST["personalizationTwo"]);
    $projectSpeed = sanitize_text_field($_POST["projectSpeed"]);
    $sherpa = sanitize_float_field($_POST["sherpa"]);
    $stitchCost = sanitize_float_field($_POST["stitchCost"]);
    $stitchCount = sanitize_text_field($_POST["stitchCount"]);
    $towels = sanitize_float_field($_POST["towels"]);
  
    // Add code to save the form data to the database
    global $wpdb;
    $table_name = $wpdb->prefix . 'fmd_cust_estimates';
    $data = array(
      'name' => $name,
      'email' => $email,
      'phone' => $phone,
      'refNumber' => $refNumber,
      'bagging' => $bagging,
      'bags' => $bags,
      'caps' => $caps,
      'designEditing' => $designEditing,
      'digitizing' => $digitizing,
      'editingHours' => $editingHours,
      'fleece' => $fleece,
      'jackets' => $jackets,
      'leather' => $leather,
      'numOfColors' => $numOfColors,
      'performance' => $performance,
      'personalization' => $personalization,
      'personalizationOne' => $personalizationOne,
      'personalizationTwo' => $personalizationTwo,
      'projectSpeed' => $projectSpeed,
      'sherpa' => $sherpa,
      'stitchCost' => $stitchCost,
      'stitchCount' => $stitchCount,
      'towels' => $towels,
      'submission_time' => current_time('mysql')
    );
    $insert_result = $wpdb->insert($table_name, $data);
  
    if ($insert_result === false) {
      $response = array(
        'success' => false,
        'message' => 'Error saving the form data.',
      );
    } else {
      $response = array(
        'success' => true,
        'message' => 'Form data saved successfully.'
      );
    }
  
    // Return the JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
  }

  function display_contact_form_submissions_page() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'fmd_cust_estimates';
    $form_data = $wpdb->get_results("SELECT * FROM $table_name WHERE name <> '' AND email <> '' AND message <> '' ORDER BY submission_time DESC", ARRAY_A);
  
    ?>
    <div class="wrap">
      <h1>Estimate Submissions</h1>
      <table class="wp-list-table widefat fixed striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Reference Number</th>
            <th>Submission Time</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($form_data as $data) : ?>
            <tr>
              <td><?php echo esc_html($data['name']); ?></td>
              <td><?php echo esc_html($data['email']); ?></td>
              <td><?php echo esc_html($data['refNumber']); ?></td>
              <td><?php echo esc_html($data['submission_time']); ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  <?php }
  
  function register_contact_form_submissions_page() {
    add_menu_page(
      'Estimate Submissions',
      'Form Submissions',
      'manage_options',
      'estimate_submissions',
      'display_estimate_submissions_page',
      'dashicons-feedback'
    );
  }
  add_action('admin_menu', 'register_estimate_submissions_page');
?>
<?php

$file = new cfile;
$file->Page_Main();

//
// Page class for file viewer
//
class cfile {

	// Page ID
	var $PageID = "file";

	// Project ID
	var $ProjectID = "{CA090781-3F30-4766-A426-E529534DA6E5}";

	// Page object name
	var $PageObjName = "file";

	// Page name
	function PageName() {
		return ew_CurrentPage();
	}

	// Page URL
	function PageUrl() {
		return ew_CurrentPage() . "?";
	}

	// Main
	// - Uncomment ** for database connectivity / Page_Loading / Page_Unloaded server event
	function Page_Main() {
		global $conn, $UserProfile;
		$GLOBALS["Page"] = &$this;

		//**$conn = ew_Connect();
		// Get fn / table name parameters

		$key = EW_RANDOM_KEY . session_id();
		$fn = (@$_GET["fn"] <> "") ? $_GET["fn"] : "";
		$fn = ew_Decrypt($fn, $key); // File path is always encrypted
		$table = (@$_GET["t"] <> "") ? $_GET["t"] : "";
		if ($table <> "" && EW_ENCRYPT_FILE_PATH)
			$table = ew_Decrypt($table, $key);

		// User profile
		$UserProfile = new cUserProfile();

		// Security
		$Security = new cAdvancedSecurity();
		if (!$Security->IsLoggedIn()) $Security->AutoLogin();
		$Security->TablePermission_Loading();
		$Security->LoadCurrentUserLevel(CurrentProjectID() . $table);
		$Security->TablePermission_Loaded();
		if (!$Security->CanList()) exit(); // No permission

		// Global Page Loading event (in userfn*.php)
		//**Page_Loading();
		// Get resize parameters

		$resize = (@$_GET["resize"] <> "");
		$width = (@$_GET["width"] <> "") ? $_GET["width"] : 0;
		$height = (@$_GET["height"] <> "") ? $_GET["height"] : 0;
		if (@$_GET["width"] == "" && @$_GET["height"] == "") {
			$width = EW_THUMBNAIL_DEFAULT_WIDTH;
			$height = EW_THUMBNAIL_DEFAULT_HEIGHT;
		}

		// Resize image from physical file
		if ($fn <> "") {
			$fn = str_replace("\0", "", $fn);
			$info = pathinfo($fn);
			if (file_exists($fn) || @fopen($fn, "rb") !== FALSE) {
				if (ob_get_length())
					ob_end_clean();
			
				$ext = strtolower(@$info["extension"]);
				$ct = ew_ContentType("", $fn);
				if ($ct <> "")
					header("Content-type: " . $ct);
				$download = !isset($_GET["download"]) || $_GET["download"] == "1"; // Download by default
				if ($download)
					header("Content-Disposition: attachment; filename=\"" . $info["basename"] . "\"");
									
				header('Access-Control-Allow-Origin: *'); //Permitir cross-domain	
				
				if (in_array($ext, explode(",", EW_IMAGE_ALLOWED_FILE_EXT))) {
					$size = @getimagesize($fn);
					if ($size)
						header("Content-type: {$size['mime']}");
					if ($width > 0 || $height > 0)
						echo ew_ResizeFileToBinary($fn, $width, $height);
					else
						echo file_get_contents($fn);
				} elseif (in_array($ext, explode(",", EW_DOWNLOAD_ALLOWED_FILE_EXT))) {
					echo file_get_contents($fn);
				}
			}
		}

		// Global Page Unloaded event (in userfn*.php)
		//**Page_Unloaded();
		// Close connection
		//**ew_CloseConn();

	}
}
?>

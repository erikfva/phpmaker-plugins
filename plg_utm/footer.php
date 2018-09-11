<?php
echo "
				<script type=\"text/javascript\">
				coolTemplate(
					$('<div/>').appendTo('body').load('".$plgConf["plugins_path"]."plg_utm/dialog.min.html',function(){
						buildUTMDialog();
					})
				);

				</script>
				";

	ew_AddClientScript($plgConf["plugins_path"]."plg_utm/utm2lat.min.js");
			
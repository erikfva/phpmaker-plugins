<?php
	function css($newcss){
		global $__css;
		$__css = empty($__css)? $newcss : $__css.$newcss;
	}
?>
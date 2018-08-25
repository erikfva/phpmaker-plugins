<?php
	function css($newcss){
		global $__css;
		$__css = empty($__css)? $newcss : $__css.$newcss;
	}
	function Stylesheet($url){
		global $__cssUrl;
		$__cssUrl[] = $url;
	}	
	function ClientScript($url){
		global $__scriptUrl;
		$__scriptUrl[] = $url;
	}
?>
<?php
echo "
				<script type=\"text/javascript\">
				jQuery(document).ready(function(){
					$('textarea.autosize').each(function(){
						autosize(this);
					  }).on('autosize:resized', function(){
						if(typeof resizeIFRM == 'function') resizeIFRM();
					});
				});
				</script>
				";
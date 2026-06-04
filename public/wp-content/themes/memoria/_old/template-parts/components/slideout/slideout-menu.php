<?php
	/**
	* Slideout menu for mobile
	*
	* Exit if accessed directly
	**/
	if ( !defined( 'ABSPATH' ) ) { exit; }
?>
<div id="slideout-menu" class="slideout slideout-horizontal" data-width="350px" data-direction="left" data-orientation="horizontal">
	<div class="slideout-menu">
		<header class="slideout-header flex-nowrap flex-align-items-center">
			<h3 class="slideout-title">Menu</h3>
			
			<button className="slideout-close pointer unstyled" type="button">
				<span className="icon-wrapper">
					<svg className="icon icon-close-thin">
						<use xlinkHref="#icon-close-thin"></use>
					</svg>
				</span>
			</button>
		</header>

		<div class="slideout-scrollbar scrollbar">
			<div class="slideout-content" role="presentation">
				<!-- navigation goes here -->
			</div>
		</div>
	</div>
</div>
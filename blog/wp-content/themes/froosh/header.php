<html>
  <head>
    <title><?php
  	/*
  	 * Print the <title> tag based on what is being viewed.
  	 */
  	global $page, $paged;

  	wp_title( '|', true, 'right' );

  	// Add the blog name.
  	bloginfo( 'name' );

  	// Add the blog description for the home/front page.
  	$site_description = get_bloginfo( 'description', 'display' );
  	if ( $site_description && ( is_home() || is_front_page() ) )
  		echo " | $site_description";

  	// Add a page number if necessary:
  	if ( $paged >= 2 || $page >= 2 )
  		echo ' | ' . sprintf( __( 'Page %s', 'twentyeleven' ), max( $paged, $page ) );

  	?></title>
    	<link rel="stylesheet" href="/css/style.css" />
    	<link type="text/css" href="/css/Aristo/jquery-ui-1.8.7.custom.css" rel="stylesheet" />	
			<link href='http://fonts.googleapis.com/css?family=Coustard' rel='stylesheet' type='text/css'>
			<link rel="shortcut icon" type="image/x-icon" href="/images/favicon.ico">
		<script type="text/javascript" src="/js/jquery-1.4.4.min.js"></script>
		<script type="text/javascript" src="/js/jquery-ui-1.8.10.custom.min.js"></script>
		<script type="text/javascript" src="/js/froosh/froosh.js"></script>
	<?
	wp_head();
	?>
  </head>
  <body id="index" class="desktop">
  	<div id="container">
			<div id="header">
				<a href="/" class="image"><img src="/images/logo.png" /></a>
				<div class="subhead">food <span class="dark">:</span> sweet <span class="dark">:</span> food</div>
			</div>
			<div id="content" class="wp-column-left">

(function($) {

	'use strict';

	/* global io */ //global io is defined by socket.io

	// define semi-global variables (vars that are "global" in this file's scope) and prefix them
	// with sg so we can easily distinguish them from "normal" vars



	/**
	* initialize the socket, and send event containing it to the page
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var initIo = function() {
		io = io();
		io.on('connectionready', () => {
			$(document).trigger('connectionready.socket', io);		
		});
	};
	

	// kick off script when dom is ready
	document.addEventListener('DOMContentLoaded', initIo);

})(jQuery);
(function() {

	'use strict';

	/* global io */ //global io is defined by socket.io


	/**
	* initialize the socket, and send event containing it to the page
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var initIo = function() {
		io = io();
		io.on('connectionready', () => {
			const evt = new CustomEvent('connectionready.socket');
			document.dispatchEvent(evt);
		});
	};
	

	// kick off script when dom is ready
	document.addEventListener('DOMContentLoaded', initIo);

})();
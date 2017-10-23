/*
* show the id of this page's socket connection
*/
;(function() {

	'use strict';

	/* global io */ //instruction for jshint

	//globals:
	//window.io is defined by socket.IO.
	//It represents the socket server.
	//io is a bit of a strange name, but it's being used in examples everywhere,
	//so let's stick to that.



	/**
	* initialize the remote
	* @returns {undefined}
	*/
	var init = function() {
		const elm = document.querySelector('#id-box .user-id');
		if (elm) {
			elm.textContent = io.id;
		}
	};


	// single point of entry: init when connection is ready	
	document.addEventListener('connectionready.socket', init);
})();
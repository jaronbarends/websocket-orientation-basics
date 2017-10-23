(function() {

	'use strict';

	/* global io */ //instruction for jshint

	//globals:
	//window.io is defined by socket.IO.
	//It represents the socket server.
	//io is a bit of a strange name, but it's being used in examples everywhere,
	//so let's stick to that.


	// define semi-global variables (vars that are "global" in this file's scope) and prefix them
	// with sg so we can easily distinguish them from "normal" vars
	var sgRole = 'hub';
	


	/**
	* add event listeners for socket
	* @returns {undefined}
	*/
	var initSocketListeners = function() {
		// add events you want to listen for, like this:
		// io.on('newuser', newUserHandler);
	};


	/**
	* send event to server to request entry to room
	* by joining a room, we can track which users disconnect
	* @returns {undefined}
	*/
	var joinRoom = function() {
		var user = {
				role: sgRole,
				id: io.id,
			};

		// tell socket we want to join the room
		io.emit('join', user);
	};
		
	
	/**
	* initialize this hub when
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var initHub = function() {
		initSocketListeners();
		joinRoom();
	};



	// init when connection is ready	
	document.addEventListener('connectionready.socket', initHub);

})();
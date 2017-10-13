(function($) {

	'use strict';

	/* global io */ //instruction for jshint

	//globals:
	//window.io is defined by socket.IO.
	//It represents the socket server.
	//io is a bit of a strange name, but it's being used in examples everywhere,
	//so let's stick to that.


	// define semi-global variables (vars that are "global" in this file's scope) and prefix them
	// with sg so we can easily distinguish them from "normal" vars
	var $sgOrientationTable = $('#orientation-table');


	// define semi-global variables (vars that are "global" in this file's scope) and prefix them
	// with sg so we can easily distinguish them from "normal" vars

	
	/**
	* handle socket's acceptance of join request
	* @param {object} data Data sent by the socket (currently empty)
	* @returns {undefined}
	*/
	var joinedHandler = function(data) {
		// this script's page has joined the room
	};



	/**
	* handle entry of new user in the room
	* @param {object} users Updated array with users; the newly added user is the last one in the array
	* @returns {undefined}
	*/
	var newUserHandler = function(users) {
		// we might want to add a table for a user's device
	};



	/**
	* handle user disconnecting
	* @param {object} data Object containing disconnected user's id
	* @returns {undefined}
	*/
	var disconnectHandler = function(data) {
		if (data.removedUser) {
			// there is no removed user when a client disconnects that hadn't joined the room yet
		}
	};
	


	/**
	* handle the orientation change of one of the remote devices
	* @param {object} data Data sent by remote.js's tiltchange event
	* @returns {undefined}
	*/
	var tiltChangeHandler = function(data) {
		showOrientationData(data);
	};



	/**
	* show orientation data DIFFERENT DEVICES ARE NOT DISTINGUISHED YET
	* @param {object} data Data sent by remote.js's tiltchange event
	* @returns {undefined}
	*/
	var showOrientationData = function(data) {
		$sgOrientationTable.removeClass('u-hidden');
		var orientation = data.orientation;

		var h = '<tr>';
			h += '<td>'+orientation.tiltLR+'</td>';
			h += '<td>'+orientation.tiltFB+'</td>';
			h += '<td>'+orientation.dir+'</td>';
			h += '</td>';

		$sgOrientationTable.append(h);
		var $trs = $sgOrientationTable.find('tr');
		if ($trs.length === 12) {
			$trs.eq(1).remove();
		}
	};
		
	

	/**
	* add event listeners for socket
	* @returns {undefined}
	*/
	var initSocketListeners = function() {
		io.on('joined', joinedHandler);
		io.on('newuser', newUserHandler);
		io.on('disconnect', disconnectHandler);
		io.on('tiltchange', tiltChangeHandler);
	};


	
	/**
	* initialize this hub when
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var initTableView = function() {
		initSocketListeners();
	};

	
	/**
	* kick off the app once the socket is ready
	* @param {event} e The ready.socket event sent by socket js
	* @param {Socket} socket This client's socket
	* @returns {undefined}
	*/
	var connectionReadyHandler = function(e, io) {
		if (io) {
			initTableView();
		}
	};
	
	
	/**

	* initialize the app
	* (or rather: set a listener for the socket connection to be ready, the handler will initialize the app)
	* @returns {undefined}
	*/
	var init = function() {
		$(document).on('connectionready.socket', connectionReadyHandler);
	};

	document.addEventListener('DOMContentLoaded', init);

})(jQuery);
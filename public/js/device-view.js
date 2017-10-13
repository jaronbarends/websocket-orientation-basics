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
	var sgRole = 'hub',
		sgDeviceIdPrefix = 'device-',//prefix used for device elements' ids
		$sgDevices = $('#devices-container'),
		sgUsers = [];//array of users, in order of joining


	/**
	* handle socket's acceptance of join request
	* @param {object} data Data sent by the socket (currently empty)
	* @returns {undefined}
	*/
	var joinedHandler = function(data) {
		//this hub has been joined the room
	};


	/**
	* create a device on screen for a user
	* @param {object} data Info about the newly connected user
	* @returns {undefined}
	*/
	var createDevice = function(data) {
		var deviceId = sgDeviceIdPrefix+data.id,
			$clone = $('#clone-src')
				.find('.user-device')
				.clone()
				.attr('id', deviceId)
				.find('.user')
					.text(data.username)
				.end()
				.find('.user-color')
					.css('background', data.color)
				.end()
				.hide()
				.appendTo($sgDevices)
				.fadeIn();
	};


	/**
	* remove a device from screen
	* @returns {undefined}
	*/
	var removeDevice = function(id) {
		var deviceId = sgDeviceIdPrefix+id;
		$('#'+deviceId).fadeOut(function(){$(this).remove();});
	};
	


	/**
	* handle entry of new user in the room
	* @param {object} users Updated array with users; the newly added user is the last one in the array
	* @returns {undefined}
	*/
	var newUserHandler = function(users) {
		var newUser = users[users.length-1];

		sgUsers = users;
		if (newUser.role === 'remote') {
			createDevice(newUser);
		}
	};


	/**
	* handle user disconnecting
	* @param {object} data Object containing disconnected user's id
	* @returns {undefined}
	*/
	var disconnectHandler = function(data) {
		//console.log('disconnect', data);
		if (data.removedUser) {
			//there is no removed user when a client disconnects that hadn't joined the room yet
			var removedUserId = data.removedUser.id;
			removeDevice(removedUserId);
		}
	};
	


	/**
	* handle the orientation change of one of the remote devices
	* @param {object} data Data sent by remote.js's tiltchange event
	* @returns {undefined}
	*/
	var tiltChangeHandler = function(data) {
		var orientation = data.orientation;

		var dirCorrection = 0;//direction is determined by the devices angle relative to the screen at the time of connecting

		orientation.tiltFB -= 90;//tiltFB = 0 when remote device is horizontal, we want it to correspond with vertical screen
		orientation.dir += dirCorrection;

		var rotateLR = "rotate3d(0,0,1, "+ orientation.tiltLR +"deg)",
			rotateFB = "rotate3d(1,0,0, "+ (orientation.tiltFB*-1)+"deg)",
			rotateDir = "rotate3d(0,0,1, "+(orientation.dir*-1)+"deg)";

		var $device = $('#'+sgDeviceIdPrefix+data.id).find('.device');//TODO: move devices in array and search array
		
		var css = {
			transform: rotateLR+' '+rotateFB+' '+rotateDir
		};

		$device.css(css);
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
	* initialize this view when connection is ready
	* @returns {undefined}
	*/
	var initView = function() {
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
			initView();
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
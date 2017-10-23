;(function() {

	'use strict';

	/* global io */ //instruction for jshint

	//globals:
	//window.io is defined by socket.IO.
	//It represents the socket server.
	//io is a bit of a strange name, but it's being used in examples everywhere,
	//so let's stick to that.


	// define semi-global variables (vars that are "global" in this file's scope) and prefix them
	// with sg so we can easily distinguish them from "normal" vars
	var sgUsername = '',
		sgRole = 'remote',
		sgOrientation = {
			tiltLR: 0,
			tiltFB: 0,
			dir: 0
		},
		sgCompassCorrection = 0,
		sgScreenAngle,
		sgUsers = [];//array of users, in order of joining

	
	/**
	* add identifier for this user
	* @returns {undefined}
	*/
	var initIdentifier = function() {
		document.querySelector('#id-box .user-id').textContent = io.id;
	};


	/**
	* handle socket's acceptance of entry request (so this page has entered the room)
	* @param {object} data Data sent by the socket (currently empty)
	* @returns {undefined}
	*/
	var joinedHandler = function(data) {
		document.getElementById('login-form').classList.add('u-is-hidden');
	};


	/**
	* handle entry of new user in the room
	* @param {object} users Updated array with users; the newly added user is the last one in the array
	* @returns {undefined}
	*/
	var newUserHandler = function(users) {
	};


	/**
	* handle user disconnecting 
	* @returns {undefined}
	*/
	var userDisconnectHandler = function() {
	};
	


	/**
	* add event listeners for so cket
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var initSocketListeners = function() {
		io.on('joined', joinedHandler);
		io.on('newuser', newUserHandler);
		io.on('disconnect', userDisconnectHandler);
	}
;

	/**
	* send event to server to request entry to room
	* @returns {undefined}
	*/
	var joinRoom = function() {
		var user = {
				role: sgRole,
				id: io.id,
				username: sgUsername
			};

		io.emit('join', user);
	};


	/**
	* when remote is tilted, send orientation data and this device's id to the socket
	* @param {event} e The tiltchange.deviceorientation event sent by device-orientation.js
	* @returns {undefined}
	*/
	var tiltChangeHandler = function(e) {
		const data = e.detail;

		var tiltLR = Math.round(data.tiltLR),
			tiltFB = Math.round(data.tiltFB),
			dir = Math.round(data.dir);

		dir -= sgCompassCorrection;

		if (sgOrientation.tiltLR !== tiltLR || sgOrientation.tiltFB !== tiltFB || sgOrientation.dir !== dir) {
			sgOrientation = {
				tiltLR: tiltLR,
				tiltFB: tiltFB,
				dir: dir
			};

			var newData = {
				id: io.id,
				orientation: sgOrientation
			};
			window.util.sockets.sendEventToSockets('tiltchange', newData);
		}
	};


	/**
	* initialize stuff for handling device orientation changes
	* listen for events triggered on body by device-orientation.js
	* @returns {undefined}
	*/
	var initDeviceOrientation = function() {
		document.body.addEventListener('tiltchange.deviceorientation', tiltChangeHandler);
	};



	/**
	* initialize the login form
	* @returns {undefined}
	*/
	var initLoginForm = function() {
		document.getElementById('login-form').addEventListener('submit', function(e) {
			e.preventDefault();

			var form = e.currentTarget;
			sgUsername = form.querySelector('[name="username"]').value || sgUsername;

			joinRoom();
		});
	};


	/**
	* handle clicking calibration button
	* @returns {undefined}
	*/
	var calibrationHandler = function(e) {
		e.preventDefault();
		sgCompassCorrection = sgOrientation.dir;
	};
	


	/**
	* initialize the calibration form
	* @returns {undefined}
	*/
	var initCalibrationForm = function() {
		document.getElementById('calibration-form').addEventListener('submit', calibrationHandler);
	};



	/**
	* initialize the remote
	* @returns {undefined}
	*/
	var initRemote = function() {
		initIdentifier();
		sgUsername = io.id;
		initSocketListeners();
		initDeviceOrientation();
		initLoginForm();
		initCalibrationForm();
	};


	// init when connection is ready	
	document.addEventListener('connectionready.socket', initRemote);


})();
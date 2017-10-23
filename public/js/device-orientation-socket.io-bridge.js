/*
* bridge between device-orientation and socket server
* listens for deviceorientation events and passes them on to the socket server
*/
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
	var sgOrientation = {
			tiltLR: 0,
			tiltFB: 0,
			dir: 0
		},
		sgCompassCorrection = 0;



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
	var init = function() {
		initDeviceOrientation();
		initCalibrationForm();
	};


	// single point of entry: init when connection is ready	
	document.addEventListener('connectionready.socket', init);
})();
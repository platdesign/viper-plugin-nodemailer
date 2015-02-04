'use strict';

// require nodemailer - the heart of this plugin ;)
var nodemailer = require('nodemailer');

// defaults for this plugin
var defaults = {

	// name of config-key
	configId: 'nodemailer'

};

module.exports = function() {
	var that = this;

	// Provide nodemailer as service
	this.value('nodemailer', nodemailer);

	// Provide a service called sendMail which expects a transporter
	// object as first argument, email-data as second and will return a promise
	this.service('sendMail', function(Q) {
		return function(transporter, data) {
			// create deferred object
			var d = Q.defer();

			// send mail on transporter and resolve/reject promise in callback
			transporter.sendMail(data, function(err, res) {
				if(err) { return d.reject(err); }
				d.resolve(res);
			});

			// return promise
			return d.promise;
		};
	});


	// Scan app config for nodemailer-config
	if( this._config[defaults.configId] ) {

		var config = this._config[defaults.configId];

		// Walk config and create transporter-provider for each item
		Object.keys(config).forEach(function(serviceName) {

			// config args
			var args = config[serviceName];

			// create provider which will return transporter as service
			// name will be the key of configuration hash
			that.provider(serviceName, function() {

				// create transporter with configuration args from config
				var transporter = nodemailer.createTransport(args);

				// return service as getter for transporter instance
				return function() {
					return transporter;
				};

			});

		});

	}

};

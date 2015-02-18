'use strict';

// require nodemailer - the heart of this plugin ;)
var nodemailer = require('nodemailer');

module.exports = function($extend, $q) {

	var connections = {};
	this.connect = function(name, config) {
		connections[name] = new Connection(name, config);
	};


	var templates = {};
	this.registerTemplate = function(name, handler) {
		templates[name] = handler;
	};



	this.$get = function() {
		return connections;
	};









	var Connection = function(name, config) {
		this.name = name;
		this._config = config;

		if(!config.transporter) {
			throw new Error('Missing \'transporter\' parameter for nodemailer connection: '+name);
		}
		this._transporter = nodemailer.createTransport(config.transporter);

		this._templates = {};
	};

	var proto = Connection.prototype;



	proto.sendMail = function(data) {
		var that = this;

		// If data.from and defaults.from is set check if data.from contains an @
		// if not, append data.from with string after @ in defaults.from
		if(data.from && this._config.defaults && this._config.defaults.from && data.from.indexOf('@') === -1) {
			data.from += this._config.defaults.from.substr(this._config.defaults.from.indexOf('@'));
		}

		// extend defaults with data
		var _data = $extend(true, {}, this._config.defaults, data);

		return $q.promise(function(resolve, reject) {

			// send mail on transporter and resolve/reject promise in callback
			that._transporter.sendMail(_data, function(err, res) {
				if(err) { return reject(err); }
				resolve(res);
			});

		});

	};

	proto.sendMailTemplate = function(name) {
		var that = this;

		if(templates[name]) {
			var template = templates[name];

			// remove first item from arguments
			var args = Array.prototype.slice.call(arguments).slice(1);

			// call template method with args, wrap it in a promise.
			// resolved data will be the hash for sendMail
			return $q.when( template.apply(null, args) )
			.then(function(mailData) {
				return that.sendMail(mailData);
			});
		} else {
			return $q.fcall(function() {
				throw new Error('EmailTemplate ('+name+') not found in '+this.name);
			});
		}
	};

};

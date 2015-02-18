'use strict';



module.exports = function() {



	this.provider('nodemailer', require('./providers/nodemailer.js') );


	this.config(function($configProvider, nodemailerProvider) {

		$configProvider.each('nodemailer', function(key, item) {
			nodemailerProvider.connect(key, item);
		});

	});

};

#viper-plugin-nodemailer

[Viper](https://github.com/platdesign/viper) plugin for [nodemailer](https://github.com/andris9/Nodemailer)


##Install

	npm install --save viper-plugin-nodemailer


## Config

This plugin listens to `nodemailer`-key in your configuration.
Multiple configuration-items are possible. Each item will create a viper-service (serviceName == item-keyname) with a nodemailer-transporter instance.

**Example**

	{
		nodemailer: {
			mySMTP: {
				host: 'localhost',
				port: 587,
				auth: {
					user: 'me',
					pass: 'my-super-secret-pass'
				}
			}
		}
	}

This will create a service `mySMTP` on your viper-app which will provide the transporter-instance for this configuration.


## Services

- `nodemailer` The plain [nodemailer](https://github.com/andris9/Nodemailer) lib.

- `sendMail` `function(transporter, emailData)` A function which sends an eMail using given `transporter` with `emailData`. For more information about `emailData` have a look at [official nodemailer docs](https://github.com/andris9/Nodemailer).



##Author

Christian Blaschke <mail@platdesign.de>

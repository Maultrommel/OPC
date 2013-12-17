Ext.define('opc.controller.desktop.desktopController', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
			mainview: 'authenticateview'
		},

		control: {
			'mainview': {
				//initialize: 'onLoadDesktop'
			}
		}
	},

	

	init: function() {
	//onLoadDesktop: function() {
		console.log('INIT: Desktop specific controller started...');

		/*opc.app.globals = {
            key: 123,
            preferences: {},
            countrysettings: {},
            preferencesfunction: function() {},
            notification: function() {},
            emailcomposer: function() {}
        };*/

	//Load dummy preference data into global variable

		opc.app.globals.preferences = {
			"reminder": false, 
			"perform_updates": false, 
			"selectedtime3": "50500000", 
			"passcode_key": "novalid_passcode", 
			"prayer_country": "none",
			"language_key": 'de'
		};
		
		//console.log('Globals preferences: ' + JSON.stringify(opc.app.globals.preferences));
	
	//Load dummy preferences function into global variable

		var preferencesFunction = function() {};

		preferencesFunction.prototype.set = function(key,value,success,fail) {
			//Ext.Msg.alert('Preferences set','Virtual preferences setting function invoked');
			console.log('Entered "' + value + '" into key: ' + key);
			if (key == 'passcode_key') {
				var passcodeforpreferences = value;
				if (success) {
					success(passcodeforpreferences);
				}
				
			}
			if (key == 'selectedtime3') {
				opc.app.globals.preferences.selectedtime3 = value;
			}
			if (key == 'reminder') {
				opc.app.globals.preferences.reminder = value;
			}
			if (key == 'language_key') {
				opc.app.globals.preferences.language_key = value;
			}
			if (key == 'perform_updates') {
				opc.app.globals.preferences.perform_updates = value;
			}
			
		};

		preferencesFunction.prototype.get = function(key,success,fail) {
			//var value = 'UEMG%2013%GEBET';
			//var value = 'validPasscode';
			//Ext.Msg.alert('Preferences get', 'Virtually fetching value of "'+key+'" from preferences. <br/> Return value is '+value+'.');
			/*success = function(value) {
				value = returnvalue;
				return value;
			};*/
			console.log('Loading virtual preferences get');
			if (key = 'passcode_key') {
				success('UEMG%2013%GEBET');
			}
			
			//success(value);
			//console.log('Virtually getting the preferences. Success = ' + success(value));
			
			//return true;
		};

		opc.app.globals.preferencesfunction = new preferencesFunction();

	//Load dummy notification function into global variable

		var localNotification = function() {};

		localNotification.prototype.add = function(options) {
			Ext.Msg.alert('Reminder added','Symbolic reminder at ' + options.date + 'added on Desktop enviroment');
		};

		localNotification.prototype.cancel = function(notificationId, success, fail) {
			Ext.Msg.alert('Reminder cancelled','Symbolic reminder cancelled on Desktop enviroment');
			success();
		};

		localNotification.prototype.cancelAll = function() {
			Ext.Msg.alert('All reminders cancelled','All reminders cancelled on Desktop enviroment');
		};

		opc.app.globals.notification = new localNotification();

	//Load dummy E-Mail-Handler into global variable

		var EmailComposer = function() {};

		EmailComposer.prototype.showEmailComposer = function(subject,body,toRecipients,ccRecipients,bccRecipients,bIsHTML,attachments) {
			var args = {};
			if(toRecipients)
				args.toRecipients = toRecipients;
			if(ccRecipients)
				args.ccRecipients = ccRecipients;
			if(bccRecipients)
				args.bccRecipients = bccRecipients;
			if(subject)
				args.subject = subject;
			if(body)
				args.body = body;
			if(bIsHTML)
				args.bIsHTML = bIsHTML;
		    if(attachments)
		        args.attachments = attachments;
			Ext.Msg.alert('Virtual Email sent','To: ' + args.toRecipients + ' Body: ' + args.body);
			//cordova.exec(null, null, "EmailComposer", "showEmailComposer", [args]);
		}		

		EmailComposer.prototype.showEmailComposerWithCallback = function(callback, subject, body, toRecipients, ccRecipients, bccRecipients, isHTML, attachments) {
			this.resultCallback = callback;
			this.showEmailComposer.apply(this,[subject,body,toRecipients,ccRecipients,bccRecipients,isHTML,attachments]);
		}

		opc.app.globals.emailcomposer = new EmailComposer();

	//Decide whether this is the first run or not

		//opc.app.globals.firstrun = false;
		if (opc.app.globals.firstrun == true) {
			//this.getApplication().getController('opc.controller.UpdatePrayerItems').clearLocalPrayers();
			opc.app.globals.preferences.prayer_country = null;
		}
		//opc.app.globals.preferences.prayer_country = 'switzerland';
		

	}

});
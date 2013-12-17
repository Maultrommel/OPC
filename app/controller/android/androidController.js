Ext.define('opc.controller.android.androidController', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
			mainview: 'authenticateview'
		},

		control: {
			//'mainview': {
				//initialize: 'onLoadAndroid'
			//}
		}
	},

	init: function() {
	//onLoadAndroid: function() {
		console.log('INIT: Android specific controller started...');

	//Load Android preferences settings into global variable
		var preferences = cordova.require("cordova/plugin/applicationpreferences");

		preferences.load(function(value) {
			console.log('OPC preferences are: ' + JSON.stringify(value));
			//preferencesAndroid = Ext.JSON.decode(value,true);
			//preferencesAndroid = value;
			opc.app.globals.preferences = value;
		}, function(error) {
			console.log(JSON.stringify(error));
		});

		//console.log('preferencesAndroid: ' + preferencesAndroid.passcode_key);
		//console.log('globals.preference: ' + opc.app.globals.preferences.passcode_key);
		if (opc.app.globals.preferences.reminder == null) {
			opc.app.globals.preferences.reminder = 'false';
		}

	//Load Preferences function into global variable

		opc.app.globals.preferencesfunction = preferences;

	//Load Notification function into global variable
		var notification = cordova.require("cordova/plugin/localnotification");

		opc.app.globals.notification = notification;

	//Load EmailComposer function into global variable
		var emailcomposer = cordova.require("cordova/plugin/emailcomposer");

		opc.app.globals.emailcomposer = emailcomposer;

	//Decide whether this is the first run or not

		/*if (opc.app.globals.preferences.prayer_country == null) {
			opc.app.globals.firstrun = true;
		} else {
			opc.app.globals.firstrun = false;
		}*/

		//opc.app.globals.firstrun = false;
	}

});
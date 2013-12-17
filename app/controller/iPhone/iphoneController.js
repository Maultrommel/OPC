Ext.define('opc.controller.iphone.iphoneController', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
			mainview: 'authenticateview'
		}
	},

	init: function() {
		me = this;
	//onLoadAndroid: function() {
		console.log('INIT: iPhone specific controller started...');

	//Load iPhone preferences settings into global variable
		var preferences = cordova.require("cordova/plugin/applicationpreferencesiphone");

			
		preferences.get('perform_updates',function(result) {
			console.log('Result for updates: ' + result);
			if (result == 1 || result == true) {
				opc.app.globals.preferences.perform_updates = true;
			} else {
				opc.app.globals.preferences.perform_updates = false;
			}
			
			console.log('perform_updates: ' + opc.app.globals.preferences.perform_updates);
			//opc.app.globals.doneloading = true;
			//console.log('Doneloading: ' + opc.app.globals.doneloading);
		}, function(error) {
			console.log('ERROR in fetching preferences: '+error);
		});
		
		
		preferences.get('prayer_country', function(result) {
			console.log('prayer_country: ' + result);
			opc.app.globals.preferences.prayer_country = result;
			
		}, function(error) {
			console.log("Failed to retrieve country setting: " + error);
		});

		preferences.get('selectedtime3', function(result) {
			console.log('selectedtime3: ' + result);
			opc.app.globals.preferences.selectedtime3 = result;
			
		}, function(error) {
			console.log("Failed to retrieve reminder time RAW: " + error);
		});
		
		preferences.get('selectedtimeformated', function(result) {
			console.log('selectedtimeformated: ' + result);
			opc.app.globals.preferences.selectedtimeformated = result;
			
		}, function(error) {
			console.log("Failed to retrieve reminder time: " + error);
		});

		preferences.get('language_key', function(result) {
			console.log('language_key: ' + result);
			opc.app.globals.preferences.language_key = result;
			
		}, function(error) {
			console.log("Failed to retrieve reminder time: " + error);
		});

		preferences.get('reminder', function(result) {
			if (result == 1 || result == true) {
				opc.app.globals.preferences.reminder = true;
			} else {
				opc.app.globals.preferences.reminder = false;
			}
			console.log('reminder: ' + opc.app.globals.preferences.reminder);
			opc.app.globals.preferences.reminder = result;
			
		}, function(error) {
			console.log("Failed to retrieve reminder status: " + error);
		});
		
	//Load Preferences function into global variable

		opc.app.globals.preferencesfunction = preferences;

	//Load Notification function into global variable
		var notification = cordova.require("cordova/plugin/localnotification");

		opc.app.globals.notification = notification;

	//Load EmailComposer function into global variable
		var emailcomposer = cordova.require("emailcomposer.EmailComposer");

		opc.app.globals.emailcomposer = emailcomposer;

	

		//opc.app.globals.firstrun = false;
	}

});
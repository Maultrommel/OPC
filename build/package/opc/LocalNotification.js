/*-
 * Phonegap LocalNotification Plugin for Android
 * 
 * Created by Daniel van 't Oever 2012 MIT Licensed
 * 
 * Usage: 
 * 
 * plugins.localNotification.add({ date: new Date(), message: 'This is an Android alarm using the statusbar', id: 123 });
 * plugins.localNotification.cancel(123); 
 * plugins.localNotification.cancelAll();
 * 
 * This interface is similar to the existing iOS LocalNotification plugin created by Greg Allen
 */

//if (typeof PhoneGap !== "undefined") {
cordova.define("cordova/plugin/localnotification", function(require, exports, module) {
	var exec = require("cordova/exec");
	/**
	 * Empty constructor
	 */
	var LocalNotification = function() {
	};

	/**
	 * Register a notification message for a specific date / time
	 * 
	 * @param successCB
	 * @param failureCB
	 * @param options
	 *            Array with arguments. Valid arguments are date, message,
	 *            repeatDaily and id
	 */
	LocalNotification.prototype.add = function(options) {
		var defaults = {
			date : new Date(),
			message : '',
			ticker : '',
			repeatDaily : false,
			repeat: 'daily',
			id : 0,
			hasAction: true,
			action: 'View',
			badge: 0,
			sound:'',
			background:'',
			foreground:''
		};

		if (options.date) {
			options.dateAndroid = (options.date.getMonth()) + "/" + (options.date.getDate()) + "/"
					+ (options.date.getFullYear()) + "/" + (options.date.getHours()) + "/"
					+ (options.date.getMinutes());
			options.date = Math.round(options.date.getTime()/1000);
		}

		for ( var key in defaults) {
			if (typeof options[key] !== "undefined")
				defaults[key] = options[key];
		}

		cordova.exec(null, null, 'LocalNotification', 'add', new Array(defaults));
	};

	/**
	 * Cancel an existing notification using its original ID.
	 * 
	 * @param id
	 *            The ID that was used when creating the notification using the
	 *            'add' method.
	 */
	
	/*LocalNotification.prototype.cancel = function(notificationId) {
		cordova.exec(null, null, 'LocalNotification', 'cancel', new Array({
			id : notificationId
		}));
	};*/

	//with callback!

	LocalNotification.prototype.cancel = function(notificationId, success, fail) {
		cordova.exec(success, fail, 'LocalNotification', 'cancel', new Array({
			id : notificationId
		}));
	};

	/**
	 * Cancel all notifications that were created by your application.
	 */
	LocalNotification.prototype.cancelAll = function() {
		cordova.exec(null, null, 'LocalNotification', 'cancelAll', new Array());
	};

	var localNotification = new LocalNotification();
	module.exports = localNotification;

	/**
	 * Register this plugin with phonegap
	 */
	
	
});

/*if (!window.plugins) {
	window.plugins = {};
}
if (!window.plugins.localNotification) {
	window.plugins.localNotification = cordova.require("cordova/plugin/localnotification");
}
	//window.plugins.localNotification = new LocalNotification();
*/		

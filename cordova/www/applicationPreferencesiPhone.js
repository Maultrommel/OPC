/*(function() {
  
function applicationPreferences() {}

applicationPreferences.prototype.get = function(key,success,fail) 
{
    var args = {};
    args.key = key;
    cordova.exec(success,fail,"applicationPreferences","getSetting",[args]);
};

applicationPreferences.prototype.set = function(key,value,success,fail) 
{
    var args = {};
    args.key = key;
    args.value = value;
    cordova.exec(success,fail,"applicationPreferences","setSetting",[args]);
};


if(!window.plugins) {
    window.plugins = {};
}
if ( ! window.plugins.applicationPreferences ) {
    window.plugins.applicationPreferences = new applicationPreferences();
}

})();*/

cordova.define("cordova/plugin/applicationpreferencesiphone", function(require, exports, module) {
	var exec = require("cordova/exec");
	var AppPreferences = function () {};
	
	var AppPreferencesError = function(code, message) {
	    this.code = code || null;
	    this.message = message || '';
	};
	
	AppPreferencesError.NO_PROPERTY = 0;
	AppPreferencesError.NO_PREFERENCE_ACTIVITY = 1;
	
	AppPreferences.prototype.get = function(key,success,fail) {
		var args = {};
		args.key = key;
		//console.log('ApplicationPreferencesIphone Request: ' + key);
		cordova.exec(success,fail,"applicationPreferences","getSetting",[args]);
	};
	
	AppPreferences.prototype.set = function(key,value,success,fail) {
		var args = {};
		args.key = key;
		args.value = value;
	    cordova.exec(success,fail,"applicationPreferences","setSetting",[args]);
	};
	
	/*applicationPreferences.prototype.load = function(success,fail) {
	    cordova.exec(success,fail,"applicationPreferences","load",[]);    
	};
	
	applicationPreferences.prototype.show = function(activity,success,fail) {
	    cordova.exec(success,fail,"applicationPreferences","show",[activity]);    
	};
	
	applicationPreferences.prototype.clear = function(success,fail) {
	    cordova.exec(success,fail,"applicationPreferences","clear", []);    
	};
	
	applicationPreferences.prototype.remove = function(keyToRemove, success,fail) {
	    cordova.exec(success,fail,"applicationPreferences","remove", [keyToRemove]);    
	};*/

	var appPreferences = new AppPreferences();
	module.exports = appPreferences;
});

cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/me.apla.cordova.app-preferences/www/apppreferences.js",
        "id": "me.apla.cordova.app-preferences.apppreferences",
        "clobbers": [
            "plugins.appPreferences"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "me.apla.cordova.app-preferences": "0.4.2"
}
// BOTTOM OF METADATA
});
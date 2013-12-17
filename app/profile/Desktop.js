Ext.define('opc.profile.Desktop', {
	extend: 'Ext.app.Profile',

	config: {
		controllers: ['desktopController']
	},

	isActive: function() {
		if (Ext.os.deviceType == 'Desktop') {
			return true;
		} else {
			return false;
		}
	}
});
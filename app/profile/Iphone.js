Ext.define('opc.profile.Iphone', {
	extend: 'Ext.app.Profile',

	config: {
		controllers: ['iphoneController']
	},

	isActive: function() {
		//console.log('Betriebssystem: ' + Ext.os.is.iOS);
		return Ext.os.is.iOS;
	}
});
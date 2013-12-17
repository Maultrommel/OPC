Ext.define('opc.profile.Android', {
	extend: 'Ext.app.Profile',

	config: {
		controllers: ['androidController']
	},

	isActive: function() {
		return Ext.os.is.Android;
	}
});
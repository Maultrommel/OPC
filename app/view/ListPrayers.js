Ext.define('opc.view.ListPrayers', {
	extend: 'Ext.navigation.View',
	requires: 'Ext.dataview.List',
	xtype: 'prayerlist',
	
	config: {
		locales: {
			defaultBackButtonText: 'buttons.back'
		},
		defaultBackButtonText: 'Zurück',
		navigationBar: false,
		title: 'List',
		//striped: true,

		items: [
			/*{
				docked: 'top',
	            xtype: 'titlebar',
	            title: 'List of all Prayer Requests'
			},*/
			{
				xtype: 'list',
				itemId: 'actualList',
				itemTpl: '{date_raw:date("d. F")}: {title}',
				store: 'localPrayerStore',
				grouped: true
				//indexBar: true
			}
			
		]
	}
});

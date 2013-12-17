Ext.define('opc.store.LocalPrayerItems', {
	requires: [
		'Ext.data.proxy.LocalStorage',
		'Ext.data.identifier.Uuid'
		],
	extend: 'Ext.data.Store',
	config: {
		storeId: 'localPrayerStore',
		model: 'opc.model.PrayerPointModel',
		autoLoad: true,
		sorters: {property:'date_raw',direction: 'ASC'},
		proxy: {
			type: 'localstorage',
			id: 'localPrayerStoreProxy'
		},
		grouper: {
			groupFn: function(record) {
				//console.log('Setting grouper for language: '+Ux.locale.Manager.getLanguage());
				Ext.Date.monthNames = [
		            Ux.locale.Manager.get('misc.months.january','January'),
		            Ux.locale.Manager.get('misc.months.february','February'),
		            Ux.locale.Manager.get('misc.months.march','March'),
		            Ux.locale.Manager.get('misc.months.april','April'),
		            Ux.locale.Manager.get('misc.months.may','May'),
		            Ux.locale.Manager.get('misc.months.june','June'),
		            Ux.locale.Manager.get('misc.months.july','July'),
		            Ux.locale.Manager.get('misc.months.august','August'),
		            Ux.locale.Manager.get('misc.months.september','September'),
		            Ux.locale.Manager.get('misc.months.october','October'),
		            Ux.locale.Manager.get('misc.months.november','November'),
		            Ux.locale.Manager.get('misc.months.december','December')
		        ];
		        Ext.Date.dayNames = [
		            Ux.locale.Manager.get('misc.days.sunday','Sunday'),
		            Ux.locale.Manager.get('misc.days.monday','Monday'),
		            Ux.locale.Manager.get('misc.days.tuesday','Tuesday'),
		            Ux.locale.Manager.get('misc.days.wednesday','Wednesday'),
		            Ux.locale.Manager.get('misc.days.thursday','Thursday'),
		            Ux.locale.Manager.get('misc.days.friday','Friday'),
		            Ux.locale.Manager.get('misc.days.saturday','Saturday')
		        ];
				month = record.get('date_raw').getMonth();
				monthreturn = Ext.Date.monthNames[month] + ' ' + record.get('date_raw').getFullYear();

				return monthreturn;
			},
			sortProperty: 'date_raw',
			direction: 'ASC'
		} 
	}
});

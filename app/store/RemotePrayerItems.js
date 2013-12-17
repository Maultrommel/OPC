Ext.define('opc.store.RemotePrayerItems', {
	extend: 'Ext.data.Store',
	requires: [
		'Ext.data.proxy.JsonP'
	],
	config: {
		storeId: 'remotePrayerStore',
		model: 'opc.model.PrayerPointModel',
//		autoLoad: true,
		sorters: {property:'date_raw',direction: 'ASC'},
		/*filters: {filterFn: function(item){
			var currentMonth = new Date();
			var min_Month = currentMonth.getUTCMonth();
			//console.log(min_Month);
			return item.get("date_raw").getMonth() >= min_Month; 
		}},*/
		//pageSize: 10,
//		remoteFilter: true,
		remoteSort: true,
	
	//Settings for Joomla Backend		
		/*proxy: {
			type: 'jsonp',
			callbackKey: 'callback',
			url: 'http://www.xn--mg-wka.ch/prayercalendar/index.php/prayer-items?format=json',
			reader: {
				type: 'json',
				rootProperty: 'items',
				successProperty: 'success'
			}
		}*/

	//Settings for Wordpress Backend

		proxy: {
			type: 'jsonp',
			callbackKey: 'callback',
			//url: 'http://www.commstest.omf.org/opc/category/'+opc.app.globals.preferences.prayer_country+'/?json=1&custom_fields=date,worker',
			reader: {
				type: 'json',
				rootProperty: 'posts',
				totalProperty: 'category.post_count',
				successProperty: 'status'
			}
		}
	}
});

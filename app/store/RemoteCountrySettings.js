Ext.define('opc.store.RemoteCountrySettings', {
	extend: 'Ext.data.Store',

	config: {
		storeId: 'remoteCountrySettingsStore',
		model: 'opc.model.CountryModel',
		//autoLoad: true,

		proxy: {
			type: 'jsonp',
			callbackKey: 'callback',
		
		//Settings for Joomla Backend
			/*url: 'http://www.xn--mg-wka.ch/prayercalendar/index.php/country-information?format=json',
			reader: {
				type: 'json',
				rootProperty: 'items',
				successProperty: 'success'
			}*/
		
		//Settings for Wordpress Backend
			url: 'http://commstest.omf.org/opc/tag/countrysettings/?json=1&custom_fields=defaultlanguage,email,passcode,telephone',
			timeout: 30000,
			reader: {
				type: 'json',
				rootProperty: 'posts',
				successProperty: 'success'
			}

		}
	}
});
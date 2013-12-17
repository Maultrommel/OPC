Ext.define('opc.store.LocalCountrySettings', {
	extend: 'Ext.data.Store',

	config: {
		storeId: 'localCountrySettingsStore',
		model: 'opc.model.CountryModel',
		autoLoad: true,
		proxy: {
			type: 'localstorage',
			id: 'localCountryStoreProxy'
		}
	}
});
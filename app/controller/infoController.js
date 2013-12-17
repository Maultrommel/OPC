Ext.define('opc.controller.infoController', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
			infoViewRef: 'infoview',
			infoTabButtonRef: 'initialview #infoTabButton',
			firstrunview: 'firstrunview'
		},

		control: {
			'infoViewRef': {
				show: 'onShowInfo'
			}
		}
	},


	onShowInfo: function() {
		console.log('Infoview Controller started');
		var me = this,
			chosenCountry = '';
		var localCountryStore = Ext.getStore('localCountrySettingsStore');
		//console.log('Prayer Country: ' + opc.app.globals.preferences.prayer_country);

		if (opc.app.globals.preferences.prayer_country) {
			chosenCountry = opc.app.globals.preferences.prayer_country;
		} else {
			if (me.getFirstrunview().down('radiofield[name=country]').getGroupValue()) {
				console.log('Already a country selected');
				chosenCountry = me.getFirstrunview().down('radiofield[name=country]').getGroupValue();
			} else {
				var countrySelectionOverlay = Ext.Viewport.down('countryselectform');
				if (!countrySelectionOverlay) {
					countrySelectionOverlay = Ext.widget('countryselectform');
					Ext.Viewport.add(countrySelectionOverlay);
				}
				
				countrySelectionOverlay.down('#countryselectfield').addListener('change', function(select, value) {
					chosenCountry = value;
					console.log('Choice: ' + chosenCountry);
					countrySelectionOverlay.hide(true);
				}, this);
				countrySelectionOverlay.down('#abortButton').addListener('tap', function() {
					countrySelectionOverlay.hide(true);
				},this);
				countrySelectionOverlay.show(true);
			}
			
		}

		console.log('Chosen Country: ' + chosenCountry);
		//var logoIndex = localCountryStore.find('alias', );
		var countryRecord = localCountryStore.getAt(localCountryStore.find('alias', chosenCountry))
		var logoData = countryRecord.get('logo');
		var contactData = countryRecord.get('introtext');
		var contactEmail = countryRecord.get('contactemail')
		//console.log('LogoIndex: ' + logoIndex + ' Logo: ' + logoData);
		me.getInfoViewRef().down('#labelContactData').setData({'contact': contactData,'contactemail': contactEmail});

		return me.getInfoViewRef().down('#labelLogo').setData({'logo': logoData})
	}
});
Ext.define('opc.controller.firstRunController', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
			//firstRunViewButton: 'firstrunview #firstRunButton',
			firstRunViewButton: 'initialview #firstRunButton',
			firstRunProceedButton: 'firstrunview #firstRunProceedButton',
			firstRunViewRef: 'firstrunview',
			firstRunNav: 'initialview titlebar',
			languageChooser: 'firstrunview radiofield[name=language]'
		},

		control: {
			firstRunViewButton: {
				tap: 'onFirstRunButtonTap'
			},
			firstRunProceedButton: {
				tap: 'onFirstRunButtonTap'
			},
			firstRunViewRef: {
				show: 'onFirstRunShow',
				hide: 'onFirstRunHide'
			},
			languageChooser: {
				change: 'onLanguageChange'
			}
		}
	},

	onFirstRunHide: function() {
		var me = this;
		me.getFirstRunViewButton().hide();
	},

	onFirstRunShow: function() {
		var me = this,
			uiLanguage = '';
		console.log('Showing FirstRun');

		//console.log('Language in Preferences: ' + opc.app.globals.preferences.language_key);
		if (opc.app.globals.preferences.language_key == '') {
	//Proposing a language from the environement
			uiLanguage = Ux.locale.Manager.getLanguage();
		} else {
			uiLanguage = opc.app.globals.preferences.language_key;
			//Ux.locale.Manager.updateLocale(uiLanguage);
		}
 		//uiLanguage = opc.app.globals.preferences.language_key;
 		console.log('uiLanguage: ' + uiLanguage + ' Radio set to: ' + me.getLanguageChooser().setGroupValue(uiLanguage));

 		me.getLanguageChooser().setGroupValue(uiLanguage);
		//me.getFirstRunViewRef().down('radiofield[name=language]').setValue('de');
		me.getFirstRunViewButton().show();

	},

	onFirstRunButtonTap: function() {
		console.log('FirstRunButton pressed');
		var me = this;
		var firstRunView = me.getFirstRunViewRef();

		var countryfield = firstRunView.down('radiofield[name=country]'),
			languagefield = firstRunView.down('radiofield[name=language]'),
			label = firstRunView.down('#selectionFailedLabel');

		var chosenCountry = countryfield.getGroupValue(),
			chosenLanguage = languagefield.getGroupValue(),
			chosenUpdates = firstRunView.down('#toggleAutomaticUpdates').getValue();

		if (chosenUpdates == 1) {
			chosenUpdates = true;
		} else {
			chosenUpdates = false;
		}

		if (chosenLanguage && chosenLanguage != Ux.locale.Manager.getLanguage()) {
			//console.log('Language has changed: '+chosenLanguage);
			
			Ux.locale.Manager.updateLocale(chosenLanguage);
		}	

		if (chosenLanguage) {
			opc.app.globals.preferencesfunction.set('language_key',chosenLanguage,null,null);
			opc.app.globals.preferences.language_key = chosenLanguage;
		}

		if (chosenUpdates) {
			//console.log('Saving updates preferences');
			opc.app.globals.preferencesfunction.set('perform_updates',chosenUpdates,null,null);
			opc.app.globals.preferences.perform_updates = chosenUpdates;
		}		

		if (chosenCountry) {
			//console.log('Country: ' + chosenCountry);
			opc.app.globals.preferencesfunction.set('prayer_country',chosenCountry,null,null);
			opc.app.globals.preferences.prayer_country = chosenCountry;
			console.log('Written into preferences: ' + opc.app.globals.preferences.prayer_country);


		//Fetch basic settings for this country
			firstRunView.setMasked({
				xtype: 'loadmask',
				message: Ux.locale.Manager.get('tabs.firstrun.countrysettingsloading')
			});
			//opc.app.globals.countrysettings = me.onLoadCountrySettings(chosenCountry);
			
			me.onLoadCountrySettings(chosenCountry, 
				function successCB() {
					console.log('Countrysettings Passcode: ' + opc.app.globals.countrysettings.get('passcode'));
		//Hide this view and show the Passcode View (if necessary)
					authenticateview = Ext.Viewport.down('authenticateview');
					if (!authenticateview) {
						authenticateview = Ext.Viewport.add({
							xtype: 'authenticateview'
						});
					}

					firstRunView.setMasked(false);
					Ext.Viewport.animateActiveItem(authenticateview, me.getSlideLeftTransition());
				//firstRunView.destroy();
				},
				function failureCB() {
				//console.log('Failure returned');
					firstRunView.setMasked(false);
					opc.app.globals.preferencesfunction.set('prayer_country',none,null,null);
					opc.app.globals.preferences.prayer_country = 'none';
				}
			);

		} else {
			console.log('Showing failed label');
			label.show();
		}

	

	},

	onLoadCountrySettings: function(country, successCB, failureCB) {

	//Check if we have a already have content in a local store
		var localCountryStore = Ext.getStore('localCountrySettingsStore');
		
		if (localCountryStore.getCount() == 0) {
			console.log('No local countrysettings present, loading remote ones');
			var remoteCountryStore = Ext.getStore('remoteCountrySettingsStore');
			//localCountryStore.removeAll();
			//console.log('Cleared local Country Store: ' + localCountryStore.getCount());
			remoteCountryStore.on({
				load: function() {
					remoteCountryStore.each(function(item){
						console.log('Syncing country ' + item.get('alias') + '!');
						//var logo = localCountryStore.add(item.copy());
						//logo.setUrl();
						localCountryStore.add(item.copy());
						//item.setLogoUrl();
					});
					localCountryStore.sync();
				}
			});
			remoteCountryStore.load({
				callback: function(records, operation, success) {
					console.log('Success callback: ' + success);
					if (!success) {
						console.log('Failed loading country settings');
						return failureCB();
					} else {
						console.log('Finished syncing country settings');
						opc.app.globals.countrysettings = localCountryStore.findRecord('alias', country);
						console.log('opc.app.globals.countrysettings: ' + opc.app.globals.countrysettings);
						return successCB();
					}

				},
				scope: this
			});

	//Load local store and check for specific country settings		

		} else {
			console.log('Local Country settings: ' + localCountryStore.getCount());
			opc.app.globals.countrysettings = localCountryStore.findRecord('alias', country);
			if (opc.app.globals.countrysettings) {
				return successCB();
			} else {
				Ext.Msg.confirm('Update required','Unable to load country settings for your selected country. Shall we try again?',
					function(response) {
						if (response == 'yes') {
							var remoteCountryStore = Ext.getStore('remoteCountrySettingsStore');
							remoteCountryStore.on({
								load: function() {
									remoteCountryStore.each(function(item){
										console.log('Syncing country!');
										if (localCountryStore.find('alias', item.get('alias'), '', true, '', '') == -1) {
											var logo = localCountryStore.add(item.copy());
											logo.setUrl();
										}

									});
									localCountryStore.sync();
								}
							});
							remoteCountryStore.load({
								callback: function(records, operation, success) {
									console.log('Finished syncing country settings');
									opc.app.globals.countrysettings = localCountryStore.findRecord('alias', country);
									if (opc.app.globals.countrysettings) {
										return successCB();
									} else {
										Ext.Msg.alert('Update required','Unable to load country settings for your selected country. Please choose a different country.');
										//console.log('Returning failure');
										return failureCB();
									}		
								},
								scope: this
							});
						} else {
							console.log('Update denied');
							return failureCB();
						}
					}, 
				this);
			}
			
			
		}

		//return localCountryStore.findRecord('alias', country);
		
	},

	getSlideLeftTransition: function() {
		return {
			type: 'slide',
			direction: 'left'
		};

	},

	/*setLogoUrl: function(id, dataUrl) {
		var logostore = Ext.getStore('localCountrySettingsStore');
		var logoRecord = logostore.findRecord('alias',id);
		console.log('DataURL: ' + dataUrl);
		console.log('Id: ' + id);
		logoRecord.set('logo', dataUrl);
		logostore.sync();

	},*/

	onLanguageChange: function() {
		console.log('Language changed to: ' + this.getLanguageChooser().getGroupValue());

		if (this.getLanguageChooser().getGroupValue() != Ux.locale.Manager.getLanguage()) {
			console.log('Different language than UI chosen');
			Ux.locale.Manager.updateLocale(this.getLanguageChooser().getGroupValue());
		}
		
	}
});
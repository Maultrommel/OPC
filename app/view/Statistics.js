Ext.define('opc.view.Statistics', {
	extend: 'Ext.Container',
	xtype: 'showstatistics',
	requires: 'Ext.SegmentedButton',
	config: {
		title: 'Prayer Statistics',
		//fullscreen: true,
		styleHtmlContent: true,
		layout: 'vbox',
		scrollable: true,
		defaults: {
			padding: 5
		},

		items: [
			/*{
				docked: 'top',
				xtype: 'titlebar',
				locales: {
					title: 'tabs.config.title'
				}
			},*/
			{
				xtype: 'fieldset',
				itemId: 'statisticsFieldSet',
				locales: {
					title: 'tabs.config.statistics.title'
				},
				items: [
					{
						//xtype: 'panel',
						xtype: 'label',
						//html: '<h3>Statistics</h3><br/>Prayer Requests stored on device: {parent.numberOfItems}'
						//xtype: 'statisticsDataView'
						itemId: 'statisticspanel',
						data: {
							numberOfItems: 4,
							monthsPresent: 5
						},
						/*tpl: [
							//'<h3>Statistics</h3>',
							'Prayer Requests stored on device: {numberOfItems}<br />',
							'Last visit: {lastVisit}'
						].join('')*/
						locales: {
							tpl: 'tabs.config.statistics.numberofitems'
						}
					},
					/*{
						xtype: 'list',
						itemId: 'statisticspanel',
						data: {
							numberOfItems: 4
						}
						
					},*/
					{
						xtype: 'segmentedbutton',
						allowToggle: false,
						//width: '100%',
						//right: 0,
						//bottom: 0,
						margin: '5 0',
						items: [
							{
								iconCls: 'refresh',
								locales: {
									text: 'tabs.config.statistics.manualupdate'
								},
								ui: 'action',
								action: 'updaterequest'
							},

							{
								iconCls: 'delete',
								locales: {
									text: 'tabs.config.statistics.clearitems'
								},
								//text: 'Delete local prayers',
								ui: 'decline',
								action: 'clearprayeritems' 
							}

						]
					}
					/*{
						xtype: 'button',
						iconCls: 'download',
						iconMask: true,
						//text: 'Manually update Prayer Items',
						locales: {
							text: 'tabs.config.statistics.manualupdate'
						},
						ui: 'action',
						action: 'updaterequest',
						itemId: 'updateButton'
					},
					{
						xtype: 'spacer',
						height: '2px'
					},
					{
						xtype: 'button',
						iconCls: 'delete1',
						iconMask: true,
						//text: 'Clear local Prayer Items',
						locales: {
							text: 'tabs.config.statistics.clearitems'
						},
						ui: 'decline',
						action: 'clearprayeritems',
						itemId: 'clearButton'
					}*/
				]
			},
			/*{
				xtype: 'fieldset',
				itemId: 'reminderFieldSet',
				locales: {
					title: 'tabs.config.reminder.title'
				},
				
				//instructions: 'Tap to change',
				items: [
					{
						xtype: 'label',
						itemId: 'reminderpanel',
						data: {
							reminderTimeDisplay: '00:00',
							allowReminderFlag: false
						},
						locales: {
							tpl: 'tabs.config.reminder.allowreminderflag'
						}
					},
					{
						xtype: 'button',
						locales: {
							text: 'tabs.config.reminder.changeremindersettings',
						},
						ui: 'action',
						iconMask: true,
						action: 'changereminder',
						itemId: 'reminderButton'
					}
				],

			},*/
			{
				xtype: 'fieldset',
				itemId: 'reminderFieldSet',
				locales: {
					title: 'tabs.firstrun.reminder.title'
					//instructions: 'tabs.firstrun.reminder.instructions'
				},
				items: [
					{
						xtype: 'label',
						
						locales: {
							html: 'tabs.firstrun.reminder.description'
						}
					},
					{
						xtype: 'togglefield',
						itemId: 'toggleReminderStatistics',
						labelWidth: '60%',
						value: false,
						locales: {
							label: 'tabs.firstrun.reminder.togglelabel'
						}
					},
					/*{
						xtype: 'label',
						itemId: 'reminderTimeLabel',
						locales: {
							tpl: 'tabs.firstrun.reminder.timelabel'
						},
						hideAnimation: 'fadeOut',
						showAnimation: 'fadeIn',
						hidden: true
					}*/
					{
						xtype: 'textfield',
						labelWidth: '60%',
						itemId: 'reminderTimeTextfieldStatistics',
						locales: {
							label: 'tabs.firstrun.reminder.timelabel'
						},
						value: '08:00',
						hideAnimation: 'fadeOut',
						showAnimation: 'fadeIn',
						hidden: true,
						readOnly: true
					}
				]
			},
			{
				xtype: 'fieldset',
				itemId: 'Language',
				locales: {
					title: 'tabs.config.language.title'
				},
				items: [
					/*{
						xtype: 'panel',
						itemId: 'languagePanel',
						locales: {
							html: [
								'tabs.config.language.text'
							]
						}
					},*/
					{
						xtype: 'selectfield',
						itemId: 'languagePanel',
						locales: {
							label: 'tabs.config.language.label'
						},
						labelWidth: '60%',
						//label: 'Some text',
						align: 'right',
						displayField: 'text',
						valueField: 'abbr',
						value: Ux.locale.Manager.getLanguage(),
						//value: opc.app.globals.preferences.language_key,
						//value: 'de',
						store: Ux.locale.Manager.getAvailable(false),
						listeners: {
							change: function(select, value) {
								if (value instanceof Ext.data.Model) {
									value = value.get(select.getValueField());
								}

								Ux.locale.Manager.updateLocale(value);
								opc.app.globals.preferencesfunction.set('language_key', value, null,null);
								opc.app.globals.preferences.language_key = value;
							}
						}
					}
				]

			},
			{
				xtype: 'fieldset',
				
				locales: {
					title: 'tabs.firstrun.automaticupdates.title'
					//instructions: 'tabs.firstrun.automaticupdates.instructions'
				},
				items: [
					{
						xtype: 'label',
						padding: 10,
						locales: {
							html: 'tabs.firstrun.automaticupdates.description'
						}
					},
					{
						xtype: 'togglefield',
						itemId: 'toggleAutomaticUpdates',
						labelWidth: '75%',
						//value: opc.app.globals.preferences.perform_updates,
						value: true,
						locales: {
							label: 'tabs.firstrun.automaticupdates.togglelabel'
						}
					}
				]
			},
			{
				xtype: 'fieldset',
				itemId: 'Reset',
				locales: {
					title: 'tabs.config.reset.title'
				},
				items: [
					{
						xtype: 'label',
						itemId: 'resetPanel',
						locales: {
							html: 'tabs.config.reset.html'
						}
						//html: [
						//	'By pressing this button, you can delete all locally stored data (including your passcode) and reset the application. The next time you start it up, it will again ask for this settings and reload all the prayer items.']
					},
					{
						xtype: 'button',
						itemId: 'resetButton',
						locales: {
							text: 'tabs.config.reset.resetbutton'
						},
						ui: 'decline',
						iconMask: true,
						action: 'resetapp'
					}
				]
			}
			
		]

		
	}
	/*getStatisticsData: function(storeCount) {
			var storeCount = Ext.getStore('localPrayerStore').getCount();
			console.log(storeCount);
			return storeCount;
			}*/
});
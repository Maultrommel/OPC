Ext.define('opc.view.FirstRun', {
	extend: 'Ext.form.Panel',
	//extend: 'Ext.tab.Panel',
	alias: 'widget.firstrunview',
	//requires: 'Ext.field.Toggle',
	//id: 'firstrunview',
	config: {
		title: 'FirstRun',
		items: [
			{
				/*xtype: 'titlebar',
				docked: 'top',
				locales: {
					title: 'app.title'
				},*/
				items: [
					{
						xtype: 'button',
						itemId: 'firstRunButton',
						//action: 'proceed',
						//padding: '10px',
						locales: {
							text: 'buttons.next'
						},
						ui: 'forward',
						//width: '300px',
						align: 'right',
						hidden: true 
					},
					{
						xtype: 'button',
						itemId: 'firstRunResetButton',
						text: 'Clear data',
						ui: 'decline',
						align: 'left',
						hidden: true
					}
				]
			},
			{
				xtype: 'label',
				padding: 10,
				locales: {
					html: 'tabs.firstrun.welcome'
				}
				
			},
			
			{
				xtype: 'fieldset',
				itemId: 'countrySettings',
				locales: {
					instructions: 'tabs.firstrun.countrysettingsinstruction',
					title: 'tabs.firstrun.countrysettingstitle'
				},
				defaults: {
					labelWidth: '80%'
				},
				items: [
					{
						xtype: 'radiofield',
						name: 'country',
						itemId: 'countryRadio',
						value: 'germany',
						disabled: true,
						locales: {
							label: 'misc.centergermany'
						},
						ui: 'radio'
						
					},
					{
						xtype: 'radiofield',
						name: 'country',
						itemId: 'countryRadio',
						value: 'switzerland',
						locales: {
							label: 'misc.centerswitzerland'
						},
						ui: 'radio'
						
					},
					{
						xtype: 'radiofield',
						name: 'country',
						itemId: 'countryRadio',
						value: 'uk',
						disabled: true,
						locales: {
							label: 'misc.centeruk'
						},
						ui: 'radio'
						
					},
					{
						xtype: 'label',
						itemId: 'selectionFailedLabel',
						locales: {
							html: 'tabs.firstrun.countrysettingsfailed'
						},
						//html: 'Failed message',
						hidden: true,
						hideAnimation: 'fadeOut',
						showAnimation: 'fadeIn',
						style: 'color: #990000; margin: 5px 0px;',
						padding: 10
					}
				]
			},

			{
				xtype: 'fieldset',
				locales: {
					instructions: 'tabs.firstrun.language',
					title: 'tabs.firstrun.languagetitle'
				},
				defaults: {
					labelWidth: '80%'
				},
				items: [
					{
						xtype: 'radiofield',
						name: 'language',
						value: 'de',
						locales: {
							label: 'misc.language.de'
						}
						
					},
					{
						xtype: 'radiofield',
						name: 'language',
						value: 'en',
						locales: {
							label: 'misc.language.en'
						}
					}
				]
			},
			{
				xtype: 'fieldset',
				
				locales: {
					title: 'tabs.firstrun.automaticupdates.title',
					instructions: 'tabs.firstrun.automaticupdates.instructions'
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
						value: true,
						locales: {
							label: 'tabs.firstrun.automaticupdates.togglelabel'
						}
					}
				]
			},
			{
				xtype: 'fieldset',
				
				locales: {
					title: 'tabs.firstrun.reminder.title',
					instructions: 'tabs.firstrun.reminder.instructions'
				},
				items: [
					{
						xtype: 'label',
						padding: 10,
						locales: {
							html: 'tabs.firstrun.reminder.description'
						}
					},
					{
						xtype: 'togglefield',
						itemId: 'toggleReminder',
						labelWidth: '75%',
						value: false,
						locales: {
							label: 'tabs.firstrun.reminder.togglelabel'
						}
					},

					{
						xtype: 'textfield',
						itemId: 'reminderTimeTextfield',
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
				xtype: 'button',
				itemId: 'firstRunProceedButton',
				ui: 'action-forward',
				locales: {
					text: 'buttons.next'
				},
				width: '60%',
				margin: '15 20%'
				
			}
			
		]

	}

});
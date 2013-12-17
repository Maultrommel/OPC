Ext.define('opc.view.CountrySelectForm', {
	extend: 'Ext.form.Panel',
	alias: 'widget.countryselectform',
	config: {
		//title: 'Land',
		modal: true,
		hideOnMaskTap: true,
		/*layout: {
			align: 'middle'
		},*/
		//left: 10,
		top: '30%',
		//right: 10,
		layout: {
			type: 'vbox'
		},
		height: 250,
		width: '80%',
		maxWidth: 400,
		fullscreen: false,
		margin: '0 10%',
		border: 0,
		items: [
			{
				xtype: 'titlebar',
				locales: {
					title: 'tabs.firstrun.countrysettingstitle'
				},
				items: {
					xtype: 'button',
					itemId: 'abortButton',
					ui: 'action',
					align: 'right',
					locales: {
						text: 'buttons.cancel'
					}
				}
			},
			{
				xtype: 'label',
				padding: 10,
				locales: {
					html: 'tabs.info.chooseCountryDescription'
				}
			},
			{
				xtype: 'selectfield',
				itemId: 'countryselectfield',
				locales: {
					label: 'tabs.info.countryselectionlabel'
				},
				options: [
					{text: 'United Kingdom', value: 'uk'},
					{text: 'Schweiz', value: 'switzerland'},
					{text: 'Germany', value: 'germany'}
				]
			}
			/*
				xtype: 'label',
				html: 'Text'
			}*/
		]
	}
});

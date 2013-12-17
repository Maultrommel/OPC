Ext.define('opc.view.Info', {
	extend: 'Ext.form.Panel',
	alias: 'widget.infoview',
	config: {
		title: 'Info',
		items: [
			{
				xtype: 'spacer',
				height: '5px'
			},
			{
				xtype: 'label',
				itemId: 'labelLogo',
				//html: 'Information about OMF and contact form'
				data: {
					logo: 'resources/loading/Default.png'
				},
				margin: '0 10%',
				style: {
					'width': '80%',
					'background': '#ffffff',
					'border': '3px',
					'border-color': 'red',
					'border-radius': '20px'
				},
				tpl: '<p align="center"><img src="{logo}" width="80%"/></p>'
			},
			{
				xtype: 'label',
				itemId: 'labelContactData',
				padding: 10,
				margin: '15 10%',
				data: {
					contact: 'OMF International',
					contactemail: 'ch@omfmail.com'
				},
				tpl: '<p>{contact}</p><a href="mailto:{contactemail}">{contactemail}</a>'
			}
		]
	}
});
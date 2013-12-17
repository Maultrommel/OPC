Ext.define('opc.view.SorterForm', {
	extend: 'Ext.form.Panel',
	alias: 'widget.sorterform',

	config: {
				//left: 0,
				//top: 0,
				modal: true,
				/*layout: {
					type: 'vbox'
				},*/
				//title: 'Choose sorting',
				hidden: true,
				hideOnMaskTap: true,
				width: '250px',
				height: '350px',
				itemId: 'sorterPanelPanel',
				
				//html: 'Floating Panel',
				
				fullscreen: false,
				scrollable: false,
				
				
				padding: 10,
				//centered: true,
				defaults: {
					labelWidth: '70%',
					//labelAlign: 'right',
					//width: '280px',
					//clearIcon: true,
					labelWrap: false,
					ui: 'sortingdown'
				},
				items: [
					{
						xtype: 'label',
						locales: {
							html: 'tabs.list.sorter.choosesorting'
						}
					},
					{
						xtype: 'checkboxfield',
						name: 'sorting',
						itemId: 'sortingDate',
						//cls: 'sortingdown',
						//ui: 'sortingdown',
						value: 'byDate',
						locales: {
							label: 'tabs.list.sorter.sortingdate'
						}
					},
					{
						xtype: 'checkboxfield',
						name: 'sorting',
						itemId: 'sortingCountry',
						value: 'byCountry',
						locales: {
							label: 'tabs.list.sorter.sortingcountry'
						}
					},
					{
						xtype: 'checkboxfield',
						name: 'sorting',
						itemId: 'sortingWork',
						value: 'byWork',
						locales: {
							label: 'tabs.list.sorter.sortingwork'
						}
					},
					{
						xtype: 'label',
						locales: {
							html: 'tabs.list.sorter.chooserange'
						}
					},

					{
						xtype: 'textfield',
						itemId: 'rangeTextStart',
						labelWidth: '30%',
						label: 'Start',
						placeHolder: 'Startdatum',
						readOnly: true
					},
					{
						xtype: 'textfield',
						itemId: 'rangeTextEnd',
						labelWidth: '30%',
						label: 'End',
						placeHolder: 'Enddatum',
						readOnly: true
					},
					/*{
						xtype: 'slider',
						itemId: 'rangeSlider',
						//label: 'Datum',
						minValue: 0,
						maxValue: 100,
						value: [0,100]
					},*/
					{
						xtype: 'button',
						itemId: 'closeSorterForm',
						locales: {
							text: 'tabs.list.sorter.closesorter'
						}
					}
				]
			}

});
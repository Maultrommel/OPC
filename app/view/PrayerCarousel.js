Ext.define('opc.view.PrayerCarousel', {
	extend: 'Ext.Carousel',
	xtype: 'prayercarouselview',
	//requires: 'Ext.scroll.Scroller',
	id: 'prayercarouselview',
	config: {
	//fullscreen: true,
		iconCls: 'home',
		title: 'Today',
		indicator: false,
		//animation: 'flip',
		ui: 'dark',
		bufferSize: 2,
		direction: 'horizontal',
		align: 'center',
		/*scrollable: {
			direction: 'horizontal',
			directionLock: true
		},*/
		defaults: {
			styleHtmlContent: true
			//height: '50%'
			//maxWidth: 400,
			//align: 'center'
			//style: 'background-color: #fff',
			//xtype: 'prayercard',
			//country: 'Cambodia',
			
		}
		
		//store: 'localPrayerStore',
		// items: [
		// {
		// 	itemTpl: '{introtext}',
		// 	html: 'Item 1',
		// 	style: 'background-color: #fff',
		// },
		// {
		// 	html: 'Item 2',
		// 	style: 'background-color: #888'
		// }]
	}
});
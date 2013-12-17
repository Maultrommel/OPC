Ext.define('opc.view.PrayerCard', {
	extend: 'Ext.Container',
	xtype: 'prayercard',

	config: {

		layout: {
			type: 'vbox'
			//align: 'middle'
		},
		style: {
			'border-left': '1px solid black'
		},

		prayeritem: null,
		//prayertitle: null,


		items: [
			
		    {
                xtype: 'titlebar',
                //title: prayeritem.get('date_raw')
                title: 'Today'
            },
            {
                xtype: 'panel',
                //layout: 'card',
                scrollable: {
					direction: 'vertical',
					directionLock: true
				},
                
                //flex: 1,
                //border: 2,
                height: '100%',
                padding: 5,
                style: {
                    background: 'gainsboro'

                },
                data: {
                	prayertitle: 'Title Prayeritem',
                	introtext: 'Some random text',
                	country: 'Switzerland',
                	author: 'CH Office'
                },
                tpl: [
                	'<h2>{prayertitle}</h2>',
                	'<b>{author}</b>',
                	'{introtext}'
                	//'Written by: {author}'
                	//'Different source: ' + prayeritem.get('introtext')
                ].join('') 
                
            }
			
		]
		/*listeners: {
			updatedata: function(prayeritem) {
				//this.setData({'introtext':prayeritem.get('introtext')});
				console.log('Prayeritem changed');
			}
		}*/
		
	},

	updatePrayeritem: function(prayeritem) {
		var today = new Date();
		this.down('panel').setData({
			'prayertitle':prayeritem.get('title'),
			'introtext':prayeritem.get('introtext'),
			'country':prayeritem.get('country'),
			'author':prayeritem.get('author')
		});

		prayeritem.set('today', false);
		
		//console.log('Prayer title: ' + prayeritem.get('date_formatted'));

		//this.down('titlebar').setTitle(prayeritem.get('date_formatted'));
		//var titlePrayerItem = prayeritem.get('date_formatted') + ' - ' + prayeritem.get('title');

		//console.log('Date formatted: ' + prayeritem.get('date_formatted'));
		this.down('titlebar').setTitle(prayeritem.get('date_formatted'));

		//if (prayeritem.get('today') == true) {
		if (prayeritem.get('date_raw').getMonth() == today.getMonth() && prayeritem.get('date_raw').getDate() == today.getDate()) {
			prayeritem.set('today', true);
			//console.log('Today found: ' + prayeritem.get('today'));
			this.down('titlebar').setStyle({background: 'green'});
		}
		
		//console.log('Prayeritem changed');
	}


});
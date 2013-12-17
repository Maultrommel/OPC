Ext.define('opc.view.Today', {
    extend: 'Ext.tab.Panel',
    xtype: 'today',
    id: 'mainView',
    requires: [
        'Ext.TitleBar',
        'Ext.Video',
        'Ext.DataView',
        'Ext.Carousel'
    ],
    config: {
        tabBarPosition: 'bottom',

        items: [
            
            {
                xtype: 'titlebar',
                docked: 'top',
                //title: 'OMF Prayer Calendar',
                locales: {
                    title: 'app.title'
                },
                items: [
                    {
                        xtype: 'button',
                        id: 'datePickerButton',
                        iconCls: 'calendar',
                        /*locales: {
                            text: 'buttons.pick-a-date'
                        },*/
                        //text: 'Pick a date',
                        align: 'right',
                        hidden: true
                    },
                    {
                        xtype: 'button',
                        itemId: 'listSorterButton',
                        iconCls: 'list',
                        align: 'right',
                        hidden: true
                    }
                ]
            },
            {
                xtype: 'prayercarouselview',
                itemId: 'todayIcon',
                locales: {
                    title: 'tabs.carousel.icontitle'
                }
            },
            {
               // title: 'Prayer Items',
                xtype: 'prayerlist',
                //title: 'List',
                iconCls: 'list',
                locales: {
                    title: 'tabs.list.icontitle'
                }
                
            },

            {
                xtype: 'infoview',
                iconCls: 'info',
                locales: {
                    title: 'tabs.info.buttontitle'
                }
                //title: 'Info'
            },
            {
                xtype: 'showstatistics',
                iconCls: 'settings',
                locales: {
                    title: 'tabs.config.buttontitle'
                }
                
            }
            /*{
                //xtype: 'requestpasscode'
            }*/
        ]
    }
});

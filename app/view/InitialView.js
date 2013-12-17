Ext.define('opc.view.InitialView', {
    extend: 'Ext.tab.Panel',
    xtype: 'initialview',
    //id: 'mainView',
    /*requires: [
        'Ext.TitleBar',
        'Ext.Video',
        'Ext.DataView',
        'Ext.Carousel'
    ],*/
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
                        align: 'left'
                        //hidden: true
                    }
                ]
            },
            {
                xtype: 'firstrunview',
                iconCls: 'play',
                locales: {
                    title: 'tabs.firstrun.buttontitle'
                }
            },
            
            {
                xtype: 'infoview',
                itemId: 'infoTabButton',
                iconCls: 'info',
                locales: {
                    title: 'tabs.info.buttontitle'
                }
                //title: 'Info'
            }
            
        ]
    }
});

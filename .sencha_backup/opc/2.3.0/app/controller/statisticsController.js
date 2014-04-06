Ext.define('opc.controller.statisticsController', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            statisticsPanelRef: 'showstatistics',
            statisticsPanelButtonClear: 'showstatistics button[action=clearprayeritems]',
            statisticsButtonUpdate: 'showstatistics button[action=updaterequest]',
            resetButton: 'showstatistics #resetButton',
            clearDataButton: 'initialview #firstRunResetButton',
            firstRunViewRef: 'firstrunview'

        },
        control: {
            'statisticsPanelRef': {
                show: 'computeStatistics'
            } ,
            'statisticsPanelButtonClear': {
                tap: 'computeStatistics'    
            },
            'resetButton': {
                tap: 'onResetButton'
            },
            'clearDataButton': {
                tap: 'doDeleteData'
            },
            statisticsButtonUpdate: {
                tap: 'forceUpdate'
            }
        }
    },
    
    computeStatistics: function() {
        console.log('Updating statistics data');
        var languagePanelRef = this.getStatisticsPanelRef().down('#languagePanel');
        languagePanelRef.suspendEvents();
        languagePanelRef.setValue(opc.app.globals.preferences.language_key);
        languagePanelRef.resumeEvents(true);
        //var m = Ext.create('opc.model.StatisticsModel', {numberOfItems: Ext.getStore('localPrayerStore').getCount()});
        
        var automaticUpdatePanelRef = this.getStatisticsPanelRef().down('#toggleAutomaticUpdates');
        automaticUpdatePanelRef.suspendEvents();
        automaticUpdatePanelRef.setValue(opc.app.globals.preferences.perform_updates);
        automaticUpdatePanelRef.resumeEvents(true);

        var monthArray = [],
            monthAlreadyInArray = [],
            yearAlreadyInArray = [];

        /*Ext.getStore('localPrayerStore').each(function(item) {
            var monthIndex = item.get('date_raw').getMonth(),
                yearIndex = item.get('date_raw').getFullYear();*/
        opc.app.globals.dateArray.forEach(function(item) {
            var monthIndex = item.getMonth(),
                yearIndex = item.getFullYear();

                //console.log('MonthIndex: ' + monthIndex + '');

            if (monthAlreadyInArray.indexOf(Ext.Date.monthNames[monthIndex]) == -1) {
                //monthArray.push(Ext.Date.monthNames[monthIndex] + ' ' + item.get('date_raw').getFullYear());
                if (yearAlreadyInArray.indexOf(yearIndex) == -1) {
                    //monthArray.push(yearIndex);
                    monthArray.push(yearIndex);
                    yearAlreadyInArray.push(yearIndex);
                    //monthArray.push(Ext.Date.monthNames[monthIndex]);
                    monthArray.splice(-1,0,Ext.Date.monthNames[monthIndex]);

                    
                } else {
                    monthArray.splice(-1,0,Ext.Date.monthNames[monthIndex]);
                    
                    
                    
                }

                monthAlreadyInArray.push(Ext.Date.monthNames[monthIndex]); 
                  

            }
                /*if (yearAlreadyInArray.indexOf(yearIndex) == -1) {
                    
                    yearAlreadyInArray.push(yearIndex);
                } else {
                    monthArray.push(yearIndex);
                }*/               

        });

        var m = Ext.create('opc.model.StatisticsModel', {
            //numberOfItems: Ext.getStore('localPrayerStore').getCount(), 
            numberOfItems: opc.app.globals.dateArray.length,
            monthsPresent: monthArray.join(' ')
        });

        //numberOfItems = Ext.getStore('localPrayerStore').getCount();
        //console.log('Number of Items: ' + m.get('numberOfItems'));
        return this.getStatisticsPanelRef().down('#statisticspanel').setData(m.getData());
        
    },

    forceUpdate: function() {
        var me = this;
        //statisticsPanelRef = me.getStatisticsPanelRef();
        //statisticsPanelRef.setMasked({
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: Ux.locale.Manager.get('tabs.update.doingupdate')
        });

        me.getApplication().getController('opc.controller.UpdatePrayerItems').PrayerItemsCurrent(
            function successCB(messageSuccessUpdate) {
                console.log('Update successfull');

            //Recreate Prayer Cards
                carousel = Ext.Viewport.down('prayercarouselview');
                if (carousel) {
                    carousel.removeAll();
                    opc.app.globals.carouselItems.item = [];
                    opc.app.globals.carouselItems.monthpresent = [];
                    me.getApplication().getController('opc.controller.MakeCarouselItems').CarouselItems();
                }
                
                //console.log('Title Messagebox: ' + messageSuccessUpdate.title);
                messageSuccessUpdate.show();
                me.computeStatistics();
                //statisticsPanelRef.setMasked(false);
                Ext.Viewport.setMasked(false);
            },
            function failureCB(messageNotOnline) {
                console.log('Update failed');
                messageNotOnline.show();
                Ext.Viewport.setMasked(false);
            },
            true);
    },

    onResetButton: function() {
        var me = this;
        console.log('Reset button pressed');
        var confirmationBox = Ext.create('Ext.MessageBox', {
            locales: {
               title: 'tabs.config.reset.confirmtitle',
               message: 'tabs.config.reset.confirmtext' 
            },
            iconCls: Ext.MessageBox.WARNING,
            buttons: [
                {
                    xtype: 'button',
                    ui: 'decline',
                    locales: {
                       text: 'tabs.config.reset.confirmbutton' 
                    },
                    handler: function() {
                        me.doDeleteData();
                        //me.computeStatistics();
                        confirmationBox.destroy();
                        //firstrunviewref = Ext.Viewport.add({xtype: 'firstrunview'});
                        //Ext.Viewport.animateActiveItem(firstrunviewref, me.getSlideRightTransition());
                        //Ext.Viewport.remove({xtype: 'mainView'},true);
                    }
                },
                {
                    xtype: 'button',
                    locales: {
                       text: 'buttons.cancel' 
                    },
                    handler: function() {
                        confirmationBox.destroy();
                    }
                }
            ]

        });
        confirmationBox.show();       
    },

    doDeleteData: function() {
        console.log('We are going to destroy it all...');
    //Remove prayer items
        this.getApplication().getController('opc.controller.UpdatePrayerItems').clearLocalPrayers();
    //Remove country settings
        var localCountryStore = Ext.getStore('localCountrySettingsStore');
        localCountryStore.load();
        localCountryStore.clearFilter();
        localCountryStore.removeAll();
        console.log('Items in Country Store after clearing: ' + localCountryStore.getCount());
        localCountryStore.sync();
    //Remove Notifications
        opc.app.globals.notification.cancelAll();
    //Reset variables
        opc.app.globals.firstrun = true;
        opc.app.globals.preferences = {};
        opc.app.globals.preferencesfunction.set('reminder',false,null,null);
        opc.app.globals.preferencesfunction.set('passcode_key','defaultPasscode',null,null);
        opc.app.globals.preferencesfunction.set('prayer_country','none',null,null);
        opc.app.globals.preferencesfunction.set('perform_updates',false,null,null);
        opc.app.globals.countrysettings = {};

        var doneMessageBox = Ext.create('Ext.MessageBox',{
            locales: {
                title: 'tabs.config.reset.successmessage.title',
                message: 'tabs.config.reset.successmessage.message'
            },
            //title: 'Erledigt!',
            //message: 'Erfolgreich alles gelöscht...',
            iconCls: Ext.MessageBox.INFO,
            buttons: [
                {
                    xtype: 'button',
                    ui: 'normal',
                    locales: {
                        text: 'buttons.restart'
                    },
                    handler: function() {
                        window.location.reload();
                    }
                }
            ]
        });
        doneMessageBox.show();

    },

    getSlideRightTransition: function() {
        return {
            type: 'slide',
            direction: 'right'
        };

    }
});
/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/


// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides

//<debug>
/*Ext.Loader.setPath({
    //'Ext': '../touch-2.2.0/src',
    'Ext': 'touch/src',
    //'opc': 'app',
    //'opc': 'app',
    'Ux': 'app/ux'

});*/
//</debug>

Ext.application({

    profiles: ['Android', 'Desktop', 'Iphone'],

    name: 'opc',

    requires: [
        'Ext.MessageBox','Ext.device.Connection','Ext.DateExtras','Ext.device.Notification', 'Ext.form.FieldSet','Ext.field.Email',
        'Ext.ActionSheet', 'Ext.field.Radio', 'Ext.env.OS', 'Ext.field.Select', 'Ext.util.DelayedTask', 'Ext.field.Toggle',

        'Ux.locale.Manager','Ux.locale.override.st.Button','Ux.locale.override.st.Container','Ux.locale.override.st.TitleBar',
        'Ux.locale.override.st.field.Field','Ux.locale.override.st.field.Select'/*,'Ux.locale.override.st.field.Radio'*/,
        /*'Ux.locale.override.st.field.DatePicker',*/'Ux.locale.override.st.form.FieldSet',
        'Ux.locale.override.st.picker.Picker','Ux.locale.override.st.picker.Date'
    ],

    models:[
        'CountryModel',
        'PrayerPointModel',
        'ReminderModel',
        'StatisticsModel'
    ],

    views: [
        'AuthenticateUser',
        'FirstRun',
        'ListMarkers',
        'ListPrayers',
        'PrayerCard',
        'PrayerCarousel',
        'RequestPasscodeForm',
        'Statistics',
        'Today',
        'Info',
        'InitialView',
        'CountrySelectForm',
        'SorterForm'
    ],

    stores: [
        'LocalCountrySettings',
        'LocalPrayerItems',
        'RemoteCountrySettings',
        'RemotePrayerItems'
    ],

    controllers: [
        'CheckPasscode',
        'DisplayPrayerItem',
        'MakeCarouselItems',
        'UpdatePrayerItems',
        //'android.androidController',
        //'dayPickerController',
        //'desktop.desktopController',
        'firstRunController',
        //'iPhone.iphoneController',
        'reminderController',
        'statisticsController',
        'infoController'
    ],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

//Initialize global variables
    globals: {
        key: 123,
        firstrun: false,
        doneloading: false,
        notfoundmessage: false,
        lateUpdate: false,
        preferences: {},
        countrysettings: {},
        carouselItems: {
            item: [],
            monthpresent: []
        },
        dateArray: [],
        rangeArray: [],
        preferencesfunction: function() {},
        notification: function() {},
        emailcomposer: function() {},
        setGlobalLogoUrl: function(id, dataUrl) {
            //console.log('DataUrl in globals: ' + dataUrl);
        },

    },

    launch: function() {

        var task = Ext.create('Ext.util.DelayedTask', function() {

            if (opc.app.globals.preferences.prayer_country == null||opc.app.globals.preferences.prayer_country == 'none' ||opc.app.globals.preferences.prayer_country == '') {
                opc.app.globals.firstrun = true;
            } else {
                opc.app.globals.firstrun = false;
            }

        /*// Initialize the localization

            //console.log('Language setting: '+navigator.language);
            Ux.locale.Manager.setConfig({
                ajaxConfig: {
                    method: 'GET'
                },
                language: navigator.language.split('-')[0],
                tpl: 'resources/locales/{locale}.json',
                type: 'ajax'
            });

            Ux.locale.Manager.init();*/

            console.log('Language in Preferences: ' + opc.app.globals.preferences.language_key);
            


        //Override the environement language, if there is a language in the preferences
            if (opc.app.globals.preferences.language_key && opc.app.globals.preferences.language_key != navigator.language.split('-')[0]) {
                Ux.locale.Manager.updateLocale(opc.app.globals.preferences.language_key);
            }

        
            
    // Destroy the #appLoadingIndicator element
            Ext.fly('appLoadingIndicator').destroy();


    //Check for first Run
            if (opc.app.globals.firstrun == true) {
                //console.log('This is the first run of this app');
                //opc.app.globals.firstrun = true;
                Ext.Viewport.add([
                    //{xtype: 'firstrunview'}
                    {xtype: 'initialview'}
                ]);
            } else {
        // Set new reminder for next day if necessary
                /*if (opc.app.globals.preferences.reminder == 'true'||opc.app.globals.preferences.reminder == true) {
                    console.log('Resetting reminder');
                    this.getApplication().getController('opc.controller.reminderController').setNextReminder();
                }*/

                //console.log('Going directly to authentification. Value of prayer_country: ' + opc.app.globals.preferences.prayer_country);
                Ext.Viewport.add([
                    {xtype: 'authenticateview'}
                    //{xtype: 'today'}
                ]); 
            }
        });

        // Initialize the localization
        console.log('Initializing Localization');

        Ux.locale.Manager.setConfig({
            ajaxConfig: {
                method: 'GET'
            },
            language: navigator.language.split('-')[0],
            tpl: 'resources/locales/{locale}.json',
            type: 'ajax'
        });

        Ux.locale.Manager.init();

        task.delay(500);

        var me = this;
        document.addEventListener('resume', function(){
            //me.resumeApp();
            if (!opc.app.backgroundNotification) {
                me.resumeApp();
            }
            //me.backgroundNotification();
        });

    //Print preference values
    /*    var keyArray = ['perform_updates','prayer_country', 'selectedtime3', 'selectedtimeformated', 'language_key', 'reminder'];
        for (i = 0; i < keyArray.length; i++) {
            opc.app.globals.preferencesfunction.get(keyArray[i], function(result){
                preferences_value = result;
                
            }, function(error) {
                console.log('Error getting preferences');
            });
            
            //console.log('Resumed value for key ' + keyArray[i] + ': ' + preferences_value);
            console.log('Locally stored value "' + opc.app.globals.preferences[keyArray[i]] + '" for key: ' + keyArray[i]);
        }*/

    },

    onUpdated: function() {
        /*Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );*/
        Ext.Msg.show({
            locales: {
                title: 'app.appupdatetitle',
                message: 'app.appupdatetext'
            },
            iconCls: Ext.MessageBox.WARNING,
            buttons: [
                {
                    ui: 'normal',
                    locales: {
                        text: 'buttons.restart'
                    },
                    handler: function() {
                        window.location.reload();
                    }
                },
                {
                    ui: 'normal',
                    locales: {
                        text: 'buttons.cancel'
                    },
                    handler: function() {
                        this.parent.parent.hide();
                    } 
                }
            ]
        });
    },

    resumeApp: function() {
        var me = this;

        console.log('RESUME APP: Back to opc from resumed state');

    //Check for changes in preferences
        var preferences_value = [];
        var keyArray = ['perform_updates','prayer_country', 'selectedtime3', 'selectedtimeformated', 'language_key', 'reminder'];
        
        me.getPreferences(preferences_value,keyArray, function successCB(preferences_value) {
            //for (i = 0; i < preferences_value.length; i++) {
            //    console.log('Resumed value "'+ preferences_value[i] + '" for key: ' + keyArray[i]);
            //    console.log('Locally stored value "' + opc.app.globals.preferences[keyArray[i]] + '" for key: ' + keyArray[i]);  
            //}
            me.compareSettings(preferences_value, keyArray);
        }, function failureCB() {
            console.log('Failed to retrieve preferences upon resuming app');
        });



        
        /*if (preferences_value[i] != opc.app.globals.preferences[keyArray[i]]) {
            console.log('Different setting in ' + keyArray[i]);
        }*/

    //Rebuild carousel if necessary
        var carousel = Ext.Viewport.down('prayercarouselview');
        console.log('Resumed Carousel found: ' + carousel.getItems().length + ' items.');
        if (carousel) {
            Ext.Viewport.setMasked({
                xtype: 'loadmask',
                message: 'Loading...'
            });

            //console.log('Entering for routine...');
            for (i = 1; i <= carousel.getItems().length; i++) {

                //console.log(i);
                //console.log('Today: '+ carousel.getItems().items[i].get('prayeritem').get('today'));
                if (carousel.getItems().items[i].get('prayeritem').get('today') == true) {
                    today = new Date();
                    console.log('Marked as today: ' + carousel.getItems().items[i].get('prayeritem').get('date_raw').toDateString());
                    console.log('Actually today is: ' + today.toDateString());
                    if (carousel.getItems().items[i].get('prayeritem').get('date_raw').toDateString() != today.toDateString()) {
                        carousel.removeAll();
                        console.log('Rebuilding carousel');
                        me.getApplication().getController('opc.controller.MakeCarouselItems').CarouselItems();
                        Ext.Viewport.setMasked(false);
                        return;
                    }
                    if (carousel.getItems().items[i].get('prayeritem').get('date_raw').toDateString() == today.toDateString()) {
                        Ext.Viewport.setMasked(false);
                        return;
                    }

                }
            }
            Ext.Viewport.setMasked(false);
        }

    },

    getPreferences: function(preferences_value,keyArray,successCB,failureCB) {
        for (i = 0; i < keyArray.length; i++) {
            opc.app.globals.preferencesfunction.get(keyArray[i].toString(), function(result){
                preferences_value.push(result);
                //console.log('Function result: ' + preferences_value[i] + ' Length: ' + preferences_value.length);
                if (preferences_value.length == keyArray.length) {
                    //preferences_value.forEach(function(value,index){
                    //    console.log('Results: ' + value);
                    //});
                    console.log('We did it, all preferences are here!');
                    return successCB(preferences_value);
                }
            }, function(error) {
                console.log('Error getting preferences');
                preferences_value = 'error';
                return failureCB();
            });
            /*if (keyArray.length == preferences_value.length) {
                return successCB(preferences_value);
            }*/
        }
    },

    compareSettings: function(preferences_value,keyArray) {
        for (i=0; i < preferences_value.length; i++) {
            if (preferences_value[i] != opc.app.globals.preferences[keyArray[i]]) {
                console.log('Different setting in ' + keyArray[i]);
                switch(keyArray[i]) {
                    case 'perform_updates':
                        opc.app.globals.preferences.perform_updates = preferences_value[i];
                        this.getApplication().getController('opc.controller.statisticsController').computeStatistics();
                        break;
                    case 'prayer_country':
                        opc.app.globals.preferences.prayer_country = preferences_value[i];
                        this.getApplication().getController('opc.controller.UpdatePrayerItems').clearLocalPrayers();
                        //this.getApplication().getController('opc.controller.statisticsController').forceUpdate();
                        //Fetch basic settings for this country
                        Ext.Viewport.setMasked({
                            xtype: 'loadmask',
                            message: 'Loading country settings'
                        });
                        //opc.app.globals.countrysettings = me.onLoadCountrySettings(chosenCountry);
                        
                        this.getApplication().getController('opc.controller.firstRunController').onLoadCountrySettings(opc.app.globals.preferences.prayer_country, 
                            function successCB() {
                                console.log('Countrysettings Passcode: ' + opc.app.globals.countrysettings.get('passcode'));
                    //Hide this view and show the Passcode View (if necessary)
                                authenticateview = Ext.Viewport.down('authenticateview');
                                if (!authenticateview) {
                                    authenticateview = Ext.Viewport.add({
                                        xtype: 'authenticateview'
                                    });
                                }

                                Ext.Viewport.setMasked(false);
                                Ext.Viewport.animateActiveItem(authenticateview, me.getSlideLeftTransition());
                            //Ext.Viewport.destroy();
                            },
                            function failureCB() {
                            //console.log('Failure returned');
                                firstrunview = Ext.Viewport.down('firstrunview');
                                if (!firstrunview) {
                                    firstrunview = Ext.Viewport.add({
                                        xtype: 'firstrunview'
                                    });
                                } 
                                Ext.Viewport.setMasked(false);
                                Ext.Viewport.animateActiveItem(firstrunview, this.getApplication.getController('opc.controller.firstRunController').getSlideLeftTransition());
                            }
                        );


                        break;
                    case 'selectedtime3':
                        break;
                    case 'language_key':
                        opc.app.globals.preferences.language_key = preferences_value[i];
                        this.getApplication().getController('opc.controller.statisticsController').computeStatistics();
                        Ux.locale.Manager.updateLocale(preferences_value[i]);
                        break;
                    case 'reminder':
                        opc.app.globals.preferences.reminder = preferences_value[i];
                        if (preferences_value[i] == 0 || preferences_value[i] == false) {
                            this.getApplication().getController('opc.controller.reminderController').onStopReminder();
                        }
                        if (preferences_value[i] == 1 || preferences_value[i] == true) {
                            this.getApplication().getController('opc.controller.reminderController').onSetReminder(opc.app.globals.preferences.selectedtime3);
                        }
                        break;
                    default:
                        console.log('Something changed in preferences, but I do not know what...');
                        break;
                }
            }
        }

    },

    foregroundNotification: function(id) {
        console.log('Back to opc, resuming from tapping notification. My ID is: ' + id);
    //Make sure the notification is cancelled
        //opc.app.globals.notification.cancel(id);

    //Get carousel from the background to the front

        var carousel = Ext.Viewport.down('prayercarouselview');
        if (carousel) {
            console.log('Carousel present...');
            if (typeof id == 'number') {
                idString = id.toString();
            } else {
                idString = id;
            }
            var notificationDate = new Date(parseInt(idString.slice(0,4),10),parseInt(idString.slice(4,6),10)-1,parseInt(idString.slice(6,8),10));
            this.getApplication().getController('opc.controller.MakeCarouselItems').setCarouselDate(notificationDate);
            //carousel.setActiveItem(id);
            Ext.Viewport.down('today').setActiveItem(0);
        } else {
            console.log('No carousel, starting today view');
            today = Ext.Viewport.add({xtype: 'today'});
            today.show();
        }
    },

    rebuildCarousel: function(carousel) {
        if (carousel) {
            Ext.Viewport.setMasked({
                xtype: 'loadmask',
                message: 'Loading...'
            });

            //console.log('Entering for routine...');
            for (i = 1; i <= carousel.getItems().length; i++) {

                //console.log(i);
                //console.log('Today: '+ carousel.getItems().items[i].get('prayeritem').get('today'));
                if (carousel.getItems().items[i].get('prayeritem').get('today') == true) {
                    today = new Date();
                    console.log('Marked as today: ' + carousel.getItems().items[i].get('prayeritem').get('date_raw').toDateString());
                    console.log('Actually today is: ' + today.toDateString());
                    if (carousel.getItems().items[i].get('prayeritem').get('date_raw').toDateString() != today.toDateString()) {
                        carousel.removeAll();
                        console.log('Rebuilding carousel');
                        me.getApplication().getController('opc.controller.MakeCarouselItems').addItemstoCarousel(today.getMonth(),function addSuccess(addedItemsCount){
                            Ext.Viewport.setMasked(false);
                            return;
                        }, function addFail(){
                            console.log('Failed composing carousel items for current month');
                            return;
                        });

                    }
                    if (carousel.getItems().items[i].get('prayeritem').get('date_raw').toDateString() == today.toDateString()) {
                        console.log('Carousel up to date, no changes needed');
                        Ext.Viewport.setMasked(false);
                        return;
                    }

                }
            }
            Ext.Viewport.setMasked(false);
        }
    },

    backgroundNotification: function(id) {
       var me = this; 
    //Make sure the notification is cancelled
        //opc.app.globals.notification.cancel(id);
        console.log('Back to opc...');


    //Check for changes in preferences
        var preferences_value = [];
        var keyArray = ['perform_updates','prayer_country', 'selectedtime3', 'selectedtimeformated', 'language_key', 'reminder'];
        
        me.getPreferences(preferences_value,keyArray, function successCB(preferences_value) {
            //for (i = 0; i < preferences_value.length; i++) {
            //    console.log('Resumed value "'+ preferences_value[i] + '" for key: ' + keyArray[i]);
            //    console.log('Locally stored value "' + opc.app.globals.preferences[keyArray[i]] + '" for key: ' + keyArray[i]);  
            //}
            me.compareSettings(preferences_value, keyArray);
        }, function failureCB() {
            console.log('Failed to retrieve preferences upon resuming app');
        });

    //Get carousel from the background to the front
        var carousel = Ext.Viewport.down('prayercarouselview');

        if (carousel) {
            console.log('Carousel present, checking if we have to update it...');
            me.rebuildCarousel(carousel);
        } else {
            var carousel = Ext.getCmp('prayercarouselview');
        }

        if (id) {
            console.log('Back to opc from not running. My ID is: ' + id);
            if (carousel) {
                //console.log('Setting carousel to date of notification');
                //carousel.setActiveItem(id);
                if (typeof id == 'number') {
                    idString = id.toString();
                } else {
                    idString = id;
                }
                notificationMonth = idString.slice(4,6);
                //console.log('notificationMonth: ' + notificationMonth);
                //console.log('Month: ' + parseInt(notificationMonth,10));
                var notificationDate = new Date(parseInt(idString.slice(0,4),10),parseInt(idString.slice(4,6),10)-1,parseInt(idString.slice(6,8),10));
                console.log('Carousel present... Going to date: ' + notificationDate);
                this.getApplication().getController('opc.controller.MakeCarouselItems').setCarouselDate(notificationDate);

                Ext.Viewport.down('today').setActiveItem(0);
            } else {
                console.log('No carousel, starting today view');
                today = Ext.Viewport.add({xtype: 'today'});
                today.show();
            }  
        }
        
    }
});

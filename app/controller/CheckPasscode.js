Ext.define('opc.controller.CheckPasscode', {
    extend: 'Ext.app.Controller',
    //requires: 'Ext.env.OS',
    xtype: 'checkpasscodetype',
    //suspendEvents: true,
    
    config: {
        refs: {

            authenticateView: 'authenticateview',
            authenticateBackButton: 'authenticateview #authenticateBackButton'
            //today: 'today'
        },
        control: {
            authenticateView: {
                authenticateCommand: 'onAuthenticateCommand',
                show: 'checkGlobals'
            },
            authenticateBackButton: {
                tap: 'onBackCommand'
            }
        }
        
    },
 

    getSlideLeftTransition: function() {
        return {
            type: 'slide',
            direction: 'left'
        };
    },

    getSlideRightTransition: function() {
        return {
            type: 'slide',
            direction: 'right'
        };
    },

    onBackCommand: function() {
        var me = this;
        console.log('Back button pressed');
        var firstrunview = Ext.Viewport.down('initialview');
        if (!firstrunview) {
            firstrunView = Ext.Viewport.add({xtype: 'firstrunview'});
        }
        Ext.Viewport.animateActiveItem(firstrunview, me.getSlideRightTransition());
        //Ext.Viewport.animateActiveItem(today, me.getSlideLeftTransition());
    },

    onAuthenticateCommand: function(view, passcode) {
        console.log('Authentification started. Passcode: ' + passcode);
        var me = this,
            authenticateView = me.getAuthenticateView();

        if (passcode.length === 0) {
            console.log('No Passcode entered');
            authenticateView.showAuthenticateFailedMessage(Ux.locale.Manager.get('tabs.authentification.nopasscodeentered'));
            return;
        }

        authenticateView.setMasked({
            xtype: 'loadmask',
            message: 'Checking Passcode...'
        });

        if (me.ValidatePasscode(passcode) == true) {
            //enter valid passcode in Preferences
            opc.app.globals.preferencesfunction.set('passcode_key',passcode, 
                function() {
                    //Ext.Msg.alert("First run", "Passcode value set to: 'Default Passcode'",'',this);
                    firstrun = false;
                    console.log('Passcode "' + passcode + '" entered into preferences');
                },
                function(error){
                    Ext.Msg.alert("Error setting", JSON.stringify(error),'',this);
                }
            );
            opc.app.globals.preferences.passcode_key = passcode;

            me.authenticateSuccess();
        } else {
            me.authenticateFailure(Ux.locale.Manager.get('tabs.authentification.passcodefailed'));
        }

    },

    authenticateSuccess: function() {
        console.log('Authentification successfull');
        var authenticateView = this.getAuthenticateView();
        var me = this;
        //today = this.getToday();
        authenticateView.down('#authenticateDescription').hide();
        authenticateView.setMasked(false);
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            //html: '<img src="resources/images/loading.gif"/><br/>',
            message: Ux.locale.Manager.get('tabs.update.doingupdate')
        });
        
        /*var updateSuccess = this.getApplication().getController('opc.controller.UpdatePrayerItems').PrayerItemsCurrent();
        console.log('Update Success: ' + updateSuccess);

        if (updateSuccess == true) {*/

        me.getApplication().getController('opc.controller.UpdatePrayerItems').PrayerItemsCurrent(
            function successCB(messageSuccessUpdate) {
                console.log('Update Callback successfull');
                /*if (Response != null) {
                    Ext.Msg.alert('Update successful','Successfully fetched ' + Response + ' current prayer items for this month.<br>Thank you for praying!','',this);
                }*/
                if (messageSuccessUpdate) {
                    messageSuccessUpdate.show();  
                }
                
                today = Ext.Viewport.add({xtype: 'today'});
                Ext.Viewport.setMasked(false);

                Ext.Viewport.animateActiveItem(today, me.getSlideLeftTransition());
                //console.log(Ext.Viewport.getScrollable());
                
            }, function failureCB() {
                console.log('Update Callback failed');
                Ext.Viewport.setMasked(false);
                today = Ext.Viewport.add({xtype: 'today'});

                Ext.Viewport.animateActiveItem(today, me.getSlideLeftTransition());
            }
        );
        /*}*/
    },

    authenticateFailure: function(message) {
        console.log('Authentification failed');
        var authenticateView = this.getAuthenticateView();

        //authenticateView.showAuthenticateFieldset();
        this.showPasscodeFieldset();
        authenticateView.showAuthenticateFailedMessage(message);
        Ext.Viewport.setMasked(false);
    },

    checkGlobals: function() {
         //console.log('Function CheckPasscode launched. Running on ' + Ext.os.name);
         // Ext.device.Notification.show({
         //    message: 'Running on ' + Ext.os.deviceType
         // });
         var authenticateView = this.getAuthenticateView();
         var PrayerPasscode = '';
         var value = null;
         var needPasscode = false;
         var me = this;

    //Load Countrysettings if necessary
        
        if (opc.app.globals.firstrun == false) {
            //var localCountryStore = Ext.getStore('localCountrySettingsStore');
            console.log('Loading Countrysettings into global variable...');
            me.getApplication().getController('opc.controller.firstRunController').onLoadCountrySettings(opc.app.globals.preferences.prayer_country, 
                function successCB() {
                    console.log('Successfully fetched country settings. Country: ' + opc.app.globals.countrysettings.get('alias'));
                    //console.log('Email before: ' + opc.app.globals.countrysettings.get('contactemail_before') + ' @ Email after: ' + opc.app.globals.countrysettings.get('contactemail_after'));
                    //console.log('Full Email: ' + opc.app.globals.countrysettings.get('contactemail'));
                    console.log('Starting hasPasscode to check passcode');
                    me.hasPasscode();

                },
                function failureCB() {
                    console.log('Not successfull casting countrysettings on global variable');
                    firstrunView = Ext.Viewport.down('initialview');
                    if (!firstrunView) {
                        firstrunView = Ext.Viewport.add({xtype: 'initialview'});
                    }
                    Ext.Viewport.animateActiveItem(firstrunView, me.getSlideRightTransition());
                }
            );
        } else {
            me.hasPasscode();
        }
    },

    hasPasscode: function() {

        var me = this;
        var authenticateView = this.getAuthenticateView();
        var PrayerPasscode = '';
        var value = null;
        var needPasscode = false;
        

        //Check if we have a passcode in preferences, if not, ask people to enter one.
             
         opc.app.globals.preferencesfunction.get('passcode_key', function(value) {
            if (value != null && value != "" && value != 'defaultPasscode') {
                PrayerPasscode = value;
                console.log('Found Passcode in Preferences...: ' + value);
                if (!me.ValidatePasscode(PrayerPasscode)) {
                        me.getAuthenticateView().down('#passcodeTextField').setValue(PrayerPasscode);
                        me.authenticateFailure(Ux.locale.Manager.get('tabs.authentification.novalidpasscode'));
                        needPasscode = true;  
                    

                } else {
                    me.authenticateSuccess();
                }
            } else {
                console.log('No Passcode or Passcode = null in Preferences...')
                needPasscode = true;
                me.showPasscodeFieldset();
            }
         }, function(error) {
            Ext.Msg.alert("Error!", JSON.stringify(error),'',this);
            console.log('No Passcode or Passcode = null in Preferences...')
            needPasscode = true;
            me.showPasscodeFieldset();
         });

        /*if (needPasscode) {
            console.log('Starting: AskforPasscode');
            authenticateView.showPasscodeFieldset();
            return; 
        }*/
              
        /*if (me.ValidatePasscode(PrayerPasscode)) {
            me.authenticateSuccess();
        } else {
            authenticateView.showPasscodeFieldset();
            console.log('Validation failed with PrayerPasscode set to: '+PrayerPasscode);
            return; 
        }*/

    },

    showPasscodeFieldset: function() {
        var me = this;

        //console.log('Making hidden fieldset now visible. Scope: ' + me.xtype + ' Hidden: ' + me.getAuthenticateView().down('#authenticateFieldset').getHidden());
        var fieldset = me.getAuthenticateView().down('#authenticateFieldset');
        var button = me.getAuthenticateView().down('#authenticateButton');
        var button2 = me.getAuthenticateView().down('#requestButton');
        var countryInLanguage = 'misc.' + opc.app.globals.preferences.prayer_country;
        fieldset.setTitle(Ux.locale.Manager.get('tabs.authentification.title') + Ux.locale.Manager.get('misc.'+opc.app.globals.preferences.prayer_country));
        fieldset.setHidden(false);
        button.setHidden(false);
        button2.setHidden(false);
        //fieldset.show();
        //button.show();
        //button2.show();
    },

    ValidatePasscode: function(code) {
        //compare the passcode with the legit one

        console.log('PrayerPasscode is set to ' + code + '. Comparing to '+ opc.app.globals.countrysettings.get('passcode'));
        if (code == opc.app.globals.countrysettings.get('passcode')) {
            return true;
        } else {
            return false;
        }
    }
    
});
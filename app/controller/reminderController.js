Ext.define('opc.controller.reminderController', {
    extend: 'Ext.app.Controller',
    itemId: 'reminderController',
    //xtype: 'remindercontrollertype',
    
    config: {
        refs: {
            reminderPanelRef: 'showstatistics',
            statisticsPanelButtonReminder: 'showstatistics button[action=changereminder]',
            reminderToggle: 'firstrunview #toggleReminder',
            //reminderToggleLabel: 'firstrunview #reminderTimeLabel',
            reminderToggleTextfield: 'firstrunview #reminderTimeTextfield',
            reminderToggle_statistics: 'showstatistics #toggleReminderStatistics',
            reminderToggleFieldsetStatistics: 'showstatistics #reminderFieldSet',
            reminderToggleTextfieldStatistics: 'showstatistics #reminderTimeTextfieldStatistics'

        },
        control: {
            'statisticsPanelButtonReminder': {
                tap: 'onChangeReminder'
            },
            'reminderPanelRef': {
                show: 'computeReminder'
                //changeReminder: 'onChangeReminder'
            },
            'reminderToggle': {
                change: 'onToggleChange'
            },
            'reminderToggle_statistics': {
                change: 'onToggleChange'
            },
            'reminderToggleTextfield': {
                focus: 'onChangeTime'
            },
            'reminderToggleTextfieldStatistics': {
                focus: 'onChangeTime',
                show: 'onShowTime',
                hide: 'onHideTime'
            }
            // 'reminderFieldset': {
            //     tap: 'changeReminder'
            // }
        }
    },
    

    formatMilliseconds: function(milliseconds) {
        var seconds = 0, 
            minutes = 0, 
            hours = 0;
        var today = new Date();
        
        seconds = Math.floor(milliseconds / 1000); 
        seconds = seconds + parseInt(Ext.Date.format(today, 'Z'),10);
        
        //console.log('timezone_offset = ' + Ext.Date.format(today, 'Z'));
        //console.log('Seconds and timezone_offset = ' + seconds);
        
        minutes = Math.floor(seconds / 60);
        hours = Math.floor(minutes / 60);
        milliseconds = milliseconds % 1000;
        seconds = seconds % 60;
        minutes = minutes % 60;

        var format = '%02u:%02u';
        var time = sprintf(format,hours,minutes);
        //return rtrim(time, '0');
        return time;
    },

    onSetReminder: function(chosentime,startingmonth) {
        console.log('Starting onSetReminder. Chosentime: ' + chosentime);
        var allowReminder = false;
        var selectedTime_raw = null;
        var selectedTime,
            selectedTimeTomorrow;
        var today = new Date(),
            tomorrow = new Date(today.getTime() + 24*60*60*1000),
            tomorrowIndex,
            nextMonth = false;
        var me = this;
        var message,
            tomorrowItem,
            reminderTitle,
            reminderTextTruncated;



        /*if (chosentime) {
            selectedTime = Ext.Date.parse(me.formatMilliseconds(chosentime),"H:i");
        } else {
            selectedTime = Ext.Date.parse(me.formatMilliseconds(opc.app.globals.preferences.selectedtime3),"H:i");
        }*/

        selectedTime = Ext.Date.parse(me.formatMilliseconds(chosentime),"H:i");

//Check, if we already have to start a notification for later today

        if (!startingmonth && selectedTime.getTime() > today.getTime()) {
            console.log('Setting first reminder for later today');
            selectedTimeTomorrow = new Date(selectedTime.getTime());
            tomorrow = today;
        } else {
            selectedTimeTomorrow = new Date(selectedTime.getTime() + 24*60*60*1000);
              
        }

//Check if we are setting a reminder for the next month already
        if (startingmonth) {
            
            selectedTimeTomorrow.setMonth(startingmonth,1);
            tomorrow.setMonth(startingmonth, 1);
        }
        
        //console.log('selectedTimeTomorrow: ' + selectedTimeTomorrow);

//Get the store and remove any filters
        var localPrayerStorage = Ext.getStore('localPrayerStore'); 
        if (localPrayerStorage.isFiltered()) {
            localPrayerStorage.clearFilter(true);
        }      

//Check if we also have prayer items for the following month
        
        if (localPrayerStorage.getAt(localPrayerStorage.getCount()-1).get('date_raw').getMonth() >= today.getMonth()+1) {
            nextMonth = true;
        }

//Customize the reminder for each remaining day of the month
       
       //console.log('Today: ' + today + ' Tomorrow: ' + tomorrow);
        tomorrowIndex = localPrayerStorage.findBy(function(record,id) {
            if (record.get('date_raw').getMonth() == tomorrow.getMonth() && record.get('date_raw').getDate() == tomorrow.getDate()) {
                return true;
            }
       });
       //console.log('Index of tomorrow: '+ tomorrowIndex);

        /*if (nextMonth && !startingmonth) {
            lastIndex = localPrayerStorage.getCount()-1;
        } else {
            lastIndex = me.getDaysInMonth(tomorrow.getMonth()+1,tomorrow.getFullYear());
        }*/
        lastIndex = localPrayerStorage.indexOf(localPrayerStorage.last());
        console.log('Month: ' + tomorrow.getMonth() + ' lastIndex: ' + lastIndex);

        if (me.getReminderPanelRef()) {
            Ext.Viewport.setMasked({
                xtype: 'loadmask',
                message: Ux.locale.Manager.get('tabs.config.reminder.messagesettingreminder')
            });
        }

        me.enterNotifications(localPrayerStorage, tomorrowIndex, lastIndex, selectedTimeTomorrow, function successCB() {
            console.log('Successfully entered notifications');
            if (me.getReminderPanelRef()) {
                Ext.Viewport.setMasked(false);
            }
        }, function failureCB() {
            console.log('Failed entering notifications');
        });

//Reapply potential filtering
        if (opc.app.globals.rangeArray[0] > 0) {
            localPrayerStorage.filterBy(function(record,id) {
                return record.get('date_raw') >= opc.app.globals.rangeArray[0] && record.get('date_raw') <= opc.app.globals.rangeArray[1];
            });
        }
        
        //me.computeReminder();
        //Ext.Msg.alert('Reminder set', 'Daily reminder set at ' + opc.app.globals.preferences.selectedtimeformated);

        if (opc.app.globals.preferences.reminder == 'false'||opc.app.globals.preferences.reminder == false) {
            Ext.Msg.alert('Sorry', 'Reminder function disabled in Preferences');
        }

           
        
    },

    pad: function(str,size) {
        while (str.length < size) str = '0' + str;
        return str;
    },

    enterNotifications: function(localPrayerStorage, tomorrowIndex, lastIndex, selectedTimeTomorrow, successCB, failureCB) {
        var me = this;
        for (i = tomorrowIndex; i <= lastIndex; i++) {

            prayeritem = localPrayerStorage.getAt(i);

            reminderTitle = prayeritem.get('date_formatted') + ': ' ;//+ prayeritem.get('title');
            var regex = /(<([^>]+)>)/ig;
            //reminderTextTruncated = prayeritem.get('introtext').substring(0,50).replace(regex, "") + '...';
            reminderTextTruncated = Ext.util.Format.ellipsis(prayeritem.get('introtext').replace(regex,""), 100, true);

            var notificationDate = prayeritem.get('date_raw');
            var notificationIdYear = String(notificationDate.getFullYear()),
                notificationIdMonth = String(notificationDate.getMonth()+1), //Because we do not want a zero based month
                notificationIdDay = String(notificationDate.getDate());
                notificationId = notificationIdYear + me.pad(notificationIdMonth,2) + me.pad(notificationIdDay,2);
            //console.log('NotificationId: '+ notificationId + ' for ' + notificationDate);

            if (prayeritem.get('notification') == false) {
                console.log('Index: ' + i + ' / ReminderTitle: ' + reminderTitle);
                opc.app.globals.notification.add({
                    date: selectedTimeTomorrow,
                    message: reminderTitle + " \r\n" + reminderTextTruncated,
                    ticker: "OMF Prayer Calendar reminder",
                    repeatDaily: false,
                    //id: i,
                    id: notificationId,
                    repeat: 'none',
                    badge: 1,
                    foreground: 'opc.app.foregroundNotification',
                    background: 'opc.app.backgroundNotification',
                    hasAction: true
                });

                prayeritem.set('notification', true); 
            }
            
        //Set reminder for every day
            selectedTimeTomorrow = new Date(selectedTimeTomorrow.getTime() + 24*60*60*1000);
        
        //Set reminder for every 5 minutes for testing purposes
            //selectedTimeTomorrow = new Date(selectedTimeTomorrow.getTime() + 5*60*1000);
       }

       console.log('All notifications from #' + tomorrowIndex + ' to #' + lastIndex + ' processed.');
       localPrayerStorage.sync();
       //me.computeReminder();
       return successCB();
    },

    getDaysInMonth: function(month, year) {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return month == 2 && this.isLeapYear(year) ? 29 : daysInMonth[month-1];
    },

    isLeapYear: function(year) {
        return !! ((year & 3) === 0 && (year % 100 || (year % 400 === 0 && year)));
    },

    onStopReminder: function() {
        me = this;
        console.log('Stopping reminder...');

        opc.app.globals.preferencesfunction.set('reminder', false, null, null);
        opc.app.globals.preferences.reminder = false;
        opc.app.globals.notification.cancelAll();

        var localPrayerStorage = Ext.getStore('localPrayerStore');
        localPrayerStorage.each(function(item) {
            item.set('notification', false)
        });

        me.computeReminder();
        
    },

    onChangeTime: function() {
        var me = this;
        var today = new Date();
        var hourArray = [],
            minuteArray = [];
        var timeInMillis;

        for (i=0; i < 24; i++) {
            hourArray.push({
                text: i+1,
                value: i+1
            });
        }

        for (i=-1; i < 59; i++) {
            minuteArray.push({
                text: sprintf('%02u', i+1),
                value: i+1
            });
        }

        var timePicker = Ext.create('Ext.picker.Picker', {
            /*locales: {
                doneButton: 'Pick time'
            },*/
            toolbar: {
                items: [
                    {
                        xtype: 'button',
                        locales: {
                            text: 'buttons.now'
                        },
                        //text: 'Now',
                        align: 'right',
                        handler: function() {
                            console.log('Now button pressed');
                            timePicker.setValue({
                                hour: today.getHours(),
                                minute: today.getMinutes()
                            });
                        }
                    }
                ]
            },
            slots: [
                {
                    name: 'hour',
                    title: 'Hour',
                    data: hourArray,
                    align: 'right'
                    //flex: 1
                },
                {
                    name: 'minute',
                    title: 'Minute',
                    data: minuteArray
                    //flex: 1
                }
            ],
            listeners: {
                change: function(picker,value) {

            //write new time value into preferences
                    console.log('Chosen time: ' + value.hour + ':' + value.minute);
                    var millis = ((value.hour*3600000)+(value.minute*60000));
                    timeInMillis = millis - (parseInt(Ext.Date.format(today, 'Z'),10)*1000);
                    //console.log('Picker timeInMillis = ' + timeInMillis);
                    opc.app.globals.preferences.selectedtime3 = timeInMillis;
                    //timeInMillisLong = Number(timeInMillis);
                    opc.app.globals.preferencesfunction.set('selectedtime3', timeInMillis.toString(), null, null);
                    opc.app.globals.preferencesfunction.set('selectedtimeformated', me.formatMilliseconds(timeInMillis), null, null);
                    opc.app.globals.preferences.selectedtimeformated = me.formatMilliseconds(timeInMillis);

                    
            //Only start reminder if we are on statistics page, because there are no loaded prayer items on firstrun page!!

                    if (me.getReminderPanelRef()) {
                        console.log('Starting or restarting reminder, because we are on statistics page');
                    
                //restart reminder if necessary
                        if (opc.app.globals.preferences.reminder == 'true' || opc.app.globals.preferences.reminder == true) {
                            //var localPrayerStorage = Ext.getStore('localPrayerStore');
                            console.log('Automatically restarting reminder at new time: ' + opc.app.globals.preferences.selectedtimeformated);
                            //timePicker.destroy();
                            var localPrayerStorage = Ext.getStore('localPrayerStore');
                            localPrayerStorage.each(function(item) {
                                item.set('notification', false)
                            });
                            opc.app.globals.notification.cancelAll();
                            me.onSetReminder(timeInMillis);
                            me.getReminderToggleTextfieldStatistics().setValue(opc.app.globals.preferences.selectedtimeformated);
                //Set reminder for the first time                           
                        } else {
                            /*Ext.Msg.confirm('New time set','Would you like to be reminded to pray for OMF at '+opc.app.globals.preferences.selectedtimeformated+ ' every day?',
                                function(buttonId,value,opt) {
                                    if (buttonId == 'ok'||buttonId == 'yes') {
                                        opc.app.globals.preferencesfunction.set('reminder', true, null, null);
                                        opc.app.globals.preferences.reminder = true;
                                        me.onSetReminder(timeInMillis);

                                    }
                                }
                            );*/
                            console.log('Confirm new time for reminder ' + opc.app.globals.preferences.selectedtimeformated);
                    //Prepare confirmation message
                        var confirmReminderMessage = Ext.create('Ext.MessageBox', {
                                locales: {
                                    title: 'tabs.config.reminder.confirmreminder.title',

                                },
                                iconCls: Ext.MessageBox.QUESTION,
                                buttons: [
                                    {
                                        ui: 'action',
                                        locales: {
                                            text: 'buttons.yesplease'
                                        }, 
                                        handler: function() {
                                            opc.app.globals.preferencesfunction.set('reminder', true, null, null);
                                            opc.app.globals.preferences.reminder = true;
                                            me.onSetReminder(timeInMillis);
                                            me.getReminderToggleTextfieldStatistics().setValue(opc.app.globals.preferences.selectedtimeformated);
                                            confirmReminderMessage.destroy();                                            
                                        }

                                    },
                                    {
                                        ui: 'normal',
                                        locales: {
                                            text: 'buttons.cancel'
                                        },
                                        handler: function() {
                                            me.getReminderToggle_statistics().setValue(0);
                                            confirmReminderMessage.destroy();

                                        }
                                    }
                                ]
                            });
                        //Set time for message
                            confirmReminderMessage.setMessage(Ux.locale.Manager.get('tabs.config.reminder.confirmreminder.message1') + opc.app.globals.preferences.selectedtimeformated + Ux.locale.Manager.get('tabs.config.reminder.confirmreminder.message2'));
                            confirmReminderMessage.show();
                            
                        } 
                    } else {
                        opc.app.globals.preferences.reminder = true;
                    }
                    //me.computeReminder();
                        
                   
                    
                },
                cancel: function() {
                    console.log('Abort by user');
                    if (me.getReminderToggleTextfield() || me.getReminderToggleTextfieldStatistics()) {
                        if (opc.app.globals.preferences.reminder == false) {
                            console.log('Cancel by user, no new time set');
                            if (me.getReminderPanelRef()) {
                                me.getReminderToggle_statistics().setValue(0);
                            } else {
                                me.getReminderToggle().setValue(0); 
                            }
                            
                        }
                        
                    }
                }
            }
        });

        Ext.Viewport.add(timePicker);
        timePicker.setValue({
            hour: today.getHours(),
            minute: today.getMinutes()
        }),
        timePicker.show();
    },

    setNextReminder: function() {
        me = this;
        me.onSetReminder(opc.app.globals.preferencesfunction.get('selectedtime3'));
    },

    computeReminder: function() {
        me = this;
        var reminderSetting = false;       

        console.log('Computing Reminder Data');
        if (opc.app.globals.preferences.reminder == ''||opc.app.globals.preferences.reminder == null) {
            reminderSetting = false;
            opc.app.globals.preferences.reminder = false;
        } else {
            reminderSetting = opc.app.globals.preferences.reminder;
        }

        console.log('reminderSetting: ' + reminderSetting);

    //Do not trigger a change when setting the initial value, using suspendEvents
        
        if (opc.app.globals.preferences.reminder == true || opc.app.globals.preferences.reminder == 'true') {
            
            if (me.getReminderPanelRef()) {
                //console.log('trigger toggle');
                me.getReminderToggle_statistics().suspendEvents();
                me.getReminderToggle_statistics().setValue(1);
                me.getReminderToggleTextfieldStatistics().show(true);
                me.getReminderToggle_statistics().resumeEvents(true); 
           } else {
                me.getReminderToggle().suspendEvents();
                me.getReminderToggle().setValue(1);
                me.getReminderToggleTextfield().show(true);
                me.getReminderToggle().resumeEvents(true);
           }           
        }

        if (opc.app.globals.preferences.reminder == false || opc.app.globals.preferences.reminder == 'false') {
            
            if (me.getReminderPanelRef()) {
                //console.log('trigger toggle');
                me.getReminderToggle_statistics().suspendEvents();
                me.getReminderToggle_statistics().setValue(0);
                me.getReminderToggleTextfieldStatistics().hide();
                me.getReminderToggle_statistics().resumeEvents(true); 
           } else {
                me.getReminderToggle().suspendEvents();
                me.getReminderToggle().setValue(0);
                me.getReminderToggleTextfield().hide();
                me.getReminderToggle().resumeEvents(true);
           }           
        }

        if (opc.app.globals.preferences.selectedtimeformated) {
            var reminderTime = opc.app.globals.preferences.selectedtimeformated;
        } else {
            var reminderTime = '07:00';
        }
        
        //console.log('Origin scope: ' + scope);
        //var cr = Ext.create('opc.model.ReminderModel', {allowReminderFlag: reminderSetting, reminderTimeDisplay: reminderTime});


        if (this.getReminderPanelRef()) {
           //console.log('Active item: ' + me.getId()); 
           //return this.getReminderPanelRef().down('#reminderpanel').setData(cr.getData());
           
            return this.getReminderToggleTextfieldStatistics().setValue(reminderTime);
       } else {
            console.log('Not on statistics page');
            
            
            return this.getReminderToggleTextfield().setValue(reminderTime);
       }
        
    },
    
    onToggleChange: function(field, something1, something2, newValue, oldValue) {
        var me = this;
        //console.log('Toggle from '+oldValue+' changed to '+ newValue);
        if (newValue == 1) {
            me.onChangeTime();
            //this.getReminderToggleLabel().show();
            

            if (me.getReminderPanelRef()) {
                //console.log('On statistics page');
                me.getReminderToggleTextfieldStatistics().show(true);
            } else {
                me.getReminderToggleTextfield().show(true); 
            }
            
        } else {
            me.onStopReminder();
            //me.getReminderToggleLabel().hide();

            if (me.getReminderPanelRef()) {
                //console.log('On statistics page');
                me.getReminderToggleTextfieldStatistics().hide(true);
            } else {
               me.getReminderToggleTextfield().hide(true); 
            }
        }
        

    },

    onShowTime: function() {
        this.getReminderToggleFieldsetStatistics().setInstructions(/*{
            locales: {
                instructions: 'tabs.firstrun.reminder.instructions'
            }*/
        //'Instructions'
        //}
            Ux.locale.Manager.get('tabs.config.reminder.instructions', 'Change time by tapping time')
        );
    },

    onHideTime: function() {
        me = this;
        //console.log('Hiding description field');
        me.getReminderToggleFieldsetStatistics().setInstructions('');
    }

});
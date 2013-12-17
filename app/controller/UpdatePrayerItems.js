Ext.define('opc.controller.UpdatePrayerItems', {
    extend: 'Ext.app.Controller',
    xtype: 'doUpdate',
    
    config: {
        refs: {
            updateprayeritems: 'today',
            statisticsButtonUpdate: 'showstatistics button[action=updaterequest]',
            statisticsButtonClear: 'showstatistics button[action=clearprayeritems]',
            showStatistics: 'showstatistics',
            automaticUpdate: 'firstrunview #toggleAutomaticUpdates',
            automaticUpdateStatistics: 'showstatistics #toggleAutomaticUpdates'
        },
        control: {
			statisticsButtonClear: {
				tap: 'clearLocalPrayers'
			},
			automaticUpdate: {
				change: 'changeUpdateSettings'
			},
			automaticUpdateStatistics: {
				change: 'changeUpdateSettings'
			}

            
        }

    },
    
    clearLocalPrayers: function() {
    	var localPrayerStorage = Ext.getStore('localPrayerStore');
    	localPrayerStorage.load();
    	console.log('Clearing all local Prayer Items: ' + localPrayerStorage.getCount());
    	localPrayerStorage.clearFilter();
    	localPrayerStorage.removeAll();
    	console.log('Cleared all Prayer Items. Left in store: ' + localPrayerStorage.getCount());
    	localPrayerStorage.sync();

    //Clear all notifications
    	opc.app.globals.notification.cancelAll();

    //Delete the prepared prayercards

    	var carousel = Ext.Viewport.down('prayercarouselview');
    	if (carousel) {
    		carousel.removeAll();
    	}
    	
    	opc.app.globals.carouselItems.item = [];
    	opc.app.globals.carouselItems.monthpresent = [];

    },

    /*forceUpdate: function () {
    	var me = this;

    	if (Ext.device.Connection.isOnline() == true) {
    		//console.log('Force update started');
    		var showStatisticsView = me.getShowStatistics();
			var remotePrayerStorage = Ext.getStore('remotePrayerStore');
			
			remotePrayerStorage.setProxy({url: 'http://www.commstest.omf.org/opc/category/'+opc.app.globals.preferences.prayer_country+'/?json=1&count=40&custom_fields=date,worker'});

			Ext.Viewport.setMasked({
				xtype: 'loadmask',
				message: 'Updating Prayer items'
			});
			remotePrayerStorage.setRemoteFilter(true);
			remotePrayerStorage.on({
				load: 'doPrayerSync',
				scope: me
			});
			remotePrayerStorage.load(function(records,operation,success) {	
				me.getApplication().getController('opc.controller.statisticsController').computeStatistics();
			}, me);
			Ext.Viewport.setMasked(false);
		} 
		if (Ext.device.Connection.isOnline() == false) {
			Ext.Msg.alert('Update required','Your prayer items are out of date. <br>Because you are not online, we could not fetch the current ones.<br>Go online and restart Prayer Calendar App','',this);
		}

    },*/

    PrayerItemsCurrent: function(successCB,failureCB, doManualUpdate) {
    	var needUpdate = false,
    		performPrayerUpdates = false;
    		today = new Date();

    	if (!doManualUpdate) {
    		needUpdate = false;
    	}
    	
    	var me = this;
		var localPrayerStorage = Ext.getStore('localPrayerStore');
		localPrayerStorage.load({
			callback: function(records,operation,success){
				console.log('Finished loading local prayer items. Success: ' + success);}, 
				scope: this
		});

	//Check if we are allowed to perform an automatic update?

		if (opc.app.globals.preferences.perform_updates == 'true' || opc.app.globals.preferences.perform_updates == true) {
			performPrayerUpdates = true;
		}

		if (doManualUpdate == true) {
			performPrayerUpdates = true;
			needUpdate = true;
		}
		
//Check if we have items in a local store
        if (localPrayerStorage.getCount() > 0) {
			console.log('We have '+ localPrayerStorage.getCount() + ' local prayer items');

//Remove items older than 1 month
		/*	var today = new Date();
			var max_Month = today.getUTCMonth()-1;
			
			localPrayerStorage.setFilters({
				filterFn: function(item){
					//console.log('Max_Month: '+max_Month + ' and Item_Month: '+ item.get('date_raw'));
					if (max_Month == 0) {
						return item.get("date_raw").getMonth() == 11;
					} 
					if (max_Month == -1) {
						return item.get("date_raw").getMonth() == 10;
					}
					if (max_Month > 0) {
						return item.get("date_raw").getMonth() < max_Month; 
					}
				}
			});
			console.log(localPrayerStorage.getCount()+' Items set to be removed');
			localPrayerStorage.each(function(item){
				localPrayerStorage.remove(item);
			});
			localPrayerStorage.sync();
			localPrayerStorage.clearFilter();
			localPrayerStorage.load();
			//console.log('Number of items in store now: ' + localPrayerStorage.getCount());*/

//Remove items older than 1 year
			
			localPrayerStorage.each(function(item) {
				if (item.get('date_raw').getFullYear() == today.getFullYear()-1 && item.get('date_raw').getMonth() < today.getMonth()) {
					console.log('Removed item with date: ' + item.get('date_raw'));
					localPrayerStorage.remove(item);
				}
			});
			localPrayerStorage.sync();
			
//check if the items are current
			localPrayerStorage.setFilters({
				filterFn: function(item){
					var today = new Date();
					var now_Month = today.getUTCMonth();
					//console.log('Now_Month: '+ now_Month + ' and Item_Month: '+ item.get("date_raw").getMonth());
					return item.get("date_raw").getMonth() == now_Month;
				}
			});
			//console.log(localPrayerStorage.getCount() + ' Prayer items for this month');
			
			if (localPrayerStorage.getCount() == 0) {
				console.log('We need to get the current prayer items!');
				//localPrayerStorage.clearFilter();
				needUpdate = true;
			}

			localPrayerStorage.clearFilter();

	//Load all the dates in a global array

			localPrayerStorage.each(function(item) {
				opc.app.globals.dateArray.push(item.get('date_raw'));
			});

	//Check if we are nearing the end of the month and need to fetch next months prayer items
			if (!doManualUpdate) {
				if (today.getDate() > 25 && localPrayerStorage.getAt(localPrayerStorage.getCount()-1).get('date_raw').getMonth() < today.getMonth()+1) {
					console.log('Need to load items for next month');
					if (Ext.device.Connection.isOnline()) {
						if (performPrayerUpdates == true) {
							opc.app.globals.lateUpdate = true;
						} else {
							needUpdate = true;
						}
					}
				}
			}
			

		} else {
			needUpdate = true;
			console.log('No local prayer items.');
		}

		if (needUpdate == false) {
			//console.log('Returning success');
			return successCB();
		}

//Perform update if needed		
		if (needUpdate == true || doManualUpdate == true) {
			//console.log('No current prayer items');
			var countBeforeUpdate = localPrayerStorage.getCount();

	//Prepare Update Success Message
			var messageSuccessUpdate = Ext.create('Ext.MessageBox', {
	            locales: {
	                title: 'tabs.update.successtitle'
	                //message: 'tabs.update.successmessage1'
	            },
	            iconCls: Ext.MessageBox.INFO,
	            buttons: [
	                {
	                    ui: 'action',
	                    locales: {
	                        text: 'buttons.ok'
	                    },
	                    handler: function() {
	                        messageSuccessUpdate.hide(true);
	                        messageSuccessUpdate.destroy();
	                    }
	                }
	            ]
	        });

	//Prepare Update Failure Message
	        var messageNotOnline = Ext.create('Ext.MessageBox', {
					locales: {
						title: 'tabs.update.updaterequiredtitle',
						message: 'tabs.update.needtobeonline'
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
								messageNotOnline.destroy();
								//return failureCB();
							}
						},
						{
							ui: 'normal',
							locales: {
								text: 'buttons.cancel'
							},
							handler: function() {
								messageNotOnline.destroy();
							}
						}

					]
				});



	//Do an automatic update
			if (performPrayerUpdates == true && Ext.device.Connection.isOnline() == true) {
				
				/*var remotePrayerStorage = Ext.getStore('remotePrayerStore');
				remotePrayerStorage.setProxy({url: 'http://www.commstest.omf.org/opc/category/'+opc.app.globals.preferences.prayer_country+'/?json=1&custom_fields=date,worker'});
				remotePrayerStorage.setRemoteFilter(true);
				remotePrayerStorage.on({
					load: 'doPrayerSync',
					scope: this
				});
				remotePrayerStorage.load(function(records,operation,success){
					console.log('Finished loading prayer items');
					var response = localPrayerStorage.getCount();
					return successCB(response);
				}, this);*/
				console.log('Performing an automatic update, because of setting and device online');
				
				me.doUpdate(function updateSuccess() {
					response = localPrayerStorage.getCount() - countBeforeUpdate;
					if (response <= 0) {
						messageSuccessUpdate.setMessage(Ux.locale.Manager.get('tabs.update.nonewitemsmessage'));
					} else {
						messageSuccessUpdate.setMessage(Ux.locale.Manager.get('tabs.update.successmessage1') + response + Ux.locale.Manager.get('tabs.update.successmessage2'));
					}
					
					return successCB(messageSuccessUpdate);
				},'');

			}					
				
	//Ask for permission to update
			if (performPrayerUpdates == false && Ext.device.Connection.isOnline() == true) {
				console.log('Asking for permission to update');


				messagePerformingUpdate = Ext.create('Ext.MessageBox', {
					locales: {
						title: 'tabs.update.updaterequiredtitle',
						message: 'tabs.update.updaterequiredmessage'
					},
					iconCls: Ext.MessageBox.INFO,
					buttons: [
						{
							ui: 'action',
							locales: {
								text: 'buttons.yesplease'
							},
							handler: function() {
								//console.log('Successfully launched update function');
								messagePerformingUpdate.destroy();
								
								/*var remotePrayerStorage = Ext.getStore('remotePrayerStore');
								Ext.getStore('remotePrayerStore').setProxy({url: 'http://www.commstest.omf.org/opc/category/'+opc.app.globals.preferences.prayer_country+'/?json=1&count=40&custom_fields=date,worker'});
								//remotePrayerStorage.setRemoteFilter(true);
								remotePrayerStorage.on({
									load: 'doPrayerSync',
									scope: me
								});
								remotePrayerStorage.load(function(records,operation,success){
									console.log('Finished loading prayer items');
									var response = localPrayerStorage.getCount();

									return successCB(response);
								}, this);*/
								me.doUpdate(function updateSuccess() {
									response = localPrayerStorage.getCount() - countBeforeUpdate;
									if (response <= 0) {
										messageSuccessUpdate.setMessage(Ux.locale.Manager.get('tabs.update.nonewitemsmessage'));
									} else {
										messageSuccessUpdate.setMessage(Ux.locale.Manager.get('tabs.update.successmessage1') + response + Ux.locale.Manager.get('tabs.update.successmessage2'));
									}
									return successCB(messageSuccessUpdate);
								},'');

							}
						},
						{
							ui: 'normal',
							locales: {
								text: 'buttons.cancel'
							},
							handler: function() {
								messagePerformingUpdate.destroy();
								return failureCB();
							}
						}
					]
				});
				messagePerformingUpdate.show();
				
			} 
			
			if (/*performPrayerUpdates == true && */Ext.device.Connection.isOnline() == false) {
				//Ext.Msg.alert('Update required','Your prayer items are out of date. <br>Because you are not online, we could not fetch the current ones.<br>Go online and restart Prayer Calendar App','',this);
				
				//messageNotOnline.show();

				return failureCB(messageNotOnline);
			}

		}        
    },

    doUpdate: function(updateSuccess,failure) {
    	var i = 0;
    	var remotePrayerStorage = Ext.getStore('remotePrayerStore');
		remotePrayerStorage.setProxy({url: 'http://www.commstest.omf.org/opc/category/'+opc.app.globals.preferences.prayer_country+'/?json=1&custom_fields=date,worker&count=80'});
		//remotePrayerStorage.setRemoteFilter(true);
		//remotePrayerStorage.load();
		
		/*remotePrayerStorage.on({
			load: 'doPrayerSync',
			scope: this
		});*/
		
		/*console.log('Number of Prayeritems to fetch: ' + remotePrayerStorage.getTotalCount());
		var numberofpages = parseInt(remotePrayerStorage.getTotalCount() / remotePrayerStorage.getPageSize())+1;
		console.log('Number of pages ' + numberofpages);
		numberofpages = 7;
		var i = 1;
		
		while (i <= numberofpages) {
			remotePrayerStorage.setProxy({url: 'http://www.commstest.omf.org/opc/category/'+opc.app.globals.preferences.prayer_country+'/?json=1&custom_fields=date,worker&page=' +i});

			remotePrayerStorage.load(function(records,operation,success){
				console.log('Finished loading prayer items, page ' + i);
				i++;
				//return updateSuccess();
			}, this);
		}*/
		//remotePrayerStorage.setProxy({url: 'http://www.commstest.omf.org/opc/category/'+opc.app.globals.preferences.prayer_country+'/?json=1&custom_fields=date,worker&count='+remotePrayerStorage.getTotalCount()});
		//console.log('Remote prayer store PROXY: ' + remotePrayerStorage.getProxy().get('url'));
		//console.log('Remote sorter: ' + remotePrayerStorage.getSorters()[0].get('property') + ' Direction: ' +remotePrayerStorage.getSorters()[0].get('direction'));
		//remotePrayerStorage.load();
		//remotePrayerStorage.sort('date_raw', 'ASC');
		//remotePrayerStorage.sync();
		remotePrayerStorage.load({
			callback: function(records,operation,success){
				console.log('Finished loading prayer items. Success: ' + success);
				Ext.Viewport.setMasked(false);
				Ext.Viewport.setMasked({
					xtype: 'loadmask',
					message: Ux.locale.Manager.get('tabs.update.doingsync')
				});
				this.doPrayerSync(records,
					function syncSuccessCB(syncedItems){
						console.log('Finished syncing with '+syncedItems+' processed.');
						return updateSuccess();
					});
				
			}, 
			scope: this
		});
		
		
    },
    
    //doPrayerSync: function() {
	doPrayerSync: function(records,syncSuccessCB) {
		//var remotePrayerStorage = Ext.getStore('remotePrayerStore');
		var localPrayerStorage = Ext.getStore('localPrayerStore');
		var syncedItems = 0;
		var currentMonth = new Date(),
			nextMonthPrayer;

		console.log('Performing sync to local store...........');
		//console.log('Remote store is sorted: ' + remotePrayerStorage)
		//console.log('Records: ' + records[0].get('title'));
		//console.log('Number of remote prayer items: ' + remotePrayerStorage.getTotalCount());

		//var item = records;
		//item.each(
		
		//remotePrayerStorage.each(function(item){
		records.forEach(function(item) {
			console.log('Title: '+ item.get('title') + '. Date_raw: ' + item.get('date_raw') + ' ID: ' + item.get('id'));
			if (!nextMonthPrayer && item.get('date_raw').getMonth() > currentMonth.getMonth()) {
				nextMonthPrayer = item.get('date_raw').getMonth();
				console.log('Processing next months prayer items');
			}
		//Only sync prayer items for current or future month
			
			if (item.get('date_raw').getMonth() >= currentMonth.getMonth()-2) {
				if (localPrayerStorage.find('date_raw', item.get('date_raw'),'',true,'','') == -1) {
					localPrayerStorage.add(item.copy());
					syncedItems++;
				}
				
			}

		});
		//);
		localPrayerStorage.sort('date_raw','ASC');
		localPrayerStorage.sync();

		this.setLocalDate();

	// Update the array with the dates
		opc.app.globals.dateArray = [];
		localPrayerStorage.each(function(item) {
			opc.app.globals.dateArray.push(item.get('date_raw'));
		});

		if (syncedItems > 0) {
		//Add new reminder notifications if necessary
			if (opc.app.globals.preferences.reminder == 'true' || opc.app.globals.preferences.reminder == true) {
				console.log('Adding notifications for new items for THIS month');
				this.getApplication().getController('reminderController').onSetReminder(opc.app.globals.preferences.selectedtime3);
			}

			/*if (nextMonthPrayer) {
				if (opc.app.globals.preferences.reminder == 'true' || opc.app.globals.preferences.reminder == true) {
					console.log('Adding notifications for new items for NEXT month');
					this.getApplication().getController('reminderController').onSetReminder(opc.app.globals.preferences.selectedtime3,nextMonthPrayer);
				}
			}*/
		}
	
		return syncSuccessCB(syncedItems);
		//Ext.Msg.alert('Update successful','Successfully fetched ' + i + ' current prayer items for this month.<br>Thank you for praying!','',this);

	},

	doLateUpdate: function() {
		var me = this;
		console.log('Late Update started');
	//Reset lateUpdate variable
		opc.app.globals.lateUpdate = false;


	//Prepare Update Success Message
		var messageSuccessUpdate = Ext.create('Ext.MessageBox', {
            locales: {
                title: 'tabs.update.successtitle'
                //message: 'tabs.update.successmessage1'
            },
            iconCls: Ext.MessageBox.INFO,
            buttons: [
                {
                    ui: 'action',
                    locales: {
                        text: 'buttons.ok'
                    },
                    handler: function() {
                        messageSuccessUpdate.hide(true);
                        messageSuccessUpdate.destroy();
                    }
                }
            ]
        });

	//Show updating symbol
		var todayTitlebar = Ext.ComponentQuery.query('#mainView titlebar');
		var updatingSymbol = Ext.create('Ext.Label', {
			html: '<img src="resources/images/ajax-loader.gif"/>',
			margin: '0 0 0 5',
			align: 'left'
		});
		//console.log('TodayTitlebar: ' + todayTitlebar[0].getDocked());

		/*todayTitlebar[0].add({
			xtype: 'button',
			text: 'Updating',
			align: 'left'
		});*/
		todayTitlebar[0].add(updatingSymbol);


	//Count the present number of prayer items
		var localPrayerStorage = Ext.getStore('localPrayerStore');
		var countBeforeUpdate = localPrayerStorage.getCount();

	//Do an automatic update
		if (Ext.device.Connection.isOnline() == true) {
			
			me.doUpdate(function updateSuccess() {
				response = localPrayerStorage.getCount() - countBeforeUpdate;
				if (response > 0) {
					messageSuccessUpdate.setMessage(Ux.locale.Manager.get('tabs.update.successmessage1') + response + Ux.locale.Manager.get('tabs.update.successmessage2'));
					messageSuccessUpdate.show();
				}
				
				//return successCB(messageSuccessUpdate);
				
				todayTitlebar[0].remove(updatingSymbol);
			},'');

		}					


	},

	setLocalDate: function() {
		console.log('Setting locale date for language: ' + Ux.locale.Manager.getLanguage());
		Ext.Date.monthNames = [
            Ux.locale.Manager.get('misc.months.january','January'),
            Ux.locale.Manager.get('misc.months.february','February'),
            Ux.locale.Manager.get('misc.months.march','March'),
            Ux.locale.Manager.get('misc.months.april','April'),
            Ux.locale.Manager.get('misc.months.may','May'),
            Ux.locale.Manager.get('misc.months.june','June'),
            Ux.locale.Manager.get('misc.months.july','July'),
            Ux.locale.Manager.get('misc.months.august','August'),
            Ux.locale.Manager.get('misc.months.september','September'),
            Ux.locale.Manager.get('misc.months.october','October'),
            Ux.locale.Manager.get('misc.months.november','November'),
            Ux.locale.Manager.get('misc.months.december','December')
        ];
        Ext.Date.dayNames = [
            Ux.locale.Manager.get('misc.days.sunday','Sunday'),
            Ux.locale.Manager.get('misc.days.monday','Monday'),
            Ux.locale.Manager.get('misc.days.tuesday','Tuesday'),
            Ux.locale.Manager.get('misc.days.wednesday','Wednesday'),
            Ux.locale.Manager.get('misc.days.thursday','Thursday'),
            Ux.locale.Manager.get('misc.days.friday','Friday'),
            Ux.locale.Manager.get('misc.days.saturday','Saturday')
        ];
 //Setting the localized date

 		var localPrayerStorage = Ext.getStore('localPrayerStore');
		localPrayerStorage.each(function(item) {
			item.set('date_formatted', Ext.util.Format.date(item.get('date_raw'), 'l, d.F Y'));
		});

		localPrayerStorage.sync();

	},

	changeUpdateSettings: function(field,something1,something2,newValue,oldValue) {
		if (newValue == 1) {
			opc.app.globals.preferences.perform_updates = true;
			opc.app.globals.preferencesfunction.set('perform_updates',true);
		} else {
			opc.app.globals.preferences.perform_updates = false;
			opc.app.globals.preferencesfunction.set('perform_updates',false);
		}

	}
});

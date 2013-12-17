Ext.define('opc.controller.DisplayPrayerItem', {
    extend: 'Ext.app.Controller',
    requires: 'Ext.DateExtras',
    
    config: {
        refs: {
            prayerlist: 'prayerlist',
            actualPrayerList: 'prayerlist #actualList',
            navigationBar: 'today titlebar',
            navigationBarButton: 'today titlebar #backButton',
            navigationBarSorter: 'today titlebar #listSorterButton',
            displaySinglePrayerItem: '#displaySinglePrayerItem',
            tabBar: 'today'
        },
        control: {
           'prayerlist list': {
				itemtap: 'showPrayer'
		   },
		   'prayerlist': {
		   		show: 'showSorterButton', 
		   		//show: 'onChangeSorting',
		   		hide: 'hideSorterButton'
		   },
		   'tabBar': {
		   		activeitemchange: 'hideShowBackButton'
		   },
		   'navigationBarSorter': {
		   		tap: 'onPressSorterButton'
		   } 
        }
    },
    
    showPrayer: function(list, index, element, record) {

    	var me = this;
		
		me.getPrayerlist().push({
			xtype: 'panel',
			id: 'displaySinglePrayerItem',
			//title: record.get('title'),
			//html: Ext.DateExtras.format(record.get('date_raw'),'d F')+'<br>'+record.get('introtext'),
			html: '<h2>'+record.get("title")+'</h2>'+'<b>'+record.get('date_formatted')+'</b></br><b>'+record.get('author')+'</b>'+record.get('introtext'),
			scrollable: true,
			styleHtmlContent: true
			//xtype: 'prayercard'
		});

		//me.getPrayerlist().deselect(record, false);

		var el = Ext.get('displaySinglePrayerItem');
		el.addListener('swipe', me.swipeBack, this);
		
		if (me.getNavigationBarButton()) {
			me.getNavigationBarButton().show();
		} else {
			this.getNavigationBar().add({
				locales: {
					text: 'buttons.back'
				},
				ui: 'back',
				itemId: 'backButton',
				handler: function() {
					//console.log('Back button pressed');
					me.getPrayerlist().pop();
					me.getPrayerlist().fireEvent('back', this);
					me.getActualPrayerList().deselectAll();
					//me.getPrayerlist().animateActiveItem(0);
					//me.getPrayerlist().fireEvent('back',me.getPrayerlist());
					this.hide(true);
				}
			});
		}

	},

	swipeBack: function(event, node, options, eOpts) {

		//console.log('Swiping invoked. Event: ' + event.direction);

		if (event.direction == 'right') {
			this.getPrayerlist().pop();
			this.getPrayerlist().fireEvent('back', this);
			this.getActualPrayerList().deselectAll(true);
			this.getNavigationBarButton().hide();
		}

		
	},

	hideShowBackButton: function(scope, value, oldValue, eOpts) {
		me = this;
		//console.log('Hiding single Prayer View: ' + oldValue.xtype);
		//console.log('New view: ' + value.xtype);
		if (value.xtype != 'prayerlist') {
			if (this.getNavigationBarButton()) {
				this.getNavigationBarButton().hide();
			}
		}
		//console.log('Number of inner Items: ' + this.getPrayerlist().getInnerItems().length);
		if (value.xtype == 'prayerlist' && this.getPrayerlist().getInnerItems().length > 1) {
			//console.log('Scope: ' + me.xtype);
			//console.log('Back to single item view');
			this.getNavigationBarButton().show();
		}

	},

	showSorterButton: function() {
		me = this;
		me.getNavigationBarSorter().show();
	},

	hideSorterButton: function() {
		this.getNavigationBarSorter().hide();
	},

	muteEvents: function(sortingCategories) {
		for (i=0;i < sortingCategories.length; i++) {
			sortingCategories[i].suspendEvents();
		}
	},

	unMuteEvents: function(sortingCategories) {
		for (i=0;i< sortingCategories.length; i++ ) {
			sortingCategories[i].resumeEvents(true);
		}
	},

	onPressSorterButton: function() {

		//Ext.Viewport.add(sorterPanel);
		var sorterPanel = Ext.Viewport.down('sorterform');
		var localPrayerStorage = Ext.getStore('localPrayerStore');
		//console.log(localPrayerStorage.getGrouper().config.sortProperty);
		var chosenSorting = localPrayerStorage.getGrouper().config.sortProperty;


		if (!sorterPanel) {
			sorterPanel = Ext.widget('sorterform');		
		}

		var sortingDateRef = sorterPanel.down('#sortingDate'),
			sortingCountryRef = sorterPanel.down('#sortingCountry'),
			sortingWorkRef = sorterPanel.down('#sortingWork'),
			sortingCategories = [sortingDateRef,sortingCountryRef,sortingWorkRef],
			
			//sortingSliderRef = sorterPanel.down('#rangeSlider'),
			rangeDateStartRef = sorterPanel.down('#rangeTextStart'),
			rangeDateEndRef = sorterPanel.down('#rangeTextEnd');

		switch(chosenSorting) {
			case 'date_raw':
				//sorterPanel.down('#sortingDate').check();
				sortingDateRef.suspendEvents();
					sortingDateRef.check();
				sortingDateRef.resumeEvents(true);
				break;
			case 'country':
				sortingCountryRef.suspendEvents();
					sortingCountryRef.check();
				sortingCountryRef.resumeEvents(true);
				break;
			case 'work':
				sortingWorkRef.suspendEvents();
					sortingWorkRef.check();
				sortingWorkRef.resumeEvents(true);
				break;
			default:
				break;
		}
	//Populate date fields
		opc.app.globals.rangeArray = [localPrayerStorage.first().get('date_raw'),localPrayerStorage.last().get('date_raw')];
		rangeDateStartRef.setPlaceHolder(opc.app.globals.rangeArray[0].toLocaleDateString());
		rangeDateEndRef.setPlaceHolder(opc.app.globals.rangeArray[1].toLocaleDateString());
	
	//Add listener to date fields
		if (!rangeDateStartRef.hasListener('focus')) {
			rangeDateStartRef.addListener('focus', function(e) {
				console.log('Focus on range start date: ' + rangeDateStartRef.getPlaceHolder());
				me.showRangeDatePicker(opc.app.globals.rangeArray[0],'start',rangeDateStartRef,rangeDateEndRef);

			});
		}

		if (!rangeDateEndRef.hasListener('focus')) {
			rangeDateEndRef.addListener('focus', function(e) {
				console.log('Focus on range end date: ' + rangeDateEndRef.getPlaceHolder());
				me.showRangeDatePicker(opc.app.globals.rangeArray[1],'end',rangeDateStartRef,rangeDateEndRef);


			});
		}

	//Close button
		if (!sorterPanel.down('#closeSorterForm').hasListener('tap')) {
			sorterPanel.down('#closeSorterForm').addListener('tap', function(e) {
				sorterPanel.hide(true);
			});
		}
	
	//Date listener
		if (!sortingDateRef.hasListener('check') || !sortingDateRef.hasListener('uncheck')) {
			
			sortingDateRef.addListener('check', function(select, value) {
			//console.log('Date checked');
				//sorterPanel.suspendEvents();
				me.muteEvents(sortingCategories);
					sortingCountryRef.uncheck();
					sortingWorkRef.uncheck();
				me.unMuteEvents(sortingCategories);
				//sorterPanel.resumeEvents(true);
				chosenSorting = 'date_raw'
				me.onChangeSorting(chosenSorting,'ASC');
				sorterPanel.hide(true);
				//sorterPanel.down('#sortingCountry').fireEvent('uncheck');
			});

			sortingDateRef.addListener('uncheck', function(select, value) {
				console.log('Date unchecked, direction before: ' + sortingDateRef.getUi());
				//me.onChangeDirection('date_raw');

				if (sortingDateRef.getUi() == 'sortingdown') {
					sortingDateRef.setUi('sortingup');
					me.onChangeSorting('date_raw', 'DESC');
				} else {
					sortingDateRef.setUi('sortingdown');
					me.onChangeSorting('date_raw', 'ASC');
				}
				me.muteEvents(sortingCategories);
					sortingDateRef.check();
				me.unMuteEvents(sortingCategories);
				sorterPanel.hide(true);
			});
		}
	
	//Country listener
		if (!sortingCountryRef.hasListener('check') || !sortingCountryRef.hasListener('uncheck')) {
			
			sortingCountryRef.addListener('check', function(select, value) {
				//console.log('Country checked');
				chosenSorting = 'country'
				//sorterPanel.suspendEvents();
				me.muteEvents(sortingCategories);
					sortingDateRef.uncheck();
					sortingWorkRef.uncheck();
				me.unMuteEvents(sortingCategories);
				//sorterPanel.resumeEvents(true);
				me.onChangeSorting(chosenSorting,'ASC');
				sorterPanel.hide(true);
			});

			sortingCountryRef.addListener('uncheck', function(select, value) {
				console.log('Country unchecked, direction before: ' + sortingCountryRef.getUi());
				//me.onChangeDirection('date_raw');

				if (sortingCountryRef.getUi() == 'sortingdown') {
					sortingCountryRef.setUi('sortingup');
					me.onChangeSorting('country', 'DESC');
				} else {
					sortingCountryRef.setUi('sortingdown');
					me.onChangeSorting('country', 'ASC');
				}
				
				me.muteEvents(sortingCategories);
					sortingCountryRef.check();
				me.unMuteEvents(sortingCategories);
				sorterPanel.hide(true);
			});

		}

	// Work listener
		if (!sortingWorkRef.hasListener('check') || !sortingWorkRef.hasListener('uncheck')) {
			
			sortingWorkRef.addListener('check', function(select, value) {
				chosenSorting = 'work';
				me.muteEvents(sortingCategories);
					sortingDateRef.uncheck();
					sortingCountryRef.uncheck();
				me.unMuteEvents(sortingCategories);
				me.onChangeSorting(chosenSorting, 'ASC');
				sorterPanel.hide(true);
			});

			sortingWorkRef.addListener('uncheck', function(select, value) {
				console.log('Country unchecked, direction before: ' + sortingWorkRef.getUi());
				//me.onChangeDirection('date_raw');

				if (sortingWorkRef.getUi() == 'sortingdown') {
					sortingWorkRef.setUi('sortingup');
					me.onChangeSorting('work', 'DESC');
				} else {
					sortingWorkRef.setUi('sortingdown');
					me.onChangeSorting('work', 'ASC');
				}
				
				me.muteEvents(sortingCategories);
					sortingWorkRef.check();
				me.unMuteEvents(sortingCategories);
				sorterPanel.hide(true);
			});
		}
	//Slider listener
	/*	if (!sortingSliderRef.hasListener('change')) {
			var movedSlider = 'none';
			sortingSliderRef.addListener('change', function(field, thumb, newValue, oldValue) {
				console.log('Slider Values 1 = ' + field.getValue()[0] + ' 2 = ' + field.getValue()[1]);
				console.log('Moved slider from: ' + oldValue + ' to ' + newValue);
				if (newValue == field.getValue()[0]) {
					movedSlider = 'left';
				} else {
					movedSlider = 'right';
				}
				me.onLimitRange(field.getValue()[0], field.getValue()[1], movedSlider);
			}, this);
		}

		if (!sortingSliderRef.hasListener('drag')) {
			
			sortingSliderRef.addListener('drag', function(field, thumb, e) {
				//console.log('Left slider value: ' + field.getValue()[0]);
				//console.log('Right slider value: ' + field.getValue()[1]);
				me.onChangeDateField(opc.app.globals.dateArray, field.getValue()[0],field.getValue()[1], rangeDateStartRef, rangeDateEndRef);
			}, this);
		}*/

		sorterPanel.showBy(this.getNavigationBarSorter());
		
	},

	onChangeDateField: function(dateArray, rangeStartText, rangeEndText, rangeDateStartRef, rangeDateEndRef) {
		var totalItems = dateArray.length;
		if (rangeEndText - rangeStartText <= 22) {
			if (rangeStartText == 0 || rangeEndText == 100) {
				if (rangeStartText == 0) {
					rangeEndText = 2;
				}
				if (rangeEndText == 100) {
					rangeStartText = 99;
				}
			} else {
				if (movedSlider == 'left') {
					rangeStartText = rangeStartText + parseInt((rangeEndText-rangeStartText)*0.78,10);
				} else {
					rangeEndText = rangeEndText - parseInt((rangeEndText-rangeStartText)*0.78,10);
				}
			}

		}
		
		var startRecord = parseInt((totalItems / 100 * rangeStartText),10),
			endRecord = parseInt((totalItems / 100 * rangeEndText),10)-1;
		
		rangeDateStartRef.setPlaceHolder(dateArray[startRecord].toLocaleDateString());
		rangeDateEndRef.setPlaceHolder(dateArray[endRecord].toLocaleDateString());
	},

	onChangeSorting: function(chosenSorting,direction) {
		var localPrayerStorage = Ext.getStore('localPrayerStore');

		if (chosenSorting == 'country') {
			localPrayerStorage.setSorters({});
			localPrayerStorage.setSorters({
				property: 'country',
				//property: 'date_raw',
				direction: direction
			});

			localPrayerStorage.setGrouper({
				groupFn: function(record) {
					country = record.get('country');
					return country;
				},
				sortProperty: 'country',
				direction: direction
			});
			localPrayerStorage.sort([
				{property: 'country',
				direction: direction},
				{property: 'date_raw'}
			]);
		}

		if (chosenSorting == 'date_raw') {
			localPrayerStorage.setSorters({});
			//localPrayerStorage.setGrouper({});
			localPrayerStorage.setSorters({
				property: 'date_raw',
				direction: direction
			});

			localPrayerStorage.setGrouper({
				groupFn: function(record) {
					month = record.get('date_raw').getMonth();
					monthreturn = Ext.Date.monthNames[month] + ' ' + record.get('date_raw').getFullYear();
					return monthreturn;
				},
				sortProperty: 'date_raw',
				direction: direction
			});

			localPrayerStorage.sort({
				property: 'date_raw',
				direction: direction
			});
		}

		if (chosenSorting == 'work') {
			localPrayerStorage.setSorters({});
			localPrayerStorage.setSorters({
				property: 'lastname',
				direction: direction
			});

			localPrayerStorage.setGrouper({
				groupFn: function(record) {
					author = record.get('author');
					return author;

					
				},
				sortProperty: 'lastname',
				direction: direction
			});
			localPrayerStorage.sort([
					{property: 'lastname',
					direction: direction},
					{property: 'date_raw'}
				]);
		}

		localPrayerStorage.fireEvent('refresh');
	},

	onLimitRange: function(rangeStart, rangeEnd, movedSlider) {
		var localPrayerStorage = Ext.getStore('localPrayerStore'),
			totalItems = opc.app.globals.dateArray.length;
		/*	totalItems = localPrayerStorage.getTotalCount(),
			oldGrouper = localPrayerStorage.getGrouper(),
			oldSorting = localPrayerStorage.getSorters();

		localPrayerStorage.clearFilter(true);

		localPrayerStorage.setSorters({
			property: 'date_raw',
			direction: 'ASC'
		});

		localPrayerStorage.setGrouper({
			groupFn: function(record) {
				month = record.get('date_raw').getMonth();
				monthreturn = Ext.Date.monthNames[month] + ' ' + record.get('date_raw').getFullYear();
				return monthreturn;
			},
			sortProperty: 'date_raw',
			direction: 'ASC'
		});*/
			

		if (rangeEnd - rangeStart <= 22) {
			if (rangeStart == 0 || rangeEnd == 100) {
				if (rangeStart == 0) {
					rangeEnd = 2;
				}
				if (rangeEnd == 100) {
					rangeStart = 99;
				}
			} else {
				if (movedSlider == 'left') {
					rangeStart = rangeStart + parseInt((rangeEnd-rangeStart)*0.78,10);
				} else {
					rangeEnd = rangeEnd - parseInt((rangeEnd-rangeStart)*0.78,10);
				}
			}

		}
		
		var startRecord = parseInt((totalItems / 100 * rangeStart),10),
			endRecord = parseInt((totalItems / 100 * rangeEnd),10)-1;

		console.log('Index of first range: ' + startRecord + ' last range: ' + endRecord);

		//var startDate = localPrayerStorage.getAt(startRecord).get('date_raw'),
		//	endDate = localPrayerStorage.getAt(endRecord).get('date_raw');

		var startDate = opc.app.globals.dateArray[startRecord];
			endDate = opc.app.globals.dateArray[endRecord];
			opc.app.globals.rangeArray[0] = startDate;
			opc.app.globals.rangeArray[1] = endDate;

		console.log('Date of start range: ' + startDate + ' end range: ' + endDate);

		localPrayerStorage.clearFilter(true);
		
		localPrayerStorage.filterBy(function(record,id) {
			return record.get('date_raw') >= startDate && record.get('date_raw') <= endDate;
		});

		/*localPrayerStorage.setSorters(oldSorting);
		localPrayerStorage.setGrouper(oldGrouper);
		localPrayerStorage.sync();

		localPrayerStorage.fireEvent('refresh');*/

	},

	showRangeDatePicker: function(oldDate,startOrEnd,rangeDateStartRef,rangeDateEndRef) {
		var me = this,
			today = new Date(),
			startYear = today.getFullYear(),
			dayArray = [],
			monthArray = [],
			monthAlreadyInArray = [],
			yearsArray = [];

		//Put all available months in an array
		opc.app.globals.dateArray.forEach(function(value,index,array) {
			if (monthAlreadyInArray.indexOf(Ext.Date.monthNames[value.getMonth()]) == -1) {
				monthArray.push({
					text: Ext.Date.monthNames[value.getMonth()] + ' ' + value.getFullYear(),
					value: value.getMonth()
				});
				monthAlreadyInArray.push(Ext.Date.monthNames[value.getMonth()]);
			}
		});
		console.log('MonthAlreadyInArray: ' + monthAlreadyInArray);

		daysInMonth = me.getDaysInMonth(1, today.getFullYear());

		for (i = 0; i < daysInMonth; i++) {
			dayArray.push({
				text: i+1,
				value: i+1
			});
		}

		datePicker = Ext.Viewport.down('#datePickerRange');

		if (!datePicker) {
			console.log('No datepicker yet, creating one');
			var datePicker = Ext.create('Ext.picker.Picker', {
				itemId: 'datePickerRange',
				doneButton: {
					locales: {
						text: 'buttons.pick-a-date'
					}
				},
				cancelButton: {
					locales: {
						text: 'buttons.cancel'
					}
				},
				slots: [
					{
						name: 'day',
						title: 'Day',
						data: dayArray,
						align: 'right',
						flex: 1
					},
					{
						name: 'month',
						title: 'Month',
						data: monthArray,
						flex: 2
					}
				],
				listeners: {
					pick: function(picker, The, slot) {
						var dayArray = [];
						slotChosen = me.getDaySlot(this);

						daysInMonth = me.getDaysInMonth(The.month, today.getFullYear());
						for (i = 0; i > daysInMonth; i++) {
							dayArray.push({
								text: i+1,
								value: i+1
							});
						}
						if (slotChosen.getStore().getCount() == dayArray.length) {
							return;
						} else {
							slotChosen.getStore().setData(dayArray);
						}
						var store = slotChosen.getStore(),
							viewItems = slotChosen.getViewItems(),
							valueField = slotChosen.getValueField(),
							index,item;

						index = store.find(valueField, The.day);
						if (index == -1) {
							return;
						}

						item = Ext.get(viewItems[index]);

						slotChosen.selectedIndex = index;
						slotChosen.scrollToItem(item);
						
					},
					change: function(picker, value) {
						var localPrayerStorage = Ext.getStore('localPrayerStore');

						for (var i = 0; i < monthArray.length; i++) {
							if (monthArray[i]['value'] = value.month) {
								var chosenMonthText = monthArray[i]['text'];
							}
						}

						var chosenMonthYear = chosenMonthText.slice(-4);
						//console.log('Chosen month: ' + monthArray[value.month - monthAlreadyInArray.length].text);
						//console.log('Chosen month: ' + chosenMonthText);
						//console.log('Chosen year: ' + chosenMonthYear);
						var chosenDate = new Date(chosenMonthYear,value.month,value.day);

						if (startOrEnd == 'start') { 
							/*if (chosenDate > opc.app.globals.rangeArray[1]) {
								console.log('Dates swapped because chosen daten later than end date');
								opc.app.globals.rangeArray[0] = opc.app.globals.rangeArray[1];
								opc.app.globals.rangeArray[1] = chosenDate;
							} else {
								opc.app.globals.rangeArray[0] = chosenDate;
							}*/
							opc.app.globals.rangeArray[0] = chosenDate;
						} 
						if (startOrEnd == 'end') {
							/*if (chosenDate < opc.app.globals.rangeArray[0]) {
								console.log('Dates swapped because chosen date earlier than start date');
								opc.app.globals.rangeArray[1] = opc.app.globals.rangeArray[0];
								opc.app.globals.rangeArray[0] = chosenDate;
							} else {
								opc.app.globals.rangeArray[1] = chosenDate;
							}*/
							opc.app.globals.rangeArray[1] = chosenDate;
						}

						console.log('Date of start range: ' + opc.app.globals.rangeArray[0] + ' end range: ' + opc.app.globals.rangeArray[1]);

						if (opc.app.globals.rangeArray[0] > opc.app.globals.rangeArray[1]) {
							console.log('Need to swap the dates...');
							var oldStart = opc.app.globals.rangeArray[0],
								oldEnd = opc.app.globals.rangeArray[1];
							opc.app.globals.rangeArray = [oldEnd,oldStart];
						}

						//console.log('Date of start range: ' + opc.app.globals.rangeArray[0] + ' end range: ' + opc.app.globals.rangeArray[1]);

						rangeDateStartRef.setPlaceHolder(opc.app.globals.rangeArray[0].toLocaleDateString());
						rangeDateEndRef.setPlaceHolder(opc.app.globals.rangeArray[1].toLocaleDateString());

						localPrayerStorage.clearFilter(true);
		
						localPrayerStorage.filterBy(function(record,id) {
							return record.get('date_raw') >= opc.app.globals.rangeArray[0] && record.get('date_raw') <= opc.app.globals.rangeArray[1];
						});

						datePicker.destroy();

					}
				}
			});
			Ext.Viewport.add(datePicker);
		}

		datePicker.setValue({
			//day: today.getDate(),
			//month: today.getMonth()
			day: oldDate.getDate(),
			month: oldDate.getMonth()
		});
		datePicker.show();

		
	},

	getDaysInMonth: function(month, year) {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return month == 2 && this.isLeapYear(year) ? 29 : daysInMonth[month-1];
    },

    isLeapYear: function(year) {
        return !! ((year & 3) === 0 && (year % 100 || (year % 400 === 0 && year)));
    },

    getDaySlot: function(scope) {
        var innerItems = scope.getInnerItems(),
            ln = innerItems.length,
            i,slot;

        if (this.daySlot) {
            return scope.daySlot;
        }

        for (i=0; i < ln; i++) {
            slot = innerItems[i];
            if (slot.isSlot && slot.getName() == "day") {
                scope.daySlot = slot;
                return slot;
            }
        }

        return null;
    },

});

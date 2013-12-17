Ext.define('opc.controller.MakeCarouselItems', {
    extend: 'Ext.app.Controller',
    requires: 'Ext.picker.Picker',
    
    config: {
        refs: {
            makecarouselitems: 'prayercarouselview',
            titlebarDatePickerButton: '#mainView titlebar button[id=datePickerButton]',
            bottombarTodayIcon: '#mainView #todayIcon'

        },
        control: {

            makecarouselitems: {
                show: 'CarouselItems',
                hide: 'removeDatePickerButton',
               // activeitemchange: 'checkForReload'
            },
            titlebarDatePickerButton: {
                tap: 'showDatePicker'
            },
            bottombarTodayIcon: {
                activate: 'jumpToToday'
            }
            
        }
        
    },


    removeDatePickerButton: function() {
        this.getTitlebarDatePickerButton().hide();
        //console.log('DatePickerButton hidden');
    },

    showDatePicker: function() {
        console.log('DatePickerButton pressed');
        me = this;
        var today = new Date();
        var startYear = today.getFullYear()-1;
        var finishMonth = today.getMonth()+2;
        var currentMonth = today.getMonth();
        var currentYear = today.getFullYear();
        var yearSwitchBack = false;
        //console.log('FinishMonth: ' + finishMonth);
        var daysInMonth;
        
        
    //Using a customized Picker

        var dayArray = [],
            monthArray = [],
            monthAlreadyInArray = [],
            yearsArray = [];
        
        var localPrayerStorage = Ext.getStore('localPrayerStore');

        localPrayerStorage.clearFilter();

        localPrayerStorage.each(function(item) {
            var monthIndex = item.get('date_raw').getMonth();
            //console.log('MonthIndex: ' + monthIndex + '');

            if (monthAlreadyInArray.indexOf(Ext.Date.monthNames[monthIndex]) == -1) {
                monthArray.push({
                    text: Ext.Date.monthNames[monthIndex] + ' ' + item.get('date_raw').getFullYear(),
                    value: monthIndex+1
                });
                monthAlreadyInArray.push(Ext.Date.monthNames[monthIndex]);
            }
            /*monthArray.forEach(function(element, index, array) {
                console.log('Text: ' + element.text);
                console.log('Index: ' + index)
            });*/

        });

        daysInMonth = this.getDaysInMonth(1, new Date().getFullYear());

        for (i = 0; i < daysInMonth; i++) {
            dayArray.push({
                text: i+1,
                value: i+1
            });
        }

        //for (i = 0, ln = Ext.Date.monthNames.length; i < ln; i++) {
        
        /*for (i = currentMonth-1; i < finishMonth; i++) {
            monthArray.push({
                text: Ext.Date.monthNames[i] + ' ' + today.getFullYear(),
                value: i+1
            })
        }*/

        if (today.getMonth() == 0) {
            yearSwitchBack = true;
            currentMonth++;
            addedMonthText = Ext.Date.monthNames[11] + ' ' + startYear;
            addedMonth = {
                text: addedMonthText,
                value: 12
            };
            monthArray.splice(0,0,addedMonth);
            //console.log('MonthName: ' + addedMonth);
            //console.log('New Array Month: ' + monthArray);
        }

        var datePicker = Ext.create('Ext.picker.Picker', {
            layout: {
            //    align: 'stretch'
            },
            //width: '300px',
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
            //doneButton: 'Pick date',
            toolbar: {
                items: [
                    {
                        xtype: 'button',
                        locales: {
                            text: 'buttons.today'
                        },
                        //text: 'Today',
                        align: 'right',
                        handler: function() {
                            //console.log('Today button pressed');
                            datePicker.setValue({
                                day: today.getDate(),
                                month: currentMonth+1
                            });
                        }
                    }
                ]
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
                change: function(picker, value) {
                    //Set year to last year, if the chosen date is last year
                    if (yearSwitchBack && value.month == 12) {
                        currentYear--;
                        console.log('Switched back a year');
                    }
                    //chosenDate = value.month + '.' + value.day + '.' + currentYear;
                    var format = '%04u-%02u-%02u';

                    
                    chosenDateNew = sprintf(format,currentYear,value.month,value.day);
                    console.log('Value datepicker: ' + chosenDateNew);

                    opc.app.globals.notfoundmessage = false;
                    
                    var chosenDateDate = new Date(currentYear,value.month-1,value.day);

                    me.setCarouselDate(chosenDateDate);
                    this.destroy();
                },
                pick: function(picker, The, slot) {
                    //console.log('Month: ' + The.month);
                    //console.log('Slot: ' + slot.getValue());
                    var dayArray = [];
                    slotChosen = me.getDaySlot(this);
                    

                    daysInMonth = me.getDaysInMonth(The.month, currentYear);
                    for (i = 0; i < daysInMonth; i++) {
                        dayArray.push({
                            text: i + 1,
                            value: i + 1
                        });
                    }
                    if (slotChosen.getStore().getCount() == dayArray.length) {
                        return;
                    }
                    slotChosen.getStore().setData(dayArray);

                    var store = slotChosen.getStore(),
                        viewItems = slotChosen.getViewItems(),
                        valueField = slotChosen.getValueField(),
                        index, item;
                    index = store.find(valueField, The.day);
                    if (index == -1) {
                        return;
                    }

                    item = Ext.get(viewItems[index]);

                    slotChosen.selectedIndex = index;
                    slotChosen.scrollToItem(item);
                }
            }
            
        });

        
        Ext.Viewport.add(datePicker);
        //datePicker.setValue(new Date(),true);
        datePicker.setValue({
            day: today.getDate(),
            month: currentMonth+1
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

    CarouselItems: function() {
        

        this.getTitlebarDatePickerButton().show();
        var carousel = Ext.Viewport.down('prayercarouselview');
        if (carousel) {
            console.log('Back to tab Carousel. Number of cards: ' + carousel.getItems().length);
            //console.log('Title of this prayeritem: ' + carousel.getItems().items[1].get('prayeritem').get('today'));
            
        }
        
        
        if (!carousel || carousel.getItems().length <= 1) {
            console.log('Started composing carousel items...');
            var carousel = Ext.getCmp('prayercarouselview');
            //console.log('Scrollable: ' + carousel.getScrollable());
            var today = new Date();
            var me = this;
            //dateToday = today;
            /*var dateToday = Ext.util.Format.date(today, "l, d F Y");*/
            //console.log(Ext.getStore('localPrayerStore').getCount());
            //console.log('Todays date: ' + today.getDate());

            var localPrayerStorage = Ext.getStore('localPrayerStore');

            var todayIndex = 0;
            var reverse;
            


        //Somehow, the sorting is strange, therefore this reverse clause

            /*if (localPrayerStorage.last().get('date_raw') < localPrayerStorage.first().get('date_raw')) {
                
                reverse = true;
            } else {
                reverse = false;
            }*/
/*
            localPrayerStorage.load(function(prayeritems) {
                var itemsArray = [];
                var dateFound = false;

 


                Ext.each(prayeritems, function(prayeritem){

                    //console.log('Item month: ' + prayeritem.get('date_raw').getMonth() + ' Today month: ' + today.getMonth());
                    if (prayeritem.get('date_raw').getMonth() >= (today.getMonth())) {
                        itemsArray.push({
                        
                            xtype: 'prayercard',
                            prayeritem: prayeritem,
                            prayerdate: prayeritem.get('date_raw')
                            //prayermonth: prayeritem.get('date_raw').getMonth();
                            //prayeryear: prayeritem.get('date_raw').getFullYear();

                            //prayerdate: 'Monday'
                            //prayertitle: datePrayerItem
                        });
                        //console.log('Prayerdate of this card: ' + itemsArray[0].prayerdate);
                    }
                    
                    
                    }, 
                    this 
                    //reverse
                );

                itemsArray.sort(function(a,b){
                    var dateA = new Date(a.prayerdate),
                        dateB = new Date(b.prayerdate);
                    return dateA - dateB;
                });
                //console.log(itemsArray);
                //console.log('ItemsArray is an array: ' + Array.isArray(itemsArray));
                //console.log('Index of Today: ' + todayIndex)
                //console.log('Index of Today: ' + localPrayerStorage.find('date_raw',dateToday));
                carousel.setItems(itemsArray);

                opc.app.globals.carouselItems.item = itemsArray;

            //Add months to array monthpresent
                itemsArray.forEach(function(item) {
                    var monthIndex = item.prayerdate.getMonth();
                    //console.log('MonthIndex: ' + monthIndex + '');

                    if (opc.app.globals.carouselItems.monthpresent.indexOf(monthIndex) == -1) {
    
                        opc.app.globals.carouselItems.monthpresent.push(monthIndex);
                    }

                });   
                console.log('Months in carousel: ' + opc.app.globals.carouselItems.monthpresent);
                //me.setCarouselDate('1.21.2013');*/

                me.addItemstoCarousel(today.getMonth(),function addSuccess(addedItemsCount){
                    me.setCarouselDate(today);    
                
                
                }, function addFail(){
                    console.log('Failed composing carousel items for current month');
                    
                });

            }
        

       
    },

    addItemstoCarousel: function(month,addSuccess,addFail) {
        var localPrayerStorage = Ext.getStore('localPrayerStore');
        var carousel = Ext.Viewport.down('prayercarouselview');
        var itemsArray = [],
            addedItemsCount = 0;

        if (!carousel) {
            var carousel = Ext.getCmp('prayercarouselview');
        }

        if (carousel) {
            //var carouselItemsArray = carousel.getItems();

            /*for (i=0; i < carouselItemsArray.length; i++) {
                itemsArray[i] = carouselItemsArray.getAt(i)
            }*/
            //itemsArray = carouselItemsArray.getRange();
            //console.log('itemsArray length: ' + itemsArray.length);
                        /*carouselItemsArray.each(function(item,index,length){
                console.log('Content of carouselItemsArray: ' + item.get('prayerdate'));
                itemsArray.push({
                    xtype: 'prayercard',
                    prayeritem: item.get('prayeritem'),
                    prayerdate: item.get('prayerdate')
                });
            });*/
            itemsArray = opc.app.globals.carouselItems.item;
            
            localPrayerStorage.setFilters({
                filterFn: function(item) {
                    return item.get('date_raw').getMonth() == month;
                }
            });
            if (localPrayerStorage.getCount() <= 0) {
                return addFail();
            }
            
            localPrayerStorage.load(function(prayeritems) {
                Ext.each(prayeritems, function(prayeritem) {
                    if (prayeritem.get('date_raw').getMonth() == month ) {
                        addedItemsCount++;
                        itemsArray.push({
                            xtype: 'prayercard',
                            prayeritem: prayeritem,
                            prayerdate: prayeritem.get('date_raw')
                        });
                    }
                });
            });
            itemsArray.sort(function(a,b){
                var dateA = new Date(a.prayerdate),
                    dateB = new Date(b.prayerdate);
                return dateA - dateB;
            });

            console.log('Length after adding: ' + itemsArray.length);
            opc.app.globals.carouselItems.item = itemsArray;

        //Add months to array monthpresent
            /*itemsArray.forEach(function(item) {
                var monthIndex = item.prayerdate.getMonth();

                if (opc.app.globals.carouselItems.monthpresent.indexOf(monthIndex) == -1) {

                    opc.app.globals.carouselItems.monthpresent.push(monthIndex);
                }

            });*/
            if (opc.app.globals.carouselItems.monthpresent.indexOf(month) == -1) {
                opc.app.globals.carouselItems.monthpresent.push(month);
            }
            console.log('Months in carousel: ' + opc.app.globals.carouselItems.monthpresent);

            carousel.setItems(itemsArray);

            localPrayerStorage.clearFilter();
            return addSuccess(addedItemsCount); 
        } else {
            console.log('No carousel loaded :(');
            return addFail();
        }
        
    },

    setCarouselDate: function(chosenDatePrayerItem) {
        var localPrayerStorage = Ext.getStore('localPrayerStore');
        
        var itemNotInCarousel = false;
        var me = this;
        var convertedDate = new Date(),
            convertedDate_raw = new Date(),
            today = new Date();

        var carousel = Ext.Viewport.down('prayercarouselview');

        if (!carousel) {
            var carousel = Ext.getCmp('prayercarouselview');
        }

        if (chosenDatePrayerItem != null) {
            //convertedDateNew = Ext.Date.parse(chosenDatePrayerItem, 'm.d.Y');
            //console.log('chosenDatePrayerItem: '+chosenDatePrayerItem);
            //convertedDate = Ext.util.Format.date(chosenDatePrayerItem, 'd. F Y');
            
            convertedDate_raw = new Date(chosenDatePrayerItem);

            //convertedDate = Ext.Date.parse(chosenDatePrayerItem,'d. F Y');
        } else {
           //var today = new Date(); 
           //convertedDate = Ext.util.Format.date(today, 'd. F Y');
           convertedDate_raw = new Date();
        }
        
        //console.log('Value chosenDatePrayerItem: ' + chosenDatePrayerItem + ' Value convertedDate_raw: ' + convertedDate_raw);
        //console.log('convertedDate: ' + convertedDate);
        
        
        /*dateIndex = localPrayerStorage.findBy(function(record,id){
            convertedDate_raw = Ext.util.Format.date(record.get('date_raw'),'d. F Y');
            //console.log('Record: ' + record.get('date_raw'));
            //console.log('convertedDate_raw: ' + convertedDate_raw);
            if (convertedDate_raw == convertedDate) {
                
                return true;
            }
        });*/

        //convertedDate_raw = new Date(convertedDate);  
        

    //Create the not-found message

        var notFoundAlert = Ext.create('Ext.MessageBox', {
            locales: {
                title: 'tabs.carousel.notfoundtitle',
                message: 'tabs.carousel.notfoundmessage'
            },
            buttons: {
                text: 'Ok',
                ui: 'action',
                handler: function() {
                    notFoundAlert.destroy();
                }
            }
            //buttons: Ext.MessageBox.OK
        });

        dateIndex = me.findIndexInCarousel(convertedDate_raw) 

    //If this date is already in the carousel, display it
        if (dateIndex >= 0) {
            carousel.setActiveItem(dateIndex); 
        } else {
    //If the month is not yet in the carousel
            if (opc.app.globals.carouselItems.monthpresent.indexOf(convertedDate_raw.getMonth()) == -1) {
    //If yes, recreate the carousel with the missing month
                monthToAdd = Ext.util.Format.date(chosenDatePrayerItem, 'm')-1;
                console.log('Month to add: ' + monthToAdd);
                me.addItemstoCarousel(monthToAdd,function addSuccess(addedItemsCount){

                    dateIndexNew = me.findIndexInCarousel(convertedDate_raw);
                    //console.log('Date '+ convertedDate_raw+' has the index ' + dateIndexNew);

                    if (dateIndexNew == -1 && opc.app.globals.notfoundmessage == false) {
                        notFoundAlert.show();
                        opc.app.globals.notfoundmessage = true;
                    } else {
                        carousel.setActiveItem(dateIndexNew);
                    } 
                    
                }, function addFail(){
                    if (opc.app.globals.notfoundmessage == false) {
                        
                        notFoundAlert.show();
                        
                    //display the not-found-message only once
                        opc.app.globals.notfoundmessage = true;
                    }
                    
                });
            } else {
    //If the month is in the carousel but couldn't be found, display the error message
                notFoundAlert.show();
            }
            
        }
        
        
        carousel.addAfterListener('painted', function() {
            //Start background update
            //console.log('Checking if we might need to do an update due to the date?');
            if (opc.app.globals.lateUpdate == true) {
                console.log('Starting lateUpdate');
                me.getApplication().getController('opc.controller.UpdatePrayerItems').doLateUpdate();
            }
        });


    },

    findIndexInCarousel: function(convertedDate_raw) {
        if (opc.app.globals.carouselItems.monthpresent.indexOf(convertedDate_raw.getMonth()) != -1) {

            for (i=0; i < opc.app.globals.carouselItems.item.length; i++) {
                //console.log('Date of this prayer card: ' + opc.app.globals.carouselItems[i].prayerdate);
                //prayerdateDate = new Date(opc.app.globals.carouselItems[i].prayerdate)
                dateIndex = -1;
                if (opc.app.globals.carouselItems.item[i].prayerdate.getMonth() == convertedDate_raw.getMonth()) {
                    if (opc.app.globals.carouselItems.item[i].prayerdate.getDate() == convertedDate_raw.getDate()) {
                        dateIndex = i;
                        break;
                    }

                }
            }
        } else {
            dateIndex = -1;
        }

        
        console.log('Date '+ convertedDate_raw+' has the carousel index ' + dateIndex);

        return dateIndex;
    },

    /*onDateChosen: function(value, eOpts) {
        //var me = this;

        //var datevalues = this.down('#datePickerForm');
        //var monthDay = datevalues.getValues();
        console.log('ReturnValue: ' + value);
    } */

    checkForReload: function() {
        var me = this;
        //console.log('Do we need to reload?');
        var carousel = Ext.Viewport.down('prayercarouselview');
        if (carousel) {
            var currentCardDate = carousel.getActiveItem().prayerdate;
                indexPreviousMonth = opc.app.globals.carouselItems.item[0].prayerdate.getMonth()-1;
            
            if (carousel.getActiveIndex() == 0 && opc.app.globals.carouselItems.monthpresent.indexOf(indexPreviousMonth) == -1) {
                console.log('We reached ' + currentCardDate + '. Need to load carousel items for month: ' + indexPreviousMonth);
                me.addItemstoCarousel(indexPreviousMonth,
                    function addSuccess(addedItemsCount){

                    console.log(addedItemsCount + ' items added for the previous month');
                    //carousel.setActiveItem(3);
                    me.setCarouselDate(currentCardDate);
                    
                }, function addFail(){
                    console.log('No additional items added');
                });
            } 

            //|| carousel.getActiveIndex() == opc.app.globals.carouselItems.item.length) {

            //}
        }
    },

    jumpToToday: function() {
        console.log('Today pressed');
    }
});
Ext.define('opc.controller.dayPickerController', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            carouselView: 'prayercarouselview',
            datePickerItem: 'today #datePickerView' 
            //today: 'today'
            /*datePickerItem: {
                selector: '#mainView tabpanel',
                xtype: 'datePickerView',
                items :[
                    {iconCls: 'calendar',
                    text: 'Pick a Date'}
                ],

                autoCreate: true
            }*/
        },
        control: {
            datePickerItem: {
                activeitemchange: 'onStartPicker'
            }
        }
    },
    
    /*launch: function() {
        console.log('DatePicker added');
        var datePickerView = Ext.create('Ext.picker.Date', {
            xtype: 'datePickerView'
        });

        //this.getDatePickerItem().add();
    },*/

    onStartPicker: function() {
        console.log('DatePicker started');
        //var datepicker = this.getDatePickerItem();
        //datepicker.show();
        var showPicker = Ext.create('Ext.picker.Date', {
            xtype: 'datepicker'
        });
        showPicker.add();
    }
});
Ext.define('opc.model.ReminderModel', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			'id',
			{name: 'allowReminderFlag', type: 'bol'},
			{name: 'reminderTimeDisplay', type: 'string'}
		]
	}
});
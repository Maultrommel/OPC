Ext.define('opc.model.StatisticsModel', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			'id',
			{name: 'numberOfItems', type: 'int'},
			{name: 'lastVisit', type: 'string'},
			{name: 'monthsPresent', type: 'string'}
		]
	}
});
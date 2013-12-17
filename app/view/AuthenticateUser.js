Ext.define('opc.view.AuthenticateUser', {
	extend: 'Ext.form.Panel',
	alias: 'widget.authenticateview',
	//xtype: 'authenticateview',
	requires: ['Ext.Label', 'Ext.util.DelayedTask'],
	config: {
		title: 'Authenticate',
		items: [
			{
				xtype: 'titlebar',
				docked: 'top',
				//title: 'OMF Prayer Calendar',
				locales: {
					title: 'app.title'
				},
				items: [
					{
						xtype: 'button',
						itemId: 'authenticateProceedButton',
						//text: 'Next',
						locales: {
							text: 'buttons.next'
						},
						ui: 'forward',
						align: 'right'
					},
					{
						xtype: 'button',
						itemId: 'authenticateBackButton',
						locales: {
							text: 'buttons.back'
						},
						ui: 'back',
						align: 'left'
					}
				]
			},
			{
				xtype: 'label',
				itemId: 'authenticateDescription',
				padding: 10,
				locales: {
					html: 'tabs.authentification.description'
				}
			},
			{
				xtype: 'fieldset',
				//title: 'Passcode Authentification',
				locales: {
					title: 'Passcode'
				},
				itemId: 'authenticateFieldset',
				hidden: true,
				items: [
					{
						xtype: 'textfield',
						placeHolder: 'Passcode',
						itemId: 'passcodeTextField',
						name: 'passcodeTextField',
						required: true,
						autoComplete: false,
						autoCorrect: false
					},
					{
						xtype: 'label',
						html: 'Incorrect Passcode. Please enter a valid Passcode.',
						itemId: 'authenticateFailedLabel',
						hidden: true,
						padding: 10,
						hideAnimation: 'fadeOut',
						showAnimation: 'fadeIn',
						style: 'color: #990000; margin: 5px 0px;'
					}
				]
			},
			
			{
				xtype: 'button',
				itemId: 'authenticateButton',
				hidden: true,
				ui: 'action',
				padding: '10px',
				locales: {
					text: 'tabs.authentification.submitbutton'
				},
				 
				width: '80%',
				margin: '15 10%'
			},
			{
				xtype: 'button',
				itemId: 'requestButton',
				hidden: true,
				padding: '10px',
				locales: {
					text: 'tabs.authentification.requestbutton'
				},
				width: '80%',
				margin: '15 10%'
			}
		],
		listeners: [{
			delegate: '#authenticateButton',
			event: 'tap',
			fn: 'onAuthenticateButtonTap'
		},
		{
			delegate: '#authenticateProceedButton',
			event: 'tap',
			fn: 'onAuthenticateButtonTap'
		},
		{
			delegate: '#requestButton',
			event: 'tap',
			fn: 'onRequestButtonTap'
		}]
	},

	onAuthenticateButtonTap: function() {
		var me = this;

		var passcodeField = me.down('#passcodeTextField'),
			label = me.down('#authenticateFailedLabel');

		label.hide();

		var passcode = passcodeField.getValue().toUpperCase();

		var task = Ext.create('Ext.util.DelayedTask', function() {
			//label.setHtml('');
			me.fireEvent('authenticateCommand', me, passcode);

			passcodeField.setValue('');
		});

		task.delay(500);
	},

	onRequestButtonTap: function() {
		
		var task = Ext.create('Ext.util.DelayedTask', function() {
			requestOverlay = Ext.Viewport.add({xtype: 'requestpasscode'});
			//console.log('Model request window started');
			//Ext.Viewport.animateActiveItem(this.overlay, 'pop');
			//requestOverlay.showAnimation('slideln');
			requestOverlay.show(true);
		});
		task.delay(500);
	},

	showAuthenticateFailedMessage: function(message) {
		var label = this.down('#authenticateFailedLabel');
		label.setHtml(message);
		label.show();
	}

	/*showAuthenticateFieldset: function() {
		var me = this;
		//var authenticateview = getAuthenticateview();

		console.log('Making hidden fieldset now visible. Scope = ' + me);
		var fieldset = this.down('#authenticateFieldset');
		var button = this.down('#authenticateButton');
		var button2 = this.down('#requestButton');
		fieldset.show();
		button.show();
		button2.show();
	}*/
});
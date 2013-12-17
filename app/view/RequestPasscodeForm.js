Ext.define('opc.view.RequestPasscodeForm', {
	extend: 'Ext.form.Panel',
	xtype: 'requestpasscode',
	config: {
		title: 'Request Passcode',


		modal: true,
		fullscreen: false,
		//width: '400px',
		height: '500px',
		maxWidth: '400px',
		width: '80%',
		//maxHeight: '500px',
		layout: {
			//align: 'middle',
			type: 'vbox'
		},
		margin: '15 10%',
		//top: 45,
		//left: 10,
		//right: 10,
		top: '10%',
		//style: 'right: -5px; top: 45px',
		//draggable: true,
		scrollable: true,
		items: [
			{
				xtype: 'titlebar',
				locales: {
					title: 'tabs.authentification.requestoverlay.titlebar'
				},
				items: {
					xtype: 'button',
					itemId: 'abortButton',
					ui: 'action',
					align: 'right',
					locales: {
						text: 'buttons.cancel'
					},
					handler: function() {
						this.up('requestpasscode').hide(true);
						this.up('requestpasscode').destroy();
					}
				}
			},
			{
				xtype: 'fieldset',
				locales: {
					title: 'tabs.authentification.requestoverlay.title',
					instructions: 'tabs.authentification.requestoverlay.instructions'
				},
				
				//height: '300px',
				items: [
					{
						xtype: 'textfield',
						name: 'firstname',
						locales: {
							label: 'misc.firstname'
						}
						
					},
					{
						xtype: 'textfield',
						name: 'lastname',
						locales: {
							label: 'misc.lastname'
						}
						
					},
					{
						xtype: 'emailfield',
						name: 'email',
						locales: {
							label: 'misc.email'
						}
					}
				] 
			},
			{
				xtype: 'button',
				locales: {
					text: 'tabs.authentification.requestoverlay.requestbutton'
				},
				width: '80%',
				margin: '5 10%',
				ui: 'confirm',
				handler: function() {
					var values = this.up('requestpasscode').getValues();

					var MsgBody = '';
					MsgBody = "Dear " + values.firstname + "<br/>";
					MsgBody = MsgBody + "You're welcome to add a little message, but please do NOT alter the following lines:<br/><br/>.........<br/>";
					for(var fieldName in values){
						MsgBody = MsgBody + fieldName + ': ' + values[fieldName] + '<br/>';
					}
					MsgBody = MsgBody + ".........<br/>";
					//Ext.Msg.alert('Mail text',MsgBody,'',this);
					console.log('Country Email: ' + opc.app.globals.countrysettings.get('contactemail'));
					opc.app.globals.emailcomposer.showEmailComposerWithCallback(null,"OMF Prayer Calendar Passcode request",
						MsgBody,
						[opc.app.globals.countrysettings.get('contactemail')],[],[],true,[]);					
					this.parent.hide();


				}
			},
			{
				xtype: 'button',
				locales: {
					text: 'buttons.cancel'
				},
				width: '80%',
				margin: '5 10%',
				ui: 'normal',
				handler: function() {
					this.parent.hide(true);
					this.parent.destroy();
				}
			}

		]
		
	}
});
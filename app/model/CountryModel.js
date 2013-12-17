Ext.define('opc.model.CountryModel', {
	extend: 'Ext.data.Model',

	config: {
		fields: [
		//Settings for Joomla Backend
			/*'id',
			{name: 'title', type: 'string'},
			{name: 'alias', type: 'string'},
			{name: 'introtext', type: 'string'},
			{name: 'image', type: 'string'},
			{name: 'contactemail_before', type: 'string', mapping: 'extra_fields[1].value'},
			{name: 'contactemail_after', type: 'string', mapping: 'extra_fields[2].value'},
			{name: 'contactemail', type: 'string', 
				convert: function(value,record) {
					var fullEmail = record.get('contactemail_before') + '@' + record.get('contactemail_after');
					return fullEmail;
				}
			},
			{name: 'passcode', type: 'string', mapping: 'extra_fields[0].value'},
			{name: 'defaultlanguage', type: 'string', mapping: 'extra_fields[3].value'}*/

		//Settings for Wordpress Backend
			{name: 'id'},
			{name: 'title', type: 'string'},
			{name: 'alias', type: 'string', mapping: 'slug'},
			{name: 'introtext', type: 'string', mapping: 'content'},
			//{name: 'imageURL', type: 'string', mapping: 'thumbnail'},
			{name: 'imageURL', type: 'string', mapping: 'attachments.url'},
			/*{name: 'logo', convert: function(value,record) {
				var imageRaw = record.get('imageURL');
				var imageBase64 = '';
				//var imageBase64 = opc.model.CountryModel.getBase64image(imageRaw);
				console.log('Image URL: ' + imageRaw);
				
				if (imageRaw) {

				/*	var script = document.createElement("script");
					script.setAttribute("src", "http://src.sencha.io/data/"	+ imageRaw)
					script.setAttribute("type","text/javascript");
					document.body.appendChild(script);
					
				/*	Ext.Ajax.request({
						url: 'http://src.sencha.io/data/'+imageRaw,
						success: function(response) {
							imageBase64 = response;
						}
					})
					//var img = imageRaw;

					
					var canvas = document.createElement('canvas');
					//var canvas = document.getElementById('mycanvas');
					canvas.width = img.width;
					canvas.height = img.height;

					var ctx = canvas.getContext("2d");
					ctx.drawImage(img,0,0);

					var dataURL = canvas.toDataURL("image/png");

					imageBase64 = dataURL.replace(/^data:image\/(png|jpg);base64,/,"");

					console.log('Base64 encoded image: '+imageBase64);
					return imageBase64;
				


				}
			}},*/
			{name: 'logo', type: 'string'},
			{name: 'contactemail', type: 'string', mapping: 'custom_fields.email'},
			{name: 'passcode', type: 'string', mapping: 'custom_fields.passcode'},
			{name: 'defaultlanguage', type: 'string', mapping: 'custom_fields.defaultlanguage'}
		],
		identifier: {type: 'uuid'},
		idProperty: 'id'
	},

	setUrl: function() {
		var url = this.get('imageURL');

		var script = document.createElement("script");
		script.setAttribute("src", "http://src.sencha.io/data.opc.app.getApplication().getController('opc.controller.firstRunController').setLogoUrl-"+ this.get('alias')+ "/" + url);
		script.setAttribute("type","text/javascript");
		document.head.appendChild(script);
	},


	getBase64image: function(img) {
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;

		var ctx = canvas.getContext('2d');
		ctx.drawImage(img,0,0);

		var dataURL = canvas.toDataURL("image/png");

		return dataURL.replace(/^data:image\/(png|jpg);base64,/,"");
	}
});
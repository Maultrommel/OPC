Ext.define('opc.model.PrayerPointModel', {
    extend: 'Ext.data.Model',
    requires: ['Ext.DateExtras','Ext.data.Field'],
        
    config: {
        fields: [
            'id',
        //Settings for Joomla Backend
            /*{name: 'title', type: 'string'},
            {name: 'introtext', type: 'string'},
            {name: 'fulltext', type: 'string'},
            {name: 'image', type: 'string'},
            {name: 'date_raw', type: 'date', mapping: 'extra_fields[0].value', dateFormat: 'l, d F Y'},
            {name: 'author', type: 'string', mapping: 'extra_fields[1].value'},
            {name: 'country', type: 'string', mapping: 'extra_fields[3].value'}*/

        //Settings for Wordpress Backend
            {name: 'title', type: 'string', convert: function(value, record) {
                //console.log('Title directly from Model: ' + value);
                return value;
            }},
            {name: 'introtext', type: 'string', mapping:'content'},
            //{name: 'fulltext', type: 'string'},
            //{name: 'image', type: 'string'},
            {name: 'date_very_raw', /*type: 'string',*/ mapping: 'custom_fields.date', convert: function(value,record) {
                if (value instanceof Array) {
                    
                    returnvalue = value[0];
                    //console.log('Array date_very_raw: ' + returnvalue);
                    return returnvalue;
                } else {
                    //console.log('Value date_very_raw: ' + value);
                    return value;
                }
            }},


            {name: 'date_formatted', type: 'string'},

            {name: 'author', type: 'string', mapping: 'custom_fields.worker'},
            {name: 'lastname', type: 'string', convert: function(valueName, recordName) {
                var author = recordName.get('author');
                if (author) {
                        lastname = author.split(' ');
                        if (lastname.length > 1) {
                            return lastname.pop();
                        } else {
                            return author;
                        }
                    } else {
                        return 'undefined';
                }
            }},
            {name: 'tags', mapping: 'tags', convert: function(value, record) {
                if (value instanceof Array) {
                    return value;
                } else {
                    return [value];
                }
            }},
            {name: 'country', convert: function(value, record) {
                //console.log('Conversion started');
                var tagsArray = record.get('tags');
                //console.log('tagsArray = ' + tagsArray[0].slug);
                //console.log('Another try on Worker: ' + record.get('author'));
                for (i=0; i < tagsArray.length; i++) {
                    
                    var tagSlug = tagsArray[i].slug;
                    var positionString = tagSlug.indexOf('country');
                    //var positionString = -1;
                    //console.log('Slug: ' + tagSlug + ' Found: ' + positionString);
                    if (positionString != -1) {
                        countryName = tagsArray[i].title;
                        return countryName;
                    }
                }

                return 'No country';
            }},
            {name: 'notification', type: 'boolean', defaultValue: false},
                        {name: 'date_raw', type: 'date', /*mapping: 'custom_fields.date',*/ convert: function(value, record) {
                if (value instanceof Date) {
                    console.log('Already in Date format');
                    return value;
                } else {
                    /*if (value instanceof Array) {
                        value = value[0];
                        console.log('Array date_very_raw: ' + value);
                    } */
                    date_very_raw_String = record.get('date_very_raw');
                    
                        //date_converted = Ext.Date.parse(value,'d.m.Y');
                    //console.log('Date date_very_raw_String: ' + date_very_raw_String);
                    parts = date_very_raw_String.split('.');
                    //console.log('Date parts: Year '+parts[2]+ ' Month ' + parts[1] + ' Day ' + parts[0]);
                    date_converted = new Date(parts[2], parts[1]-1, parts[0]);
                    //console.log('Date_very_raw: '+date_very_raw_String+' (converted): ' + date_converted);
                    return date_converted; 
                    
                    //return value;
                    
                    

                    
                }
                

                //console.log('Date_very_raw: ' + value);

            }},
        ],
        //hasMany: {model: 'PrayerTags', name: 'prayertags'}

        identifier: {type: 'uuid'},
        idProperty: 'id'

    }
});

/*Ext.define('PrayerTags', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'id', type: 'int'},
            {name: 'title', type: 'string'},
            {name: 'description', type: 'string'}
        ]
    }
});*/

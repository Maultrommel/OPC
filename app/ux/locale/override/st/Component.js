Ext.define('Ux.locale.override.st.Component', {
    override : 'Ext.Component',

    requires : [
        'Ux.locale.Manager'
    ],

    enableLocale : false,
    locale       : null,
    locales      : null,

    constructor : function(config) {
        var me = this;

        config = Ux.locale.Manager.isLocalable(me, config);

        me.callParent([config]);

        if (me.enableLocale) {
            me.setLocale(Ux.locale.Manager.getLanguage());
        }
    },

    setLocale : function(locale) {
        var me          = this,
            locales     = me.locales || me.getInitialConfig().locales,
            html        = locales.html,
            tpl         = locales.tpl,
            label       = locales.label,
            message     = locales.message,
            title       = locales.title,
            manager     = me.locale,
            defaultText = '';

        if (html) {
            if (Ext.isObject(html)) {
                defaultText = html.defaultText;
                html        = html.key;
            }

            html = manager.get(html, defaultText);

            if (Ext.isString(html)) {
                me.setHtml(html);
            }
        }

        if (tpl) {
            if (Ext.isObject(tpl)) {
                defaulttext = tpl.defaultText;
                tpl         = tpl.key;
            }

            tpl = manager.get(tpl, defaultText);

            if (Ext.isString(tpl)) {
                me.setTpl(tpl);
            }
        }

        if (message) {
            if (Ext.isObject(message)) {
                defaulttext = message.defaultText;
                message         = message.key;
            }

            message = manager.get(message, defaultText);

            if (Ext.isString(message)) {
                me.setMessage(message);
            }
        }

        if (title) {
            if (Ext.isObject(title)) {
                defaulttext = title.defaultText;
                title         = title.key;
            }

            title = manager.get(title, defaultText);

            if (Ext.isString(title)) {
                me.setTitle(title);
            }
        }     

        if (label) {
            if (Ext.isObject(label)) {
                defaulttext = label.defaultText;
                label         = label.key;
            }

            label = manager.get(label, defaultText);

            if (Ext.isString(label)) {
                me.setLabel(label);
            }
        }         
    }
});

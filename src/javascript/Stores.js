/* global Ext _ com */
Ext.define("com.ca.TechnicalServices.Stores", function(Stores) {
    var selectedRelease;
    var selectedPortfolioItem;

    return {
        statics: {
            PORTFOLIO_ITEM_TYPE: 'PortfolioItem/Feature',
            PORTFOLIO_ITEM_STORE_ID: 'PORTFOLIO_ITEM_STORE_ID',
            GRID_STORE_ID: 'GRID_STORE_ID',
        },
        init: init,
        onReleaseChange: onReleaseChange,
        onPortfolioItemChange: onPortfolioItemChange
    }

    /***
     * Private methods
     ***/
    function loadPortfolioItemStore() {
        if (selectedRelease && selectedPortfolioItem) {
            Ext.data.StoreManager.lookup(Stores.PORTFOLIO_ITEM_STORE_ID).load({
                filters: [{
                        property: 'Parent.Parent',
                        value: selectedPortfolioItem
                    },
                    {
                        property: 'Release',
                        value: selectedRelease
                    }
                ]
            });
        }
    }

    function onPortfolioItemStoreLoad(store, records, successful) {
        var data = _.map(store.getGroups(), function(group) {
            return Ext.create('com.ca.TechnicalServices.SummaryRow', {
                FormattedID: group.name.FormattedID,
                Name: group.name.Name,
            });
        });
        Ext.data.StoreManager.lookup(Stores.GRID_STORE_ID).loadData(data);
    }

    /***
     * Public methods
     ***/
    function init() {
        // Store to load portfolio item data
        Ext.create('Rally.data.wsapi.Store', {
            storeId: Stores.PORTFOLIO_ITEM_STORE_ID,
            model: Stores.PORTFOLIO_ITEM_TYPE,
            listeners: {
                scope: this
            },
            fetch: [
                'FormattedID',
                'Name',
                'Parent'
            ],
            groupField: 'Parent',
            listeners: {
                scope: this,
                load: onPortfolioItemStoreLoad
            }
        });

        // Store to contain row data computed from portfolio items
        Ext.create('Rally.data.custom.Store', {
            storeId: Stores.GRID_STORE_ID,
            model: 'com.ca.TechnicalServices.SummaryRow'
        });
    }

    function onReleaseChange(newValue) {
        selectedRelease = newValue;
        loadPortfolioItemStore();
    }

    function onPortfolioItemChange(newValue) {
        selectedPortfolioItem = newValue;
        loadPortfolioItemStore();
    }
});
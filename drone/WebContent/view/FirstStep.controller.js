sap.ui.controller("drone.view.FirstStep", {

	toSecondStep: function (sId, oEvent){
		sap.ui.core.UIComponent.getRouterFor(this).navTo("second", {area: sId});
	},
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf drone.MainView
*/
	onInit: function() {

	},
	
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf drone.MainView
*/
	onBeforeRendering: function(oEvent) {
		var tiles = this.byId("allTiles");

		tiles.setBusy(true);
		tiles.destroyTiles();

		var oFilter = new sap.ui.model.Filter("PLANTATION_ID", sap.ui.model.FilterOperator.EQ, '1');

		this.getView().getModel().read("Plantation", {
			urlParameters: {"$select": "PLANTATION_ID,AREA_ID"},
			filters: [oFilter],
			success: $.proxy(this.onDataReadOk, this),
			error: $.proxy(this.onDataReadError, this)
		});
	},

	onDataReadOk: function(oData, response) {
		var data = oData.results;

		for (var i=0; i<data.length; i++){
			this.byId("allTiles").addTile(new sap.m.StandardTile({
				title: "Area " + data[i].AREA_ID,
				press: $.proxy(this.toSecondStep, this, data[i].AREA_ID)
			}));
		}
		this.byId("allTiles").setBusy(false);
	},

	onDataReadError: function(oError) {
		this.byId("allTiles").setBusy(false);
	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf drone.MainView
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf drone.MainView
*/
//	onExit: function() {
//
//	}

});
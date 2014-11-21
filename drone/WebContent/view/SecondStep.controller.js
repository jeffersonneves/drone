sap.ui.controller("drone.view.SecondStep", {

	toThirdStep : function(sKey, sArea, sFinalColor) {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("third", {
			observationkey : sKey,
			area: sArea,
			finalcolor: sFinalColor,
		});
	},

	toFirstStep : function(oEvent) {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("first");
	},

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf view.SecondStep
	 */
	 onInit: function() {
		 var that = this;
		 sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function (oEvent){
		       var params = oEvent.getParameters();
		                    
		       this.queryParams = params.arguments;
		       
		       that.getData();
		});
	 },
	/**
	 * Similar to onAfterRendering, but this hook is invoked before the
	 * controller's View is re-rendered (NOT before the first rendering!
	 * onInit() is used for that one!).
	 * 
	 * @memberOf view.SecondStep
	 */
	onBeforeRendering : function() {
	},
	
	getData: function(){
		var tiles = this.byId("allTilesPlant");

		tiles.setBusy(true);
		tiles.destroyTiles();

		var oFilter = new sap.ui.model.Filter("AREA_ID",
				sap.ui.model.FilterOperator.EQ, this.queryParams["area"]);
		var oFilterColor = new sap.ui.model.Filter("AREA_ID",
				sap.ui.model.FilterOperator.EQ, this.queryParams["finalcolor"]);
		
		this.getView().getModel().read("Plant_Color", {
			urlParameters : {
				"$top" : "15"
			},
			filters : [ oFilter, oFilterColor ],
			success : $.proxy(this.onDataReadOk, this),
			error : $.proxy(this.onDataReadError, this)
		});
	},

	onDataReadOk : function(oData, response) {
		var data = oData.results;

		for (var i = 0; i < data.length; i++) {
			this.byId("allTilesPlant").addTile(new sap.m.StandardTile({
				title : "Plant " + data[i].PLANTATION_ID,
				infoState : this.defineInfoState(data[i].PLANT_COLOR),
				info : this.defineInfo(data[i].PLANT_COLOR),
				icon : this.defineIcon(data[i].PLANT_COLOR),
				press : $.proxy( this.toThirdStep,this, data[i].PLANT_OBSERVATION_ID, this.queryParams["area"], this.queryParams["finalcolor"])
			}));
		}
		this.byId("allTilesPlant").setBusy(false);
	},

	onDataReadError : function(oError) {
		this.byId("allTilesPlant").setBusy(false);
	},

	defineInfoState : function(color) {

		switch (color) {

		case "3":
			infoState = "Error";
			break;
		case "2":
			infoState = "Warning";
			break;
		default:
			infoState = "Success";
			break;
		}

		return infoState;
	},

	defineIcon : function(color) {

		var icon;

		switch (color) {

		case "3":
			icon = "alert";
			break;
		case "2":
			icon = "notification";
			break;
		default:
			icon = "completed";
			break;
		}

		return "sap-icon://" + icon;
	},

	defineInfo : function(color) {

		var info;

		switch (color) {

		case "3":
			info = "This Area is under Alert!";
			break;
		case "2":
			info = "Handle this Area with caution.";
			break;
		default:
			info = "This Area is Ok!";
			break;
		}

		return info;
	},

/**
 * Called when the View has been rendered (so its HTML is part of the document).
 * Post-rendering manipulations of the HTML could be done here. This hook is the
 * same one that SAPUI5 controls get after being rendered.
 * 
 * @memberOf view.SecondStep
 */
// onAfterRendering: function() {
//
// },
/**
 * Called when the Controller is destroyed. Use this one to free resources and
 * finalize activities.
 * 
 * @memberOf view.SecondStep
 */
// onExit: function() {
//
// }
});
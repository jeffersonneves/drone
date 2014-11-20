sap.ui.controller("drone.view.ThirdStep", {

	
	//http://brslehana01.sle.sap.corp:8000/drone/services/Plant_Heat_Map.xsodata/Plant_Heat_Map?%24format=json
	
	toSecondStep: function (oEvent){
		sap.ui.core.UIComponent.getRouterFor(this).navTo("second", {area:"1"});
	},
	
	setModelData: function( aNewData ){
		this.model.setProperty("/plantData", aNewData);
	},

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.ThirdStep
*/
	onInit: function() {
		var that = this;
		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function (oEvent){
		       var params = oEvent.getParameters();
		                    
		       this.queryParams = params.arguments;
		       
		       that.simulateChart();
		       that.getData();
		});
	},
	
	getData: function(){
		var oFilter = new sap.ui.model.Filter("PLANT_OBSERVATION_ID", sap.ui.model.FilterOperator.EQ, this.queryParams["observationkey"]);

		this.getView().getModel().read("Plant_Observation", {
			filters: [oFilter],
			success: $.proxy(this.createScreenData, this),
			error: $.proxy(this.onDataReadError, this)
		});
		
	},
	
	dummyErrorMessage: function( response ){
		alert(response.status);
	},
	
	
	createScreenData: function( oData ){
		this.createChart( oData );
		//this.createImage( oData ); TODO
		
	},
	
	createImage: function( oData ){
		this.getView().byId("plantImageID").setSrc();
	},
	
	createChart: function( oData ){
		 var oVizFrame = this.getView().byId("idVizFrameLine");
		    var oPopOver = this.getView().byId("idPopOver");

		    var amModel = new sap.ui.model.json.JSONModel({
		    });
		    
		    var data = oData.results;
		    
		    amModel.setData( data );
		    
		    
		    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
		      dimensions : [ {
		        name : 'PlantName',
		        value : "{PLANT_TYPE_NAME}"
		      } ],
		      measures : [
		      {
		        name : 'Height',
		        value : '{PLANT_OBSERVATION_HEIGHT}'
		      }, {
		        name : 'Oxigen',
		        value : '{PLANT_OBSERVATION_OXIGEN_INDEX}'
		      }, {
		        name : "Humidity",
		        value : "{ENVIRONMENT_OBSERVATION_HUMIDITY}"
		      }, 
		      {
		    	name : "Luminosity",
		    	value: "{PLANT_OBSERVATION_LUMINOSITY}"
			  }
		      , 
		      {
		    	name : "Temperature",
		    	value: "{PLANT_OBSERVATION_TEMPERATURE}"
			  }],
		      data : {
		        path : "/PlantCollection"
		      }
		    });
		  
		    oVizFrame.setVizProperties({
		      plotArea : {
		        isFixedDataPointSize : true,
		        categorySize : {
		           desktop : {
		             minValue : 100
		           }
		        },
		        dataLabel : {visible : true},
		        
		          lineStyle: {
		             rules: [
		                {
		                   dataContext: [
		                      {Price: "*"}
		                   ],
		                   properties: {
		                       width: 6
		                   }
		                 }]
		              }
		           },
		        legend : {
		          title: {visible : false}
		        },
		        
		            title: {
		                visible: true,
		                text: 'Plant Data'
		           }
		    });
		    oVizFrame.setDataset(oDataset);
		    oVizFrame.setModel(amModel);

		    var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
		      'uid' : "primaryValues",
		      'type' : "Measure",
		      'values' : ["Height", "Oxigen", "Humidity", "Luminosity", "Temperature"]
		    }), feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
		      'uid' : "axisLabels",
		      'type' : "Dimension",
		      'values' : ["PlantName"]
		    });

		    oVizFrame.addFeed(feedPrimaryValues);
		    oVizFrame.addFeed(feedAxisLabels);
		    oPopOver.connect(oVizFrame.getVizUid());

	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.ThirdStep
*/
	onBeforeRendering: function() {

	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.ThirdStep
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.ThirdStep
*/
//	onExit: function() {
//
//	}

});
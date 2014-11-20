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
		this.simulateChart();
		this.getData();
	},
	
	getData: function(){
		//var oFilter = new sap.ui.model.Filter("PLANTATION_ID", sap.ui.model.FilterOperator.EQ, '1');
		var oFilterArea = new sap.ui.model.Filter("AREA_ID", sap.ui.model.FilterOperator.EQ, this.queryParams["area"]);
		var oFilterColumn = new sap.ui.model.Filter("PLANT_COLUMN", sap.ui.model.FilterOperator.EQ, this.queryParams["column"]);
		var oFilterRow = new sap.ui.model.Filter("PLANT_ROW", sap.ui.model.FilterOperator.EQ, this.queryParams["row"]);

		this.getView().getModel().read("Plantation", {
			urlParameters: {"$select": "PLANTATION_ID,AREA_ID"},
			filters: [oFilterArea, oFilterColumn, oFilterRow],
			success: $.proxy(this.createChart, this),
			error: $.proxy(this.onDataReadError, this)
		});
		
	},
	
	dummyErrorMessage: function( response ){
		alert(response.status);
	},
	
	createImage: function( oData ){
		this.getView().byId("plantImageID").setSrc();;
	},
	
	createChart: function(oData, response){
		var oVizFrame = this.getView().byId("idVizFrameLine");
		var oPopOver = this.getView().byId("idPopOver");

	    var amModel = new sap.ui.model.json.JSONModel({
	    });
	    amMode.setData( oData.results );
		    
		    
	    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
	      dimensions : [ {
	        name : 'PlantID',
	        value : "{PLANT_ID}"
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
	      } ],
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
	                      //{Price: "*"} TODO check if this will not screw up things
	                      {Plant:"*"}
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
	      'values' : ["Height", "Oxigen", "Humidity"]
	    }), feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
	      'uid' : "axisLabels",
	      'type' : "Dimension",
	      'values' : ["PlantID"]
	    });

	    oVizFrame.addFeed(feedPrimaryValues);
	    oVizFrame.addFeed(feedAxisLabels);
	    oPopOver.connect(oVizFrame.getVizUid());

	},
	
	
	simulateChart: function(){
		 var oVizFrame = this.getView().byId("idVizFrameLine");
		    var oPopOver = this.getView().byId("idPopOver");

		    var amModel = new sap.ui.model.json.JSONModel({
		        'PlantCollection' : [
		                  {
		                  "PLANT_ID": "1239102",
		                  "PLANT_OBSERVATION_HEIGHT": 126,
		                  "PLANT_OBSERVATION_OXIGEN_INDEX": 80,
		                  "ENVIRONMENT_OBSERVATION_HUMIDITY": 70
		                },
		                ]
		    });
		    
		    
		    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
		      dimensions : [ {
		        name : 'PlantID',
		        value : "{PLANT_ID}"
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
		      } ],
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
		      'values' : ["Height", "Oxigen", "Humidity"]
		    }), feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
		      'uid' : "axisLabels",
		      'type' : "Dimension",
		      'values' : ["PlantID"]
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
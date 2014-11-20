sap.ui.controller("drone.view.ThirdStep", {

	
	toSecondStep: function (oEvent){
		sap.ui.core.UIComponent.getRouterFor(this).navTo("second", {area:"1"});
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
		this.createImage( oData ); 
		this.setTextAreaMessage( oData );
	},
	
	createImage: function( oData ){
		var data = oData.results[0];
		var img = data.PLANT_OBSERVATION_IMAGE_URL;
		//if there is no registered plant
		if( !img == "url"){
			this.getView().byId("plantImageID").setSrc( data.PLANT_OBSERVATION_IMAGE_URL );
		}
		else{
			if( this.getView().byId("plantImageID")  )
				this.getView().byId("plantImageID").setSrc( "img/planta.jpg");
		}
	},
	
	createChart: function( oData ){
		 var oVizFrame = this.getView().byId("idVizFrameLine");
		    var oPopOver = this.getView().byId("idPopOver");

		    var data = oData.results[0];

		    var amModel = new sap.ui.model.json.JSONModel({
		        'PlantCollection' : [ data ]		               
		    });
		    
		    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
		      dimensions : [ {
		        name : 'PlantTypeID',
		        value : "{PLANT_TYPE_ID}"
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
		        value : "{PLANT_OBSERVATION_HUMIDITY}"
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
		      'values' : ["PlantTypeID"]
		    });

		    oVizFrame.addFeed(feedPrimaryValues);
		    oVizFrame.addFeed(feedAxisLabels);
		    oPopOver.connect(oVizFrame.getVizUid());

	},
	
	setTextAreaMessage: function( oData ){
		var data = oData.results;
		if( data.PLANT_TYPE_NAME != undefined ){
			var name = "Type of Plant: " + data.PLANT_TYPE_NAME;
			this.getView().byId("inputPlantTypeId").setValue( data.PLANT_TYPE_NAME );
		} 
		else{
			this.getView().byId("inputPlantTypeId").destroy();
		}
		
		
		
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
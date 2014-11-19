jQuery.sap.declare("drone.Component");

sap.ui.core.UIComponent.extend("drone.Component", {
	metadata : {
		name : "Innoweek Drone Challenge",
		version : "1.0",
		includes : [],
		dependencies : {
			libs : [ "sap.m", "sap.ui.layout" ],
			components : []
		},
		rootView : "drone.App",
		config : {
			resourceBundle : "i18n/strbundle.properties",
			serviceConfig : {
				name : "DroneSvc",
				serviceUrl : "/drone/services/odata/All_Views.xsodata"
			}
		},
		routing : {
			// The default values for every route
			config : {
				viewType : "XML",
				viewPath : "drone.view",
				targetAggregation : "pages",
				targetControl : "appContent",
				clearTarget : false
			},
			// The route configurations
			routes: [
				{ name: "first",  view: "FirstStep",  pattern: ""	},
				{ name: "second", view: "SecondStep", pattern: "area/{area}" },
				{ name: "third",  view: "ThirdStep",  pattern: "area/{area}/column/{column}/row/{row}" }
			]
		}
	},

	init : function() {

		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		var mConfig = this.getMetadata().getConfig();

		// always use absolute paths relative to our own component
		// (relative paths will fail if running in the Fiori Launchpad)
		var rootPath = jQuery.sap.getModulePath("drone");

		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : [ rootPath, mConfig.resourceBundle ].join("/")
		});
		this.setModel(i18nModel, "i18n");

		// Create and set domain model to the component
		var sServiceUrl = mConfig.serviceConfig.serviceUrl;
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
		this.setModel(oModel);

		// set device model
		var deviceModel = new sap.ui.model.json.JSONModel({
			isTouch : sap.ui.Device.support.touch,
			isNoTouch : !sap.ui.Device.support.touch,
			isPhone : sap.ui.Device.system.phone,
			isNoPhone : !sap.ui.Device.system.phone,
			listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
			listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
		});

		deviceModel.setDefaultBindingMode("OneWay");
		this.setModel(deviceModel, "device");

		this.getRouter().initialize();
		
		this.getRouter().attachRouteMatched(function (oEvent){
			var params = oEvent.getParameters();
			
			params.view.getController().queryParams = params.arguments;
			
			params.targetControl.to(params.view);
		});

	}
});
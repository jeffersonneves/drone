sap.ui.jsview("drone.ShellView", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf drone.ShellView
	*/ 
	getControllerName : function() {
		return "drone.ShellView";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf drone.ShellView
	*/ 
	createContent : function(oController) {

	}

});

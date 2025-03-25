sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/models"
], (Controller, Models) => {
    "use strict";

    return Controller.extend("ztimetracker.controller.View1", {
        onInit: function () {
            this.oModel = this.getOwnerComponent().getModel("oData");
            this.oActorsModel = this.getOwnerComponent().getModel("ActorsModel");

            this.oActorsModel.setProperty("/Status", [{
                "sKey": "ac",
                "sValue": "Active"
            }, {
                "sKey": "in",
                "sValue": "Inactive"
            }

            ]);
            this.readData();
        },
        readData: function(){
            this.oModel.read('/Actors', {
                success: (oData) => {
                    debugger;
                    this.oActorsModel.setSizeLimit(500);
                    var aData = oData.results;
                    aData.forEach(e => { 
                        e.editMode = false;
                        e.editBtn = true;
                        e.saveBtn = false;
                        e.cancelBtn = false;
                     });
                    this.oActorsModel.setProperty('/ActorsData', aData);
                    // this.oActorsModel.setProperty('/Countries', Models.getCountryData());

                },
                error: (e) => {
                    debugger;
                }
            });
        },
        onChange:function(e){
            this.oActorsModel.setProperty(this.mode,false)
        },
        onAdd: function () {
            if (!this.frag) {
                this.frag = sap.ui.xmlfragment("ztimetracker.view.addData", this);
                this.getView().addDependent(this.frag);
            }
            this.frag.open()
        },
        onEdit: function (e) {
            debugger
            var oSelectedObj = e.getSource().getBindingContext("ActorsModel").getObject();
            oSelectedObj.editBtn = false;
            oSelectedObj.saveBtn = true;
            oSelectedObj.cancelBtn = true;
            this.mode = e.getSource().getBindingContext('ActorsModel') + "/editMode"
            var modeValue = this.oActorsModel.getProperty(this.mode)
            if (modeValue) {
                this.oActorsModel.setProperty(this.mode, false)
            }
            if (modeValue === false) {
                this.oActorsModel.setProperty(this.mode, true)
            }
        },
        onSave:function(e){
            var sPath=e.getSource().getBindingContext("ActorsModel").getPath()
            var obj=this.oActorsModel.getObject(sPath)
            if(obj.sValue){
                if(obj.sValue==="in"){
                    obj.IS_ACTIVE=false
                }
                else{
                    obj.IS_ACTIVE=true
                }
            } 
            var payload={
                ACTOR_ID:obj.ACTOR_ID,
                NAME:obj.NAME,
                IS_ACTIVE:obj.IS_ACTIVE
            }
            var path = '/Actors(' + obj.ACTOR_ID + ')'
            this.oModel.update(path,payload,{
                success:function(){
                    var mode = e.getSource().getBindingContext('ActorsModel') + "/editMode"
                    this.oActorsModel.setProperty(mode, false)
                    this.oActorsModel.refresh()
                    
                }.bind(this),
                error:function(err){
                    debugger
                }
            })
            this.readData()
        },
        onCancel:function(e){
            var mode = e.getSource().getBindingContext('ActorsModel') + "/editMode"
            this.oActorsModel.setProperty(mode, false)

            this.readData();
        },
        onDelete: function (e) {
            // var t = this.getView().byId('actors').getSelectedItem().getTitle()
            var id = this.getView().byId('actors').getSelectedItem().getBindingContext("ActorsModel").getObject().ACTOR_ID;
            var path = '/Actors(' + id + ')'
            this.oModel.remove(path, {
                success: function () {
                    this.readData()
                    debugger;
                }.bind(this),
                error: function () {
                    debugger;
                }
            })
            this.getView().byId('actors').clearSelection();
        },
        onAddData: function () {
            var name = sap.ui.getCore().byId('name').getValue()
            var s = sap.ui.getCore().byId('status').getValue()
            var status = (s === "Active") ? true : false
            var obj = {
                "NAME": name,
                "IS_ACTIVE": status
            }
            // oModel.setUseBatch(false)

            this.oModel.create("/Actors", obj, {
                success: function (odata, res) {
                    debugger;
                    this.frag.close()
                    this.frag.destroy()
                    this.frag = null
                    debugger
                }.bind(this),
                error: function (err) {
                    debugger
                }
            })
        }
    });
});
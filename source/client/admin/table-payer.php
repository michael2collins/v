<div ng-controller="PayerTableBasicController as vm">

    <div class="portlet box portlet-green">
        <div class="portlet-header">
                <div class="caption">Maintain Payer</div>
                <div class="tools"><i class="fa fa-chevron-up"></i></div>
        </div>
      <div class="portlet-body pbn ptl" style="display: block;   background-color: grey;">
            <div class="panel panel-blue">
                <div class="panel-heading">Payers</div>
                <div class="panel-body pan">
                    <div class="table-tools">
                		<div class="well well-lg" ng-show="!!vm.selected">
                            <div class="container-fluid"> 
                                <div class="container-xl" >
                                    <div class="caption">Update selected rows</div>
                                    <div class="col-md-12" style="height: 88px;">
                                        <form action="" novalidate name="edit" class="form-horizontal">
                                            <div class="col-md-2">
                                                <label for="invoicevalue" class="control-label">Invoice Value?</label>
                                                <div class="input-icon right">
                                                    <toggle-switch 
                                                            on-label="Yes" 
                                                            off-label="No" 
                                                            id="invoicevalue" 
                                                            type="checkbox" 
                                                            name="invoicevalue" 
                                                            ng-model="vm.invoicevalue" 
                                                        class="switch-primary">
                                                    </toggle-switch>
                                                </div>                
                                            </div>
                                             <div class="col-md-3"  >
                                                <label for="rankbtn" class="control-label">&nbsp; </label>                                                 
                                                <button type="button" class="btn btn-green form-control" ng-click="vm.changeInvoicing()">Change Invoicing for Selected</button>
                                             </div>
                                            <div class="col-md-7"></div>
                                        </form> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                        <div class="row col-md-offset-10 mbs">
                            
                            <button type="button" class="btn btn-blue mrs mts" 
                                ng-click="vm.isCollapsed = !vm.isCollapsed">{{ vm.isCollapsed ? 'New' : 'Collapse'}}</button>
                        </div>
                    </div>
                  	<div uib-collapse="vm.isCollapsed">
                		<div class="well well-lg">
                            <div class="container-fluid"> 
                                <div class="container-xl" >
                                    <div class="col-md-12" style="height: 88px;">
                                        <!-- payername, payeremail, invoiceCreate -->
                                        <form action="" novalidate name="editschedule2" class="form-horizontal">
                                            <div class="col-md-4">
                                                <?php require_once('../includes/table-basic.php');
                                                    print strColTemplate(
                                                        array(
                                                            'field'=>'payername',
                                                            'model'=>'vm.Payer.payername',
                                                            'label'=>'Name<br/>&nbsp;',
                                                            'placeholder'=>'Enter Name',
                                                            'required'=>true
                                                            )
                                                    );
                                                ?>
                                            </div>
                                            <div class="col-md-4">
                                                <?php require_once('../includes/table-basic.php');
                                                    print strColTemplate(
                                                        array(
                                                            'field'=>'payeremail',
                                                            'model'=>'vm.Payer.payeremail',
                                                            'label'=>'Email<br/> &nbsp;',
                                                            'placeholder'=>'Enter Email',
                                                            'required'=>true
                                                            )
                                                    );
                                                    
                                                ?>
                                            </div>
                                            <div class="col-md-2">
                                                <?php require_once('../includes/table-basic.php');
                                                    print toggleSwitchColTemplate(
                                                            array(
                                                                'field'=>'createinvoice',
                                                                'model'=>'vm.Payer.createinvoice',
                                                                'label'=>'Create<br/>Invoice?',
                                                                'required'=>true,
                                                                'form'=>'editschedule2'
                                                                )
                                                    );
                                                ?>
                                            </div>
                                            <div class="col-md-2 btn" style="margin-top: 18px;">
                                             <?php require_once('../includes/table-basic.php');
                                                    print btnColTemplate(
                                                        array(
                                                            'field'=>'rankbtn',
                                                            'label'=>'Add',
                                                            'click'=>'vm.addPayer(vm.Payer)'
                                                            )
                                                    );
                                                ?>
                                            </div>
                                        </form> 
                                    </div>
                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel-footer">
                    <div ui-grid="vm.gridOptions"  
                        ui-if="vm.gridOptions.data.length>0"
                        ui-grid-pagination 
                        ui-grid-cellNav  
                        ui-grid-selection
                        ui-grid-auto-resize
                        ui-grid-resize-columns
                        ui-grid-edit class="mygrid" ng-style="vm.getGridLength()" >
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>
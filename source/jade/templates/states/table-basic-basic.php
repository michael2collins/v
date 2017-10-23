<!DOCTYPE html>
<div ng-controller="BasicTableBasicController as vm">

    <div class="portlet box portlet-green">
        <div class="portlet-header">
                <div class="caption">Maintain Basic</div>
                <div class="tools"><i class="fa fa-chevron-up"></i></div>
        </div>
      <div class="portlet-body pbn ptl" style="display: block;   background-color: grey;">
            <div class="panel panel-blue">
                <div class="panel-heading">Basic</div>
                <div class="panel-body pan">
                    <div class="table-tools">
                        <div class="row col-md-offset-11 mbs">
                            <button type="button" class="btn btn-blue mrs" ng-click="vm.isCollapsed = !vm.isCollapsed">New</button>
                        </div>
                    </div>
                  	<div uib-collapse="vm.isCollapsed">
                		<div class="well well-lg">
                            <div class="container-fluid"> 
                                <div class="container" >
                                    <div class="col-md-12" style="height: 88px;">
                                        <!-- listtype, listkey, listvalue, listorder -->
                                        <form action="" novalidate name="editschedule2" class="form-horizontal">
                                            <div class="col-md-3">
                                                <?php require_once('table-basic.php');
                                                    print selectColTemplate(
                                                        array(
                                                            'field'=>'listtype',
                                                            'model'=>'vm.Basic.listtype',
                                                            'label'=>'List<br/>Type',
                                                            'placeholder'=>'Select',
                                                            'required'=>true,
                                                            'form'=>'editschedule2',
                                                            'repeatmodel'=>'vm.listTypes',
                                                            'repeatvalue'=>'value',
                                                            'repeatid'=>'value'
                                                            )
                                                    );
                                                ?>
                                            </div>
                                            <div class="col-md-3">
                                                <?php require_once('table-basic.php');
                                                    print strColTemplate(
                                                        array(
                                                            'field'=>'listkey',
                                                            'model'=>'vm.Basic.listkey',
                                                            'label'=>'Key<br/>&nbsp;',
                                                            'placeholder'=>'Enter Key',
                                                            'required'=>true
                                                            )
                                                    );
                                                ?>
                                            </div>
                                            <div class="col-md-3">
                                                <?php require_once('table-basic.php');
                                                    print strColTemplate(
                                                        array(
                                                            'field'=>'listvalue',
                                                            'model'=>'vm.Basic.listvalue',
                                                            'label'=>'Value<br/> &nbsp;',
                                                            'placeholder'=>0,
                                                            'required'=>true
                                                            )
                                                    );
                                                    
                                                ?>
                                            </div>
                                            <div class="col-md-2">
                                                <?php require_once('table-basic.php');
                                                    print strColTemplate(
                                                        array(
                                                            'field'=>'listorder',
                                                            'model'=>'vm.Basic.listorder',
                                                            'label'=>'Order<br/> &nbsp;',
                                                            'placeholder'=>0,
                                                            'required'=>true,
                                                            'fieldtype'=>'number'
                                                            )
                                                    );
                                                ?>
                                            </div>
                                        <div class="col-md-1 btn" style="margin-top: 18px;">
                                            <?php require_once('table-basic.php');
                                                    print btnColTemplate(
                                                        array(
                                                            'field'=>'rankbtn',
                                                            'label'=>'Add',
                                                            'click'=>'vm.addBasic(vm.Basic)'
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
                        ui-grid-pinning  
                        ui-grid-move-columns 
                        ui-grid-exporter 
                        ui-grid-auto-resize
                        ui-grid-resize-columns
                        ui-grid-edit class="mygrid" ng-style="vm.getGridLength()" >
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>
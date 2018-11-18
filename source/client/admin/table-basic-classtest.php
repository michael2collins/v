<div ng-controller="ClassTestTableBasicController as vm">
    <img ng-if="vm.dataLoading" ng-src="/images/Spinner.gif"/>
    <img id="spinner" ng-src="/images/Spinner.gif" style="display:none;">
    <div class="portlet box portlet-green" ng-hide="vm.dataLoading">
        <div class="portlet-header">
                <div class="caption">Maintain Class Test</div>
                <div class="tools"><i class="fa fa-chevron-up"></i></div>
        </div>

      <div class="portlet-body pbn ptl" style="display: block;   background-color: grey;">
            <div class="panel panel-blue">
                <div class="panel-heading">Class Test</div>
                <div class="panel-body pan">
                    <div class="table-tools">
                        <div class="row col-md-offset-11 mbs">
                            <button type="button" class="btn btn-blue mrs" ng-click="vm.isCollapsed = !vm.isCollapsed">New</button>
                        </div>
                    </div>
                  	<div uib-collapse="vm.isCollapsed">
                		<div class="well well-lg">
                            <div class="container-fluid"> 
                                <div class="container-xl" >
                <form action="" novalidate name="editschedule2" class="form-horizontal">
                                <div class="col-md-2">
                                    <?php require_once('../includes/table-basic.php');
                                        print selectColTemplate(
                                            array(
                                                'field'=>'classid',
                                                'model'=>'vm.Classtest.classid',
                                                'label'=>'Class<br/>&nbsp;',
                                                'placeholder'=>'Select',
                                                'required'=>false,
                                                'form'=>'editClasstest2',
                                                'repeatmodel'=>'vm.classes',
                                                'repeatvalue'=>'value',
                                                'repeatid'=>'id'
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-2">
                                    <?php require_once('../includes/table-basic.php');
                                        print selectColTemplate(
                                            array(
                                                'field'=>'testtypeid',
                                                'model'=>'vm.Classtest.testtypeid',
                                                'label'=>'Test<br/>Type',
                                                'placeholder'=>'Select',
                                                'required'=>false,
                                                'form'=>'editClasstest2',
                                                'repeatmodel'=>'vm.testTypes',
                                                'repeatvalue'=>'value',
                                                'repeatid'=>'id'
                                                )
                                        );
                                    ?>
                                </div>
                            <div class="col-md-1">
                                <?php require_once('../includes/table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'sortorder',
                                                'model'=>'vm.Classtest.sortorder',
                                                'label'=>'Sort<br/> Order',
                                                'placeholder'=>'',
                                                'required'=>true,
                                                'fieldtype'=>'number'
                                                )
                                        );
                                ?>
                            </div>

                            <div class="col-md-1 btn" style="margin-top: 18px;">
                                <?php require_once('../includes/table-basic.php');
                                        print btnColTemplate(
                                            array(
                                                'field'=>'rankbtn',
                                                'label'=>'Add',
                                                'click'=>'vm.addClassTest(vm.Classtest)'
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
<div ng-controller="TesttypeTableBasicController as vm">

    <div class="portlet box portlet-green">
        <div class="portlet-header">
                <div class="caption">Maintain Test Type</div>
                <div class="tools"><i class="fa fa-chevron-up"></i></div>
        </div>
      <div class="portlet-body pbn ptl" style="display: block;   background-color: grey;">
            <div class="panel panel-blue">
                <div class="panel-heading">Test Type</div>
                <div class="panel-body pan">
                    <div class="table-tools">
                        <div class="row col-md-offset-10 mbs">
                            <button type="button" class="btn btn-blue mrs mts" 
                                ng-click="vm.isCollapsed = !vm.isCollapsed">{{ vm.isCollapsed ? 'New' : 'Collapse'}}</button>
                        </div>
                    </div>
                  	<div uib-collapse="vm.isCollapsed">
                		<div class="well well-lg">
                            <div class="container-fluid"> 
                                <div class="container-xl" >
                <form action="" novalidate name="editschedule2" class="form-horizontal">
                            <div class="col-md-11">
                                <div class="col-md-4">
                                    <?php require_once('../includes/table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'testtype',
                                                'model'=>'vm.Testtype.testtype',
                                                'label'=>'Test Type<br/>&nbsp;',
                                                'placeholder'=>'Enter Type',
                                                'required'=>true
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-4">
                                    <?php require_once('../includes/table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'testdescription',
                                                'model'=>'vm.Testtype.testdescription',
                                                'label'=>'Test<br/>Description',
                                                'placeholder'=>'Enter Description'
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-4">
                                    <?php require_once('../includes/table-basic.php');
                                        print selectColTemplate(
                                            array(
                                                'field'=>'ranktype',
                                                'model'=>'vm.Testtype.ranktype',
                                                'label'=>'Rank<br/>Type',
                                                'placeholder'=>'Select',
                                                'required'=>true,
                                                'form'=>'editschedule2',
                                                'repeatmodel'=>'vm.rankTypes',
                                                'repeatvalue'=>'value',
                                                'repeatid'=>'value'
                                                )
                                        );
                                    ?>
                                </div>
                            </div>
                            <div class="col-md-1 btn" style="margin-top: 18px;">
                                <?php require_once('../includes/table-basic.php');
                                        print btnColTemplate(
                                            array(
                                                'field'=>'rankbtn',
                                                'label'=>'Add',
                                                'click'=>'vm.addTesttype(vm.Testtype)'
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

                <div class="panel-footer" >
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
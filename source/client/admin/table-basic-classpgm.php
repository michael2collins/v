<div ng-controller="ClassPgmTableBasicController as vm">

    <div class="portlet box portlet-green">
        <div class="portlet-header">
                <div class="caption">Maintain Class Program</div>
                <div class="tools"><i class="fa fa-chevron-up"></i></div>
        </div>
      <div class="portlet-body pbn ptl" style="display: block;   background-color: grey;">
            <div class="panel panel-blue">
                <div class="panel-heading">Class Program</div>
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
<!-- classid, pgmid, pgmcat, classcat, agecat -->                    
            <div class="col-md-12" style="height: 88px;">
                <form action="" novalidate name="editClassPgm2" class="form-horizontal">
                                <div class="col-md-1">
                                    <?php require_once('../includes/table-basic.php');
                                        print selectColTemplate(
                                            array(
                                                'field'=>'classid',
                                                'model'=>'vm.ClassPgm.classid',
                                                'label'=>'Class<br/>&nbsp;',
                                                'placeholder'=>'Select',
                                                'required'=>false,
                                                'form'=>'editClassPgm2',
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
                                                'field'=>'pgmid',
                                                'model'=>'vm.ClassPgm.pgmid',
                                                'label'=>'Program<br/>&nbsp;',
                                                'placeholder'=>'Select',
                                                'required'=>false,
                                                'form'=>'editClassPgm2',
                                                'repeatmodel'=>'vm.programs',
                                                'repeatvalue'=>'value',
                                                'repeatid'=>'id'
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-1">
                                    <?php require_once('../includes/table-basic.php');
                                        print selectColTemplate(
                                            array(
                                                'field'=>'nextClassid',
                                                'model'=>'vm.ClassPgm.nextClassid',
                                                'label'=>'Next<br/>Class;',
                                                'placeholder'=>'Select',
                                                'required'=>false,
                                                'form'=>'editClassPgm2',
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
                                                'field'=>'nextPgmid',
                                                'model'=>'vm.ClassPgm.nextPgmid',
                                                'label'=>'Next<br/>Program;',
                                                'placeholder'=>'Select',
                                                'required'=>false,
                                                'form'=>'editClassPgm2',
                                                'repeatmodel'=>'vm.programs',
                                                'repeatvalue'=>'value',
                                                'repeatid'=>'id'
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-1">
                                    <?php require_once('../includes/table-basic.php');
                                        print selectColTemplate(
                                            array(
                                                'field'=>'pgmcat',
                                                'model'=>'vm.ClassPgm.pgmcat',
                                                'label'=>'Program<br/>Category',
                                                'placeholder'=>'Select',
                                                'required'=>false,
                                                'form'=>'editClassPgm2',
                                                'repeatmodel'=>'vm.pgmcats',
                                                'repeatvalue'=>'value',
                                                'repeatid'=>'id'
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-1">
                                    <?php require_once('../includes/table-basic.php');
                                        print selectColTemplate(
                                            array(
                                                'field'=>'classcat',
                                                'model'=>'vm.ClassPgm.classcat',
                                                'label'=>'Class<br/>Category',
                                                'placeholder'=>'Select',
                                                'required'=>false,
                                                'form'=>'editClassPgm2',
                                                'repeatmodel'=>'vm.classcats',
                                                'repeatvalue'=>'value',
                                                'repeatid'=>'id'
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-1">
                                    <?php require_once('../includes/table-basic.php');
                                        print selectColTemplate(
                                            array(
                                                'field'=>'agecat',
                                                'model'=>'vm.ClassPgm.agecat',
                                                'label'=>'Age<br/>Category',
                                                'placeholder'=>'Select',
                                                'required'=>false,
                                                'form'=>'editClassPgm2',
                                                'repeatmodel'=>'vm.agecats',
                                                'repeatvalue'=>'value',
                                                'repeatid'=>'id'
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
                                                'click'=>'vm.addClassPgm(vm.ClassPgm)'
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
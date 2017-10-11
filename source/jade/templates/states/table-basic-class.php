<!DOCTYPE html>
<div ng-controller="ClassTableBasicController as vm">

    <div class="portlet box portlet-green">
        <div class="portlet-header">
                <div class="caption">Maintain Class</div>
                <div class="tools"><i class="fa fa-chevron-up"></i></div>
        </div>
      <div class="portlet-body pbn ptl" style="display: block;   background-color: grey;">
            <div class="panel panel-blue">
                <div class="panel-heading">Class</div>
                <div class="panel-body pan">
            <div class="col-md-12" style="height: 88px;">
                <form action="" novalidate name="editClass2" class="form-horizontal">
                            <div class="col-md-4">
                                <div class="col-md-6">
                                    <?php require_once('table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'class',
                                                'model'=>'vm.Class.class',
                                                'label'=>'Class<br/>&nbsp;',
                                                'placeholder'=>'Enter Name',
                                                'required'=>true
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-6">
                                    <?php require_once('table-basic.php');
                                        print selectColTemplate(
                                            array(
                                                'field'=>'registrationType',
                                                'model'=>'vm.Class.registrationType',
                                                'label'=>'Registration<br/>Type',
                                                'placeholder'=>'Select',
                                                'required'=>true,
                                                'form'=>'editClass2',
                                                'repeatmodel'=>'vm.rankTypes',
                                                'repeatvalue'=>'ranktype',
                                                'repeatid'=>'ranktype'
                                                )
                                        );
                                    ?>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="col-md-3">
                                    <?php require_once('table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'nextclass',
                                                'model'=>'vm.Class.nextclass',
                                                'label'=>'Next<br/> Class',
                                                'placeholder'=>'Enter',
                                                'required'=>false
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-3">
                                    <?php require_once('table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'ageForNextClass',
                                                'model'=>'vm.Class.ageForNextClass',
                                                'label'=>'Age for<br/>Next Class',
                                                'placeholder'=>0,
                                                'required'=>false,
                                                'fieldtype'=>'number'
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-3">
                                    <?php require_once('table-basic.php');
                                        print selectColTemplate(
                                            array(
                                                'field'=>'rankForNextClass',
                                                'model'=>'vm.Class.rankForNextClass',
                                                'label'=>'Rank For<br/>Next Class',
                                                'placeholder'=>'Select',
                                                'required'=>false,
                                                'form'=>'editClass2',
                                                'repeatmodel'=>'vm.rankTypes',
                                                'repeatvalue'=>'ranktype',
                                                'repeatid'=>'ranktype'
                                                )
                                        );
                                    ?>
                                </div>
                            </div>
                            <div class="col-md-1">
                                <?php require_once('table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'sort',
                                                'model'=>'vm.Class.sort',
                                                'label'=>'Sort<br/> Order',
                                                'placeholder'=>'',
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
                                                'click'=>'vm.addClass(vm.Class)'
                                                )
                                        );
                                ?>
                            </div>
                </form>
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
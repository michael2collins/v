<!DOCTYPE html>
<div ng-controller="ProgramTableBasicController as vm">

    <div class="portlet box portlet-green">
        <div class="portlet-header">
                <div class="caption">Maintain Program</div>
                <div class="tools"><i class="fa fa-chevron-up"></i></div>
        </div>
      <div class="portlet-body pbn ptl" style="display: block;   background-color: grey;">
            <div class="panel panel-blue">
                <div class="panel-heading">Program</div>
                <div class="panel-body pan">
            <div class="col-md-12" style="height: 88px;">
                <form action="" novalidate name="editschedule2" class="form-horizontal">
                            <div class="col-md-2">
                                <div class="col-md-6">
                                    <?php require_once('table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'class',
                                                'model'=>'vm.program.class',
                                                'label'=>'Program<br/>&nbsp;',
                                                'placeholder'=>'Enter Name',
                                                'required'=>'true'
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-6">
                                    <?php require_once('table-basic.php');
//    'classtype', 'vm.program.classType', 'Class<br/> Type', 'Select', true, 'editschedule2', 'vm.classTypes', 'value', 'value'

                                        print selectColTemplate(
                                            array(
                                                'field'=>'classtype',
                                                'model'=>'vm.program.classType',
                                                'label'=>'Class<br/>Type',
                                                'placeholder'=>'Select',
                                                'required'=>'true',
                                                'form'=>'editschedule2',
                                                'repeatmodel'=>'vm.classTypes',
                                                'repeatvalue'=>'value',
                                                'repeatid'=>'value'
                                                )
                                        );
                                    ?>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="col-md-3">
                                    <?php require_once('table-basic.php');
//                                            'WeeklyPrice', 'vm.program.WeeklyPrice', 'Weekly Price', '0', true, 'number'
                                        print strColTemplate(
                                            array(
                                                'field'=>'WeeklyPrice',
                                                'model'=>'vm.program.WeeklyPrice',
                                                'label'=>'Weekly<br/> Price',
                                                'placeholder'=>0,
                                                'required'=>'true',
                                                'fieldtype'=>'number'
                                                )
                                        );
                                        
                                    ?>
                                </div>
                                <div class="col-md-3">
                                    <?php require_once('table-basic.php');
//                                            'MonthlyPrice', 'vm.program.MonthlyPrice', 'Monthly Price', '0', true, 'number'
                                        print strColTemplate(
                                            array(
                                                'field'=>'MonthlyPrice',
                                                'model'=>'vm.program.MonthlyPrice',
                                                'label'=>'Monthly<br/> Price',
                                                'placeholder'=>0,
                                                'required'=>'true',
                                                'fieldtype'=>'number'
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-3">
                                    <?php require_once('table-basic.php');
//                                            '_6MonthPrice', 'vm.program._6MonthPrice', '6 Month Price', '0', true, 'number'
                                        print strColTemplate(
                                            array(
                                                'field'=>'_6MonthPrice',
                                                'model'=>'vm.program._6MonthPrice',
                                                'label'=>'6 Month<br/> Factor',
                                                'placeholder'=>0,
                                                'required'=>'true',
                                                'fieldtype'=>'number'
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-3">
                                    <?php require_once('table-basic.php');
//                                            '_12MonthPrice', 'vm.program._12MonthPrice', '12 Month Price', '0', true, 'number'
                                        print strColTemplate(
                                            array(
                                                'field'=>'_12MonthPrice',
                                                'model'=>'vm.program._12MonthPrice',
                                                'label'=>'12 Month<br/> Factor',
                                                'placeholder'=>0,
                                                'required'=>'true',
                                                'fieldtype'=>'number'
                                                )
                                        );
                                    ?>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="col-md-3">
                                    <?php require_once('table-basic.php');
//                                            '_2ndPersonDiscount', 'vm.program._2ndPersonDiscount', '2nd Person Discount', '0', true, 'number'
                                        print strColTemplate(
                                            array(
                                                'field'=>'_2ndPersonDiscount',
                                                'model'=>'vm.program._2ndPersonDiscount',
                                                'label'=>'2nd Person<br/> Discount',
                                                'placeholder'=>0,
                                                'required'=>'true',
                                                'fieldtype'=>'number'
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-3">
                                    <?php require_once('table-basic.php');
//                                            '_3rdPersonDiscount', 'vm.program._3rdPersonDiscount', '3rd Person Discount', '0', true, 'number'
                                        print strColTemplate(
                                            array(
                                                'field'=>'_3rdPersonDiscount',
                                                'model'=>'vm.program._3rdPersonDiscount',
                                                'label'=>'3rd Person<br/> Discount',
                                                'placeholder'=>0,
                                                'required'=>'true',
                                                'fieldtype'=>'number'
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-3">
                                    <?php require_once('table-basic.php');
//                                            '_4thPersonDiscount', 'vm.program._4thPersonDiscount', '4th Person Discount', '0', true, 'number'
                                        print strColTemplate(
                                            array(
                                                'field'=>'_4thPersonDiscount',
                                                'model'=>'vm.program._4thPersonDiscount',
                                                'label'=>'4th Person<br/> Discount',
                                                'placeholder'=>0,
                                                'required'=>'true',
                                                'fieldtype'=>'number'
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-3">
                                    <?php require_once('table-basic.php');
//                                            'SpecialPrice', 'vm.program.SpecialPrice', 'Special Price', '0', true, 'number'
                                        print strColTemplate(
                                            array(
                                                'field'=>'SpecialPrice',
                                                'model'=>'vm.program.SpecialPrice',
                                                'label'=>'Special<br/> Price',
                                                'placeholder'=>0,
                                                'required'=>'true',
                                                'fieldtype'=>'number'
                                                )
                                        );
                                    ?>
                                </div>
                            </div>
                            <div class="col-md-1">
                                <?php require_once('table-basic.php');
//                                        'sortKey', 'vm.program.sortKey', 'Sort Order', '', true, 'number'
                                        print strColTemplate(
                                            array(
                                                'field'=>'sortKey',
                                                'model'=>'vm.program.sortKey',
                                                'label'=>'Sort<br/> Order',
                                                'placeholder'=>'',
                                                'required'=>'true',
                                                'fieldtype'=>'number'
                                                )
                                        );
                                ?>
                            </div>
                            <div class="col-md-1 btn" style="margin-top: 18px;">
                                <?php require_once('table-basic.php');
//                                        'rankbtn', 'vm.updateProgram(vm.program)', 'Add', 'green', 'fa-plus'
                                        print btnColTemplate(
                                            array(
                                                'field'=>'rankbtn',
                                                'label'=>'Add',
                                                'click'=>'vm.updateProgram(vm.program)'
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
                        ui-grid-edit class="mygrid" ng-style="vm.getGridLength()" >
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>
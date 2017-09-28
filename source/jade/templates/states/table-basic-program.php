<!DOCTYPE html>
<div ng-controller="ProgramTableBasicController as vm">
    <div class="portlet box portlet-green">
        <div class="portlet-header">
            <div class="row">
                <div class="caption">Maintain Program</div>
            </div>
        </div>
        <div class="portlet-body">
            <div class="panel panel-blue">
                <div class="panel-heading">Program</div>
                <div class="panel-body pan">
            <div class="col-md-12" style="height: 88px;">
                <form action="" novalidate name="editschedule2" class="form-horizontal">
                            <div class="col-md-2">
                                <div class="col-md-6">
                                    <?php require_once('table-basic.php');
                                        print selectColTemplate(
                                            'classtype', 'vm.program.classType', 'Class Type', 'Select', true, 'editschedule2', 'vm.classTypes', 'value', 'value'
                                        );
                                    ?>
                                </div>
                                <div class="col-md-6">
                                    <?php require_once('table-basic.php');
                                        print strColTemplate(
                                            'class', 'vm.program.class', 'Class', 'Enter name', true, 'text'
                                        );
                                    ?>
                                </div>
                            </div>
                            <div class="col-md-5">
                                <div class="col-md-2">
                                    <?php require_once('table-basic.php');
                                        print strColTemplate(
                                            '_12MonthPrice', 'vm.program._12MonthPrice', '12 Month Price', '0', true, 'number'
                                        );
                                    ?>
                                </div>
                                <div class="col-md-2">
                                    <?php require_once('table-basic.php');
                                        print strColTemplate(
                                            '_6MonthPrice', 'vm.program._6MonthPrice', '6 Month Price', '0', true, 'number'
                                        );
                                    ?>
                                </div>
                                <div class="col-md-2">
                                    <?php require_once('table-basic.php');
                                        print strColTemplate(
                                            'MonthlyPrice', 'vm.program.MonthlyPrice', 'Monthly Price', '0', true, 'number'
                                        );
                                    ?>
                                </div>
                                <div class="col-md-2">
                                    <?php require_once('table-basic.php');
                                        print strColTemplate(
                                            'WeeklyPrice', 'vm.program.WeeklyPrice', 'Weekly Price', '0', true, 'number'
                                        );
                                    ?>
                                </div>
                                <div class="col-md-2">
                                    <?php require_once('table-basic.php');
                                        print strColTemplate(
                                            'SpecialPrice', 'vm.program.SpecialPrice', 'Special Price', '0', true, 'number'
                                        );
                                    ?>
                                </div>
                            </div>
                            <div class="col-md-1">
                                <?php require_once('table-basic.php');
                                    print strColTemplate(
                                        'sortKey', 'vm.program.sortKey', 'Sort Order', '', true, 'number'
                                    );
                                ?>
                            </div>
                            <div class="col-md-3">
                                <div class="col-md-4">
                                    <?php require_once('table-basic.php');
                                        print strColTemplate(
                                            '_2ndPersonDiscount', 'vm.program._2ndPersonDiscount', '2nd Person Discount', '0', true, 'number'
                                        );
                                    ?>
                                </div>
                                <div class="col-md-4">
                                    <?php require_once('table-basic.php');
                                        print strColTemplate(
                                            '_3rdPersonDiscount', 'vm.program._3rdPersonDiscount', '3rd Person Discount', '0', true, 'number'
                                        );
                                    ?>
                                </div>
                                <div class="col-md-4">
                                    <?php require_once('table-basic.php');
                                        print strColTemplate(
                                            '_4thPersonDiscount', 'vm.program._4thPersonDiscount', '4th Person Discount', '0', true, 'number'
                                        );
                                    ?>
                                </div>
                                
                            </div>
                            <div class="col-md-1 btn" style="margin-top: 18px;">
                                <?php require_once('table-basic.php');
                                    print btnColTemplate(
                                        'rankbtn', 'vm.updateProgram(vm.program)', 'Add', 'green', 'fa-plus'
                                    );
                                ?>
                            </div>
                </form>
            </div>
                    
                </div>
                <div class="panel-footer">
                    <div ui-grid="vm.gridOptions"  
                    ui-grid-pagination 
                    ui-grid-cellNav  
                    ui-grid-pinning 
                    ui-grid-move-columns 
                    ui-grid-exporter 
                    ui-grid-edit class="mygrid">
<!--                        <div class="watermark" ng-show="!vm.gridOptions.data.length">No data available</div>
-->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
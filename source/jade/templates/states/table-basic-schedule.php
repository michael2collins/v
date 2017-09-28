<!DOCTYPE html>
<div ng-controller="ScheduleTableBasicController as vm">
    <div class="portlet box portlet-green">
        <div class="portlet-header">
            <div class="row">
                <div class="caption">Maintain Schedule</div>
            </div>
        </div>
        <div class="portlet-body">
            <div class="panel panel-blue">
                <div class="panel-heading">Schedule</div>
                <div class="panel-body pan">
            <div class="col-md-12" style="height: 88px;">
                <form action="" novalidate name="editschedule2" class="form-horizontal">
                            <div class="col-md-3">
                                <div class="col-md-4">
                                    <?php require_once('table-basic.php');
                                        print selectColTemplate(
                                            'dow', 'vm.schedule.dow', 'Day Of Week', 'Select', true, 'editschedule2', 'vm.weekschedule', 'value', 'value'
                                        );
                                    ?>
                                </div>
                                <div class="col-md-4">
                                    <?php require_once('table-basic.php');
                                        print strColTemplate(
                                            'timerange', 'vm.schedule.timerange', 'Time Range', '0:00AM to 0:00', true, 'text'
                                        );
                                    ?>
                                </div>
                                <div class="col-md-4">
                                    <?php require_once('table-basic.php');
                                        print strColTemplate(
                                            'agerange', 'vm.schedule.agerange', 'Age Range', 'All Ages', true, 'text'
                                        );
                                    ?>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <?php require_once('table-basic.php');
                                    print strColTemplate(
                                        'description', 'vm.schedule.description', 'Description', 'Enter Class Name', true, 'text'
                                    );
                                ?>
                            </div>
                            <div class="col-md-2">
                                <?php require_once('table-basic.php');
                                    print selectColTemplate(
                                        'classid', 'vm.schedule.classid', 'Class', 'Select', true, 'editschedule2', 'vm.classhashlist', 'value', 'id'
                                    );
                                ?>
                            </div>
                            <div class="col-md-2">
                                <div class="col-md-6" style="margin-top: -10px;">
                                    <?php require_once('table-basic.php');
                                        print timepickerColTemplate(
                                            '1', '5', 'false', 'vm.schedule.startT', true
                                        );
                                    ?>
                                </div>
                                <div class="col-md-6" style="margin-top: -10px;">
                                    <?php require_once('table-basic.php');
                                        print timepickerColTemplate(
                                            '1', '5', 'false', 'vm.schedule.endT', true
                                        );
                                    ?>
                                </div>
                            </div>
                            <div class="col-md-1">
                                <?php require_once('table-basic.php');
                                    print toggleSwitchColTemplate(
                                        'TakeAttendance', 'vm.schedule.TakeAttendance', 'Take Attendance?', false, 'editschedule2', 'Yes', 'No'
                                    );
                                ?>
                            </div>
                            <div class="col-md-1">
                                <?php require_once('table-basic.php');
                                    print strColTemplate(
                                        'sortorder', 'vm.schedule.sortorder', 'Sort Order', '', true, 'number'
                                    );
                                ?>
                            </div>
                            <div class="col-md-1 btn" style="margin-top: 18px;">
                                <?php require_once('table-basic.php');
                                    print btnColTemplate(
                                        'rankbtn', 'vm.updSchedule(vm.schedule)', 'Add', 'green', 'fa-plus'
                                    );
                                ?>
                            </div>
                </form>
            </div>
                
                </div>
                <div class="panel-footer">

                    <div ui-grid="vm.gridOptions"  ui-grid-pagination ui-grid-cellNav  ui-grid-pinning ui-grid-selection ui-grid-move-columns ui-grid-exporter ui-grid-edit class="mygrid">
                        <div class="watermark" ng-show="!vm.gridOptions.data.length">No data available</div>
                    </div>
                    
                    
                </div>
            </div>
        </div>
    </div>
</div>
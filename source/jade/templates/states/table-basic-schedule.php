<!DOCTYPE html>
<div ng-controller="ScheduleTableBasicController as vm">
    <div class="portlet box portlet-green">
        <div class="portlet-header">
            <div class="row">
                <div class="caption">Maintain Schedule</div>
                <div class="tools"><i class="fa fa-chevron-up"></i></div>
            </div>
        </div>
        <div class="portlet-body">
            <div class="panel panel-blue">
                <div class="panel-heading">Schedule</div>
                <div class="panel-body pan">
            <div class="col-md-12" style="height: 110px;">
                <form action="" novalidate name="editschedule2" class="form-horizontal">
                            <div class="col-md-3">
                                <div class="col-md-4">
                                    <?php require_once('table-basic.php');
//   'dow', 'vm.schedule.dow', 'Day Of Week', 'Select', true, 'editschedule2', 'vm.weekschedule', 'value', 'value'
                                        print selectColTemplate(
                                            array(
                                                'field'=>'dow',
                                                'model'=>'vm.schedule.dow',
                                                'label'=>'Day of<br/>Week',
                                                'placeholder'=>'Select',
                                                'required'=>true,
                                                'form'=>'editschedule2',
                                                'repeatmodel'=>'vm.weekschedule',
                                                'repeatvalue'=>'value',
                                                'repeatid'=>'value'
                                                )
                                        );
                                        
                                    ?>
                                </div>
                                <div class="col-md-4">
                                    <?php require_once('table-basic.php');
//'timerange', 'vm.schedule.timerange', 'Time Range', '0:00AM to 0:00', true, 'text'
                                        print strColTemplate(
                                            array(
                                                'field'=>'timerange',
                                                'model'=>'vm.schedule.timerange',
                                                'label'=>'Time<br/>Range',
                                                'placeholder'=>'0:00AM to 0:00',
                                                'required'=>true
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-4">
                                    <?php require_once('table-basic.php');
//'agerange', 'vm.schedule.agerange', 'Age Range', 'All Ages', true, 'text'
                                        print strColTemplate(
                                            array(
                                                'field'=>'agerange',
                                                'model'=>'vm.schedule.agerange',
                                                'label'=>'Age<br/>Range',
                                                'placeholder'=>'All Ages ',
                                                'required'=>true
                                                )
                                        );
                                    ?>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="col-md-6">
                                    <?php require_once('table-basic.php');
    //'classid', 'vm.schedule.classid', 'Class', 'Select', true, 'editschedule2', 'vm.classhashlist', 'value', 'id'
                                            print selectColTemplate(
                                                array(
                                                    'field'=>'classid',
                                                    'model'=>'vm.schedule.classid',
                                                    'label'=>'Class<br/>&nbsp;',
                                                    'placeholder'=>'Select',
                                                    'required'=>true,
                                                    'changefunction'=>'vm.changeclass()',
                                                    'form'=>'editschedule2',
                                                    'repeatmodel'=>'vm.classhashlist',
                                                    'repeatvalue'=>'value',
                                                    'repeatid'=>'id'
                                                    )
                                            );
                                    ?>
                                </div>
                                <div class="col-md-6">
                                    <?php require_once('table-basic.php');
    //'description', 'vm.schedule.description', 'Description', 'Enter Class Name', true, 'text'
                                            print strColTemplate(
                                                array(
                                                    'field'=>'description',
                                                    'model'=>'vm.schedule.description',
                                                    'label'=>'Description<br/>&nbsp;',
                                                    'placeholder'=>'Enter Class Name',
                                                    'required'=>true
                                                    )
                                            );
                                    ?>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="col-md-6" style="margin-top: 10px;">
                                    <?php require_once('table-basic.php');
                                        print timepickerColTemplate(
                                            array(
                                                'field'=>'startT',
                                                'model'=>'vm.schedule.startT',
                                                'required'=>true
                                            )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-6" style="margin-top: 10px;">
                                    <?php require_once('table-basic.php');
                                        print timepickerColTemplate(
                                            array(
                                                'field'=>'endT',
                                                'model'=>'vm.schedule.endT',
                                                'required'=>true
                                            )
                                        );
                                    ?>
                                </div>
                            </div>
                            <div class="col-md-1">
                                <?php require_once('table-basic.php');
//                                        'TakeAttendance', 'vm.schedule.TakeAttendance', 'Take Attendance?', false, 'editschedule2', 'Yes', 'No'
                                    print toggleSwitchColTemplate(
                                            array(
                                                'field'=>'TakeAttendance',
                                                'model'=>'vm.schedule.TakeAttendance',
                                                'label'=>'Take<br/>Attendance',
                                                'required'=>true,
                                                'form'=>'editschedule2'
                                                )
                                    );
                                ?>
                            </div>
                            <div class="col-md-1">
                                <?php require_once('table-basic.php');
//'sortorder', 'vm.schedule.sortorder', 'Sort Order', '', true, 'number'
                                        print strColTemplate(
                                            array(
                                                'field'=>'sortorder',
                                                'model'=>'vm.schedule.sortorder',
                                                'label'=>'Sort<br/>Order',
                                                'placeholder'=>'',
                                                'required'=>true,
                                                'fieldtype'=>'number'
                                                )
                                        );
                                ?>
                            </div>
                            <div class="col-md-1 btn" style="margin-top: 36px;">
                                <?php require_once('table-basic.php');
                                    print btnColTemplate(
                                        array(
                                            'field'=>'rankbtn',
                                            'label'=>'Add',
                                            'click'=>'vm.updSchedule(vm.schedule)'
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
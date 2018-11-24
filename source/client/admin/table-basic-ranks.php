<div ng-controller="RankTableBasicController as vm">

    <div class="portlet box portlet-green">
        <div class="portlet-header">
                <div class="caption">Maintain Rank</div>
                <div class="tools"><i class="fa fa-chevron-up"></i></div>
        </div>
      <div class="portlet-body pbn ptl" style="display: block;   background-color: grey;">
            <div class="panel panel-blue">
                <div class="panel-heading">Rank</div>
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
<!--ranktype, rankid, ranklist, sortkey, rankGroup, alphasortkey, AttendPromoteTarget, DurationPromoteTarget, school, nextsortkey          -->                           
                <form action="" novalidate name="editschedule2" class="form-horizontal">
                            <div class="col-md-3">
                                <div class="col-md-4">
                                    <?php require_once('../includes/table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'ranklist',
                                                'model'=>'vm.Rank.ranklist',
                                                'label'=>'Rank<br/>&nbsp;',
                                                'placeholder'=>'Enter Name',
                                                'required'=>true
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-4">
                                    <?php require_once('../includes/table-basic.php');
                                        print selectColTemplate(
                                            array(
                                                'field'=>'ranktype',
                                                'model'=>'vm.Rank.ranktype',
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
                                <div class="col-md-4">
                                    <?php require_once('../includes/table-basic.php');
                                        print selectColTemplate(
                                            array(
                                                'field'=>'rankGroup',
                                                'model'=>'vm.Rank.rankGroup',
                                                'label'=>'Rank<br/>Group',
                                                'placeholder'=>'Select',
                                                'required'=>true,
                                                'form'=>'editschedule2',
                                                'repeatmodel'=>'vm.rankGroups',
                                                'repeatvalue'=>'value',
                                                'repeatid'=>'value'
                                                )
                                        );
                                    ?>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <div class="col-md-2">
                                    <?php require_once('../includes/table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'AttendPromoteTarget',
                                                'model'=>'vm.Rank.AttendPromoteTarget',
                                                'label'=>'Attendance<br/>Promotion Target',
                                                'placeholder'=>0,
                                                'required'=>true,
                                                'fieldtype'=>'number'
                                                )
                                        );
                                        
                                    ?>
                                </div>
                                <div class="col-md-2">
                                    <?php require_once('../includes/table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'DurationPromoteTarget',
                                                'model'=>'vm.Rank.DurationPromoteTarget',
                                                'label'=>'Duration<br/>Promotion Target',
                                                'placeholder'=>0,
                                                'required'=>true,
                                                'fieldtype'=>'number'
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-2">
                                    <?php require_once('../includes/table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'sortkey',
                                                'model'=>'vm.Rank.sortkey',
                                                'label'=>'Sort<br/> Key',
                                                'placeholder'=>0,
                                                'required'=>true,
                                                'fieldtype'=>'number'
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-2">
                                    <?php require_once('../includes/table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'nextsortkey',
                                                'model'=>'vm.Rank.nextsortkey',
                                                'label'=>'Next Sort<br/> Key',
                                                'placeholder'=>0,
                                                'required'=>true,
                                                'fieldtype'=>'number'
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-2">
                                    <?php require_once('../includes/table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'alphasortkey',
                                                'model'=>'vm.Rank.alphasortkey',
                                                'label'=>'Alphabetic<br/> Sortkey',
                                                'placeholder'=>'text',
                                                'required'=>true
                                                )
                                        );
                                    ?>
                                </div>
                            </div>
                            <div class="col-md-1 btn" style="margin-top: 18px;">
                                <?php require_once('../includes/table-basic.php');
//                                        'rankbtn', 'vm.updateRank(vm.Rank)', 'Add', 'green', 'fa-plus'
                                        print btnColTemplate(
                                            array(
                                                'field'=>'rankbtn',
                                                'label'=>'Add',
                                                'click'=>'vm.addRank(vm.Rank)'
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
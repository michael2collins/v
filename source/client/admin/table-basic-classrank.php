<div ng-controller="ClassRankTableBasicController as vm">

    <div class="portlet box portlet-green">
        <div class="portlet-header">
                <div class="caption">Maintain Class Rank</div>
                <div class="tools"><i class="fa fa-chevron-up"></i></div>
        </div>
      <div class="portlet-body pbn ptl" style="display: block;   background-color: grey;">
            <div class="panel panel-blue">
                <div class="panel-heading">Class Rank</div>
                <div class="control-label attendance">Select Ranks by Rank Type</div>
                <div class="col-md-6">
                    <?php require_once('../includes/table-basic.php');
                        print selectColTemplate(
                            array(
                                'field'=>'rankType',
                                'model'=>'vm.ClassRank.rankType',
                                'label'=>'Rank<br/>Type',
                                'placeholder'=>'Select',
                                'required'=>true,
                                'form'=>'editClassRank2',
                                'changefunction'=>'vm.changeRanktype()',
                                'repeatmodel'=>'vm.rankTypes',
                                'repeatvalue'=>'value',
                                'repeatid'=>'id'
                                )
                        );
                    ?>
                </div>
                
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
<!-- classid, rankid -->                    
            <div class="col-md-12" style="height: 88px;">
                <form action="" novalidate name="editClassRank2" class="form-horizontal">
                                <div class="col-md-2">
                                    <?php require_once('../includes/table-basic.php');
                                        print selectColTemplate(
                                            array(
                                                'field'=>'classid',
                                                'model'=>'vm.ClassRank.classid',
                                                'label'=>'Class<br/>&nbsp;',
                                                'placeholder'=>'Select',
                                                'required'=>false,
                                                'form'=>'editClassRank2',
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
                                                'field'=>'rankid',
                                                'model'=>'vm.ClassRank.rankid',
                                                'label'=>'Rank<br/>&nbsp;',
                                                'placeholder'=>'Select',
                                                'required'=>false,
                                                'form'=>'editClassRank2',
                                                'repeatmodel'=>'vm.Ranks',
                                                'repeatvalue'=>'label',
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
                                                'click'=>'vm.addClassRank(vm.ClassRank)'
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
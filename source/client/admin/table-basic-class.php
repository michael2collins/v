<div ng-controller="ClassTableBasicController as $ctrl" ng-cloak> 
    <div class="portlet box portlet-green">
        <div class="portlet-header">
                <div class="caption">Maintain Class</div>
                <div class="tools"><i class="fa fa-chevron-up"></i></div>
        </div>
      <div class="portlet-body pbn ptl" style="display: block;   background-color: grey;">
            <div class="panel panel-blue">
                <div class="panel-heading">Class</div>
                <div class="control-label attendance">Filter by Registration Type</div>
                <div class="col-md-6">
                    <?php require_once('../includes/table-basic.php');
                        print selectColTemplate(
                            array(
                                'field'=>'registrationType',
                                'model'=>'$ctrl.Class.registrationType',
                                'label'=>'Registration<br/>Type',
                                'placeholder'=>'Select',
                                'required'=>true,
                                'form'=>'editClass2',
                                'changefunction'=>'$ctrl.changeRanktype()',
                                'repeatmodel'=>'$ctrl.rankTypes',
                                'repeatvalue'=>'value',
                                'repeatid'=>'id'
                                )
                        );
                    ?>
                </div>

                <div class="panel-body pan">
                    <div class="table-tools">
                        <div class="row col-md-offset-10 mbs">
                            <button type="button" class="btn btn-blue mrs mts" 
                                ng-click="$ctrl.isCollapsed = !$ctrl.isCollapsed">{{ $ctrl.isCollapsed ? 'New' : 'Collapse'}}</button>
                        </div>
                    </div>
                  	<div uib-collapse="$ctrl.isCollapsed">
                		<div class="well well-lg">
                            <div class="container-fluid"> 
                                <div class="container-xl" >
                    
            <div class="col-md-12" style="height: 88px;">
                <form action="" novalidate name="editClass2" class="form-horizontal">
                            <div class="col-md-2">
                                <div class="col-md-12">
                                    <?php require_once('../includes/table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'class',
                                                'model'=>'$ctrl.Class.class',
                                                'label'=>'Class<br/>&nbsp;',
                                                'placeholder'=>'Enter Name',
                                                'required'=>true
                                                )
                                        );
                                    ?>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="col-md-4">
                                    <?php require_once('../includes/table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'nextclass',
                                                'model'=>'$ctrl.Class.nextclass',
                                                'label'=>'Next<br/> Class',
                                                'placeholder'=>'Enter',
                                                'required'=>false
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-2">
                                    <?php require_once('../includes/table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'ageForNextClass',
                                                'model'=>'$ctrl.Class.ageForNextClass',
                                                'label'=>'Age for<br/>Next Class',
                                                'placeholder'=>0,
                                                'required'=>false,
                                                'fieldtype'=>'number'
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-3">
                                    <?php require_once('../includes/table-basic.php');
                                        print selectColTemplate(
                                            array(
                                                'field'=>'ranklistForNextClass',
                                                'model'=>'$ctrl.Class.ranklistForNextClass',
                                                'label'=>'Type of<br/>Next Class',
                                                'placeholder'=>'Select',
                                                'required'=>false,
                                                'form'=>'editClass2',
                                                'changefunction'=>'$ctrl.changeRanklisttype()',
                                                'repeatmodel'=>'$ctrl.rankTypes',
                                                'repeatvalue'=>'value',
                                                'repeatid'=>'id'
                                                )
                                        );
                                    ?>
                                </div>
                                <div class="col-md-3">
                                    <?php require_once('../includes/table-basic.php');
                                        print selectColTemplate(
                                            array(
                                                'field'=>'rankForNextClass',
                                                'model'=>'$ctrl.Class.rankForNextClass',
                                                'label'=>'Rank For<br/>Next Class',
                                                'placeholder'=>'Select',
                                                'required'=>false,
                                                'form'=>'editClass2',
                                                'repeatmodel'=>'$ctrl.ranks',
                                                'repeatvalue'=>'label',
                                                'repeatid'=>'value'
                                                )
                                        );
                                    ?>
                                </div>
                            </div>
                            <div class="col-md-1">
                                <?php require_once('../includes/table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'sort',
                                                'model'=>'$ctrl.Class.sort',
                                                'label'=>'Sort<br/> Order',
                                                'placeholder'=>'',
                                                'required'=>true,
                                                'fieldtype'=>'number'
                                                )
                                        );
                                ?>
                            </div>
                            <div class="col-md-2">
                                <?php require_once('../includes/table-basic.php');
                                        print btnColTemplate(
                                            array(
                                                'field'=>'picbtn',
                                                'label'=>'Set Photo',
                                                'click'=>'$ctrl.setPhoto($ctrl.Class)'
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
                                                'click'=>'$ctrl.addClass($ctrl.Class)'
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
                    <div ui-grid="$ctrl.gridOptions"  
                        ui-if="$ctrl.gridOptions.data.length>0"
                        ui-grid-pagination 
                        ui-grid-cellNav  
                        ui-grid-pinning  
                        ui-grid-move-columns 
                        ui-grid-exporter 
                        ui-grid-auto-resize
                        ui-grid-resize-columns
                        ui-grid-edit class="mygrid" ng-style="$ctrl.getGridLength()" >
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>
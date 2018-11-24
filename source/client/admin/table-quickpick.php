<div ng-controller="QuickPickController as $ctrl" ng-cloak> 

    <div class="portlet box portlet-green">
        <div class="portlet-header">
                <div class="caption">Maintain Quick Picks</div>
                <div class="tools"><i class="fa fa-chevron-up"></i></div>
        </div>
      <div class="portlet-body pbn ptl" style="display: block;   background-color: grey;">
            <div class="panel panel-blue">
                <div class="panel-heading">Quick Pick</div>
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
                                        <!-- ranktype rank class program paytype amt plan dayofm -->
                                        <form action="" novalidate name="editschedule2" class="form-horizontal">
                                            <div class="col-md-3">
                                                <?php require_once('../includes/table-basic.php');
                                                    print selectColTemplate(
                                                        array(
                                                            'field'=>'listtype',
                                                            'model'=>'$ctrl.QuickPick.listtype',
                                                            'label'=>'List<br/>Type',
                                                            'placeholder'=>'Select',
                                                            'required'=>true,
                                                            'form'=>'editschedule2',
                                                            'repeatmodel'=>'$ctrl.listTypes',
                                                            'repeatvalue'=>'value',
                                                            'repeatid'=>'value'
                                                            )
                                                    );
                                                ?>
                                            </div>
                                            <div class="col-md-3">
                                                <?php require_once('../includes/table-basic.php');
                                                    print strColTemplate(
                                                        array(
                                                            'field'=>'listkey',
                                                            'model'=>'$ctrl.QuickPick.listkey',
                                                            'label'=>'Key<br/>&nbsp;',
                                                            'placeholder'=>'Enter Key',
                                                            'required'=>true
                                                            )
                                                    );
                                                ?>
                                            </div>
                                            <div class="col-md-3">
                                                <?php require_once('../includes/table-basic.php');
                                                    print strColTemplate(
                                                        array(
                                                            'field'=>'listvalue',
                                                            'model'=>'$ctrl.QuickPick.listvalue',
                                                            'label'=>'Value<br/> &nbsp;',
                                                            'placeholder'=>0,
                                                            'required'=>true
                                                            )
                                                    );
                                                    
                                                ?>
                                            </div>
                                            <div class="col-md-2">
                                                <?php require_once('../includes/table-basic.php');
                                                    print strColTemplate(
                                                        array(
                                                            'field'=>'listorder',
                                                            'model'=>'$ctrl.QuickPick.listorder',
                                                            'label'=>'Order<br/> &nbsp;',
                                                            'placeholder'=>0,
                                                            'required'=>true,
                                                            'fieldtype'=>'number'
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
                                                            'click'=>'$ctrl.addBasic($ctrl.QuickPick)'
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
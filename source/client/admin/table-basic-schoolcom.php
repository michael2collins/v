<div ng-controller="SchoolcomTableBasicController as $ctrl" ng-cloak> 
    <div class="portlet box portlet-green">
        <div class="portlet-header">
                <div class="caption">Maintain School Communication options</div>
                <div class="tools"><i class="fa fa-chevron-up"></i></div>
        </div>
      <div class="portlet-body pbn ptl" style="display: block;   background-color: grey;">
            <div class="panel panel-blue">
                <div class="panel-heading">School Communication</div>

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

                            <div class="col-md-3">
                                <div class="col-md-12">
                                    <?php require_once('../includes/table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'schoolReplyEmail',
                                                'model'=>'$ctrl.Schoolcom.schoolReplyEmail',
                                                'label'=>'Reply<br/>&nbsp;Email',
                                                'placeholder'=>'Enter Email',
                                                'required'=>true
                                                )
                                        );
                                    ?>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <?php require_once('../includes/table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'schoolReplySignature',
                                                'model'=>'$ctrl.Schoolcom.schoolReplySignature',
                                                'label'=>'Reply<br/> Signature',
                                                'placeholder'=>'Enter text',
                                                'required'=>true
                                                )
                                        );
                                ?>
                            </div>
                            <div class="col-md-3">
                                <?php require_once('../includes/table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'invoicebatchenabled',
                                                'model'=>'$ctrl.Schoolcom.invoicebatchenabled',
                                                'label'=>'Invoice<br/> Enabled',
                                                'placeholder'=>'',
                                                'required'=>true
                                                )
                                        );
                                ?>
                            </div>
                            <div class="col-md-1 btn" style="margin-top: 18px;">
                                <?php require_once('../includes/table-basic.php');
                                        print btnColTemplate(
                                            array(
                                                'field'=>'thebtn',
                                                'label'=>'Add',
                                                'click'=>'$ctrl.addSchoolcom($ctrl.Schoolcom)'
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
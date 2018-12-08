<div ng-controller="QuickpickController as $ctrl" ng-cloak> 

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
        <div class="panel-footer" >
          <div class="control-label pam h4">Picklist</div>
                    <div ui-grid="$ctrl.pickgridOptions"  
                        ui-if="$ctrl.pickgridOptions.data.length>0"
                        ui-grid-selection
                        ui-grid-pagination 
                        ui-grid-cellNav  
                        ui-grid-auto-resize
                        ui-grid-resize-columns
                        ui-grid-edit class="mygrid" ng-style="$ctrl.getpickGridLength()" >
              <div class="watermark" ng-show="!$ctrl.pickgridOptions.data.length">No Pick Options available</div>
                    </div>
                    </div>
                    </div>

                                    <div class="col-md-12" style="height: 88px;">
                                        
                            <!-- ranktype rank class program paytype amt plan dayofm -->
                            <form action="" novalidate name="editschedule2" class="form-horizontal">

                                <div class="col-md-7">
                <!--class pgm classid pgmid ranktype ranklist rankid -->
                                    <div class="col-md-3">
                                        <?php require_once('../includes/table-basic.php');
                                            print strColTemplate(
                                                array(
                                                    'field'=>'description',
                                                    'model'=>'$ctrl.picklistpick[0].description',
                                                    'label'=>'Description<br/>&nbsp;',
                                                    'required'=>true,
                                                    'readonly'=>false
                                                    )
                                            );
                                        ?>
                                    </div>
                                    <div class="col-md-3">
                                        <?php require_once('../includes/table-basic.php');
                                            print strColTemplate(
                                                array(
                                                    'field'=>'ranktype',
                                                    'model'=>'$ctrl.picklistpick[0].ranktype',
                                                    'label'=>'Ranktype<br/>&nbsp;',
                                                    'required'=>true,
                                                    'readonly'=>true
                                                    )
                                            );
                                        ?>
                                    </div>
                                    <div class="col-md-2">
                                        <?php require_once('../includes/table-basic.php');
                                            print strColTemplate(
                                                array(
                                                    'field'=>'ranklist',
                                                    'model'=>'$ctrl.picklistpick[0].ranklist',
                                                    'label'=>'Rank<br/>&nbsp;',
                                                    'required'=>true,
                                                    'readonly'=>true
                                                    )
                                            );
                                        ?>
                                    </div>
                                    <div class="col-md-2">
                                        <?php require_once('../includes/table-basic.php');
                                            print strColTemplate(
                                                array(
                                                    'field'=>'class',
                                                    'model'=>'$ctrl.picklistpick[0].class',
                                                    'label'=>'Class<br/>&nbsp;',
                                                    'required'=>true,
                                                    'readonly'=>true
                                                    )
                                            );
                                        ?>
                                    </div>
                                    <div class="col-md-2">
                                        <?php require_once('../includes/table-basic.php');
                                            print strColTemplate(
                                                array(
                                                    'field'=>'pgm',
                                                    'model'=>'$ctrl.picklistpick[0].pgm',
                                                    'label'=>'Program<br/>&nbsp;',
                                                    'required'=>true,
                                                    'readonly'=>true
                                                    )
                                            );
                                        ?>
                                    </div>

                                </div>
                                <div class="col-md-1">
                                    <?php require_once('../includes/table-basic.php');
                                        print selectColTemplate(
                                            array(
                                                'field'=>'paymentPlan',
                                                'model'=>'$ctrl.picklistpick[0].paymentPlan',
                                                'label'=>'Payment<br/>Plan',
                                                'placeholder'=>'Select',
                                                'required'=>true,
                                                'form'=>'editschedule2',
                                                'repeatmodel'=>'$ctrl.PaymentPlans',
                                                'repeatvalue'=>'value',
                                                'repeatid'=>'value'
                                                )
                                        );
                                    ?>
                                </div>

                                <div class="col-md-1">
                                    <?php require_once('../includes/table-basic.php');
                                        print numtypeColTemplate(
                                            array(
                                                'field'=>'amt',
                                                'model'=>'$ctrl.amt',
                                                'label'=>'Amount<br/> &nbsp;',
                                                'formatter'=>'"$ctrl.formatter($modelValue,$filter,\'$0.00\');"',
                                                'modelformat'=>'currency',
                                                'required'=>true
                                                )
                                        );
                                        
                                    ?>
                                </div>
                                <div class="col-md-1">
                                    <?php require_once('../includes/table-basic.php');
                                        print numtypeColTemplate(
                                            array(
                                                'field'=>'payOnDayOfMonth',
                                                'model'=>'$ctrl.payOnDayOfMonth',
                                                'label'=>'Pay On<br/>&nbsp;',
                                                'formatter'=>'"$ctrl.formatter($modelValue,$filter,\'00\');"',
                                                'modelformat'=>'int',
                                                'required'=>true
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
                                                            'click'=>'$ctrl.addQuickpick($ctrl.picklistpick[0])'
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
              <div class="watermark" ng-show="!$ctrl.gridOptions.data.length">No Quickpicks available</div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>
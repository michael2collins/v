<div ng-controller="TemplateTableBasicController as vm">

    <div class="portlet box portlet-green">
        <div class="portlet-header">
                <div class="caption">Maintain Template</div>
                <div class="tools"><i class="fa fa-chevron-up"></i></div>
        </div>
      <div class="portlet-body pbn ptl" style="display: block;   background-color: grey;">
            <div class="panel panel-blue">
                <div class="panel-heading">Template</div>
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
                <form action="" novalidate name="editschedule2" class="form-horizontal">
                            <div class="col-md-1">
                                    <?php require_once('../includes/table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'title',
                                                'model'=>'vm.Template.title',
                                                'label'=>'Title<br/>&nbsp;',
                                                'placeholder'=>'Enter Title',
                                                'required'=>true
                                                )
                                        );
                                    ?>
                            </div>
                            <div class="col-md-1">
                                    <?php require_once('../includes/table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'description',
                                                'model'=>'vm.Template.description',
                                                'label'=>'Description<br/>&nbsp;',
                                                'placeholder'=>'Enter Description',
                                                'required'=>false
                                                )
                                        );
                                    ?>
                            </div>
                            <div class="col-md-1">
                                    <?php require_once('../includes/table-basic.php');
                                        print strColTemplate(
                                            array(
                                                'field'=>'url',
                                                'model'=>'vm.Template.url',
                                                'label'=>'Url<br/>&nbsp;',
                                                'placeholder'=>'Enter Url',
                                                'required'=>false
                                                )
                                        );
                                    ?>
                            </div>
                            <div class="col-md-7">
                                    <?php require_once('../includes/table-basic.php');
                                        print textareaColTemplate(
                                            array(
                                                'field'=>'content',
                                                'change'=>'vm.messageChange(vm.Template)',
                                                'model'=>'vm.Template.content',
                                                'label'=>'Content<br/>&nbsp;',
                                                'placeholder'=>'Enter Content',
                                                'tinymce'=>true,
                                                'required'=>false
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
                                                'click'=>'vm.addTemplate(vm.Template)'
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
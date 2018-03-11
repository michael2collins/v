<!DOCTYPE html>
<div id="table-basic-paymenttracking" class="row" ng-controller="PaymentTrackingController as vm">

  <div class="portlet box portlet-green">
    <div class="portlet-header">
      <div class="row">
        <div class="caption">Payment Tracking</div>
                <div class="tools"><i class="fa fa-chevron-up"></i></div>
      </div>
    </div>
    <div class="portlet-body" style="display: block;   background-color: grey;">
      <div class="panel panel-blue">
        <div class="panel-heading">Invoicing</div>
          <div class="control-label pam h4">Payer/Student Selection</div>

          <form action="" novalidate name="edit" class="form-horizontal">
            <div class="form-body ">
              <div class="col-md-3 mlm" style="height: 80px;">
                <div ng-class="{'has-error': editclass.payerName.$invalid, 'has-success': !editclass.payerName.$invalid}" class="form-group">
                  <label for="payerName" class="control-label">Payer Name</label>
                  <div class="">
                    <i data-hover="tooltip" data-original-title="Correct" ng-show="editclass.payerName.$dirty" ng-class="editclass.payerName.$invalid ? 'glyphicon-remove' : 'glyphicon-ok' " class="glyphicon tooltips"></i>
                    <div class="select-box">
                      <ui-select ng-model="vm.payerName" theme="bootstrap" reset-search-input="false" style="width: 300px;" 
                      on-select="vm.getPayerStudent($item,'payer');vm.getInvoices($item.payerid);vm.getPayments($item.payerid)" title="Pick Payer" 
                      append-to-body="true">
                        <ui-select-match placeholder="Choose...">{{$select.selected.payerName}}</ui-select-match>
                        <ui-select-choices repeat="item in vm.payers | filter: $select.search track by $index" refresh="vm.getPayersPartial($select.search)" refresh-delay="0">
                          <div id="payerpicklist" ng-bind-html="item.payerName | highlight: $select.search"></div>
                        </ui-select-choices>
                        <ui-select-no-choice>
                          Dang! We couldn't find any choices...
                        </ui-select-no-choice>
                      </ui-select>
                    </div>
                  </div>
                  <div style="color:maroon" role="alert" ng-messages="editclass.payerName.$error" class="has-error">
                    <div ng-message="required">You did not enter a field</div>
                  </div>
                </div>
              </div>
              <div class="col-md-3" style="height: 80px;">
                <div ng-class="{'has-error': editclass.studentpick.$invalid, 'has-success': !editclass.studentpick.$invalid}" class="form-group">
                  <label for="studentpick" class="control-label">Student Name</label>
                  <div class="">
                    <i data-hover="tooltip" data-original-title="Correct" ng-show="editclass.studentpick.$dirty" ng-class="editclass.studentpick.$invalid ? 'glyphicon-remove' : 'glyphicon-ok' " class="glyphicon tooltips"></i>
                    <div class="select-box">
                      <ui-select ng-model="vm.studentpick" theme="bootstrap" reset-search-input="false" style="width: 300px;" on-select="vm.getPayerStudent($item,'student')" title="Choose a student" append-to-body="false">
                        <ui-select-match placeholder="Or Choose...">{{$select.selected.FullName}}</ui-select-match>
                        <ui-select-choices repeat="stu in vm.refreshstudentlist.refreshstudentlist | filter: $select.search track by stu.ID" refresh="vm.refreshStudents($select.search)" refresh-delay="0">
                          <div ng-bind-html="stu.FullName | highlight: $select.search"></div>
                        </ui-select-choices>
                        <ui-select-no-choice>
                          Dang! We couldn't find any choices...
                        </ui-select-no-choice>
                      </ui-select>
                    </div>
                  </div>
                  <div style="color:maroon" role="alert" ng-messages="editclass.studentpick.$error" class="has-error">
                    <div ng-message="required">You did not enter a field</div>
                  </div>
                </div>
              </div>
              </div>
          </form>

        <div class="panel-body pan">
                    <div class="table-tools">
                        <div class="row col-md-offset-6 ">
                            <button type="button" class="btn btn-blue mtxl" 
                            ng-click="vm.isCollapsed = !vm.isCollapsed;">{{vm.isCollapsed ? 'New Invoice' : 'Close New Invoice'}}</button>
                        </div>
                    </div>
                  	<div uib-collapse="vm.isCollapsed">
                		<div class="well well-lg">
                            <div class="container-fluid"> 
                                <div class="container" >
                                    <div class="col-md-12" style="height: 110px;">
                                        <!-- 
                                            invoice, invoiceDate, invoiceAmt, paymentid, status
                                        -->
                                      <div class="row">
                                        <div class="col-md-2">
                                        <button type="button" class="btn btn-blue" ng-click="vm.calcInvoice()">Calc Invoice</button>
                                      </div>
                                        <div class="col-md-2">Plan: {{vm.Invoice.paymentplan}}</div>
                                        <div class="col-md-2">Type: {{vm.Invoice.paymenttype}}</div>
                                        <div class="col-md-2">Last: {{vm.Invoice.lastpaymentdate | date:'yyyy-MM-dd'}}</div>
                                        <div class="col-md-2">Overdue: {{vm.Invoice.overduecnt}}</div>
                                        <div class="col-md-2">Pay On: {{vm.Invoice.payondayofmonth}}</div>
                                      </div>

                                        <form action="" novalidate name="editschedule2" class="form-action">
                                            <div class="col-md-3">
                                                <?php require_once('table-basic.php');
                                                    print dateColTemplate(
                                                        array(
                                                            'field'=>'invoiceDate',
                                                            'model'=>'vm.Invoice.invdate',
                                                            'label'=>'Date<br/> &nbsp;',
                                                            'placeholder'=>'Enter Date',
                                                            'required'=>true,
                                                            'isopen'=>'vm.status.opened',
                                                            'dateFormat'=>'MM/dd/yyyy',
                                                            'dopen'=>'vm.dateopen($event)'
                                                            )
                                                    );
                                                ?>
                                            </div>
                                            <div class="col-md-2">
                                                <?php require_once('table-basic.php');
                                                    print numtypeColTemplate(
                                                        array(
                                                            'field'=>'invoiceAmt',
                                                            'model'=>'vm.Invoice.amt',
                                                            'label'=>'Amount<br/> &nbsp;',
                                                            'formatter'=>'"vm.formatter($modelValue,$filter,\'$0.00\');"',
                                                            'modelformat'=>'currency',
                                                            'required'=>true
                                                            )
                                                    );
                                                    
                                                ?>
                                            </div>
                                            <div class="col-md-2">
                                                <?php require_once('table-basic.php');
                                                  print selectColTemplate(
                                                      array(
                                                          'field'=>'status',
                                                          'model'=>'vm.Invoice.status',
                                                          'label'=>'Status<br/>&nbsp;',
                                                          'placeholder'=>'Select',
                                                          'required'=>true,
                                                          'form'=>'editschedule2',
                                                          'repeatmodel'=>'vm.invStatuses',
                                                          'repeatvalue'=>'value',
                                                          'repeatid'=>'value'
                                                          )
                                                  );
                                                ?>
                                            </div>
                                            <div class="col-md-2" style="margin-top: 18px;">
                                              <?php require_once('table-basic.php');
                                                    print btnColTemplate(
                                                        array(
                                                            'field'=>'invoicebtn',
                                                            'label'=>'Add/Email',
                                                            'click'=>'vm.addInvoice(vm.Invoice,\'Email\')'
                                                            )
                                                    );
                                                ?>
                                            </div>
                                            <div class="col-md-2" style="margin-top: 18px;">
                                              <?php require_once('table-basic.php');
                                                    print btnColTemplate(
                                                        array(
                                                            'field'=>'invoicebtn',
                                                            'label'=>'Add/NoEmail',
                                                            'click'=>'vm.addInvoice(vm.Invoice,\'NoEmail\')'
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
          
        <div class="panel-footer" ng-show="vm.studentpick">
          <div class="control-label pam h4">Open Invoices</div>
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
              <div class="watermark" ng-show="!vm.gridOptions.data.length">No invoice available</div>
            </div>
            
        </div>
        <div class="panel-footer" ng-show="vm.studentpick">
          <div class="control-label pam h4">Payments</div>
            <div ui-grid="vm.paygridOptions"  
                ui-if="vm.paygridOptions.data.length>0"
                ui-grid-pagination 
                ui-grid-cellNav  
                ui-grid-pinning  
                ui-grid-move-columns 
                ui-grid-exporter 
                ui-grid-auto-resize
                ui-grid-resize-columns
                ui-grid-edit class="mygrid" ng-style="vm.getpayGridLength()" >
              <div class="watermark" ng-show="!vm.paygridOptions.data.length">No payments available</div>
            </div>
            
        </div>
          
        </div>
      </div>
    </div>

  </div>

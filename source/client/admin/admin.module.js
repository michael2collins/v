import angular from 'angular';
const { rangy: rangy } = window;
const { jQuery: $ } = window;

import { DirectiveModule } from '../../js/directives/directive.module';
import { CoreModule } from '../../js/core/core.module';

import stripeonboardtemplate from './template/stripe_onboard.html';
import classtemplate from './template/table-basic-class.html';
import classranktemplate from './template/table-basic-classrank.html';
import htmltemplate from './template/table-basic-htmltemplate.html';
import rankstemplate from './template/table-basic-ranks.html';
import testtypetemplate from './template/table-basic-testtype.html';
import basictemplate from './template/table-basic-basic.html';
import classpgmtemplate from './template/table-basic-classpgm.html';
import classtesttemplate from './template/table-basic-classtest.html';
import programtemplate from './template/table-basic-program.html';
import scheduletemplate from './template/table-basic-schedule.html';
import rptbuildertemplate from './table-basic-rptbuilder.html';

import { BasicTableBasicController } from './table-basic-basic';
import { ClassRankTableBasicController } from './table-basic-classrank';
import { ProgramTableBasicController } from './table-basic-program';
import { TesttypeTableBasicController } from './table-basic-testtype';
import { RptBuilderController } from './rptbuilder.controller';
import { ClassTableBasicController } from './table-basic-class';
import { ClassTestTableBasicController } from './table-basic-classtest';
import { RankTableBasicController } from './table-basic-rank';
import { StripeTableBasicController } from './stripe-onboard';
import { ClassPgmTableBasicController } from './table-basic-classpgm';
import { TemplateTableBasicController } from './table-basic-htmltemplate';
import { ScheduleTableBasicController } from './table-basic-schedule';

import { ClassServices } from '../../js/services/classServices';
import { TestingServices } from '../../js/services/testingServices';
import { CalendarServices } from '../../js/services/calendarServices';
import { UserServices } from '../../js/services/userServices';
import { TemplateServices } from '../../js/services/templateServices';
import { AttendanceServices } from '../../js/services/attendanceServices';
import { portalDataService } from '../portal/portaldata.service';

//textAngularManager,  , pdfMake

import { Util } from '../../js/utility/utility';
import iddropdown from '../../js/filters/iddropdown.filter';


import {
    basicComponent,
    classrankComponent,
    programComponent,
    testtypeComponent,
    rptbuilderComponent,
    classComponent,
    classtestComponent,
    rankComponent,
    stripeonboardComponent,
    classpgmComponent,
    templateComponent,
    scheduleComponent
}
from './admin.component';

export const AdminModule = angular
    .module('ngadmin.admin', [DirectiveModule, CoreModule,
        'ui.grid',
        'ui.grid.pagination',
        'ui.grid.cellNav',
        'ui.grid.edit',
        'ui.grid.autoResize',
        'ui.grid.selection',
        'ui.grid.resizeColumns',
        'ui.grid.pinning',
        'ui.grid.moveColumns',
        'ui.grid.exporter',
        'ui.grid.importer',
        'ui.grid.grouping',
        'ui.grid.saveState',
        'ui.tinymce'
    ])
    .config(config)
    .service('ClassServices', ClassServices)
    .service('Util', Util)
    .service('attendanceServices', AttendanceServices)
    .service('testingServices', TestingServices)
    .service('templateServices', TemplateServices)
    .service('portalDataService', portalDataService)
    .service('userServices', UserServices)
    .service('calendarServices', CalendarServices)

    .controller('BasicTableBasicController', BasicTableBasicController)
    .controller('ClassRankTableBasicController', ClassRankTableBasicController)
    .controller('ProgramTableBasicController', ProgramTableBasicController)
    .controller('TesttypeTableBasicController', TesttypeTableBasicController)
    .controller('RptBuilderController', RptBuilderController)
    .controller('ClassTableBasicController', ClassTableBasicController)
    .controller('ClassTestTableBasicController', ClassTestTableBasicController)
    .controller('RankTableBasicController', RankTableBasicController)
    .controller('StripeTableBasicController', StripeTableBasicController)
    .controller('ClassPgmTableBasicController', ClassPgmTableBasicController)
    .controller('TemplateTableBasicController', TemplateTableBasicController)
    .controller('ScheduleTableBasicController', ScheduleTableBasicController)
    .filter('iddropdown', iddropdown)

    .component('basicComponent', basicComponent)
    .component('classrankComponent', classrankComponent)
    .component('programComponent', programComponent)
    .component('testtypeComponent', testtypeComponent)
    .component('rptbuilderComponent', rptbuilderComponent)
    .component('classComponent', classComponent)
    .component('classtestComponent', classtestComponent)
    .component('rankComponent', rankComponent)
    .component('stripeonboardComponent', stripeonboardComponent)
    .component('classpgmComponent', classpgmComponent)
    .component('templateComponent', templateComponent)
    .component('scheduleComponent', scheduleComponent)
    .config(rptconfig)
    .name;

function rptconfig($provide) {
    // this demonstrates how to register a new tool and add it to the default toolbar
    //                $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions) { // $delegate is the taOptions we are decorating
    'ngInject';

    $provide.decorator('taOptions', ['taRegisterTool', 'taToolFunctions', '$uibModal', '$log', '$window', '$delegate',
        function(taRegisterTool, taToolFunctions, $uibModal, $log, $window, taOptions) {

            var varlist = [
                { name: 'Student Name', value: 'studentname' },
                { name: 'First Name', value: 'FirstName' },
                { name: 'Last Name', value: 'LastName' },
                { name: 'Certificate Date', value: 'certDate' },
                { name: 'Next Rank', value: 'nextRank' },
                { name: 'Test Start Time', value: 'teststarttime' },
                { name: 'Test Fee', value: 'testfee' },
                { name: 'Belt Size', value: 'beltsize' },
                { name: 'Class Was', value: 'classwas' },
                { name: 'Program Was', value: 'pgmwas' },
                { name: 'daysAttended', value: 'daysAttended' },
                { name: 'daysSinceLastTest', value: 'daysSinceLastTest' },
                { name: 'lastPromoted', value: 'lastPromoted' },
                { name: 'email', value: 'email' },
                { name: 'address', value: 'address' },
                { name: 'state', value: 'state' },
                { name: 'city', value: 'city' },
                { name: 'zip', value: 'zip' },
                { name: 'parent', value: 'parent' },
                { name: 'phone', value: 'phone' },
                { name: 'birthday', value: 'birthday' },
                { name: 'age category', value: 'agecat' },
                { name: 'class category', value: 'classcat' },
                { name: 'class', value: 'nclass' },
                { name: 'Program category', value: 'pgrmcat' },
                { name: 'next class', value: 'nextClass' },
                { name: 'Instructor 1', value: 'instructor1' },
                { name: 'Instructor 2', value: 'instructor2' },
                { name: 'Instructor 3', value: 'instructor3' },
                { name: 'Instructor 4', value: 'instructor4' },
                { name: 'Instructor Title1', value: 'title1' },
                { name: 'Instructor Title2', value: 'title2' },
                { name: 'Instructor Title3', value: 'title3' },
                { name: 'Instructor Title4', value: 'title4' }
            ];

            function createTable(tableParams) {
                if (angular.isNumber(tableParams.row) && angular.isNumber(tableParams.col) &&
                    tableParams.row > 0 && tableParams.col > 0) {
                    /*
                                                    var table = "<table class='table  " 
                                                    + (tableParams.style ? "table-" + tableParams.style : '')  
                                                    + "'" +
                                                    " style='"
                                                    +"margin-bottom: " + tableParams.tblMarginB 
                                                    +"px; margin-top: " + tableParams.tblMarginT
                                                    +"px; margin-left: " + tableParams.tblMarginL
                                                    +"px; margin-right: " + tableParams.tblMarginR
                                                    +"px; '>";
                    */
                    var table = "<div " +
                        " style='" +
                        "margin-bottom: " + tableParams.tblMarginB +
                        "px; margin-top: " + tableParams.tblMarginT +
                        "px; margin-left: " + tableParams.tblMarginL +
                        "px; margin-right: " + tableParams.tblMarginR +
                        "px; '>" +
                        "<table class='table " +
                        (tableParams.style ? "table-" + tableParams.style : '') +
                        "'>";

                    var colWidth, col, row;
                    if (tableParams.style === "vars") {
                        colWidth = 100 / varlist.length;
                        col = "<col width='" + colWidth + "%' >";
                        for (var idxCol = 0; idxCol < varlist.length; idxCol++) {
                            table += col;
                        }
                    }
                    else {
                        colWidth = 100 / tableParams.col;
                        col = "<col width='" + colWidth + "%' >";
                        for (var idxCol = 0; idxCol < tableParams.col; idxCol++) {
                            table += col;
                        }
                    }
                    for (var idxRow = 0; idxRow < tableParams.row; idxRow++) {
                        row = "<tr>";
                        if (tableParams.style === "SampleText") {
                            for (var idxCol = 0; idxCol < tableParams.col; idxCol++) {
                                row += "<td"
                                    //                                        + (idxRow == 0 ? " style='width: " + "colWidth" + "%;'" : "")
                                    +
                                    ">Sample Cell</td>";
                            }
                        }
                        else if (tableParams.style === "vars") {
                            for (var v = 0; v < varlist.length; v++) {
                                row += "<td" +
                                    ">{" + varlist[v].value + "}</td>";
                            }
                        }
                        else {
                            for (var idxCol = 0; idxCol < tableParams.col; idxCol++) {
                                row += "<td" +
                                    "></td>";
                            }

                        }
                        table += row + "</tr>";
                    }
                    return table + "</table>";
                }
            }

            function createImage(imageParams) {
                $log.debug("createImage entered", imageParams);
                var images = [];
                for (var iter = 0; iter < imageParams.bodyimages.length; iter++) {
                    images[iter] = ' <img height="' + imageParams.height + '"  width="' + imageParams.width + '" src="' + imageParams.bodyimages[iter] + '"/>';
                }
                return images;
            }

            taOptions.toolbar = [
                ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
                ['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent'],
                ['html', 'charcount']
            ];
            //                    				['html', 'insertImage', 'insertLink', 'charcount']

            taOptions.disableSanitizer = true;

            taRegisterTool('insertTable', {
                iconclass: 'fa fa-table',
                tooltiptext: 'Insert table',
                action: function(deferred) {
                    var textAngular = this;
                    var savedSelection = rangy.saveSelection();

                    $uibModal.open({
                        templateUrl: 'templates/admin/textblocktable.html',
                        windowClass: 'modal-window-sm',
                        backdrop: 'static',
                        keyboard: false,
                        controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                            $scope.newtable = {};
                            $scope.newtable.tblMarginL = 25;
                            $scope.newtable.tblMarginR = 25;
                            $scope.newtable.tblMarginT = 5;
                            $scope.newtable.tblMarginB = 5;
                            $scope.tablestyles = [
                                { name: 'Bordered', value: 'bordered' },
                                { name: 'Striped', value: 'striped' },
                                { name: 'HeaderlineOnly', value: 'HeaderlineOnly' },
                                { name: 'LightHorizontalLines', value: 'LightHorizontalLines' },
                                { name: 'Striped', value: 'striped' },
                                { name: 'Borderd Striped', value: 'striped table-bordered' }
                            ];
                            $scope.samplestyles = [
                                { name: 'SampleText', value: 'sampletext' },
                                { name: 'Vars', value: 'vars' }
                            ];

                            $scope.tblInsert = function() {
                                $uibModalInstance.close($scope.newtable);
                            };

                            $scope.tblCancel = function() {
                                $uibModalInstance.dismiss("cancel");
                            };
                        }],
                        size: 'sm'

                        //define result modal , when user complete result information 
                    }).result.then(function(result) {
                            rangy.restoreSelection(savedSelection)
                            textAngular.$editor().wrapSelection('insertHTML', createTable(result));
                            deferred.resolve();
                        },
                        function() {
                            rangy.restoreSelection(savedSelection)
                            deferred.resolve();
                        }
                    );
                    return false;
                }
            });
            taOptions.toolbar[1].push('insertTable');

            taRegisterTool('VInsertImage', {
                iconclass: 'fa fa-picture-o',
                tooltiptext: 'Insert Image',
                action: function(deferred) {
                    var textAngular = this;
                    var savedSelection = rangy.saveSelection();

                    $uibModal.open({
                        templateUrl: 'templates/admin/textblockimage.html',
                        windowClass: 'modal-window-sm',
                        backdrop: 'static',
                        keyboard: false,
                        controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                            $scope.vm = {};
                            $scope.vm.height = 100;
                            $scope.vm.width = 100;
                            $scope.vm.imagelist = [];
                            $scope.vm.bodyimages = [];
                            $scope.imgLoadedCallback = function(event) {
                                $log.debug("imgLoadedCallback entered", event);
                                $scope.vm.imagelist.push({
                                    data: event.target.currentSrc,
                                    naturalHeight: event.target.naturalHeight,
                                    naturalWidth: event.target.naturalWidth
                                });
                            };
                            $scope.tblInsert = function() {
                                $uibModalInstance.close($scope.vm);
                            };

                            $scope.tblCancel = function() {
                                $uibModalInstance.dismiss("cancel");
                            };
                        }],
                        size: 'lg'

                        //define result modal , when user complete result information 
                    }).result.then(function(result) {
                            rangy.restoreSelection(savedSelection)
                            textAngular.$editor().wrapSelection('insertHTML', createImage(result));
                            deferred.resolve();
                        },
                        function() {
                            rangy.restoreSelection(savedSelection)
                            deferred.resolve();
                        }
                    );
                    return false;
                }
            });
            taOptions.toolbar[1].push('VInsertImage');

            taRegisterTool('fontSize', {
                display: "<span class='bar-btn-dropdown dropdown'>" +
                    "<button class='btn btn-dark btn-plugin dropdown-toggle' style='margin-top: 5px;' type='button' ng-disabled='showHtml()'><i class='fa fa-text-height'></i><i class='fa fa-caret-down'></i></button>" +
                    "<ul class='dropdown-menu plugin-dropdown-menu'><li ng-repeat='o in options'><button class='btn btn-blue checked-dropdown' style='font-size: {{o.css}};' type='button' ng-click='action($event, o.value)'><i ng-if='o.active' class='fa fa-check'></i> {{o.name}}</button></li></ul>" +
                    "</span>",
                action: function(event, size) {
                    if (!!event.stopPropagation) {
                        event.stopPropagation();
                        $("body").trigger("click");
                    }
                    return this.$editor().wrapSelection('fontSize', parseInt(size));
                },
                options: [
                    { name: 'xx-small', css: 'xx-small', value: 1 },
                    { name: 'x-small', css: 'x-small', value: 2 },
                    { name: 'small', css: 'small', value: 3 },
                    { name: 'medium', css: 'medium', value: 4 },
                    { name: 'large', css: 'large', value: 5 },
                    { name: 'x-large', css: 'x-large', value: 6 },
                    { name: 'xx-large', css: 'xx-large', value: 7 }

                ]
            });
            taOptions.toolbar[1].push('fontSize');

            taRegisterTool('fontName', {
                display: "<span class='bar-btn-dropdown dropdown'>" +
                    "<button class='btn btn-dark btn-plugin dropdown-toggle' style='margin-top: 5px;' type='button' ng-disabled='showHtml()'><i class='fa fa-font'></i><i class='fa fa-caret-down'></i></button>" +
                    "<ul class='dropdown-menu plugin-dropdown-menu'><li ng-repeat='o in options'><button class='checked-dropdown' style='font-family: {{o.css}};' type='button' ng-click='action($event, o.css)'><i ng-if='o.active' class='fa fa-check'></i>{{o.name}}</button></li></ul></span>",
                action: function(event, font) {
                    if (!!event.stopPropagation) {
                        event.stopPropagation();
                        $("body").trigger("click");
                    }
                    return this.$editor().wrapSelection('fontName', font);
                },
                options: [
                    { name: 'Sans-Serif', css: 'Arial, Helvetica, sans-serif' },
                    { name: 'Serif', css: "'times new roman', serif" },
                    { name: 'Wide', css: "'arial black', sans-serif" },
                    { name: 'Garamond', css: 'garamond, serif' },
                    { name: 'Georgia', css: 'georgia, serif' },
                    { name: 'Tahoma', css: 'tahoma, sans-serif' },
                    { name: 'Trebuchet MS', css: "'trebuchet ms', sans-serif" },
                    { name: "Helvetica", css: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
                    { name: 'Verdana', css: 'verdana, sans-serif' },
                    { name: 'Proxima Nova', css: 'proxima_nova_rgregular' }
                ]
            });
            taOptions.toolbar[1].push('fontName');

            taRegisterTool('vars', {
                display: "<span class='bar-btn-dropdown dropdown'>" +
                    "<button class='btn btn-dark btn-plugin dropdown-toggle' style='margin-top: 5px;' type='button' ng-disabled='showHtml()'>Vars {} <i class='fa fa-caret-down'></i></button>" +
                    "<ul class='dropdown-menu plugin-dropdown-menu'><li ng-repeat='o in options'><button class='btn  checked-dropdown' type='button' ng-click='action($event, false, o.value)'><i ng-if='o.active' class='fa fa-check'></i> {{o.name}}</button></li></ul>" +
                    "</span>",
                action: function(event, restoreSelection, size) {
                    if (!!event.stopPropagation) {
                        event.stopPropagation();
                        //Then click in the body to close the dropdown.
                        $("body").trigger("click");
                        this.$editor().wrapSelection('inserthtml', '{' + size + '}');
                    }
                    return false;
                },
                //                        options: [
                //                            { name: 'Student Name', value: 'studentname' },
                //                            { name: 'Instructor Title4',  value: 'title4' }
                //                        ]
                options: varlist
            });
            taOptions.toolbar[1].push('vars');

            taRegisterTool('insertHRdashed', {
                iconclass: 'ti-line-dashed',
                tooltiptext: 'Insert Dashed Line',
                action: function() {
                    //                         this.$editor().wrapSelection('insertHtml', '<hr style="border: 1px dashed black;" />',true);             
                    this.$editor().wrapSelection('insertHtml', '<div><hr class="dashed" /></div>', 'true');
                }
            });
            taOptions.toolbar[1].push('insertHRdashed');

            taRegisterTool('insertHRsolid', {
                iconclass: "ti-arrows-horizontal",
                tooltiptext: 'Insert Solid Line',
                action: function() {
                    this.$editor().wrapSelection('inserthorizontalrule', 'false', null);
                }
            });
            taOptions.toolbar[1].push('insertHRsolid');
            /*
                                taRegisterTool('dropdownTest', {
                                    display: "<div class='btn-group' uib-dropdown> <button id='single-button' type='button' class='btn btn-primary' uib-dropdown-toggle auto-close='outsideClick'>Select Option <span class='caret'></span>       </button>       <ul class='dropdown-menu' uib-dropdown-menu role='menu' aria-labelledby='single-button'>           <li role='menuitem' ng-repeat='o in options'>             <button type='button' ng-class='displayActiveToolClass(active)' ng-click='action($event, o.value)'> {{ o.name }} </button></li></ul></div>",
                                    action: function(deferred, value) {

                                        $log.debug('dropdowntest deferred:',deferred);
                                        $log.debug('dropdowntest value:', value);

                               //       if (!!event.stopPropagation) {
                            //              $log.debug('stop');
                             //           event.stopPropagation();
                              //          $('body').trigger('click');
                            //          }
                                      if( value === 'H1' || value === 'H2' || value === 'H3' || value === 'blockquote' ) {
                                          //  deferred.resolve();
                                        return this.$editor().wrapSelection('formatBlock', "<" + value + ">");
                                      }
                                      else if( value === 'ul' ) {
                                        //    deferred.resolve();
                                        return this.$editor().wrapSelection('insertUnorderedList', null);
                                      }
                                      else if ( value === 'ol' ) {
                                          //  deferred.resolve();
                                        return this.$editor().wrapSelection('insertOrderedList', null);
                                      }
                                      return false;
                                    },
                                    options: [
                                          { name: 'h1',  value: 'H1' },
                                          { name: 'h2', css: 'H2', value: 'H2' },
                                          { name: 'h3', css: 'H3', value: 'H3' },
                                          { name: 'quote', css: 'blockquote', value: 'blockquote' },
                                          { name: 'ul', css: 'list-ul', value: 'ul' },
                                          { name: 'ol', css: 'list-ol', value: 'ol' }
                                        ]
                                    });
                                // add the button to the default toolbar definition
                                taOptions.toolbar[1].push('dropdownTest');
              */
            taRegisterTool('backgroundColor', {
                display: "<div spectrum-colorpicker ng-model='color' on-change='!!color && action(color)' format='\"hex\"' options='options'></div>",
                action: function(color) {
                    var me = this;
                    if (!this.$editor().wrapSelection) {
                        setTimeout(function() {
                            me.action(color);
                        }, 100);
                    }
                    else {
                        return this.$editor().wrapSelection('backColor', color);
                    }
                },
                options: {
                    replacerClassName: 'fa fa-paint-brush',
                    showButtons: false
                },
                color: "#fff"
            });
            taOptions.toolbar[1].push('backgroundColor');

            taRegisterTool('fontColor', {
                display: "<spectrum-colorpicker trigger-id='{{trigger}}' ng-model='color' on-change='!!color && action(color)' format='\"hex\"' options='options'></spectrum-colorpicker>",
                action: function(color) {
                    var me = this;
                    if (!this.$editor().wrapSelection) {
                        setTimeout(function() {
                            me.action(color);
                        }, 100);
                    }
                    else {
                        return this.$editor().wrapSelection('foreColor', color);
                    }
                },
                options: {
                    replacerClassName: 'fa fa-font',
                    showButtons: false
                },
                color: "#000"
            });
            taOptions.toolbar[1].push('fontColor');

            return taOptions;
        }
    ]);
}


function config($routeProvider) {
    'ngInject';
    $routeProvider
        .when('/stripe-onboard', { template: stripeonboardtemplate })
        .when('/table-basic-class', { template: classtemplate })
        .when('/table-basic-classrank', { template: classranktemplate })
        .when('/table-basic-htmltemplate', { template: htmltemplate })
        .when('/table-basic-rank', { template: rankstemplate })
        .when('/table-basic-testtype', { template: testtypetemplate })
        .when('/table-basic-basic', { template: basictemplate })
        .when('/table-basic-classpgm', { template: classpgmtemplate })
        .when('/table-basic-classtest', { template: classtesttemplate })
        .when('/table-basic-program', { template: programtemplate })
        .when('/table-basic-rptbuilder', { template: rptbuildertemplate })
        .when('/table-basic-schedule', { template: scheduletemplate })
        .otherwise({
            redirectTo: '/page-signin'
            //           redirectTo: '/'
        });
}

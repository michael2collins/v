/*
 * angular-deckgrid-demo
 *
 * Copyright(c) 2013 André König <akoenig@posteo.de>
 * MIT Licensed
 *
 */

/**
 * @author André König (andre.koenig@posteo.de)
 *
 */
const { jQuery: $ } = window;

export const elementReady = ($timeout, $rootScope) => {
    return {
      restrict: 'A',
      link(scope, element, attrs) {
        $timeout(() => {
          element.ready(() => {
            scope.$apply(() => {
              $rootScope.$broadcast(`${attrs.elementReady}:ready`);
            });
          });
        });
      }
    };
  };
export const disenableloaded = () => {
    'ngInject';
    return {
        restrict: 'A',

        link: function(scope, element, attrs) {

            var cssClass = attrs.loadedclass,
                timeout;

            function reload() {
                timeout = setTimeout(function() {
                    reload();
                }, 5000);
            }

            reload();

            element.bind('load', function(e) {
                clearTimeout(timeout);
                element.addClass(cssClass);
            });
        }
    };
};
export const imageloaded = () => {
    'ngInject';
    return {
        restrict: 'A',

        link: function(scope, element, attrs) {

            var cssClass = attrs.loadedclass,
                origSrc,
                timeout;

            function reload() {
                timeout = setTimeout(function() {
                    if (!origSrc) {
                        origSrc = element[0].src;
                    }
                    element[0].src = origSrc + '?' + Date.now();
                    reload();
                }, 5000);
            }

            reload();

            element.bind('load', function(e) {
                clearTimeout(timeout);
                element.addClass(cssClass);
            });
        }
    };
};
export const backgroundloaded = () => {
    'ngInject';
    return {
        restrict: 'A',

        link: function(scope, element, attrs) {

            var cssClass = attrs.loadedclass;

            var src = element.css('background-image');
            var url = src.match(/\((.*?)\)/)[1].replace(/('|")/g, '');

            var img = new window.Image();

            img.onload = function() {
                element.addClass(cssClass);
            };
            img.src = url;
            if (img.complete) img.onload();
        }
    };
};

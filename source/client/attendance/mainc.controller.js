export class MaincController {
    constructor() {
      'ngInject';

    }
    
    $onInit() {

        var vm = this;
        vm.eventLog = '';
    }

    listener($event) {

        this.eventLog = 'Event with type "' + $event.type + '" fired at ' + $event.detail;
    }

}

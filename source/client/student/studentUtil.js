
export class StudentUtil {
    constructor($log, $uibModal, ClassServices, _ ) {
        'ngInject';
        this.$log = $log;
        this.ClassServices = ClassServices;
        this.$uibModal = $uibModal;
        this._ = _;
    }

    getPayersPartial(theinput) {
        var vmclass = this;
        vmclass.$log.log('getPayers entered');

        return vmclass.ClassServices.getPayersPartial(theinput).then(function(data) {
            vmclass.$log.log('controller getPayersPartial returned data', theinput);
            vmclass.$log.log(data.payerlist);
            vmclass.payers = data.payerlist;
            return vmclass.payers;
        });

    } 
        
    getPriceDate(input) {
        var theDate = new Date(input);
        return theDate;
    }

   getStudentClazzList(vmclass) {
       var v=this;
        vmclass.$log.log('getStudentClazzList entered:' + vmclass.$routeParams.id);
        var path = '../v1/studentclasslist/' + vmclass.$routeParams.id;
        return vmclass.ClassServices.getStudentClassList(path).then(function(data) {
            vmclass.studentclazzlist = data.studentclasslist;
            for (var iter = 0, len = vmclass.studentclazzlist.length; iter < len; iter++) {
                vmclass.studentclazzlist[iter].payerList = {
                    payerName: vmclass.studentclazzlist[iter].payerName,
                    payerid: vmclass.studentclazzlist[iter].payerid,
                    primaryContact: vmclass.studentclazzlist[iter].primaryContact
                };
                if (vmclass._.isEmpty(vmclass.studentclazzlist[iter].expiresOn)) {
                    vmclass.studentclazzlist[iter].expiresOn = v.getPriceDate(new Date());
                }
                else {
                    vmclass.studentclazzlist[iter].expiresOn = v.getPriceDate(vmclass.studentclazzlist[iter].expiresOn);
                }
                vmclass.status[iter] = {
                    opened: false
                };

            }
            vmclass.$log.log('studentclazzlist returned data', vmclass.studentclazzlist);
            return vmclass.studentclazzlist;
        }, function(error) {
            vmclass.$log.log('getStudentClass ', error);
            vmclass.Notification.error({ message: error, delay: 5000 });
            return (error);
        });

   }

}

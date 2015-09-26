ALTER TABLE `nclasspays` CHANGE `isTestFeeWaived` `isTestFeeWaived` INT(1) NULL DEFAULT '0';

ALTER TABLE `nclasspays` ADD `studentclassstatus` VARCHAR(40) NOT NULL ;

UPDATE `nclasspays` set `studentclassstatus`= 'Inactive' WHERE class = 'Inactive';
UPDATE `nclasspays` set `studentclassstatus`= 'Injured' WHERE class = 'Injured';
UPDATE `nclasspays` set `studentclassstatus`= 'Active' WHERE class not in ( 'Injured', 'Inactive');

INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("ClassStatus","Active","Active",1);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("ClassStatus","Inactive","Inactive",2);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("ClassStatus","Injured","Injured",3);

ALTER TABLE `nclasspays` ADD `pgmseq` BIGINT NOT NULL ;

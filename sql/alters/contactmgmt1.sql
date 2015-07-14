ALTER TABLE `ncontactmgmt` ADD `contactDate` DATE NULL ;
UPDATE `ncontactmgmt` SET `contactDate`= date_format(concat(contactdateyyyy, lpad(`contactdatem`,2,'0'),lpad(`contactdated`,2,'0')) ,'%Y%m%d') WHERE 1
ALTER TABLE `ncontactmgmt`
DROP PRIMARY KEY,
 ADD PRIMARY KEY(
 `contactid`,
 `contactmgmttype`,
 `contactDate`);
ALTER TABLE `ncontactmgmt` DROP `contactdateyyyy`;
ALTER TABLE `ncontactmgmt` DROP `contactdatem`;
ALTER TABLE `ncontactmgmt` DROP `contactdated`;
 
INSERT INTO `ncontactmgmt`(`contactid`, `contactmgmttype`, `contactDate`) select id, 'dateEntered', dateEntered from ncontacts where dateEntered is not null;
INSERT INTO `ncontactmgmt`(`contactid`, `contactmgmttype`, `contactDate`) select id, 'dateInactive', dateInactive from ncontacts where dateInactive is not null;
INSERT INTO `ncontactmgmt`(`contactid`, `contactmgmttype`, `contactDate`) select id, 'sendWelcomeCard', dateEntered from ncontacts where sendWelcomeCard >0;
INSERT INTO `ncontactmgmt`(`contactid`, `contactmgmttype`, `contactDate`) select id, 'signupDate', signupDate from ncontacts where signupDate is not null;
INSERT INTO `ncontactmgmt`(`contactid`, `contactmgmttype`, `contactDate`) select id, 'ConsentToPublicPictures', dateEntered from ncontacts where ConsentToPublicPictures >0;
INSERT INTO `ncontactmgmt`(`contactid`, `contactmgmttype`, `contactDate`) select id, 'StartDate', StartDate from ncontacts where StartDate is not null;
 

ALTER TABLE `ncontacts` DROP dateEntered;
ALTER TABLE `ncontacts` DROP dateInactive;
ALTER TABLE `ncontacts` DROP signupDate;
ALTER TABLE `ncontacts` DROP ConsentToPublicPictures;
ALTER TABLE `ncontacts` DROP StartDate;
ALTER TABLE `ncontacts` DROP sendWelcomeCard;
ALTER TABLE `ncontacts` DROP ReferredBy;

ALTER TABLE `ncontacts` DROP `Attachments`;
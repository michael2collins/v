ALTER TABLE `ncontacts` ADD `pictureurl` VARCHAR(80) NOT NULL AFTER `SSMA_TimeStamp`;

UPDATE `ncontacts` SET  `pictureurl` = 'spencerbirch.jpg' WHERE `ncontacts`.`ID` = 5340;
UPDATE `ncontacts` SET  `pictureurl` = 'noahbirch.jpg' WHERE `ncontacts`.`ID` = 6592;
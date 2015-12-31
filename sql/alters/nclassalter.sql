ALTER TABLE `nclass` ADD `classcat` VARCHAR(80) NOT NULL , ADD `pgmcat` VARCHAR(80) NOT NULL , ADD `agecat` VARCHAR(80) NOT NULL ;

UPDATE nclass SET classcat = 'karate', pgmcat = 'adult', agecat = 'adult' WHERE nclass.class = 'Adult';
UPDATE nclass SET classcat = 'special', pgmcat = 'other', agecat = 'children' WHERE nclass.class = 'After School';
UPDATE nclass SET classcat = 'karate', pgmcat = 'basic or dragon', agecat = 'children' WHERE nclass.class = 'Basic Dragon';
UPDATE nclass SET classcat = 'karate', pgmcat = 'basic or leopard', agecat = 'children' WHERE nclass.class = 'Basic Leopard';
UPDATE nclass SET classcat = 'karate', pgmcat = 'bbt', agecat = 'children' WHERE nclass.class = 'BBT - Multiclasses';
UPDATE nclass SET classcat = 'karate', pgmcat = 'bbt1', agecat = 'children' WHERE nclass.class = 'BBT1 - Purple - B/G';
UPDATE nclass SET classcat = 'karate', pgmcat = 'bbt1 or leopard', agecat = 'children' WHERE nclass.class = 'BBT1 Leopard';
UPDATE nclass SET classcat = 'karate', pgmcat = 'bbt2', agecat = 'children' WHERE nclass.class = 'BBT2 - Green';
UPDATE nclass SET classcat = 'karate', pgmcat = 'bbt3', agecat = 'children' WHERE nclass.class = 'BBT3 - Brown';
UPDATE nclass SET classcat = 'karate', pgmcat = 'black', agecat = 'adult' WHERE nclass.class = 'Blackbelt Adult';
UPDATE nclass SET classcat = 'karate', pgmcat = 'black', agecat = 'children' WHERE nclass.class = 'Blackbelt Jr';
UPDATE nclass SET classcat = 'special', pgmcat = 'other', agecat = 'children or adult' WHERE nclass.class = 'Inactive';
UPDATE nclass SET classcat = 'special', pgmcat = 'other', agecat = 'children or adult' WHERE nclass.class = 'Injured';
UPDATE nclass SET classcat = 'fitness', pgmcat = 'other', agecat = 'children or adult' WHERE nclass.class = 'Kickboxing';
UPDATE nclass SET classcat = 'karate', pgmcat = 'privates', agecat = 'adult' WHERE nclass.class = 'Privates Adult';
UPDATE nclass SET classcat = 'karate', pgmcat = 'privates', agecat = 'children' WHERE nclass.class = 'Privates Children';
UPDATE nclass SET classcat = 'karate', pgmcat = 'other', agecat = 'children or adult' WHERE nclass.class = 'Saturday Only';
UPDATE nclass SET classcat = 'special', pgmcat = 'other', agecat = 'adult' WHERE nclass.class = 'Self Defense';
UPDATE nclass SET classcat = 'special', pgmcat = 'other', agecat = 'children or adult' WHERE nclass.class = 'Special Needs';
UPDATE nclass SET classcat = 'wellness', pgmcat = 'other', agecat = 'adult' WHERE nclass.class = 'TaiChi';
UPDATE nclass SET classcat = 'fitness', pgmcat = 'other', agecat = 'children or adult' WHERE nclass.class = 'Zoomba';

ALTER TABLE `nclass` ADD `pictureurl` VARCHAR(200) NULL ;

UPDATE `vdb`.`nclass` SET `pictureurl` = '/images/adult.jpg' WHERE `nclass`.`class` = "Adult";
UPDATE `vdb`.`nclass` SET `pictureurl` = '/images/afterschool.jpg' WHERE `nclass`.`class` ="After School";
UPDATE `vdb`.`nclass` SET `pictureurl` = '/images/basicdragon.jpg' WHERE `nclass`.`class` ="Basic Dragon";
UPDATE `vdb`.`nclass` SET `pictureurl` = '/images/leopards.jpg' WHERE `nclass`.`class` ="Basic Leopard";
UPDATE `vdb`.`nclass` SET `pictureurl` = '/images/multiclass.jpg' WHERE `nclass`.`class` ="BBT - Multiclasses";
UPDATE `vdb`.`nclass` SET `pictureurl` = '/images/bbt1purple.jpg' WHERE `nclass`.`class` ="BBT1 - Purple - B/G";
UPDATE `vdb`.`nclass` SET `pictureurl` = '/images/bbt1leopard.jpg' WHERE `nclass`.`class` ="BBT1 Leopard";
UPDATE `vdb`.`nclass` SET `pictureurl` = '/images/bbt2.jpg' WHERE `nclass`.`class` ="BBT2 - Green";
UPDATE `vdb`.`nclass` SET `pictureurl` = '/images/bbt3.jpg' WHERE `nclass`.`class` ="BBT3 - Brown";
UPDATE `vdb`.`nclass` SET `pictureurl` = '/images/adultblackbelt.jpg' WHERE `nclass`.`class` ="Blackbelt Adult";
UPDATE `vdb`.`nclass` SET `pictureurl` = '/images/jrblackbelt.jpg' WHERE `nclass`.`class` ="Blackbelt Jr";
UPDATE `vdb`.`nclass` SET `pictureurl` = '/images/inactive.jpg' WHERE `nclass`.`class` ="Inactive";
UPDATE `vdb`.`nclass` SET `pictureurl` = '/images/injured.jpg' WHERE `nclass`.`class` ="Injured";
UPDATE `vdb`.`nclass` SET `pictureurl` = '/images/kickbox.jpg' WHERE `nclass`.`class` ="Kickboxing";
UPDATE `vdb`.`nclass` SET `pictureurl` = '/images/private.jpg' WHERE `nclass`.`class` ="Privates Adult";
UPDATE `vdb`.`nclass` SET `pictureurl` = '/images/privatechild.jpg' WHERE `nclass`.`class` ="Privates Children";
UPDATE `vdb`.`nclass` SET `pictureurl` = '/images/saturday.png' WHERE `nclass`.`class` ="Saturday Only";
UPDATE `vdb`.`nclass` SET `pictureurl` = '/images/selfdefence.jpg' WHERE `nclass`.`class` ="Self Defense";
UPDATE `vdb`.`nclass` SET `pictureurl` = '/images/specialneeds.jpg' WHERE `nclass`.`class` ="Special Needs";
UPDATE `vdb`.`nclass` SET `pictureurl` = '/images/taichi.jpg' WHERE `nclass`.`class` ="TaiChi";
UPDATE `vdb`.`nclass` SET `pictureurl` = '/images/zumba.jpg' WHERE `nclass`.`class` ="Zoomba";

UPDATE nclass SET pictureurl = 'adult.jpg' WHERE nclass.class = 'Adult';
UPDATE nclass SET pictureurl = 'afterschool.jpg' WHERE nclass.class = 'After School';
UPDATE nclass SET pictureurl = 'basicdragon.jpg' WHERE nclass.class = 'Basic Dragon';
UPDATE nclass SET pictureurl = 'leopards.jpg' WHERE nclass.class = 'Basic Leopard';
UPDATE nclass SET pictureurl = 'multiclass.jpg' WHERE nclass.class = 'BBT - Multiclasses';
UPDATE nclass SET pictureurl = 'bbt1purple.jpg' WHERE nclass.class = 'BBT1 - Purple - B/G';
UPDATE nclass SET pictureurl = 'bbt1leopard.jpg' WHERE nclass.class = 'BBT1 Leopard';
UPDATE nclass SET pictureurl = 'bbt2.jpg' WHERE nclass.class = 'BBT2 - Green';
UPDATE nclass SET pictureurl = 'bbt3.jpg' WHERE nclass.class = 'BBT3 - Brown';
UPDATE nclass SET pictureurl = 'adultblackbelt.jpg' WHERE nclass.class = 'Blackbelt Adult';
UPDATE nclass SET pictureurl = 'jrblackbelt.jpg' WHERE nclass.class = 'Blackbelt Jr';
UPDATE nclass SET pictureurl = 'inactive.jpg' WHERE nclass.class = 'Inactive';
UPDATE nclass SET pictureurl = 'injured.jpg' WHERE nclass.class = 'Injured';
UPDATE nclass SET pictureurl = 'kickbox.jpg' WHERE nclass.class = 'Kickboxing';
UPDATE nclass SET pictureurl = 'private.jpg' WHERE nclass.class = 'Privates Adult';
UPDATE nclass SET pictureurl = 'privatechild.jpg' WHERE nclass.class = 'Privates Children';
UPDATE nclass SET pictureurl = 'saturday.png' WHERE nclass.class = 'Saturday Only';
UPDATE nclass SET pictureurl = 'selfdefence.jpg' WHERE nclass.class = 'Self Defense';
UPDATE nclass SET pictureurl = 'specialneeds.jpg' WHERE nclass.class = 'Special Needs';
UPDATE nclass SET pictureurl = 'taichi.jpg' WHERE nclass.class = 'TaiChi';
UPDATE nclass SET pictureurl = 'zumba.jpg' WHERE nclass.class = 'Zoomba';

ALTER TABLE `nclass` ADD `id` SERIAL NOT NULL FIRST, ADD UNIQUE (`id`) ;

ALTER TABLE `nclasspays` ADD `classseq` BIGINT NOT NULL ;
ALTER TABLE `nclasspays` CHANGE `isTestFeeWaived` `isTestFeeWaived` INT(1) NULL DEFAULT '0';

ALTER TABLE `nclasspays` ADD `studentclassstatus` VARCHAR(40) NOT NULL ;



INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("ClassStatus","Active","Active",1);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("ClassStatus","Inactive","Inactive",2);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("ClassStatus","Injured","Injured",3);


update nclasspays set classseq = 1 where class = 'Adult';
update nclasspays set classseq = 2 where class = 'After School';
update nclasspays set classseq = 3 where class = 'Basic Dragon';
update nclasspays set classseq = 4 where class = 'Basic Leopard';
update nclasspays set classseq = 5 where class = 'BBT - Multiclasses';
update nclasspays set classseq = 6 where class = 'BBT1 - Purple - B/G';
update nclasspays set classseq = 7 where class = 'BBT1 Leopard';
update nclasspays set classseq = 8 where class = 'BBT2 - Green';
update nclasspays set classseq = 9 where class = 'BBT3 - Brown';
update nclasspays set classseq = 10 where class = 'Blackbelt Adult';
update nclasspays set classseq = 11 where class = 'Blackbelt Jr';
update nclasspays set classseq = 12 where class = 'Inactive';
update nclasspays set classseq = 13 where class = 'Injured';
update nclasspays set classseq = 14 where class = 'Kickboxing';
update nclasspays set classseq = 15 where class = 'Privates Adult';
update nclasspays set classseq = 16 where class = 'Privates Children';
update nclasspays set classseq = 17 where class = 'Saturday Only';
update nclasspays set classseq = 18 where class = 'Self Defense';
update nclasspays set classseq = 19 where class = 'Special Needs';
update nclasspays set classseq = 20 where class = 'TaiChi';
update nclasspays set classseq = 21 where class = 'Zoomba';

UPDATE `nclasspays` set `studentclassstatus`= 'Inactive' WHERE class = 'Inactive';
UPDATE `nclasspays` set `studentclassstatus`= 'Injured' WHERE class = 'Injured';
UPDATE `nclasspays` set `studentclassstatus`= 'Active' WHERE class not in ( 'Injured', 'Inactive');

ALTER TABLE `nclasslist` ADD `id` SERIAL NOT NULL FIRST, ADD UNIQUE (`id`) ;
ALTER TABLE `nclasspays` ADD `pgmseq` BIGINT NOT NULL ;

update nclasspays set pgmseq = 1 where classid = 'Adult ATP';
update nclasspays set pgmseq = 2 where classid = 'Adult Basic';
update nclasspays set pgmseq = 3 where classid = 'Adult Single Class';
update nclasspays set pgmseq = 4 where classid = 'Adult Unlimited';
update nclasspays set pgmseq = 5 where classid = 'After School';
update nclasspays set pgmseq = 6 where classid = 'BBT';
update nclasspays set pgmseq = 7 where classid = 'Blackbelt Adult';
update nclasspays set pgmseq = 8 where classid = 'Blackbelt Jr';
update nclasspays set pgmseq = 9 where classid = 'Children Basic';
update nclasspays set pgmseq = 10 where classid = 'Children Single BBT';
update nclasspays set pgmseq = 11 where classid = 'Children Single Class';
update nclasspays set pgmseq = 12 where classid = 'Children Single Ldr';
update nclasspays set pgmseq = 13 where classid = 'Intro Karate';
update nclasspays set pgmseq = 14 where classid = 'Kickboxing';
update nclasspays set pgmseq = 15 where classid = 'Leadership';
update nclasspays set pgmseq = 16 where classid = 'Privates Adult';
update nclasspays set pgmseq = 17 where classid = 'Privates Children';
update nclasspays set pgmseq = 18 where classid = 'Self Defense';
update nclasspays set pgmseq = 19 where classid = 'Special Needs';
update nclasspays set pgmseq = 20 where classid = 'Tai Chi Drop In';
update nclasspays set pgmseq = 21 where classid = 'TaiChi';
update nclasspays set pgmseq = 22 where classid = 'Zoomba';

--
-- Table structure for table `nclasspgm`
--

CREATE TABLE IF NOT EXISTS `nclasspgm` (
  `classid` bigint(20) NOT NULL,
  `pgmid` bigint(20) NOT NULL,
  `pgmcat` varchar(80) NOT NULL,
  `classcat` varchar(80) NOT NULL,
  `agecat` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `nclasspgm`
--
ALTER TABLE `nclasspgm`
 ADD PRIMARY KEY (`classid`,`pgmid`);

delete from nclasspgm;
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 1, 2, 'adult', 'karate',  'adult');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 1, 3, 'adult', 'karate',  'adult');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 1, 4, 'adult', 'karate',  'adult');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 1, 13, 'adult', 'karate',  'adult');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 2, 5, 'special', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 3, 9, 'dragon', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 3, 11, 'dragon', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 3, 13, 'dragon', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 4, 9, 'leopard', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 4, 11, 'leopard', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 4, 13, 'leopard', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 6, 6, 'bbt1', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 6, 10, 'bbt1', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 6, 12, 'bbt1', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 6, 15, 'bbt1', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 7, 6, 'bbt1', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 7, 10, 'bbt1', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 7, 12, 'bbt1', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 7, 15, 'bbt1', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 8, 6, 'bbt2', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 8, 10, 'bbt2', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 8, 12, 'bbt2', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 8, 15, 'bbt2', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 9, 6, 'bbt3', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 9, 10, 'bbt3', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 9, 12, 'bbt3', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 9, 15, 'bbt3', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 10, 7, 'black', 'karate',  'adult');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 11, 8, 'black', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 14, 14, 'other', 'fitness',  'both');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 15, 16, 'privates', 'karate',  'adult');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 16, 17, 'privates', 'karate',  'children');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 17, 9, 'other', 'karate',  'both');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 18, 18, 'other', 'karate',  'both');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 19, 19, 'other', 'karate',  'both');
insert into `nclasspgm` ( `classid`, `pgmid`, `pgmcat`, `classcat`, `agecat`) VALUES ( 20, 21, 'other', 'wellness',  'adult');


DELETE FROM `nclass` WHERE class in ('Inactive','Injured') ;
UPDATE `nclasspays` SET `classseq`= null WHERE classseq = 12 ;
UPDATE `nclasspays` SET `classseq`= null WHERE classseq = 13 ; 
delete from nclasspgm where classid in (12,13);

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
CREATE TABLE IF NOT EXISTS `schedule` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `DayOfWeek` varchar(12) NOT NULL,
  `TimeRange` varchar(20) NOT NULL,
  `AgeRange` varchar(20) NOT NULL,
  `Description` varchar(80) NOT NULL,
  `TakeAttendance` varchar(12) NOT NULL,
  `TimeStart` varchar(5) NOT NULL,
  `TimeEnd` varchar(5) NOT NULL,
  `sortorder` INT NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Sunday','All day','All Ages','No Scheduled Classes','No','00:01','23:59',10);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Monday','Midnight - 3:30PM','All Ages','No Scheduled Classes','No','00:01','15:30',20);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Monday','3:30PM - 4:00','All Ages','Advanced Training Prgm','Yes','15:30','16:00',30);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Monday','4:00PM - 4:30','Ages 4-7','Basic Leopard','Yes','16:00','16:30',40);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Monday','4:30PM - 4:45','Ages 4-7','Leadership','No','16:30','16:45',50);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Monday','4:45PM - 5:30','Ages 4-7','BBT1 Leopard','Yes','16:45','17:30',60);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Monday','5:15PM - 6:00','All Ages','White thru Green w/stripe','All Rank','17:15','18:00',70);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Monday','5:30PM - 6:15','Ages 7-14','BBT3 - Brown','Yes','17:30','18:15',80);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Monday','6:15PM - 6:30','Ages 7-14','Leadership','No','18:15','18:30',90);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Monday','6:30PM - 7:30','Adult','Adult','Yes','18:30','19:30',100);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Monday','7:30PM - 8:30','Adult','Adult Black Belt','No','19:30','20:30',110);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Monday','8:30PM - Midnight','All Ages','No Scheduled Classes','No','20:30','23:59',120);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Tuesday','Midnight - 3:45PM','All Ages','No Scheduled Classes','No','00:01','15:45',130);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Tuesday','3:45PM - 4:30','Ages 7-14','BBT2 - Green','Yes','15:45','16:30',140);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Tuesday','4:30PM - 4:45','Ages 7-14','Leadership','No','16:30','16:45',150);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Tuesday','4:45PM - 5:30','Ages 7-14','BBT1 - Purple - B/G','Yes','16:45','17:30',160);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Tuesday','5:30PM - 6:15','Ages 7-14','Basic Dragon','Yes','17:30','18:15',170);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Tuesday','6:00PM - 6:30','All Ages','Advanced Training Prgm','Yes','18:00','18:30',180);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Tuesday','6:30PM - 7:30','Ages 13+','Cardio Kickboxing','No','18:30','19:30',190);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Tuesday','6:30PM - 7:30','Adult','Tai Chi','No','18:30','19:30',200);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Tuesday','7:30PM - 8:30','Adult','Wellness Class','No','19:30','20:30',210);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Tuesday','8:30PM - Midnight','All Ages','No Scheduled Classes','No','20:30','23:59',220);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Wednesday','Midnight - 3:30PM','All Ages','No Scheduled Classes','No','00:01','15:30',230);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Wednesday','3:30PM - 4:00','All Ages','Advanced Training Prgm','Yes','15:30','16:00',240);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Wednesday','4:00PM - 4:30','Ages 4-7','Basic Leopard','Yes','16:00','16:30',250);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Wednesday','4:30PM - 4:45','Ages 4-7','Leadership','No','16:30','16:45',260);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Wednesday','4:45PM - 5:30','Ages 4-7','BBT1 Leopard','Yes','16:45','17:30',270);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Wednesday','5:15PM - 6:00','All Ages','White thru Green w/stripe','All Rank','17:15','18:00',280);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Wednesday','5:30PM - 6:15','Ages 7-14','BBT3 - Brown','Yes','17:30','18:15',290);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Wednesday','6:15PM - 6:30','Ages 7-14','Leadership','No','18:15','18:30',300);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Wednesday','6:30PM - 7:30','Adult','Teen Defense and Fitness','No','18:30','19:30',310);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Wednesday','6:30PM - 7:30','Adult','Monthly Classes','No','18:30','19:30',320);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Wednesday','7:30PM - 8:30','Adult Black Belt','Adult Black Belt','No','19:30','20:30',330);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Wednesday','8:30PM - Midnight','All Ages','No Scheduled Classes','No','20:30','23:59',340);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Thursday','Midnight - 3:30PM','All Ages','No Scheduled Classes','No','00:01','15:45',350);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Thursday','3:45PM - 4:30','Ages 7-14','BBT1 Leopard','Yes','15:45','16:30',360);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Thursday','4:30PM - 4:45','Ages 7-14','Leadership','No','16:30','16:45',370);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Thursday','4:45PM - 5:30','Ages 7-14','BBT2 - Green','Yes','16:45','17:30',380);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Thursday','5:30PM - 6:15','Ages 7-14','Basic Dragon','Yes','17:30','18:15',390);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Thursday','6:00PM - 6:30','All Ages','Advanced Training Prgm','Yes','18:00','18:30',400);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Thursday','6:30PM - 7:30','Ages 10-18','Blackbelt Jr','Yes','18:30','19:30',410);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Thursday','6:30PM - 7:30','Adult','Adult','Yes','18:30','19:30',420);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Thursday','7:30PM - 8:15','Adult','Adult Sport Karate','No','19:30','20:15',430);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Thursday','8:15PM - Midnight','All Ages','No Scheduled Classes','No','20:15','23:59',440);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Friday','Midnight - 9:30AM','All Ages','No Scheduled Classes','No','00:01','09:30',450);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Friday','9:30AM - 10:30','Adult','Master in the Morning','No','09:30','10:30',460);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Friday','4:30PM - 5:30','By Invitation','Grappling','No','16:30','17:30',470);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Friday','5:30PM - Midnight','All Ages','No Scheduled Classes','No','17:30','23:59',480);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Saturday','Midnight - 8:00AM','All Ages','No Scheduled Classes','No','00:01','08:00',490);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Saturday','8:00AM - 8:45','All Ages','Advanced Training Prgm','Yes','08:00','08:45',500);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Saturday','8:45AM - 9:00','All Ages','No Scheduled Classes','No','08:45','09:00',510);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Saturday','9:00AM - 10:00','Adult','Adult','Yes','09:00','10:00',520);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Saturday','10:05AM - 11:00','Ages 10-18','Blackbelt Jr','Yes','10:05','11:00',530);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Saturday','10:30AM - 11:10','Ages 7-14','Basic Dragon','Yes','10:30','11:10',540);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Saturday','11:00AM - 11:30','Ages 4-7','All Ranks','All Rank','11:00','11:30',550);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Saturday','11:15AM - 11:30','All Ages','Leadership','No','11:15','11:30',560);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Saturday','11:30 AM - 12:15','Ages 7-14','Purple thru Brown','All Rank','11:30','12:15',570);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Saturday','12:15PM - 1:00','All Ages','Sport Karate','No','12:15','13:00',580);
insert into schedule (DayofWeek,TimeRange,AgeRange,Description,TakeAttendance,timestart,timeend,sortorder) values ('Saturday','1:00PM - Midnight','All Ages','No Scheduled Classes','No','13:00','23:59',590);

--
-- Table structure for table 'studentregistration'
--

DROP TABLE IF EXISTS studentregistration;
CREATE TABLE IF NOT EXISTS studentregistration (
  registrationid int(11) NOT NULL AUTO_INCREMENT,
  studentid int(11) NOT NULL,
  classid int(11) NOT NULL,
  registrationtype varchar(20) NOT NULL,
  PRIMARY KEY (registrationid),
  UNIQUE KEY unique_studentregistration (studentid,classid)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;


ALTER TABLE `nclass`
  DROP `mondayInst`,
  DROP `tuesdayInst`,
  DROP `wednesdayInst`,
  DROP `thursdayInst`,
  DROP `saturdayInst`,
  DROP `satOpenInst`,
  DROP `satSportInst`,
  DROP `mondayAssis1`,
  DROP `mondayAssis2`,
  DROP `mondayAssis3`,
  DROP `tuesdayAssis1`,
  DROP `tuesdayAssis2`,
  DROP `tuesdayAssis3`,
  DROP `wedAssis1`,
  DROP `wedAssis2`,
  DROP `wedAssis3`,
  DROP `thurAssis1`,
  DROP `thurAssis2`,
  DROP `thurAssis3`,
  DROP `SatAssis1`,
  DROP `SatAssis2`,
  DROP `SatAssis3`;
  
  ALTER TABLE  `ranklist` DROP PRIMARY KEY ;
  ALTER TABLE  `ranklist` ADD  `rankid` INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST ;
  
  --
-- Table structure for table `classrank`
--

DROP TABLE IF EXISTS `classrank`;
CREATE TABLE IF NOT EXISTS `classrank` (
  `classid` int(11) NOT NULL,
  `rankid` int(11) NOT NULL,
  PRIMARY KEY (`classid`,`rankid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO  `vdb`.`nclass` (
`id` ,
`class` ,
`sort` ,
`nextClass` ,
`rankForNextClass` ,
`ageForNextClass` ,
`classcat` ,
`pgmcat` ,
`agecat` ,
`pictureurl`
)
VALUES (
NULL ,  'Leadership',  '61', NULL , NULL , NULL ,  '',  '',  '', NULL
), (
NULL ,  'Grappling',  '62', NULL , NULL , NULL ,  '',  '',  '', NULL
);

UPDATE  `vdb`.`nclass` SET  `classcat` =  'karate',
`pgmcat` =  'leadership',
`agecat` =  'children' WHERE  `nclass`.`class` =  'Leadership';

UPDATE  `vdb`.`nclass` SET  `classcat` =  'karate',
`pgmcat` =  'other',
`agecat` =  'children' WHERE  `nclass`.`class` =  'Grappling';

insert into classrank (rankid,classid) values (1,10);
insert into classrank (rankid,classid) values (2,11);
insert into classrank (rankid,classid) values (2,10);
insert into classrank (rankid,classid) values (3,9);
insert into classrank (rankid,classid) values (3,1);
insert into classrank (rankid,classid) values (3,22);
insert into classrank (rankid,classid) values (4,11);
insert into classrank (rankid,classid) values (4,10);
insert into classrank (rankid,classid) values (5,9);
insert into classrank (rankid,classid) values (5,1);
insert into classrank (rankid,classid) values (5,22);
insert into classrank (rankid,classid) values (6,11);
insert into classrank (rankid,classid) values (6,10);
insert into classrank (rankid,classid) values (7,9);
insert into classrank (rankid,classid) values (7,1);
insert into classrank (rankid,classid) values (7,22);
insert into classrank (rankid,classid) values (8,11);
insert into classrank (rankid,classid) values (8,10);
insert into classrank (rankid,classid) values (9,10);
insert into classrank (rankid,classid) values (10,10);
insert into classrank (rankid,classid) values (11,10);
insert into classrank (rankid,classid) values (12,10);
insert into classrank (rankid,classid) values (13,10);
insert into classrank (rankid,classid) values (14,6);
insert into classrank (rankid,classid) values (14,1);
insert into classrank (rankid,classid) values (14,22);
insert into classrank (rankid,classid) values (15,6);
insert into classrank (rankid,classid) values (15,22);
insert into classrank (rankid,classid) values (16,6);
insert into classrank (rankid,classid) values (16,22);
insert into classrank (rankid,classid) values (17,6);
insert into classrank (rankid,classid) values (17,1);
insert into classrank (rankid,classid) values (17,22);
insert into classrank (rankid,classid) values (22,8);
insert into classrank (rankid,classid) values (22,1);
insert into classrank (rankid,classid) values (22,22);
insert into classrank (rankid,classid) values (23,8);
insert into classrank (rankid,classid) values (23,22);
insert into classrank (rankid,classid) values (24,8);
insert into classrank (rankid,classid) values (24,22);
insert into classrank (rankid,classid) values (25,8);
insert into classrank (rankid,classid) values (25,1);
insert into classrank (rankid,classid) values (25,22);
insert into classrank (rankid,classid) values (34,4);
insert into classrank (rankid,classid) values (34,3);
insert into classrank (rankid,classid) values (34,1);
insert into classrank (rankid,classid) values (35,4);
insert into classrank (rankid,classid) values (35,3);
insert into classrank (rankid,classid) values (40,6);
insert into classrank (rankid,classid) values (40,1);
insert into classrank (rankid,classid) values (40,22);
insert into classrank (rankid,classid) values (41,6);
insert into classrank (rankid,classid) values (41,22);
insert into classrank (rankid,classid) values (50,4);
insert into classrank (rankid,classid) values (50,3);
insert into classrank (rankid,classid) values (50,1);
insert into classrank (rankid,classid) values (51,4);
insert into classrank (rankid,classid) values (51,3);
insert into classrank (rankid,classid) values (56,4);
insert into classrank (rankid,classid) values (56,3);
insert into classrank (rankid,classid) values (56,1);
insert into classrank (rankid,classid) values (57,4);
insert into classrank (rankid,classid) values (57,3);

delete from classrank where classid = 22;

ALTER TABLE `nclasspays`
  DROP `address`,
  DROP `city`,
  DROP `state`,
  DROP `zip`,
  DROP `phone`,
  DROP `phoneExt`,
  DROP `altPhone`,
  DROP `altPhoneExt`,
  DROP `autoBillEFTDate`,
  DROP `firstPaymentDate`;
  
  ALTER TABLE  `nclasspays` CHANGE  `classid`  `removeclassid` VARCHAR( 255 ) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ;
  ALTER TABLE  `nclasspays` CHANGE  `class`  `removeclass` VARCHAR( 255 ) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ;
  
  
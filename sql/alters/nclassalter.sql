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





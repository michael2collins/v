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

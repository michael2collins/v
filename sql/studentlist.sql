--
-- Table structure for table studentlist
--

CREATE TABLE IF NOT EXISTS studentlist (
  listtype varchar(40) NOT NULL,
  listkey varchar(40) NOT NULL,
  listvalue varchar(80) NOT NULL,
  listorder int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `studentlist` ADD PRIMARY KEY( `listtype`, `listkey`);

INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("gisize","8","8",1);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("gisize","7","7",2);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("gisize","6","6",3);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("gisize","5","5",4);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("gisize","4","4",5);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("gisize","3","3",6);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("gisize","2","2",7);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("gisize","1","1",8);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("gisize","0","0",9);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("gisize","00","00",10);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("gisize","000","000",11);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","8","8",1);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","7","7",2);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","6","6",3);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","5","5",4);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","4","4",5);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","3","3",6);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","2","2",7);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","1","1",8);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","0","0",9);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","00","00",10);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","000","000",11);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("shirtsize","Adult XXX","Adult XXX",1);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("shirtsize","Adult XXL","Adult XXL",2);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("shirtsize","Adult XL","Adult XL",3);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("shirtsize","Adult L","Adult L",4);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("shirtsize","Adult M","Adult M",5);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("shirtsize","Adult S","Adult S",6);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("shirtsize","Youth L","Youth L",7);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("shirtsize","Youth M","Youth M",8);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("shirtsize","Youth S","Youth S",9);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("ContactType","BlackBelt","BlackBelt",2);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("ContactType","Break","Break",3);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("ContactType","Inactive","Inactive",4);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("ContactType","Lead","Lead",5);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("ContactType","Student","Student",1);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("ContactType","TaiChi","TaiChi",6);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("ContactType","Tobin","Tobin",7);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("ContactType","Wayland","Wayland",8);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("ContactType","YMCA","YMCA",9);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("Instructor Title","Intern","Intern",2);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("Instructor Title","Instructor Assistant","Instructor Assistant",3);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("Instructor Title","Instructor","Instructor",4);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("Instructor Title","Storm Team","Storm Team",1);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("Instructor Title","Master Instructor","Master Instructor",5);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("Instructor Title","Asst Chief Instructor","Asst Chief Instructor",6);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("Instructor Title","Chief Instructor","Chief Instructor",7);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("Instructor Title","Judan Master Instructor","Judan Master Instructor",8);

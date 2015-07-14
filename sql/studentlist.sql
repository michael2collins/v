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
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("gisize","Zero","Zero",9);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("gisize","Double Zero","Double Zero",10);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("gisize","Triple Zero","Triple Zero",11);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","8","8",1);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","7","7",2);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","6","6",3);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","5","5",4);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","4","4",5);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","3","3",6);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","2","2",7);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","1","1",8);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","Zero","Zero",9);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","Double Zero","Double Zero",10);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("beltsize","Triple Zero","Triple Zero",11);
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
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Natick","Natick",1);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Chicopee","Chicopee",2);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Holliston","Holliston",3);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Marlborough","Marlborough",4);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Mashpee","Mashpee",5);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Palmer","Palmer",6);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Shrewsbury","Shrewsbury",7);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Somerville","Somerville",8);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Walpole","Walpole",9);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Westborough","Westborough",10);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Williamstown","Williamstown",11);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Wrentham/Norfolk","Wrentham/Norfolk",12);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Cranston RI","Cranston RI",13);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Middletown RI","Middletown RI",14);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Syracuse NY","Syracuse NY",15);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Antrim NH","Antrim NH",16);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Bennington NH","Bennington NH",17);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Richland NH","Richland NH",18);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Concord NH","Concord NH",19);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Biddeford ME","Biddeford ME",20);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Portland ME","Portland ME",21);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Scarborough ME","Scarborough ME",22);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Standish ME","Standish ME",23);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Barre VT","Barre VT",24);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Ambler PA","Ambler PA",25);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Chalfont PA","Chalfont PA",26);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Chester Springs PA","Chester Springs PA",27);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Enfield CT","Enfield CT",28);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Fairfield CT","Fairfield CT",29);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Glastonbury CT","Glastonbury CT",30);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Newington CT","Newington CT",31);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","North Windham CT","North Windham CT",32);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Simsbury CT","Simsbury CT",33);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Southington CT","Southington CT",34);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Torrington CT","Torrington CT",35);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","West Hartford CT","West Hartford CT",36);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Windsor CT","Windsor CT",37);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Antioch IL","Antioch IL",38);
INSERT INTO studentlist (listtype,listkey,listvalue,listorder) VALUES("School","Other","Other",39);


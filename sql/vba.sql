-- phpMyAdmin SQL Dump
-- version 4.3.8
-- http://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Mar 11, 2015 at 03:20 PM
-- Server version: 5.5.42
-- PHP Version: 5.4.37

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `vba`
--

-- --------------------------------------------------------

--
-- Table structure for table `eventregistration`
--

DROP TABLE IF EXISTS `eventregistration`;
CREATE TABLE IF NOT EXISTS `eventregistration` (
  `event` varchar(255) NOT NULL,
  `event date` datetime NOT NULL,
  `Contact` int(11) NOT NULL,
  `eventType` varchar(255) DEFAULT NULL,
  `paid` bit(1) DEFAULT b'0',
  `shirtSize` varchar(255) DEFAULT NULL,
  `Notes` longtext,
  `include` bit(1) DEFAULT b'0',
  `attended` bit(1) DEFAULT b'0',
  `ordered` bit(1) DEFAULT b'0',
  `SSMA_TimeStamp` longblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `eventregistration`
--

INSERT INTO `eventregistration` (`event`, `event date`, `Contact`, `eventType`, `paid`, `shirtSize`, `Notes`, `include`, `attended`, `ordered`, `SSMA_TimeStamp`) VALUES
('2014 Aug. Karate Kamp', '2014-02-19 00:00:00', 5366, 'Camp', b'1', 'Jack/Steven', '60 in. Red', b'0', b'0', b'0', 0x00000000000008d9),
('2014 Aug. Karate Kamp', '2014-02-19 00:00:00', 5401, 'Camp', b'1', 'Lizzy/Sophia', '62 in. Purple', b'0', b'0', b'0', 0x00000000000008da),
('2014 Aug. Karate Kamp', '2014-02-19 00:00:00', 6534, 'Camp', b'1', 'Alex/Doug', '52 in.', b'0', b'0', b'0', 0x00000000000008db),
('2014 Aug. Karate Kamp', '2014-02-19 00:00:00', 6676, 'Camp', b'1', 'Lizzy/Sophia', '58 in. Green', b'0', b'0', b'0', 0x00000000000008dc),
('2014 Aug. Karate Kamp', '2014-02-19 00:00:00', 7002, 'Camp', b'1', NULL, '55 in. Red', b'0', b'0', b'0', 0x00000000000008dd);

-- --------------------------------------------------------

--
-- Table structure for table `leadmgmt`
--

DROP TABLE IF EXISTS `leadmgmt`;
CREATE TABLE IF NOT EXISTS `leadmgmt` (
  `contactid` int(11) NOT NULL,
  `lead source` varchar(255) DEFAULT NULL,
  `lead acquired date` datetime DEFAULT NULL,
  `week1 contacted date` datetime DEFAULT NULL,
  `week3 contacted date` datetime DEFAULT NULL,
  `week6 contacted date` datetime DEFAULT NULL,
  `week9 contacted date` datetime DEFAULT NULL,
  `week1 Email` bit(1) DEFAULT b'0',
  `week1 Call` bit(1) DEFAULT b'0',
  `week1 Letter` bit(1) DEFAULT b'0',
  `week3 Email` bit(1) DEFAULT b'0',
  `week3 Call` bit(1) DEFAULT b'0',
  `week3 Letter` bit(1) DEFAULT b'0',
  `week6 Email` bit(1) DEFAULT b'0',
  `week6 Call` bit(1) DEFAULT b'0',
  `week6 Letter` bit(1) DEFAULT b'0',
  `week9 Email` bit(1) DEFAULT b'0',
  `week9 Call` bit(1) DEFAULT b'0',
  `week9 Letter` bit(1) DEFAULT b'0',
  `Studio Info Pack` bit(1) DEFAULT b'0',
  `Lead Notes` longtext,
  `Lead Gone Cold` bit(1) DEFAULT b'0',
  `SSMA_TimeStamp` longblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `leadmgmt`
--

INSERT INTO `leadmgmt` (`contactid`, `lead source`, `lead acquired date`, `week1 contacted date`, `week3 contacted date`, `week6 contacted date`, `week9 contacted date`, `week1 Email`, `week1 Call`, `week1 Letter`, `week3 Email`, `week3 Call`, `week3 Letter`, `week6 Email`, `week6 Call`, `week6 Letter`, `week9 Email`, `week9 Call`, `week9 Letter`, `Studio Info Pack`, `Lead Notes`, `Lead Gone Cold`, `SSMA_TimeStamp`) VALUES
(1450, NULL, '2010-03-17 21:25:44', NULL, NULL, NULL, NULL, b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', NULL, b'1', 0x000000000000099f),
(1530, NULL, '2010-06-08 16:17:11', NULL, NULL, NULL, NULL, b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', NULL, b'0', 0x00000000000009a0),
(1817, 'Movie Night 5/21', '2010-05-25 15:38:56', '2010-05-25 00:00:00', NULL, NULL, NULL, b'0', b'0', b'1', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', NULL, b'0', 0x00000000000009a1),
(2095, NULL, '2010-03-22 17:25:41', '2010-03-22 00:00:00', NULL, NULL, NULL, b'0', b'0', b'1', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', NULL, b'0', 0x00000000000009a2),
(2228, NULL, '2010-03-22 17:30:11', '2010-03-15 00:00:00', NULL, NULL, NULL, b'0', b'0', b'1', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', NULL, b'0', 0x00000000000009a3);

-- --------------------------------------------------------

--
-- Table structure for table `nattendance`
--

DROP TABLE IF EXISTS `nattendance`;
CREATE TABLE IF NOT EXISTS `nattendance` (
  `ID` int(11) NOT NULL,
  `MondayOfWeek` datetime NOT NULL,
  `contid` int(11) NOT NULL,
  `ContactId` int(11) DEFAULT NULL,
  `day1` bit(1) DEFAULT b'0',
  `day2` bit(1) DEFAULT b'0',
  `day3` bit(1) DEFAULT b'0',
  `day4` bit(1) DEFAULT b'0',
  `day5` bit(1) DEFAULT b'0',
  `day6` bit(1) DEFAULT b'0',
  `day7` bit(1) DEFAULT b'0',
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `class` varchar(255) DEFAULT NULL,
  `rank` varchar(255) DEFAULT NULL,
  `alphasortkey` varchar(255) DEFAULT NULL,
  `AttendanceForWeek` int(11) DEFAULT NULL,
  `SSMA_TimeStamp` longblob NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2109 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `nattendance`
--

INSERT INTO `nattendance` (`ID`, `MondayOfWeek`, `contid`, `ContactId`, `day1`, `day2`, `day3`, `day4`, `day5`, `day6`, `day7`, `firstname`, `lastname`, `class`, `rank`, `alphasortkey`, `AttendanceForWeek`, `SSMA_TimeStamp`) VALUES
(1870, '2013-11-25 00:00:00', 5347, 5347, b'0', b'0', b'0', b'0', b'0', b'0', b'0', 'Mary', 'Carter', 'Adult', 'Green w/Brown Stripe Belt', 'ha', NULL, 0x0000000000000a5a),
(1885, '2013-11-25 00:00:00', 5364, 5364, b'0', b'0', b'0', b'0', b'0', b'0', b'0', 'Shayla', 'DeGeorge', 'BBT3 - Brown', '1st Degree Brown Belt', 'ic', NULL, 0x0000000000000a5b),
(1881, '2013-11-25 00:00:00', 5366, 5366, b'0', b'0', b'0', b'0', b'0', b'0', b'0', 'Justus', 'Dick', 'BBT3 - Brown', '2nd Degree Brown Belt', 'ib', NULL, 0x0000000000000a5c),
(2108, '2013-11-25 00:00:00', 5367, 5367, b'0', b'0', b'0', b'0', b'0', b'0', b'0', 'Aidan', 'Doyle', 'BBT3 - Brown', '2nd Degree Brown Belt', 'ib', NULL, 0x0000000000000a5d),
(1857, '2013-11-25 00:00:00', 5377, 5377, b'0', b'0', b'0', b'0', b'0', b'0', b'0', 'Emma', 'Jackson', 'BBT2 - Green', 'Green Belt', 'ga', NULL, 0x0000000000000a5e);

-- --------------------------------------------------------

--
-- Table structure for table `nclass`
--

DROP TABLE IF EXISTS `nclass`;
CREATE TABLE IF NOT EXISTS `nclass` (
  `class` varchar(255) NOT NULL,
  `sort` int(11) DEFAULT NULL,
  `mondayInst` varchar(255) DEFAULT NULL,
  `tuesdayInst` varchar(255) DEFAULT NULL,
  `wednesdayInst` varchar(255) DEFAULT NULL,
  `thursdayInst` varchar(255) DEFAULT NULL,
  `saturdayInst` varchar(255) DEFAULT NULL,
  `satOpenInst` varchar(255) DEFAULT NULL,
  `satSportInst` varchar(255) DEFAULT NULL,
  `mondayAssis1` varchar(255) DEFAULT NULL,
  `mondayAssis2` varchar(255) DEFAULT NULL,
  `mondayAssis3` varchar(255) DEFAULT NULL,
  `tuesdayAssis1` varchar(255) DEFAULT NULL,
  `tuesdayAssis2` varchar(255) DEFAULT NULL,
  `tuesdayAssis3` varchar(255) DEFAULT NULL,
  `wedAssis1` varchar(255) DEFAULT NULL,
  `wedAssis2` varchar(255) DEFAULT NULL,
  `wedAssis3` varchar(255) DEFAULT NULL,
  `thurAssis1` varchar(255) DEFAULT NULL,
  `thurAssis2` varchar(255) DEFAULT NULL,
  `thurAssis3` varchar(255) DEFAULT NULL,
  `SatAssis1` varchar(255) DEFAULT NULL,
  `SatAssis2` varchar(255) DEFAULT NULL,
  `SatAssis3` varchar(255) DEFAULT NULL,
  `nextClass` varchar(255) DEFAULT NULL,
  `rankForNextClass` varchar(255) DEFAULT NULL,
  `ageForNextClass` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `nclass`
--

INSERT INTO `nclass` (`class`, `sort`, `mondayInst`, `tuesdayInst`, `wednesdayInst`, `thursdayInst`, `saturdayInst`, `satOpenInst`, `satSportInst`, `mondayAssis1`, `mondayAssis2`, `mondayAssis3`, `tuesdayAssis1`, `tuesdayAssis2`, `tuesdayAssis3`, `wedAssis1`, `wedAssis2`, `wedAssis3`, `thurAssis1`, `thurAssis2`, `thurAssis3`, `SatAssis1`, `SatAssis2`, `SatAssis3`, `nextClass`, `rankForNextClass`, `ageForNextClass`) VALUES
('Adult', 70, 'Pat Wyatt', NULL, NULL, 'Mark Lehman', 'Beef Mazzola', NULL, 'Mark Lehman', 'Tom Morrell', 'Deb Morrell', 'Roy Kennedy', NULL, NULL, NULL, NULL, NULL, NULL, 'Karen Humphries', 'Michael Collins', NULL, NULL, NULL, NULL, 'Blackbelt Adult', '1st Degree Black Belt', NULL),
('After School', 180, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('Basic Dragon', 30, NULL, 'John Curtin', NULL, 'Matthew Higgins', NULL, 'Roy Kennedy', 'Mark Lehman', NULL, NULL, NULL, 'Brandon Coll', NULL, NULL, NULL, NULL, NULL, 'Sophia  Clune', 'Emily Tumang', 'Elizabeth Flagg', NULL, NULL, NULL, 'BBT1 - Purple - B/G', 'Orange Belt mid-term Stripe', NULL),
('Basic Leopard', 10, 'Mark Lehman', NULL, 'Erin Curtin', NULL, NULL, 'Roy Kennedy', 'Mark Lehman', 'Gabriela Carey', 'Elizabeth Zuelke:STORM', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'BBT1 Leopard', 'Orange Belt mid-term Stripe', 8),
('BBT - Multiclasses', 55, 'Karen Humphries', 'Karen Humphries', 'Karen Humphries', 'Karen Humphries', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'BBT2 - Green', 'Blue w/Green mid-term Stripe', 8);

-- --------------------------------------------------------

--
-- Table structure for table `nclasslist`
--

DROP TABLE IF EXISTS `nclasslist`;
CREATE TABLE IF NOT EXISTS `nclasslist` (
  `class` varchar(255) NOT NULL,
  `classType` varchar(255) DEFAULT NULL,
  `12MonthPrice` float DEFAULT NULL,
  `6MonthPrice` float DEFAULT NULL,
  `MonthlyPrice` int(11) DEFAULT NULL,
  `WeeklyPrice` int(11) DEFAULT NULL,
  `2ndPersonDiscount` float DEFAULT NULL,
  `3rdPersonDiscount` float DEFAULT '0',
  `4thPersonDiscount` float DEFAULT NULL,
  `SpecialPrice` int(11) DEFAULT NULL,
  `sortKey` int(11) DEFAULT NULL,
  `SSMA_TimeStamp` longblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `nclasslist`
--

INSERT INTO `nclasslist` (`class`, `classType`, `12MonthPrice`, `6MonthPrice`, `MonthlyPrice`, `WeeklyPrice`, `2ndPersonDiscount`, `3rdPersonDiscount`, `4thPersonDiscount`, `SpecialPrice`, `sortKey`, `SSMA_TimeStamp`) VALUES
('Adult ATP', 'AdultKarate', 0.8, 0.9, 155, 30, 0.75, 0.5, 0, NULL, 60, 0x0000000000002c95),
('Adult Basic', 'AdultKarate', 0.8, 0.9, 105, 30, 0.75, 0.5, 0, NULL, 65, 0x0000000000002c96),
('Adult Single Class', 'AdultKarate', 0.8, 0.9, 60, 30, 0.75, 0.5, 0, NULL, 70, 0x0000000000002c97),
('Adult Unlimited', 'AdultKarate', 0.8, 0.9, 135, 30, 0.75, 0.5, 0, NULL, 80, 0x0000000000002c98),
('After School', 'AfterSchool', NULL, NULL, NULL, NULL, NULL, 0, NULL, 60, 51, 0x0000000000002c99);

-- --------------------------------------------------------

--
-- Table structure for table `nclasspays`
--

DROP TABLE IF EXISTS `nclasspays`;
CREATE TABLE IF NOT EXISTS `nclasspays` (
  `ID` int(11) NOT NULL,
  `contactid` int(11) DEFAULT NULL,
  `classid` varchar(255) DEFAULT NULL,
  `classPayName` varchar(255) DEFAULT NULL,
  `class` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zip` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `phoneExt` varchar(255) DEFAULT NULL,
  `altPhone` varchar(255) DEFAULT NULL,
  `altPhoneExt` varchar(255) DEFAULT NULL,
  `isTestFeeWaived` bit(1) DEFAULT b'0',
  `autoBillEFTDate` varchar(255) DEFAULT NULL,
  `firstPaymentDate` datetime DEFAULT NULL,
  `SSMA_TimeStamp` longblob NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `nclasspays`
--

INSERT INTO `nclasspays` (`ID`, `contactid`, `classid`, `classPayName`, `class`, `address`, `city`, `state`, `zip`, `phone`, `phoneExt`, `altPhone`, `altPhoneExt`, `isTestFeeWaived`, `autoBillEFTDate`, `firstPaymentDate`, `SSMA_TimeStamp`) VALUES
(30, 5340, 'Blackbelt Jr', 'Jennifer & RychardBirch', 'Blackbelt Jr', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, b'0', NULL, NULL, 0x0000000000002cab),
(31, 5341, 'Blackbelt Jr', 'Nancy & JoeBombino', 'Blackbelt Jr', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, b'0', NULL, NULL, 0x0000000000002cac),
(33, 5342, 'Blackbelt Jr', 'Claudia & GiovanniBravin', 'Blackbelt Jr', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, b'0', NULL, NULL, 0x0000000000002cad),
(34, 5343, 'Blackbelt Jr', 'Micheal & MariaCarey', 'Blackbelt Jr', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, b'0', NULL, NULL, 0x0000000000002cae),
(35, 5344, 'Adult Basic', 'Micheal & MariaCarey', 'Inactive', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, b'0', NULL, NULL, 0x0000000000002caf);

-- --------------------------------------------------------

--
-- Table structure for table `ncontactmgmt`
--

DROP TABLE IF EXISTS `ncontactmgmt`;
CREATE TABLE IF NOT EXISTS `ncontactmgmt` (
  `contactid` int(11) NOT NULL DEFAULT '0',
  `contactmgmttype` varchar(255) NOT NULL,
  `contactdateyyyy` int(11) NOT NULL DEFAULT '0',
  `contactdatem` int(11) NOT NULL DEFAULT '0',
  `contactdated` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ncontactmgmt`
--

INSERT INTO `ncontactmgmt` (`contactid`, `contactmgmttype`, `contactdateyyyy`, `contactdatem`, `contactdated`) VALUES
(5340, '1st degree black belt test', 2010, 12, 4),
(5340, '12-2012 2nd Degree Black Belt', 2012, 12, 10),
(5340, '7-2010 1st Degree Brown Belt', 2010, 7, 19),
(5341, '11-2010 1st Degree Brown Belt', 2010, 11, 13),
(5341, '11-2010 filter 1st Degree Black Belt', 2010, 11, 13);

-- --------------------------------------------------------

--
-- Table structure for table `ncontacts`
--

DROP TABLE IF EXISTS `ncontacts`;
CREATE TABLE IF NOT EXISTS `ncontacts` (
  `ID` int(11) NOT NULL,
  `LastName` varchar(50) DEFAULT NULL,
  `FirstName` varchar(50) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Email2` varchar(255) DEFAULT NULL,
  `Parent` varchar(50) DEFAULT NULL,
  `Phone` varchar(25) DEFAULT NULL,
  `AltPhone` varchar(25) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `City` varchar(50) DEFAULT 'Natick',
  `State` varchar(50) DEFAULT 'MA',
  `ZIP` varchar(255) DEFAULT '01760',
  `Notes` longtext,
  `Birthday` datetime DEFAULT NULL,
  `StartDate` datetime DEFAULT NULL,
  `NewRank` varchar(255) DEFAULT NULL,
  `BeltSize` double DEFAULT NULL,
  `CurrentRank` varchar(255) DEFAULT NULL,
  `LastPromoted` datetime DEFAULT NULL,
  `ReferredBy` varchar(255) DEFAULT NULL,
  `ConsentToPublicPictures` bit(1) DEFAULT b'0',
  `Attachments` text,
  `InstructorPaymentFree` bit(1) DEFAULT b'0',
  `ContactType` varchar(255) DEFAULT 'Student',
  `include` bit(1) DEFAULT b'0',
  `InstructorFlag` bit(1) DEFAULT b'0',
  `quickbooklink` varchar(255) DEFAULT NULL,
  `instructorTitle` varchar(255) DEFAULT NULL,
  `testDate` varchar(255) DEFAULT NULL,
  `testTime` varchar(255) DEFAULT NULL,
  `bdayinclude` bit(1) DEFAULT b'0',
  `signupDate` datetime DEFAULT NULL,
  `sex` varchar(255) DEFAULT 'Unknown',
  `medicalConcerns` longtext,
  `GuiSize` varchar(255) DEFAULT '1',
  `ShirtSize` varchar(255) DEFAULT 'Adult L',
  `phoneExt` varchar(255) DEFAULT NULL,
  `altPhoneExt` varchar(255) DEFAULT NULL,
  `CurrentReikiRank` varchar(255) DEFAULT NULL,
  `StudentSchool` varchar(255) DEFAULT NULL,
  `EmergencyContact` varchar(255) DEFAULT NULL,
  `sendWelcomeCard` bit(1) DEFAULT b'0',
  `dateEntered` datetime DEFAULT NULL,
  `dateInactive` datetime DEFAULT NULL,
  `CurrentIARank` varchar(255) DEFAULT NULL,
  `ReadyForNextRank` int(11) DEFAULT '0',
  `nextScheduledTest` varchar(50) DEFAULT NULL,
  `upgrade` int(11) DEFAULT '0',
  `SSMA_TimeStamp` longblob NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5345 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ncontacts`
--

INSERT INTO `ncontacts` (`ID`, `LastName`, `FirstName`, `Email`, `Email2`, `Parent`, `Phone`, `AltPhone`, `Address`, `City`, `State`, `ZIP`, `Notes`, `Birthday`, `StartDate`, `NewRank`, `BeltSize`, `CurrentRank`, `LastPromoted`, `ReferredBy`, `ConsentToPublicPictures`, `Attachments`, `InstructorPaymentFree`, `ContactType`, `include`, `InstructorFlag`, `quickbooklink`, `instructorTitle`, `testDate`, `testTime`, `bdayinclude`, `signupDate`, `sex`, `medicalConcerns`, `GuiSize`, `ShirtSize`, `phoneExt`, `altPhoneExt`, `CurrentReikiRank`, `StudentSchool`, `EmergencyContact`, `sendWelcomeCard`, `dateEntered`, `dateInactive`, `CurrentIARank`, `ReadyForNextRank`, `nextScheduledTest`, `upgrade`, `SSMA_TimeStamp`) VALUES
(5340, 'Birch', 'Spencer', 'spencerbirch45@gmail.com', 'jenbirchis@gmail.com', 'Jennifer & Rychard', '5086517734', NULL, '9 Sawin Steet ', 'Natick', 'MA', '01760', '', '1999-03-27 00:00:00', '2005-04-27 00:00:00', NULL, 4, '2nd Degree Black Belt', '2012-12-01 00:00:00', NULL, b'0', '', b'0', 'Inactive', b'0', b'0', 'Birch, Spencer', 'Intern', '', '', b'0', '2005-04-27 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, b'0', NULL, '2014-04-03 16:55:09', NULL, 0, NULL, 1369, 0x0000000000005192),
(5341, 'Bombino', 'Steven', 'nancynavarro62@gmail.com', 'stbombino@students.natickps.org', 'Nancy & Joe', '5086470336', '5086476400', '8 Sheridan Street', 'Natick', 'MA', '01760', '', '1996-05-27 00:00:00', '2004-02-23 00:00:00', NULL, 5, '1st Degree Black Belt', '2011-12-10 00:00:00', NULL, b'0', '', b'1', 'Inactive', b'0', b'0', 'Bambino, Steven', 'Intern', '12/10/2011', '2:00 PM', b'0', '2004-02-23 00:00:00', 'Male', NULL, NULL, NULL, NULL, '1629', NULL, NULL, NULL, b'0', NULL, '2014-09-22 15:13:00', NULL, 0, NULL, 1370, 0x0000000000005193),
(5342, 'Bravin', 'Alyssa', 'gbravin@aol.com', NULL, 'Claudia & Giovanni', '5086555090', '6175294962', '2 Durant Road', 'Natick', 'MA', '01760', '', '1997-09-14 00:00:00', '2007-08-22 00:00:00', NULL, 4, '3rd Degree Black Belt', '2014-12-13 00:00:00', NULL, b'0', '', b'0', 'BlackBelt', b'0', b'0', 'Bravin, Alyssa', 'Intern', '', '', b'0', '2007-08-22 00:00:00', NULL, NULL, '3', 'Adult S', NULL, NULL, NULL, NULL, NULL, b'0', NULL, NULL, 'Intern', 0, NULL, 1372, 0x0000000000005194),
(5343, 'Carey', 'Gabriela', 'mariaocarey@msn.com ', NULL, 'Micheal & Maria', NULL, NULL, '88 Bacon Street', 'Natick', 'MA', '01760', '', '2010-03-01 00:00:00', '2010-03-01 18:42:21', NULL, 3, '1st Degree Black Belt', '2009-11-07 00:00:00', NULL, b'0', '', b'0', 'Inactive', b'0', b'0', NULL, 'STORM', NULL, NULL, b'0', '2010-03-01 18:42:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, b'0', NULL, NULL, NULL, 0, NULL, 1373, 0x0000000000005195),
(5344, 'Carey', 'Maria', 'mariaocarey@msn.com ', NULL, NULL, '5086534135', NULL, '88 Bacon Street', 'Natick', 'MA', '01760', '', '1964-06-24 00:00:00', '2008-06-21 00:00:00', NULL, 5, 'Yellow Belt', '2008-07-26 00:00:00', NULL, b'0', '', b'0', 'Inactive', b'0', b'0', 'Carey, Sophia & Gabriela', NULL, '', '', b'0', '2008-06-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, b'0', NULL, NULL, NULL, 0, NULL, 1374, 0x0000000000005196);

-- --------------------------------------------------------

--
-- Table structure for table `nleadmgmt`
--

DROP TABLE IF EXISTS `nleadmgmt`;
CREATE TABLE IF NOT EXISTS `nleadmgmt` (
  `contactid` int(11) NOT NULL,
  `leadsource` varchar(255) DEFAULT NULL,
  `leadacquireddate` datetime DEFAULT NULL,
  `week1contacteddate` datetime DEFAULT NULL,
  `week3contacteddate` datetime DEFAULT NULL,
  `week6contacteddate` datetime DEFAULT NULL,
  `week9contacteddate` datetime DEFAULT NULL,
  `week1Email` bit(1) DEFAULT b'0',
  `week1Call` bit(1) DEFAULT b'0',
  `week1Letter` bit(1) DEFAULT b'0',
  `week3Email` bit(1) DEFAULT b'0',
  `week3Call` bit(1) DEFAULT b'0',
  `week3Letter` bit(1) DEFAULT b'0',
  `week6Email` bit(1) DEFAULT b'0',
  `week6Call` bit(1) DEFAULT b'0',
  `week6Letter` bit(1) DEFAULT b'0',
  `week9Email` bit(1) DEFAULT b'0',
  `week9Call` bit(1) DEFAULT b'0',
  `week9Letter` bit(1) DEFAULT b'0',
  `StudioInfoPack` bit(1) DEFAULT b'0',
  `LeadNotes` longtext,
  `LeadGoneCold` bit(1) DEFAULT b'0',
  `SSMA_TimeStamp` longblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `nleadmgmt`
--

INSERT INTO `nleadmgmt` (`contactid`, `leadsource`, `leadacquireddate`, `week1contacteddate`, `week3contacteddate`, `week6contacteddate`, `week9contacteddate`, `week1Email`, `week1Call`, `week1Letter`, `week3Email`, `week3Call`, `week3Letter`, `week6Email`, `week6Call`, `week6Letter`, `week9Email`, `week9Call`, `week9Letter`, `StudioInfoPack`, `LeadNotes`, `LeadGoneCold`, `SSMA_TimeStamp`) VALUES
(5397, NULL, '2010-03-17 21:25:44', NULL, NULL, NULL, NULL, b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', NULL, b'1', 0x00000000000039e0),
(5433, NULL, '2010-06-08 16:17:11', NULL, NULL, NULL, NULL, b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', NULL, b'0', 0x00000000000039e1),
(5654, 'Movie Night 5/21', '2010-05-25 15:38:56', '2010-05-25 00:00:00', NULL, NULL, NULL, b'0', b'0', b'1', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', NULL, b'0', 0x00000000000039e2),
(5874, NULL, '2010-03-22 17:25:41', '2010-03-22 00:00:00', NULL, NULL, NULL, b'0', b'0', b'1', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', NULL, b'0', 0x00000000000039e3),
(5977, NULL, '2010-03-22 17:30:11', '2010-03-15 00:00:00', NULL, NULL, NULL, b'0', b'0', b'1', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', b'0', NULL, b'0', 0x00000000000039e4);

-- --------------------------------------------------------

--
-- Table structure for table `notherclass`
--

DROP TABLE IF EXISTS `notherclass`;
CREATE TABLE IF NOT EXISTS `notherclass` (
  `ID` int(11) NOT NULL,
  `otherClassname` varchar(255) DEFAULT NULL,
  `testType` varchar(255) DEFAULT NULL,
  `sortorder` int(11) DEFAULT '0',
  `testTime` varchar(255) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `notherclass`
--

INSERT INTO `notherclass` (`ID`, `otherClassname`, `testType`, `sortorder`, `testTime`) VALUES
(1, 'IA', 'IA', 12, '8:00 am'),
(2, 'Reiki', 'Reiki', 11, NULL),
(3, 'Tobin', 'Tobin', 13, NULL),
(4, 'Wayland', 'Wayland', 14, NULL),
(5, 'Johnson', 'Johnson', 15, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `npayments`
--

DROP TABLE IF EXISTS `npayments`;
CREATE TABLE IF NOT EXISTS `npayments` (
  `PaymentClassName` varchar(255) NOT NULL,
  `NumberOfMembers` varchar(255) DEFAULT '1',
  `LastPaymentdate` datetime DEFAULT NULL,
  `Nextpaymentdate` datetime DEFAULT NULL,
  `paymenttype` varchar(255) DEFAULT 'Check',
  `PaymentNotes` longtext,
  `PaymentPlan` varchar(255) DEFAULT 'Monthly',
  `PaymentAmount` decimal(19,4) DEFAULT NULL,
  `PriceSetby` varchar(255) DEFAULT 'Mark',
  `Pricesetdate` datetime DEFAULT NULL,
  `SSMA_TimeStamp` longblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `npayments`
--

INSERT INTO `npayments` (`PaymentClassName`, `NumberOfMembers`, `LastPaymentdate`, `Nextpaymentdate`, `paymenttype`, `PaymentNotes`, `PaymentPlan`, `PaymentAmount`, `PriceSetby`, `Pricesetdate`, `SSMA_TimeStamp`) VALUES
('Aaron Sodickson', '1', '2015-01-20 00:00:00', '2016-01-15 00:00:00', 'Check', NULL, '6Month', '1536.0000', 'Mark', NULL, 0x0000000000003a96),
('Aarthi Shankar', '1', '2013-09-02 00:00:00', '2013-10-01 00:00:00', 'Check', NULL, 'Monthly', '60.0000', 'Mark', NULL, 0x0000000000003a97),
('Achuoth', '1', '2012-07-24 00:00:00', '2012-09-04 00:00:00', 'Check', NULL, 'Special', '105.0000', 'Mark', NULL, 0x0000000000003a98),
('Adaligil', '1', NULL, '2014-11-30 00:00:00', 'Check', NULL, 'Special', NULL, 'Mark', NULL, 0x0000000000003a99),
('Ainsworth', '1', '2012-06-20 00:00:00', '2012-08-08 00:00:00', 'Check', NULL, 'Special', '60.0000', 'Mark', NULL, 0x0000000000003a9a);

-- --------------------------------------------------------

--
-- Table structure for table `nswitchboarditems`
--

DROP TABLE IF EXISTS `nswitchboarditems`;
CREATE TABLE IF NOT EXISTS `nswitchboarditems` (
  `SwitchboardID` int(11) NOT NULL,
  `ItemNumber` smallint(6) NOT NULL DEFAULT '0',
  `ItemText` varchar(255) DEFAULT NULL,
  `Command` smallint(6) DEFAULT NULL,
  `Argument` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `nswitchboarditems`
--

INSERT INTO `nswitchboarditems` (`SwitchboardID`, `ItemNumber`, `ItemText`, `Command`, `Argument`) VALUES
(1, 0, 'Villaris', NULL, 'Default'),
(1, 1, 'Open Contact List', 2, 'Contact List'),
(1, 2, 'Open Lead List', 2, 'Lead List'),
(1, 3, 'Open Anniversary Candidates', 3, 'Anniversary Candidate'),
(1, 4, 'Open Birthday Candidates', 3, 'Birthday Candidate');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `PaymentClassName` varchar(255) NOT NULL,
  `NumberOfMembers` varchar(255) DEFAULT '1',
  `Last Payment date` datetime DEFAULT NULL,
  `Next payment date` datetime DEFAULT NULL,
  `payment type` varchar(255) DEFAULT 'Check',
  `Payment Notes` longtext,
  `Payment Plan` varchar(255) DEFAULT 'Monthly',
  `Payment Amount` decimal(19,4) DEFAULT NULL,
  `Price Set by` varchar(255) DEFAULT 'Mark',
  `Price set date` datetime DEFAULT NULL,
  `SSMA_TimeStamp` longblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`PaymentClassName`, `NumberOfMembers`, `Last Payment date`, `Next payment date`, `payment type`, `Payment Notes`, `Payment Plan`, `Payment Amount`, `Price Set by`, `Price set date`, `SSMA_TimeStamp`) VALUES
('Aaron Sodickson', '1', '2015-01-20 00:00:00', '2016-01-15 00:00:00', 'Check', NULL, '6Month', '1536.0000', 'Mark', NULL, 0x0000000000003d05),
('Aarthi Shankar', '1', '2013-09-02 00:00:00', '2013-10-01 00:00:00', 'Check', NULL, 'Monthly', '60.0000', 'Mark', NULL, 0x0000000000003d06),
('Achuoth', '1', '2012-07-24 00:00:00', '2012-09-04 00:00:00', 'Check', NULL, 'Special', '105.0000', 'Mark', NULL, 0x0000000000003d07),
('Adaligil', '1', NULL, '2014-11-30 00:00:00', 'Check', NULL, 'Special', NULL, 'Mark', NULL, 0x0000000000003d08),
('Ainsworth', '1', '2012-06-20 00:00:00', '2012-08-08 00:00:00', 'Check', NULL, 'Special', '60.0000', 'Mark', NULL, 0x0000000000003d09);

-- --------------------------------------------------------

--
-- Table structure for table `ranklist`
--

DROP TABLE IF EXISTS `ranklist`;
CREATE TABLE IF NOT EXISTS `ranklist` (
  `ranklist` varchar(255) NOT NULL,
  `sortkey` int(11) DEFAULT NULL,
  `childnextsortkey` int(11) DEFAULT NULL,
  `adultnextsortkey` int(11) DEFAULT NULL,
  `ymcaUse` bit(1) DEFAULT b'0',
  `ymcanextsortkey` int(11) DEFAULT NULL,
  `rankGroup` varchar(255) DEFAULT NULL,
  `alphasortkey` varchar(255) DEFAULT NULL,
  `childAttendPromoteTarget` int(11) DEFAULT '0',
  `childDurationPromoteTarget` int(11) DEFAULT '0',
  `adultAttendPromoteTarget` int(11) DEFAULT '0',
  `adultDurationPromoteTarget` int(11) DEFAULT '0',
  `SSMA_TimeStamp` longblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ranklist`
--

INSERT INTO `ranklist` (`ranklist`, `sortkey`, `childnextsortkey`, `adultnextsortkey`, `ymcaUse`, `ymcanextsortkey`, `rankGroup`, `alphasortkey`, `childAttendPromoteTarget`, `childDurationPromoteTarget`, `adultAttendPromoteTarget`, `adultDurationPromoteTarget`, `SSMA_TimeStamp`) VALUES
('10th Degree Grand Master', 29, NULL, NULL, b'0', NULL, 'grandmaster', 'jj', NULL, NULL, NULL, NULL, 0x0000000000003f74),
('1st Degree Black Belt', 20, 21, 21, b'0', NULL, 'black', 'ja', 180, 90, 90, 90, 0x0000000000003f75),
('1st Degree Brown Belt', 19, 20, 20, b'0', NULL, 'advanced', 'ic', 40, 22, 22, 22, 0x0000000000003f76),
('2nd Degree Black Belt', 21, 22, 22, b'0', NULL, 'black', 'jb', 180, 90, 90, 90, 0x0000000000003f77),
('_Owner', 30, NULL, NULL, b'0', NULL, NULL, 'ka', NULL, NULL, NULL, NULL, 0x0000000000003f73);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
CREATE TABLE IF NOT EXISTS `settings` (
  `ID` int(11) NOT NULL,
  `ShowGettingStarted` bit(1) NOT NULL DEFAULT b'0',
  `SSMA_TimeStamp` longblob NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`ID`, `ShowGettingStarted`, `SSMA_TimeStamp`) VALUES
(1, b'0', 0x0000000000003fad);

-- --------------------------------------------------------

--
-- Table structure for table `testcandidatelist`
--

DROP TABLE IF EXISTS `testcandidatelist`;
CREATE TABLE IF NOT EXISTS `testcandidatelist` (
  `ID` int(11) NOT NULL,
  `contactID` int(11) NOT NULL,
  `TestDate` datetime NOT NULL,
  `TestTime` varchar(255) DEFAULT NULL,
  `Tester1` varchar(255) DEFAULT NULL,
  `Tester2` varchar(255) DEFAULT NULL,
  `Tester3` varchar(255) DEFAULT NULL,
  `Tester4` varchar(255) DEFAULT NULL,
  `TestType` varchar(255) DEFAULT 'Student',
  `RankAchievedInTest` varchar(255) DEFAULT NULL,
  `selected` bit(1) DEFAULT b'0',
  `testStatus` varchar(255) DEFAULT NULL,
  `testName` varchar(255) DEFAULT NULL,
  `SSMA_TimeStamp` longblob NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4419 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `testcandidatelist`
--

INSERT INTO `testcandidatelist` (`ID`, `contactID`, `TestDate`, `TestTime`, `Tester1`, `Tester2`, `Tester3`, `Tester4`, `TestType`, `RankAchievedInTest`, `selected`, `testStatus`, `testName`, `SSMA_TimeStamp`) VALUES
(1725, 5340, '2010-07-19 00:00:00', '2:00 PM', NULL, NULL, NULL, NULL, 'Student', ' 1st Degree Brown Belt', b'0', NULL, NULL, 0x0000000000003fae),
(1724, 5340, '2010-12-04 00:00:00', '2:00 PM', NULL, NULL, NULL, NULL, 'Student', '1st degree black belt test', b'0', NULL, NULL, 0x0000000000003faf),
(4418, 5340, '2012-12-01 00:00:00', '12:30 PM', 'Mark Lehman:Chief Instructor', 'Roy Kennedy:Instructor', 'Ben Jackson:Instructor', ':Witness', 'YMCA', '2nd Degree Black Belt', b'0', 'Yes', NULL, 0x0000000000003fb0),
(1726, 5341, '2010-11-13 00:00:00', '2:00 PM', NULL, NULL, NULL, NULL, 'Student', ' 1st Degree Brown Belt', b'0', NULL, NULL, 0x0000000000003fb1),
(2655, 5341, '2011-12-10 00:00:00', '2:00 PM', NULL, NULL, NULL, NULL, 'Student', ' 1st Degree Black Belt', b'0', NULL, NULL, 0x0000000000003fb2);

-- --------------------------------------------------------

--
-- Table structure for table `testtimes`
--

DROP TABLE IF EXISTS `testtimes`;
CREATE TABLE IF NOT EXISTS `testtimes` (
  `time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `testtimes`
--

INSERT INTO `testtimes` (`time`) VALUES
('1:30 PM'),
('2:00 PM'),
('3:00 PM');

-- --------------------------------------------------------

--
-- Table structure for table `zipcity`
--

DROP TABLE IF EXISTS `zipcity`;
CREATE TABLE IF NOT EXISTS `zipcity` (
  `zip` varchar(255) NOT NULL,
  `city` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `zipcity`
--

INSERT INTO `zipcity` (`zip`, `city`) VALUES
('01095', 'Wilbraham'),
('01202', 'Framingham'),
('01301', 'Greenfield'),
('01507', 'Charlton'),
('01518', 'Sturbridge');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `eventregistration`
--
ALTER TABLE `eventregistration`
  ADD PRIMARY KEY (`Contact`,`event`,`event date`), ADD KEY `EventRegistration$include` (`include`);

--
-- Indexes for table `leadmgmt`
--
ALTER TABLE `leadmgmt`
  ADD PRIMARY KEY (`contactid`);

--
-- Indexes for table `nattendance`
--
ALTER TABLE `nattendance`
  ADD PRIMARY KEY (`contid`,`MondayOfWeek`), ADD KEY `nAttendance$alphasortkey` (`alphasortkey`), ADD KEY `nAttendance$contid` (`contid`), ADD KEY `ID` (`ID`);

--
-- Indexes for table `nclass`
--
ALTER TABLE `nclass`
  ADD PRIMARY KEY (`class`);

--
-- Indexes for table `nclasslist`
--
ALTER TABLE `nclasslist`
  ADD PRIMARY KEY (`class`), ADD KEY `nclassList$sortKey` (`sortKey`);

--
-- Indexes for table `nclasspays`
--
ALTER TABLE `nclasspays`
  ADD PRIMARY KEY (`ID`), ADD KEY `nclasspays$class` (`class`), ADD KEY `nclasspays$classid` (`classid`), ADD KEY `nclasspays$classPayName` (`classPayName`);

--
-- Indexes for table `ncontactmgmt`
--
ALTER TABLE `ncontactmgmt`
  ADD PRIMARY KEY (`contactdated`,`contactdatem`,`contactdateyyyy`,`contactid`,`contactmgmttype`), ADD KEY `ncontactmgmt$Contactscontactmgmt` (`contactid`), ADD KEY `ncontactmgmt$id` (`contactid`);

--
-- Indexes for table `ncontacts`
--
ALTER TABLE `ncontacts`
  ADD PRIMARY KEY (`ID`), ADD UNIQUE KEY `nContacts$uniquekey` (`LastName`,`FirstName`,`Address`), ADD KEY `nContacts$City` (`City`), ADD KEY `nContacts$Contactszip` (`ZIP`), ADD KEY `nContacts$ContactType` (`ContactType`), ADD KEY `nContacts$ContactTypeLastName` (`ContactType`,`LastName`), ADD KEY `nContacts$currrank` (`CurrentRank`), ADD KEY `nContacts$First Name` (`FirstName`), ADD KEY `nContacts$First NameLastName` (`FirstName`,`LastName`), ADD KEY `nContacts$LastName` (`LastName`), ADD KEY `nContacts$LastNameFirstName` (`LastName`,`FirstName`), ADD KEY `nContacts$StateProvince` (`State`);

--
-- Indexes for table `nleadmgmt`
--
ALTER TABLE `nleadmgmt`
  ADD PRIMARY KEY (`contactid`), ADD UNIQUE KEY `nleadmgmt$Contactsleadmgmt` (`contactid`);

--
-- Indexes for table `notherclass`
--
ALTER TABLE `notherclass`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `npayments`
--
ALTER TABLE `npayments`
  ADD PRIMARY KEY (`PaymentClassName`), ADD KEY `npayments$NumberOfMembers` (`NumberOfMembers`), ADD KEY `npayments$PaymentClassName` (`PaymentClassName`), ADD KEY `npayments$paymenttype` (`paymenttype`);

--
-- Indexes for table `nswitchboarditems`
--
ALTER TABLE `nswitchboarditems`
  ADD PRIMARY KEY (`ItemNumber`,`SwitchboardID`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`PaymentClassName`), ADD KEY `payments$NumberOfMembers` (`NumberOfMembers`), ADD KEY `payments$payment type` (`payment type`), ADD KEY `payments$PaymentClassName` (`PaymentClassName`);

--
-- Indexes for table `ranklist`
--
ALTER TABLE `ranklist`
  ADD PRIMARY KEY (`ranklist`), ADD KEY `ranklist$adultnextsortkey` (`adultnextsortkey`), ADD KEY `ranklist$alphasortkey` (`alphasortkey`), ADD KEY `ranklist$nextsortkey` (`childnextsortkey`), ADD KEY `ranklist$sortkey` (`sortkey`), ADD KEY `ranklist$ymcanextsortkey` (`ymcanextsortkey`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `testcandidatelist`
--
ALTER TABLE `testcandidatelist`
  ADD PRIMARY KEY (`contactID`,`TestDate`), ADD KEY `testCandidateList$contactID` (`contactID`), ADD KEY `ID` (`ID`);

--
-- Indexes for table `testtimes`
--
ALTER TABLE `testtimes`
  ADD PRIMARY KEY (`time`);

--
-- Indexes for table `zipcity`
--
ALTER TABLE `zipcity`
  ADD PRIMARY KEY (`zip`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `nattendance`
--
ALTER TABLE `nattendance`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2109;
--
-- AUTO_INCREMENT for table `nclasspays`
--
ALTER TABLE `nclasspays`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=36;
--
-- AUTO_INCREMENT for table `ncontacts`
--
ALTER TABLE `ncontacts`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5345;
--
-- AUTO_INCREMENT for table `notherclass`
--
ALTER TABLE `notherclass`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `testcandidatelist`
--
ALTER TABLE `testcandidatelist`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4419;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

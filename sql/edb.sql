--
-- Table structure for table `ncontacts`
--

DROP TABLE IF EXISTS `ncontacts`;
CREATE TABLE IF NOT EXISTS `ncontacts` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `LastName` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `FirstName` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `Email` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `Email2` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `Parent` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `Phone` varchar(25) CHARACTER SET utf8 DEFAULT NULL,
  `AltPhone` varchar(25) CHARACTER SET utf8 DEFAULT NULL,
  `Address` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `City` varchar(50) CHARACTER SET utf8 DEFAULT 'Natick',
  `State` varchar(50) CHARACTER SET utf8 DEFAULT 'MA',
  `ZIP` varchar(255) CHARACTER SET utf8 DEFAULT '01760',
  `Notes` longtext CHARACTER SET utf8,
  `Birthday` datetime DEFAULT NULL,
  `NewRank` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `BeltSize` varchar(255) DEFAULT NULL,
  `CurrentRank` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `LastPromoted` datetime DEFAULT NULL,
  `InstructorPaymentFree` int(1) DEFAULT '0',
  `ContactType` varchar(255) CHARACTER SET utf8 DEFAULT 'Student',
  `include` bit(1) DEFAULT b'0',
  `InstructorFlag` bit(1) DEFAULT b'0',
  `quickbooklink` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `instructorTitle` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `testDate` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `testTime` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `bdayinclude` bit(1) DEFAULT b'0',
  `sex` varchar(255) CHARACTER SET utf8 DEFAULT 'Unknown',
  `medicalConcerns` longtext CHARACTER SET utf8,
  `GuiSize` varchar(255) CHARACTER SET utf8 DEFAULT '1',
  `ShirtSize` varchar(255) CHARACTER SET utf8 DEFAULT 'Adult L',
  `phoneExt` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `altPhoneExt` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `CurrentReikiRank` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `StudentSchool` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `EmergencyContact` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `CurrentIARank` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `ReadyForNextRank` int(11) DEFAULT '0',
  `nextScheduledTest` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `upgrade` int(11) DEFAULT '0',
  `SSMA_TimeStamp` longblob NOT NULL,
  `pictureurl` varchar(80) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `nContacts$uniquekey` (`LastName`,`FirstName`,`Address`),
  KEY `nContacts$City` (`City`),
  KEY `nContacts$Contactszip` (`ZIP`),
  KEY `nContacts$ContactType` (`ContactType`),
  KEY `nContacts$ContactTypeLastName` (`ContactType`,`LastName`),
  KEY `nContacts$currrank` (`CurrentRank`),
  KEY `nContacts$First Name` (`FirstName`),
  KEY `nContacts$First NameLastName` (`FirstName`,`LastName`),
  KEY `nContacts$LastName` (`LastName`),
  KEY `nContacts$LastNameFirstName` (`LastName`,`FirstName`),
  KEY `nContacts$StateProvince` (`State`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8008 ;

--
-- Table structure for table `ranklist`
--

DROP TABLE IF EXISTS `ranklist`;
CREATE TABLE IF NOT EXISTS `ranklist` (
  `rankid` int(11) NOT NULL AUTO_INCREMENT,
  `ranklist` varchar(255) CHARACTER SET utf8 NOT NULL,
  `sortkey` int(11) DEFAULT NULL,
  `childnextsortkey` int(11) DEFAULT NULL,
  `adultnextsortkey` int(11) DEFAULT NULL,
  `ymcaUse` bit(1) DEFAULT b'0',
  `ymcanextsortkey` int(11) DEFAULT NULL,
  `rankGroup` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `alphasortkey` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `childAttendPromoteTarget` int(11) DEFAULT '0',
  `childDurationPromoteTarget` int(11) DEFAULT '0',
  `adultAttendPromoteTarget` int(11) DEFAULT '0',
  `adultDurationPromoteTarget` int(11) DEFAULT '0',
  `SSMA_TimeStamp` longblob NOT NULL,
  PRIMARY KEY (`rankid`),
  KEY `ranklist$adultnextsortkey` (`adultnextsortkey`),
  KEY `ranklist$alphasortkey` (`alphasortkey`),
  KEY `ranklist$nextsortkey` (`childnextsortkey`),
  KEY `ranklist$sortkey` (`sortkey`),
  KEY `ranklist$ymcanextsortkey` (`ymcanextsortkey`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=59 ;

--
-- Dumping data for table `ranklist`
--

INSERT INTO `ranklist` (`rankid`, `ranklist`, `sortkey`, `childnextsortkey`, `adultnextsortkey`, `ymcaUse`, `ymcanextsortkey`, `rankGroup`, `alphasortkey`, `childAttendPromoteTarget`, `childDurationPromoteTarget`, `adultAttendPromoteTarget`, `adultDurationPromoteTarget`, `SSMA_TimeStamp`) VALUES
(1, '10th Degree Grand Master', 29, NULL, NULL, b'0', NULL, 'grandmaster', 'jj', NULL, NULL, NULL, NULL, 0x0000000000003f74),
(2, '1st Degree Black Belt', 20, 21, 21, b'0', NULL, 'black', 'ja', 180, 90, 90, 90, 0x0000000000003f75),
(3, '1st Degree Brown Belt', 19, 20, 20, b'0', NULL, 'advanced', 'ic', 40, 22, 22, 22, 0x0000000000003f76),
(4, '2nd Degree Black Belt', 21, 22, 22, b'0', NULL, 'black', 'jb', 180, 90, 90, 90, 0x0000000000003f77),
(5, '2nd Degree Brown Belt', 18, 19, 19, b'0', NULL, 'advanced', 'ib', 40, 22, 22, 22, 0x0000000000003f78),
(6, '3rd Degree Black Belt', 22, 23, 23, b'0', NULL, 'black', 'jc', 260, 130, 130, 130, 0x0000000000003f79),
(7, '3rd Degree Brown Belt', 17, 18, 18, b'0', NULL, 'advanced', 'ia', 40, 22, 22, 22, 0x0000000000003f7a),
(8, '4th Degree Black Belt', 23, 24, 24, b'0', NULL, 'black', 'jd', 260, 130, 130, 130, 0x0000000000003f7b),
(9, '5th Degree Black Belt', 24, 25, 25, b'0', NULL, 'master', 'je', NULL, NULL, NULL, NULL, 0x0000000000003f7c),
(10, '6th Degree Black Belt', 25, 26, 26, b'0', NULL, 'master', 'jf', NULL, NULL, NULL, NULL, 0x0000000000003f7d),
(11, '7th Degree Black Belt', 26, 27, 27, b'0', NULL, 'master', 'jg', NULL, NULL, NULL, NULL, 0x0000000000003f7e),
(12, '8th Degree Black Belt', 27, 28, 28, b'0', NULL, 'master', 'jh', NULL, NULL, NULL, NULL, 0x0000000000003f7f),
(13, '9th Degree Black Belt', 28, 29, 29, b'0', NULL, 'master', 'ji', NULL, NULL, NULL, NULL, 0x0000000000003f80),
(14, 'Blue Belt', 9, 10, 11, b'0', NULL, 'intermediate', 'ea', 12, 6, 10, 10, 0x0000000000003f81),
(15, 'Blue Belt mid-term Stripe', 10, 11, NULL, b'0', NULL, 'intermediate', 'eb', 12, 6, NULL, NULL, 0x0000000000003f82),
(16, 'Blue w/Green mid-term Stripe ', 12, 13, NULL, b'0', NULL, 'intermediate', 'fb', 12, 6, NULL, NULL, 0x0000000000003f83),
(17, 'Blue w/Green Stripe Belt', 11, 12, 13, b'0', NULL, 'intermediate', 'fa', 12, 6, 10, 10, 0x0000000000003f84),
(18, 'Certified Instructor', 63, 64, NULL, b'0', NULL, 'IA', 'zzd', NULL, NULL, NULL, NULL, 0x0000000000003f85),
(19, 'Chief Instructor', 64, 65, NULL, b'0', NULL, 'IA', 'zze', NULL, NULL, NULL, NULL, 0x0000000000003f86),
(20, 'Director', 65, NULL, NULL, b'0', NULL, 'IA', 'zzf', NULL, NULL, NULL, NULL, 0x0000000000003f87),
(21, 'First Degree', 50, 51, NULL, b'0', NULL, 'reiki', 'zb', NULL, NULL, NULL, NULL, 0x0000000000003f88),
(22, 'Green Belt', 13, 14, 15, b'0', NULL, 'advanced', 'ga', 20, 10, 22, 22, 0x0000000000003f89),
(23, 'Green Belt mid-term Stripe', 14, 15, NULL, b'0', NULL, 'advanced', 'gb', 20, 10, NULL, NULL, 0x0000000000003f8a),
(24, 'Green w/Brown mid-term Stripe ', 16, 17, NULL, b'0', NULL, 'advanced', 'hb', 20, 10, NULL, NULL, 0x0000000000003f8b),
(25, 'Green w/Brown Stripe Belt', 15, 16, 17, b'0', NULL, 'advanced', 'ha', 20, 10, 22, 22, 0x0000000000003f8c),
(26, 'Instructor Assistant', 61, 62, NULL, b'0', NULL, 'IA', 'zzb', NULL, NULL, NULL, NULL, 0x0000000000003f8d),
(27, 'Intern', 62, 63, NULL, b'0', NULL, 'IA', 'zzc', NULL, NULL, NULL, NULL, 0x0000000000003f8e),
(28, 'No IA Rank', 60, 61, NULL, b'0', NULL, 'IA', 'zza', NULL, NULL, NULL, NULL, 0x0000000000003f8f),
(29, 'No Reiki Rank', 49, 50, NULL, b'0', NULL, 'reiki', 'za', NULL, NULL, NULL, NULL, 0x0000000000003f90),
(30, 'Orange', 39, 40, NULL, b'1', 40, 'beginner', 'yi', NULL, NULL, NULL, NULL, 0x0000000000003f91),
(31, 'Orange 1 Stripe', 40, 41, NULL, b'1', 41, 'beginner', 'yj', NULL, NULL, NULL, NULL, 0x0000000000003f92),
(32, 'Orange 2 Stripe', 41, 42, NULL, b'1', 42, 'beginner', 'yk', NULL, NULL, NULL, NULL, 0x0000000000003f93),
(33, 'Orange 3 Stripe', 42, 43, NULL, b'1', 43, 'beginner', 'yl', NULL, NULL, NULL, NULL, 0x0000000000003f94),
(34, 'Orange Belt', 5, 6, 7, b'0', NULL, 'beginner', 'ca', 12, 6, 10, 10, 0x0000000000003f95),
(35, 'Orange Belt mid-term Stripe', 6, 7, NULL, b'0', NULL, 'beginner', 'cb', 12, 6, NULL, NULL, 0x0000000000003f96),
(36, 'Purple', 43, 44, NULL, b'1', 44, 'intermediate', 'ym', NULL, NULL, NULL, NULL, 0x0000000000003f97),
(37, 'Purple 1 Stripe', 44, 45, NULL, b'1', 45, 'intermediate', 'yn', NULL, NULL, NULL, NULL, 0x0000000000003f98),
(38, 'Purple 2 Stripe', 45, 46, NULL, b'1', 46, 'intermediate', 'yo', NULL, NULL, NULL, NULL, 0x0000000000003f99),
(39, 'Purple 3 Stripe', 46, NULL, NULL, b'1', 47, 'intermediate', 'yp', NULL, NULL, NULL, NULL, 0x0000000000003f9a),
(40, 'Purple Belt', 7, 8, 9, b'0', NULL, 'intermediate', 'da', 12, 6, 10, 10, 0x0000000000003f9b),
(41, 'Purple mid-term Stripe', 8, 9, NULL, b'0', NULL, 'intermediate', 'db', 12, 6, NULL, NULL, 0x0000000000003f9c),
(42, 'Reiki Master', 52, 53, NULL, b'0', NULL, 'reiki', 'zd', NULL, NULL, NULL, NULL, 0x0000000000003f9d),
(43, 'Reiki Master of Masters', 54, NULL, NULL, b'0', NULL, 'reiki', 'zf', NULL, NULL, NULL, NULL, 0x0000000000003f9e),
(44, 'Reiki Master/Teacher', 53, 54, NULL, b'0', NULL, 'reiki', 'ze', NULL, NULL, NULL, NULL, 0x0000000000003f9f),
(45, 'Second Degree', 51, 52, NULL, b'0', NULL, 'reiki', 'zc', NULL, NULL, NULL, NULL, 0x0000000000003fa0),
(46, 'White', 31, 32, NULL, b'1', 32, 'beginner', 'ya', NULL, NULL, NULL, NULL, 0x0000000000003fa1),
(47, 'White 1 Stripe', 32, 33, NULL, b'1', 33, 'beginner', 'yb', NULL, NULL, NULL, NULL, 0x0000000000003fa2),
(48, 'White 2 Stripe', 33, 34, NULL, b'1', 34, 'beginner', 'yc', NULL, NULL, NULL, NULL, 0x0000000000003fa3),
(49, 'White 3 Stripe', 34, 35, NULL, b'1', 35, 'beginner', 'yd', NULL, NULL, NULL, NULL, 0x0000000000003fa4),
(50, 'White Belt', 1, 2, 3, b'0', NULL, 'beginner', 'aa', 6, 4, 10, 10, 0x0000000000003fa5),
(51, 'White mid-term Stripe', 2, 3, NULL, b'0', NULL, 'beginner', 'ab', 6, 4, NULL, NULL, 0x0000000000003fa6),
(52, 'Yellow', 35, 36, NULL, b'1', 36, 'beginner', 'ye', NULL, NULL, NULL, NULL, 0x0000000000003fa7),
(53, 'Yellow 1 Stripe', 36, 37, NULL, b'1', 37, 'beginner', 'yf', NULL, NULL, NULL, NULL, 0x0000000000003fa8),
(54, 'Yellow 2 Stripe', 37, 38, NULL, b'1', 38, 'beginner', 'yg', NULL, NULL, NULL, NULL, 0x0000000000003fa9),
(55, 'Yellow 3 Stripe', 38, 39, NULL, b'1', 39, 'beginner', 'yh', NULL, NULL, NULL, NULL, 0x0000000000003faa),
(56, 'Yellow Belt', 3, 4, 5, b'0', NULL, 'beginner', 'ba', 12, 6, 10, 10, 0x0000000000003fab),
(57, 'Yellow mid-term Stripe', 4, 5, NULL, b'0', NULL, 'beginner', 'bb', 12, 6, NULL, NULL, 0x0000000000003fac),
(58, '_Owner', 30, NULL, NULL, b'0', NULL, NULL, 'ka', NULL, NULL, NULL, NULL, 0x0000000000003f73);

--
-- Table structure for table `zipcity`
--

CREATE TABLE IF NOT EXISTS `zipcity` (
  `zip` varchar(255) CHARACTER SET utf8 NOT NULL,
  `city` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`zip`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `zipcity`
--

INSERT INTO `zipcity` (`zip`, `city`) VALUES
('01095', 'Wilbraham'),
('01202', 'Framingham'),
('01301', 'Greenfield'),
('01507', 'Charlton'),
('01518', 'Sturbridge'),
('01520', 'Holden'),
('01532', 'Northborough'),
('01536', 'West Grafton'),
('01545', 'Shrewsbury'),
('01568', 'Upton'),
('01569', 'Uxbridge'),
('01581', 'Westborough'),
('01588', 'Whitinsville'),
('01590', 'Sutton'),
('01701', 'Framingham'),
('01702', 'Framingham'),
('01720', 'Acton'),
('01721', 'Ashland'),
('01746', 'Holliston'),
('01747', 'Hopedale'),
('01748', 'Hopkinton'),
('01749', 'Hudson'),
('01752', 'Marlborough'),
('01754', 'Maynard'),
('01757', 'Milford'),
('01760', 'Natick'),
('01770', 'Sherborn'),
('01772', 'Southboro'),
('01773', 'Lincoln'),
('01775', 'Stow'),
('01776', 'Sudbury'),
('01778', 'Wayland'),
('01844', 'Methuen'),
('01880', 'Wakefield \r\nWakefield'),
('01960', 'Peabody'),
('02013', 'Medway'),
('02026', 'Dedham'),
('02030', 'Dover'),
('02038', 'Franklin'),
('02052', 'Medfield'),
('02053', 'Medway'),
('02054', 'Millis'),
('02062', 'Norwood'),
('02090', 'Westwood'),
('02119', 'Roxbury'),
('02121', 'Boston'),
('02132', 'West Roxbury'),
('02134', 'Allston'),
('02135', 'Brighton'),
('02136', 'Hyde Park'),
('02141', 'Cambridge'),
('02148', 'Malden'),
('02151', 'Revere'),
('02184', 'Braintree'),
('02302', 'Brockton'),
('02346', 'Middleboro'),
('02360', 'Plymouth'),
('02418', 'Malden'),
('02421', 'Lexington'),
('02452', 'Waltham'),
('02453', 'Watham'),
('02459', 'Newton Centre'),
('02465', 'West Newton'),
('02466', 'Newton'),
('02467', 'Chesnut Hill'),
('02472', 'Watertown'),
('02474', 'Arlington'),
('02476', 'Arlington'),
('02478', 'Belmont'),
('02481', 'Wellesley'),
('02482', 'Wellesley'),
('02492', 'Needham'),
('02493', 'Weston'),
('02494', 'Needham'),
('02557', 'Oak Bluffs'),
('02780', 'Taunton'),
('02904', 'North Providence'),
('02910', 'Cranston'),
('03051', 'Hudson'),
('03063', 'Nashua'),
('03836', 'Freedom'),
('06457', 'Middltown'),
('19001', 'Abington');

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` text NOT NULL,
  `api_key` varchar(32) NOT NULL,
  `status` int(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `api_key`, `status`, `created_at`) VALUES
(1, 'default', 'default@natickmartialarts.com', '', '', 1, '2015-10-28 12:32:21');

--
-- Table structure for table `userpreferences`
--

CREATE TABLE IF NOT EXISTS `userpreferences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prefkey` varchar(250) DEFAULT NULL,
  `prefcolumn` varchar(255) NOT NULL,
  `preforder` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_userpreferences` (`user_id`,`prefkey`,`prefcolumn`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=263 ;

--
-- Dumping data for table `userpreferences`
--

INSERT INTO `userpreferences` (`id`, `prefkey`, `prefcolumn`, `preforder`, `user_id`, `created_at`) VALUES
(260, 'allstudents', 'FirstName', 1, 1, '2016-01-01 02:51:22'),
(261, 'allstudents', 'LastName', 2, 1, '2016-01-01 02:51:22'),
(262, 'allstudents', 'ID', 3, 1, '2016-01-01 02:51:22');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `userpreferences`
--
ALTER TABLE `userpreferences`
  ADD CONSTRAINT `userpreferences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- --------------------------------------------------------

--
-- Table structure for table `studentlist`
--

CREATE TABLE IF NOT EXISTS `studentlist` (
  `listtype` varchar(40) NOT NULL,
  `listkey` varchar(40) NOT NULL,
  `listvalue` varchar(80) NOT NULL,
  `listorder` int(11) NOT NULL,
  PRIMARY KEY (`listtype`,`listkey`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `studentlist`
--

INSERT INTO `studentlist` (`listtype`, `listkey`, `listvalue`, `listorder`) VALUES
('beltsize', '1', '1', 8),
('beltsize', '2', '2', 7),
('beltsize', '3', '3', 6),
('beltsize', '4', '4', 5),
('beltsize', '5', '5', 4),
('beltsize', '6', '6', 3),
('beltsize', '7', '7', 2),
('beltsize', '8', '8', 1),
('beltsize', 'Double Zero', 'Double Zero', 10),
('beltsize', 'Triple Zero', 'Triple Zero', 11),
('beltsize', 'Zero', 'Zero', 9),
('ClassStatus', 'Active', 'Active', 1),
('ClassStatus', 'Inactive', 'Inactive', 2),
('ClassStatus', 'Injured', 'Injured', 3),
('ContactType', 'BlackBelt', 'BlackBelt', 2),
('ContactType', 'Break', 'Break', 3),
('ContactType', 'Inactive', 'Inactive', 4),
('ContactType', 'Lead', 'Lead', 5),
('ContactType', 'Student', 'Student', 1),
('ContactType', 'TaiChi', 'TaiChi', 6),
('ContactType', 'Tobin', 'Tobin', 7),
('ContactType', 'Wayland', 'Wayland', 8),
('ContactType', 'YMCA', 'YMCA', 9),
('gisize', '1', '1', 8),
('gisize', '2', '2', 7),
('gisize', '3', '3', 6),
('gisize', '4', '4', 5),
('gisize', '5', '5', 4),
('gisize', '6', '6', 3),
('gisize', '7', '7', 2),
('gisize', '8', '8', 1),
('gisize', 'Double Zero', 'Double Zero', 10),
('gisize', 'Triple Zero', 'Triple Zero', 11),
('gisize', 'Zero', 'Zero', 9),
('Instructor Title', 'Asst Chief Instructor', 'Asst Chief Instructor', 6),
('Instructor Title', 'Chief Instructor', 'Chief Instructor', 7),
('Instructor Title', 'Instructor', 'Instructor', 4),
('Instructor Title', 'Instructor Assistant', 'Instructor Assistant', 3),
('Instructor Title', 'Intern', 'Intern', 2),
('Instructor Title', 'Judan Master Instructor', 'Judan Master Instructor', 8),
('Instructor Title', 'Master Instructor', 'Master Instructor', 5),
('Instructor Title', 'Storm Team', 'Storm Team', 1),
('School', 'Ambler PA', 'Ambler PA', 25),
('School', 'Antioch IL', 'Antioch IL', 38),
('School', 'Antrim NH', 'Antrim NH', 16),
('School', 'Barre VT', 'Barre VT', 24),
('School', 'Bennington NH', 'Bennington NH', 17),
('School', 'Biddeford ME', 'Biddeford ME', 20),
('School', 'Chalfont PA', 'Chalfont PA', 26),
('School', 'Chester Springs PA', 'Chester Springs PA', 27),
('School', 'Chicopee', 'Chicopee', 2),
('School', 'Concord NH', 'Concord NH', 19),
('School', 'Cranston RI', 'Cranston RI', 13),
('School', 'Enfield CT', 'Enfield CT', 28),
('School', 'Fairfield CT', 'Fairfield CT', 29),
('School', 'Glastonbury CT', 'Glastonbury CT', 30),
('School', 'Holliston', 'Holliston', 3),
('School', 'Marlborough', 'Marlborough', 4),
('School', 'Mashpee', 'Mashpee', 5),
('School', 'Middletown RI', 'Middletown RI', 14),
('School', 'Natick', 'Natick', 1),
('School', 'Newington CT', 'Newington CT', 31),
('School', 'North Windham CT', 'North Windham CT', 32),
('School', 'Other', 'Other', 39),
('School', 'Palmer', 'Palmer', 6),
('School', 'Portland ME', 'Portland ME', 21),
('School', 'Richland NH', 'Richland NH', 18),
('School', 'Scarborough ME', 'Scarborough ME', 22),
('School', 'Shrewsbury', 'Shrewsbury', 7),
('School', 'Simsbury CT', 'Simsbury CT', 33),
('School', 'Somerville', 'Somerville', 8),
('School', 'Southington CT', 'Southington CT', 34),
('School', 'Standish ME', 'Standish ME', 23),
('School', 'Syracuse NY', 'Syracuse NY', 15),
('School', 'Torrington CT', 'Torrington CT', 35),
('School', 'Walpole', 'Walpole', 9),
('School', 'West Hartford CT', 'West Hartford CT', 36),
('School', 'Westborough', 'Westborough', 10),
('School', 'Williamstown', 'Williamstown', 11),
('School', 'Windsor CT', 'Windsor CT', 37),
('School', 'Wrentham/Norfolk', 'Wrentham/Norfolk', 12),
('shirtsize', 'Adult L', 'Adult L', 4),
('shirtsize', 'Adult M', 'Adult M', 5),
('shirtsize', 'Adult S', 'Adult S', 6),
('shirtsize', 'Adult XL', 'Adult XL', 3),
('shirtsize', 'Adult XXL', 'Adult XXL', 2),
('shirtsize', 'Adult XXX', 'Adult XXX', 1),
('shirtsize', 'Youth L', 'Youth L', 7),
('shirtsize', 'Youth M', 'Youth M', 8),
('shirtsize', 'Youth S', 'Youth S', 9);

--INSERT INTO `edb`.`studentlist` (`listtype`, `listkey`, `listvalue`, `listorder`) VALUES ('event', 'Medway2016', 'Medway 2016', '1');

--
-- Table structure for table `eventregistration`
--

DROP TABLE IF EXISTS `eventregistration`;
CREATE TABLE IF NOT EXISTS `eventregistration` (
  `event` varchar(255) CHARACTER SET utf8 NOT NULL,
  `eventdate` datetime NOT NULL,
  `eventstart` varchar(12) NOT NULL,
  `eventend` varchar(12) NOT NULL,
  `Contact` int(11) NOT NULL,
  `eventType` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `paid` int(1) DEFAULT '0',
  `shirtSize` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `Notes` longtext CHARACTER SET utf8,
  `include` int(1) DEFAULT '0',
  `attended` int(1) DEFAULT '0',
  `ordered` int(1) DEFAULT '0',
  `SSMA_TimeStamp` longblob NOT NULL,
  `location` varchar(200) NOT NULL,
  PRIMARY KEY (`Contact`,`event`,`eventdate`),
  KEY `EventRegistration$include` (`include`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `event`
--

CREATE TABLE IF NOT EXISTS `event` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `date` date NOT NULL,
  `active` int(11) NOT NULL,
  `order` int(11) NOT NULL,
  `start` varchar(12) NOT NULL,
  `end` varchar(12) NOT NULL,
  `location` varchar(80) NOT NULL,
  `type` varchar(80) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `event`
--

INSERT INTO `event` (`id`, `name`, `date`, `active`, `order`, `start`, `end`, `location`, `type`) VALUES
(1, 'Medway 2016', '2016-04-10', 1, 1, '9:00 AM', '5:00 PM', 'St. Joseph''s Church Hall 145 Holliston Street, Medway, Massachusetts', 'tournament');

CREATE OR REPLACE VIEW eventsource AS 
SELECT c.ID AS contactID,  `LastName` ,  `FirstName` ,  `Email` ,  `Email2` ,  `Parent` ,  `Phone` ,  `AltPhone` ,  `Address` ,  `City` ,  `State` ,  `ZIP` ,  `Newrank` ,  `BeltSize` ,  `CurrentRank` ,  `InstructorPaymentFree` , `ContactType` ,  `InstructorFlag` ,  `quickbooklink` ,  `instructorTitle` ,  `testTime` ,  `bdayinclude` ,  `sex` ,  `medicalConcerns` ,  `GuiSize` ,  `phoneExt` ,  `altPhoneExt` ,  `CurrentReikiRank` ,  `StudentSchool` ,  `event` , `eventdate` ,  `eventstart` ,  `eventend` ,  `eventType` ,  `paid` , createdby, er.shirtSize, er.Notes, er.include,  `attended` ,  `ordered` , location, (
YEAR( 
CURRENT_TIMESTAMP ) - YEAR( birthday ) - ( RIGHT( 
CURRENT_TIMESTAMP , 5 ) < RIGHT( birthday, 5 ) )
) AS age, DATE_FORMAT( birthday,  '%Y-%m-%d' ) AS birthday
FROM ncontacts c
LEFT JOIN eventregistration er ON er.contact = c.id
ORDER BY c.id


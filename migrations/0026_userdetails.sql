-- Migration number: 0026 	 2023-10-14T14:55:38.255Z
CREATE TABLE `userdetails` (
  `count` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `fkUsercount` INTEGER NOT NULL,
  `firstname` TEXT(150) NOT NULL,
  `lastname` TEXT(150) NOT NULL,
  `email` TEXT(100) DEFAULT NULL,
  `dateAdded` TEXT(50) NOT NULL,
  `dateUpdated` TEXT(100) DEFAULT NULL,
  `Address` longtext NOT NULL,
  `gender` TEXT(50) NOT NULL,
  `birthdate` TEXT(50) NOT NULL,
  `avatar` longtext,
  `zoomLink` TEXT(255) DEFAULT NULL
);

INSERT INTO `userdetails` (`count`, `fkUsercount`, `firstname`, `lastname`, `email`, `dateAdded`, `dateUpdated`, `Address`, `gender`, `birthdate`, `avatar`, `zoomLink`) VALUES
(3, '3', 'GEVIE', 'PITOGO 1', 'geviepitogo@gmail.com', '1646245862780', NULL, 'sdsdsd-', 'Male', 'Thursday, March 3, 2022', 'https://s3.us-west-1.wasabisys.com/onealpha/June 13 2022 12:14:50 test.JPEG', 'https://us05web.zoom.us/j/8106499070?pwd=MzNFTTI4WUkrNDNWTE5nZWJ0dk1nQT09'),
(12, '12', 'STAFF1', '-', '/@apple.com', '2022-06-24 06:12:50', NULL, '-', 'Male', 'Friday, June 24, 2022', NULL, NULL),
(13, '13', 'ONG', 'ONG', '1@1.com', '2022-07-01 07:14:13', NULL, '-', 'Male', 'Friday, July 1, 2022', NULL, 'https://us04web.zoom.us/j/3949238770?pwd=cktWenprcFJ3V1ZSb0hEcjVhRUpsdz09'),
(14, '14', 'DEWAN RAFIK', 'DEWAN RAFIK', '1@1.com', '2022-07-01 07:16:15', NULL, '12312', 'Male', 'Friday, July 1, 2022', NULL, NULL),
(15, '15', 'FARUK OMAR', 'FARUK OMAR', '1@1.com', '2022-07-01 07:16:34', NULL, '-', 'Male', 'Friday, July 1, 2022', NULL, NULL),
(16, '16', 'ISLAM MONIRUL', 'ISLAM MONIRUL', '1@1.com', '2022-07-01 07:17:11', NULL, '-', 'Male', 'Friday, July 1, 2022', NULL, NULL),
(17, '17', 'MOHAMMAD FARUK ', 'MOHAMMAD FARUK ', '1@1.com', '2022-07-01 07:17:28', NULL, '-', 'Male', 'Friday, July 1, 2022', NULL, NULL),
(18, '18', 'SUSAIMANICKAM AMALRAJ', 'SUSAIMANICKAM AMALRAJ', 'kwangwei@sol59.com', '2022-07-01 07:17:53', NULL, '29 TAISENG AVE', 'Male', 'Friday, July 1, 2022', NULL, NULL),
(19, '19', 'SHOHEL MD SHAHADUT HOSSAIN', 'SHOHEL MD SHAHADUT HOSSAIN', '1@1.copm', '2022-07-01 07:18:13', NULL, '-', 'Male', 'Friday, July 1, 2022', NULL, NULL),
(20, '20', 'ZHANG JUNTAO', '-', '1@1.com', '2022-07-01 07:18:39', NULL, '-', 'Male', 'Friday, July 1, 2022', NULL, NULL);

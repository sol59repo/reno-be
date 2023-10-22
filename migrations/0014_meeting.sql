-- Migration number: 0014 	 2023-10-07T05:14:15.171Z
CREATE TABLE `meeting` (
  `count` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `ID` TEXT(100) NOT NULL,
  `host` TEXT(100) NOT NULL,
  `notes` longtext NOT NULL,
  `status` TEXT(50) NOT NULL,
  `schedule` datetime NOT NULL,
  `title` TEXT(200) NOT NULL,
  `type` TEXT(50) NOT NULL
);

INSERT INTO `meeting` (`count`, `ID`, `host`, `notes`, `status`, `schedule`, `title`, `type`) VALUES
(2, 'BCB5lA8A2', '13', 'zoom meeting', 'Incoming', '2022-07-06 16:00:00', 'Virtual Meeting at Tecklim', 'Virtual'),
(3, 'w32useYnc', '13', 'virtual site visit', 'Incoming', '2022-07-05 16:00:00', 'Tour at tecklim', 'Virtual'),
(5, 'bWDnJ7fyh', '3', 'test virtual', 'Incoming', '2022-07-04 16:00:00', 'test virtual', 'Virtual'),
(6, 'sYHXW8S_o', '13', 'asda', 'Incoming', '2022-07-04 16:00:00', 'test', 'Virtual'),
(7, 'pmBy2Y8VV', '13', 'test2 ', 'Incoming', '2022-07-07 16:00:00', 'test2 ', 'Virtual'),
(8, 'XBALd4p2-', '13', 'test bug 1', 'Incoming', '2022-07-07 16:00:00', 'test bug 1', 'Virtual'),
(10, 'WTsji1MaB', '13', 'testbug 2', 'Incoming', '2022-07-08 16:00:00', 'testbug 2', 'Virtual'),
(11, 'K1gVPNez9', '13', '1', 'Incoming', '2022-07-11 16:00:00', 'test', 'Virtual'),
(12, 'eXnx_9qLa', '13', 'Test only', 'Incoming', '2022-07-23 16:00:00', 'Test event made in ios mobile', 'Virtual'),
(13, 'eMY6iZnXi', '13', 'Test only', 'Incoming', '2022-07-25 16:00:00', 'Event made using android phone', 'Virtual');
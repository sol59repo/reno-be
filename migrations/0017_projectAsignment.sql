-- Migration number: 0017 	 2023-10-07T05:17:06.149Z
CREATE TABLE `projectAsignment` (
  `count` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `fkModel` TEXT(200) NOT NULL,
  `fkUser` TEXT(200) NOT NULL,
  `status` TEXT(50) NOT NULL,
  `addedBy` TEXT(200) NOT NULL,
  `dateAdded` TEXT(150) DEFAULT NULL
);

INSERT INTO `projectAsignment` (`count`, `fkModel`, `fkUser`, `status`, `addedBy`, `dateAdded`) VALUES
(1, '-oEXq0RFD', '12', 'Active', '3', '1656051181811'),
(2, '-oEXq0RFD', '3', 'Active', '3', '1656051188854'),
(3, '1TL', '14', 'Active', '13', '1656902369364'),
(4, '1TL', '15', 'Active', '13', '1656902369369'),
(5, '1TL', '16', 'Active', '13', '1656902369373'),
(6, '1TL', '17', 'Active', '13', '1656902369375'),
(7, '1TL', '18', 'Active', '13', '1656902369377'),
(8, '1TL', '19', 'Active', '13', '1656902369379'),
(9, '1TL', '20', 'Active', '13', '1656902369381'),
(10, '1TL', '1', 'Active', '13', '1656902378144');
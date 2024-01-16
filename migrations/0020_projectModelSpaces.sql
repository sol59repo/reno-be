-- Migration number: 0020 	 2023-10-07T05:19:03.725Z
CREATE TABLE `projectModelSpaces` (
  `count` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `spaceId` TEXT(100) NOT NULL,
  `fkModel` INTEGER NOT NULL,
  `status` TEXT(50) NOT NULL,
  `location` TEXT(200) NOT NULL,
  `addedBy` TEXT(50) NOT NULL
);

INSERT INTO `projectModelSpaces` (`count`, `spaceId`, `fkModel`, `status`, `location`, `addedBy`) VALUES
(1, 'QUZxV8ve1wt', '1TL', 'Pending', 'Teck lim', '1'),
(2, 'z9r1RZqeHVz', '-oEXq0RFD', 'Pending', '18 Lorong 102 Changi', '1');
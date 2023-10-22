-- Migration number: 0022 	 2023-10-07T05:20:26.942Z
CREATE TABLE `ticketCardMembers` (
  `count` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `fkCardId` TEXT(200) NOT NULL,
  `userID` TEXT(200) NOT NULL,
  `readstatus` TEXT(200) NOT NULL,
  `readThread` TEXT(200) NOT NULL,
  `status` TEXT(50) NOT NULL,
  `avatar` longtext,
  `name` TEXT(150) NOT NULL
);
-- Migration number: 0010 	 2023-10-07T05:04:30.917Z
CREATE TABLE `commentsMembers` (
  `count` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `refId` TEXT(200) NOT NULL,
  `userID` TEXT(200) NOT NULL,
  `readstatus` TEXT(200) NOT NULL,
  `readThread` TEXT(200) NOT NULL,
  `status` TEXT(50) NOT NULL,
  `avatar` longtext,
  `name` TEXT(150) NOT NULL
);
-- Migration number: 0008 	 2023-10-07T05:03:00.001Z
CREATE TABLE `commentConvo` (
    `count` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `refId` TEXT(100) NOT NULL,
    `comment` longtext,
    `addedBy` TEXT(100) NOT NULL,
    `dateTime` datetime NOT NULL,
    `type` TEXT(100) NOT NULL,
    `hasFile` tinyint(1) NOT NULL DEFAULT '0',
    `fileName` TEXT(200) DEFAULT NULL,
    `filePath` TEXT(200) DEFAULT NULL,
    `status` TEXT(50) NOT NULL DEFAULT 'Active'
);

INSERT INTO `commentConvo` (`count`, `refId`, `comment`, `addedBy`, `dateTime`, `type`, `hasFile`, `fileName`, `filePath`, `status`) VALUES
(1, '1656051665045', 'attached June 24 2022 6:24:12 icon.png to this ticket', '2203-2075', '2022-06-24 06:24:12', 'file', 0, 'June 24 2022 6:24:12 icon.png', 'https://s3.us-west-1.wasabisys.com/onealpha/June 24 2022 6:24:12 icon.png', 'Active'),
(2, '1656044483900', 'attached July 04 2022 2:56:1 PXL_20211115_071007313.jpg to this ticket', 'OKT', '2022-07-04 02:56:02', 'file', 0, 'July 04 2022 2:56:1 PXL_20211115_071007313.jpg', 'https://s3.us-west-1.wasabisys.com/onealpha/July 04 2022 2:56:1 PXL_20211115_071007313.jpg', 'Active');
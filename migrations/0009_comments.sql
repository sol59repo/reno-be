-- Migration number: 0009 	 2023-10-07T05:03:44.622Z
CREATE TABLE `comments` (
  `count` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `refId` TEXT(200) NOT NULL,
  `status` longtext NOT NULL
);

INSERT INTO `comments` (`count`, `refId`, `status`) VALUES
(1, '1656007088483', '[]'),
(2, '1656007314079', '[]'),
(3, 'GwfVxX78Vm', '[]'),
(4, '1656011051790', '[]'),
(5, '1656044483900', '[]'),
(6, '1656047531308', '[]'),
(7, '1656051665045', '[]'),
(8, '1656056826713', '[]');
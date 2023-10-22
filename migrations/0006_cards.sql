-- Migration number: 0006 	 2023-10-07T04:59:16.969Z
CREATE TABLE `cards` (
  `count` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `id` TEXT(250) NOT NULL,
  `fkCardList` TEXT(100) NOT NULL,
  `summary` TEXT(250) NOT NULL,
  `description` longtext,
  `dateAdded` date NOT NULL,
  `dateUpdated` date DEFAULT NULL,
  `status` longtext NOT NULL,
  `archivedStatus` tinyint(1) DEFAULT '0',
  `addedBy` TEXT(100) NOT NULL
);

INSERT INTO `cards` (`count`, `id`, `fkCardList`, `summary`, `description`, `dateAdded`, `dateUpdated`, `status`, `archivedStatus`, `addedBy`) VALUES
(1, 'dd9tzWUJe', '2', 'pub', NULL, '2022-06-24', NULL, '[]', 0, '3'),
(2, 'pL-VCJdhj', '2', 'bca', NULL, '2022-06-24', NULL, '[]', 0, '3'),
(3, 'XiD3M5Zjx', '3', 'may', NULL, '2022-06-24', NULL, '[]', 0, '3'),
(4, 'RhKao8pTF', '3', 'june -150', '150', '2022-06-24', NULL, '[]', 0, '3'),
(5, 'z0S4TyGZd', '4', 'rubbish chute', NULL, '2022-06-24', NULL, '[]', 0, '3'),
(6, 'WgCwUFwVu', '5', 'PO for door ledge issued', NULL, '2022-07-04', NULL, '[]', 0, '13'),
(7, '9lk8LngWm', '6', 'Sand order PO', NULL, '2022-07-04', NULL, '[]', 0, '13'),
(8, 'wxNf8V1kz', '6', 'Equipment PO', NULL, '2022-07-04', NULL, '[]', 0, '13'),
(9, 'ipFZKcn4s', '7', 'TESTING FOR WASABIT BUCKET ACCESS DENIED', NULL, '2022-07-06', NULL, '[]', 0, '13');
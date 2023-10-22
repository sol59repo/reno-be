-- Migration number: 0019 	 2023-10-07T05:18:29.057Z
CREATE TABLE `projectModels` (
  `count` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `name` TEXT(255) DEFAULT NULL,
  `location` TEXT(200) NOT NULL,
  `modelId` TEXT(100) NOT NULL,
  `dateAdded` date NOT NULL,
  `lastUpdated` date DEFAULT NULL,
  `status` TEXT(50) NOT NULL,
  `addedBy` TEXT(50) NOT NULL,
  `updatedBy` TEXT(100) DEFAULT NULL
);

INSERT INTO `projectModels` (`count`, `name`, `location`, `modelId`, `dateAdded`, `lastUpdated`, `status`, `addedBy`, `updatedBy`) VALUES
(2, 'Project 1', 'Project 1', '-oEXq0RFD', '2022-06-23', NULL, 'Pending', '1', NULL),
(3, 'Tecklim ', '1 Teck Lim', '1TL', '2022-07-01', NULL, 'Pending', '13', NULL),
(4, '1TL', '1 Teck', 'uH3vZ4JE9', '2022-07-03', NULL, 'Deleted', '13', NULL),
(5, 'Test 1', 'Test 1', 'hihgukGih', '2022-07-06', NULL, 'Pending', '13', NULL);
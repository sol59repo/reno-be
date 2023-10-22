-- Migration number: 0018 	 2023-10-07T05:17:51.926Z
CREATE TABLE `projectConsumables` (
  `count` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `fkProject` TEXT(120) NOT NULL,
  `fkConsumables` TEXT(120) NOT NULL,
  `dateAdded` TEXT(120) NOT NULL,
  `status` TEXT(120) NOT NULL,
  `addedBy` TEXT(120) NOT NULL,
  `qty` TEXT(120) NOT NULL
);

INSERT INTO `projectConsumables` (`count`, `fkProject`, `fkConsumables`, `dateAdded`, `status`, `addedBy`, `qty`) VALUES
(1, '2', '1', '1656057391310', 'In-Stock', '3', '41'),
(2, '2', '2', '1656057391315', 'In-Stock', '3', '41'),
(3, '3', '83', '1656904017061', 'In-Stock', '13', '1'),
(4, '2', '51', '1656953371020', 'In-Stock', '13', '1'),
(5, '2', '52', '1656953371035', 'In-Stock', '13', '1');
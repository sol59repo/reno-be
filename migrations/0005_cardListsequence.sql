-- Migration number: 0005 	 2023-10-07T04:56:52.274Z
CREATE TABLE `cardListsequence` (
  `count` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `modelId` TEXT(250) DEFAULT NULL,
  `cardListSeq` longtext
);

INSERT INTO `cardListsequence` (`count`, `modelId`, `cardListSeq`) VALUES
(1, '-oEXq0RFD', '[\"bW_r0J91k\",\"VVIWd4jd1\",\"-4kKM-Gqx\"]'),
(2, '1TL', '[\"6tVFhhVfG\"]'),
(3, 'hihgukGih', '[\"iITLN7NQJ\"]');
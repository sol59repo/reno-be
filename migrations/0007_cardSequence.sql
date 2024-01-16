-- Migration number: 0007 	 2023-10-07T05:01:45.070Z
CREATE TABLE `cardSequence` (
    `count` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `fkCardList` INTEGER DEFAULT NULL,
    `sequence` longtext
);

INSERT INTO `cardSequence` (`count`, `fkCardList`, `sequence`) VALUES
(1, '1', '[]'),
(2, '2', '[\"pL-VCJdhj\",\"dd9tzWUJe\"]'),
(3, '3', '[\"XiD3M5Zjx\",\"RhKao8pTF\"]'),
(4, '4', '[\"z0S4TyGZd\"]'),
(5, '5', '[\"WgCwUFwVu\"]'),
(6, '6', '[\"9lk8LngWm\",\"wxNf8V1kz\"]'),
(7, '7', '[\"ipFZKcn4s\"]');
-- Migration number: 0002 	 2023-10-05T13:54:39.313Z
CREATE TABLE IF NOT EXISTS attendance (
    count INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    date date NOT NULL,
    fkUser TEXT(150) NOT NULL,
    status TEXT(150) DEFAULT NULL,
    timeIn TEXT(120) DEFAULT NULL,
    timeOut TEXT(120) DEFAULT NULL,
    hourSpent TEXT(100) DEFAULT '0',
    availabilityStatus TEXT(120) DEFAULT NULL,
    projectModel TEXT(100) NOT NULL
);

INSERT INTO `attendance` (`count`, `date`, `fkUser`, `status`, `timeIn`, `timeOut`, `hourSpent`, `availabilityStatus`, `projectModel`) VALUES
(1, '2022-06-24', '12', 'Out', 'JUN 24 2022 AT 3:51 PM', 'JUN 24 2022 AT 3:51 PM', '0', 'Present', '-oEXq0RFD'),
(2, '2022-07-04', '14', 'In', 'JUL 4 2022 AT 10:43 AM', NULL, '0', 'Present', '1TL'),
(3, '2022-07-04', '15', 'In', 'JUL 4 2022 AT 10:54 AM', NULL, '0', 'Present', '1TL'),
(4, '2022-07-04', '16', NULL, NULL, NULL, '0', NULL, '1TL'),
(5, '2022-07-04', '17', 'In', 'JUL 4 2022 AT 10:43 AM', NULL, '0', 'Present', '1TL'),
(6, '2022-07-04', '18', NULL, NULL, NULL, '0', NULL, '1TL'),
(7, '2022-07-04', '19', NULL, NULL, NULL, '0', NULL, '1TL'),
(8, '2022-07-04', '20', NULL, NULL, NULL, '0', NULL, '1TL'),
(9, '2022-07-12', '14', NULL, NULL, NULL, '0', NULL, '1TL'),
(10, '2022-07-12', '15', NULL, NULL, NULL, '0', NULL, '1TL'),
(11, '2022-07-12', '16', NULL, NULL, NULL, '0', NULL, '1TL'),
(12, '2022-07-12', '17', NULL, NULL, NULL, '0', NULL, '1TL'),
(13, '2022-07-12', '18', NULL, NULL, NULL, '0', NULL, '1TL'),
(14, '2022-07-12', '19', NULL, NULL, NULL, '0', NULL, '1TL'),
(15, '2022-07-12', '20', NULL, NULL, NULL, '0', NULL, '1TL');
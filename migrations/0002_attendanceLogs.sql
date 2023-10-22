-- Migration number: 0002 	 2023-10-05T13:57:26.072Z
CREATE TABLE IF NOT EXISTS attendanceLogs (
  count INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  fkAttendanceCount TEXT(120) NOT NULL,
  statusAction TEXT(100) DEFAULT NULL,
  time TEXT(100) DEFAULT NULL,
  timeSpent TEXT(100) DEFAULT NULL
);

INSERT INTO `attendanceLogs` (`count`, `fkAttendanceCount`, `statusAction`, `time`, `timeSpent`) VALUES
(1, '1', 'Time in', 'JUN 24 2022 AT 3:51 PM', '0'),
(2, '1', 'Time out', 'JUN 24 2022 AT 3:51 PM', '0'),
(3, '2', 'Time in', 'JUL 4 2022 AT 10:43 AM', '0'),
(4, '5', 'Time in', 'JUL 4 2022 AT 10:43 AM', '0'),
(5, '3', 'Time in', 'JUL 4 2022 AT 10:54 AM', '0');

-- Migration number: 0015 	 2023-10-07T05:15:10.080Z
CREATE TABLE `meetingAttendees` (
  `count` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `fkMeetingCount` TEXT(100) NOT NULL,
  `fkUserCount` TEXT(100) NOT NULL,
  `attendStatus` TEXT(100) NOT NULL
);

INSERT INTO `meetingAttendees` (`count`, `fkMeetingCount`, `fkUserCount`, `attendStatus`) VALUES
(5, '2', '13', 'Active'),
(6, '3', '13', 'Active'),
(8, '5', '1', 'Active'),
(9, '5', '3', 'Active'),
(10, '6', '1', 'Active'),
(11, '7', '1', 'Active'),
(12, '7', '3', 'Active'),
(13, '8', '13', 'Active'),
(14, '8', '3', 'Active'),
(16, '10', '3', 'Active'),
(17, '10', '13', 'Active'),
(18, '11', '13', 'Active'),
(19, '12', '3', 'Active'),
(20, '12', '13', 'Active'),
(21, '13', '3', 'Active'),
(22, '13', '13', 'Active');
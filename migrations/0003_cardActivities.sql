-- Migration number: 0003 	 2023-10-05T13:59:28.227Z
CREATE TABLE IF NOT EXISTS cardActivities (
  count INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  fkCard TEXT(100) NOT NULL,
  content longtext,
  dateTime datetime NOT NULL,
  addedBy TEXT(100) NOT NULL,
  type TEXT(100) NOT NULL,
  hasFile tinyint(1) NOT NULL DEFAULT '0',
  fileName TEXT(150) DEFAULT NULL,
  filePath TEXT(250) DEFAULT NULL,
  status TEXT(50) NOT NULL DEFAULT 'Active'
);

INSERT INTO `cardActivities` (`count`, `fkCard`, `content`, `dateTime`, `addedBy`, `type`, `hasFile`, `fileName`, `filePath`, `status`) VALUES
(1, '4', 'attached June 24 2022 8:5:33 17.06.2022 - Long Quan Paint Pte Ltd (104785) Teck Lim Rd.jpeg to this card', '2022-06-24 08:05:33', '2203-2075', 'file', 0, 'June 24 2022 8:5:33 17.06.2022 - Long Quan Paint Pte Ltd (104785) Teck Lim Rd.jpeg', 'https://s3.us-west-1.wasabisys.com/onealpha/June 24 2022 8:5:33 17.06.2022 - Long Quan Paint Pte Ltd (104785) Teck Lim Rd.jpeg', 'Active'),
(2, '4', 'attached June 24 2022 8:5:38 14.06.2022 - Yong Thye Heng Hardware Manufacturer (CS268391) Bright Hill Drive.jpeg to this card', '2022-06-24 08:05:38', '2203-2075', 'file', 0, 'June 24 2022 8:5:38 14.06.2022 - Yong Thye Heng Hardware Manufacturer (CS268391) Bright Hill Drive.jpeg', 'https://s3.us-west-1.wasabisys.com/onealpha/June 24 2022 8:5:38 14.06.2022 - Yong Thye Heng Hardware Manufacturer (CS268391) Bright Hill Drive.jpeg', 'Active'),
(3, '4', 'attached June 24 2022 8:5:47 17.06.2022 - Asia Hardware Pte Ltd (2206-3310) Safety Vest for Woodland Workers.jpeg to this card', '2022-06-24 08:05:48', '2203-2075', 'file', 0, 'June 24 2022 8:5:47 17.06.2022 - Asia Hardware Pte Ltd (2206-3310) Safety Vest for Woodland Workers.jpeg', 'https://s3.us-west-1.wasabisys.com/onealpha/June 24 2022 8:5:47 17.06.2022 - Asia Hardware Pte Ltd (2206-3310) Safety Vest for Woodland Workers.jpeg', 'Active'),
(4, '6', 'attached July 04 2022 2:51:27 Sand PO - Teck Lim.pdf to this card', '2022-07-04 02:51:27', 'OKT', 'file', 0, 'July 04 2022 2:51:27 Sand PO - Teck Lim.pdf', 'https://s3.us-west-1.wasabisys.com/onealpha/July 04 2022 2:51:27 Sand PO - Teck Lim.pdf', 'Deleted'),
(5, '6', 'deleted the  July 04 2022 2:51:27 Sand PO - Teck Lim.pdf from this card', '2022-07-04 02:51:39', 'OKT', 'delete', 0, 'July 04 2022 2:51:27 Sand PO - Teck Lim.pdf', NULL, 'Active'),
(6, '7', 'attached July 04 2022 2:57:47 Sand PO - Teck Lim.pdf to this card', '2022-07-04 02:57:48', 'OKT', 'file', 0, 'July 04 2022 2:57:47 Sand PO - Teck Lim.pdf', 'https://s3.us-west-1.wasabisys.com/onealpha/July 04 2022 2:57:47 Sand PO - Teck Lim.pdf', 'Active'),
(7, '9', 'attached July 06 2022 7:47:7 logo.jpeg to this card', '2022-07-06 07:47:07', 'OKT', 'file', 0, 'July 06 2022 7:47:7 logo.jpeg', 'https://s3.us-west-1.wasabisys.com/onealpha/July 06 2022 7:47:7 logo.jpeg', 'Active');
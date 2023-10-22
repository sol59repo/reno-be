-- Migration number: 0011 	 2023-10-07T05:05:09.830Z
CREATE TABLE `consumableLogs` (
  `count` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `ID` TEXT(100) NOT NULL,
  `fkModel` TEXT(100) NOT NULL,
  `refId` TEXT(250) DEFAULT NULL,
  `description` TEXT(250) NOT NULL,
  `dateTime` datetime NOT NULL,
  `addedBy` TEXT(100) NOT NULL,
  `type` TEXT(100) NOT NULL
);

INSERT INTO `consumableLogs` (`count`, `ID`, `fkModel`, `refId`, `description`, `dateTime`, `addedBy`, `type`) VALUES
(1, 'Rs5KT2VKu', '-oEXq0RFD', '1', 'New Order added.', '2022-06-23 17:36:01', '1', 'Add PO'),
(2, 'RR6oULfxh', '-oEXq0RFD', '2', 'New Order added.', '2022-06-24 07:55:47', '3', 'Add PO'),
(3, 'PzUQaLqxL', '-oEXq0RFD', '1', 'Approved Order', '2022-06-24 07:56:11', '3', 'Approved PO'),
(4, 'yhiVl_tjW', '-oEXq0RFD', '2', 'Approved Order', '2022-06-24 07:56:14', '3', 'Approved PO'),
(5, 'ng-CXMR-6', '-oEXq0RFD', '1', 'Acknowleged Order by user', '2022-06-24 07:56:31', '3', 'Acknowleged PO'),
(6, 'UQktomN-T', '-oEXq0RFD', '2', 'Acknowleged Order by user', '2022-06-24 07:56:33', '3', 'Acknowleged PO'),
(7, 'ILXa2VWJ3', '-oEXq0RFD', 'n/a', 'Adding of quantity to materials', '2022-06-24 08:12:23', '3', 'Add Qty'),
(8, 'gdNCbFrna', '-oEXq0RFD', '3', 'New Order added.', '2022-06-24 08:15:16', '3', 'Add PO'),
(9, 'ZpmCWqYyD', '-oEXq0RFD', 'n/a', 'Adding of quantity to materials', '2022-06-24 10:41:34', '3', 'Add Qty'),
(10, 'xnZ1aA9I8', '-oEXq0RFD', '3', 'Approved Order', '2022-06-28 02:29:34', '3', 'Approved PO'),
(11, 'QcY3ibYgZ', '1TL', '4', 'New Order added.', '2022-07-04 02:41:27', '13', 'Add PO'),
(12, 'EGToO7_Wn', '1TL', '5', 'New Order added.', '2022-07-04 02:41:39', '13', 'Add PO'),
(13, 'hD5Mko446', '1TL', '6', 'New Order added.', '2022-07-04 02:41:48', '13', 'Add PO'),
(14, 'mL-5nuPYH', '1TL', '4', 'Approved Order', '2022-07-04 03:01:22', '13', 'Approved PO'),
(15, '6BM8jWTHr', '1TL', '4', 'Acknowleged Order by user', '2022-07-04 03:06:57', '13', 'Acknowleged PO'),
(16, 'isJnkCA6Q', '-oEXq0RFD', '7', 'New Order added.', '2022-07-04 16:46:07', '13', 'Add PO'),
(17, 'oqH7-QPAd', '-oEXq0RFD', '7', 'Approved Order', '2022-07-04 16:49:12', '13', 'Approved PO'),
(18, 'WDKVMoqrj', '-oEXq0RFD', '7', 'Acknowleged Order by user', '2022-07-04 16:49:31', '13', 'Acknowleged PO');
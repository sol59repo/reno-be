-- Migration number: 0021 	 2023-10-07T05:19:48.193Z
CREATE TABLE `purchaseOrder` (
  `count` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `modelId` TEXT(250) NOT NULL,
  `Id` TEXT(250) NOT NULL,
  `dateAdded` date NOT NULL,
  `addedBy` TEXT(250) NOT NULL,
  `status` TEXT(250) NOT NULL
);

INSERT INTO `purchaseOrder` (`count`, `modelId`, `Id`, `dateAdded`, `addedBy`, `status`) VALUES
(1, '-oEXq0RFD', 'Dk1GfbhrJ', '2022-06-23', '1', 'Acknowledged'),
(2, '-oEXq0RFD', 'V9SIGYYID', '2022-06-24', '3', 'Acknowledged'),
(3, '-oEXq0RFD', 'qYKdKle3m', '2022-06-24', '3', 'Approved'),
(4, '1TL', 'loSZbXGTc', '2022-07-04', '13', 'Acknowledged'),
(5, '1TL', '6PbdRryxV', '2022-07-04', '13', 'For Approval'),
(6, '1TL', 'EBS8sQwcF', '2022-07-04', '13', 'For Approval'),
(7, '-oEXq0RFD', '6UIgd_hPJ', '2022-07-04', '13', 'Acknowledged');
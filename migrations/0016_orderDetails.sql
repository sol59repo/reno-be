-- Migration number: 0016 	 2023-10-07T05:15:54.027Z
CREATE TABLE `orderDetails` (
  `count` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `fkPo` TEXT(250) NOT NULL,
  `fkItemCount` TEXT(250) NOT NULL,
  `orderQty` INTEGER NOT NULL,
  `status` TEXT(50) NOT NULL
);

INSERT INTO `orderDetails` (`count`, `fkPo`, `fkItemCount`, `orderQty`, `status`) VALUES
(1, '1', '1', 10, 'For Approval'),
(2, '1', '2', 10, 'For Approval'),
(3, '2', '1', 10, 'For Approval'),
(4, '2', '2', 20, 'For Approval'),
(5, '3', '1', 1, 'For Approval'),
(6, '3', '2', 1, 'For Approval'),
(7, '4', '83', 1, 'For Approval'),
(8, '5', '8', 1, 'For Approval'),
(9, '6', '57', 1, 'For Approval'),
(10, '7', '51', 1, 'For Approval'),
(11, '7', '52', 1, 'For Approval');
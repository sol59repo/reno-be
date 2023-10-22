-- Migration number: 0004 	 2023-10-05T14:01:21.884Z
CREATE TABLE IF NOT EXISTS cardLists (
  count INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  id TEXT(250) NOT NULL,
  modelId TEXT(200) NOT NULL,
  name TEXT(200) NOT NULL,
  status TEXT(50) NOT NULL
);

INSERT INTO `cardLists` (`count`, `id`, `modelId`, `name`, `status`) VALUES
(1, 'VVIWd4jd1', '-oEXq0RFD', 'permits', 'Active'),
(2, 'bW_r0J91k', '-oEXq0RFD', 'signed documnents', 'Active'),
(3, 'QB0Pb4SgN', '-oEXq0RFD', 'receipts', 'Archived'),
(4, '-4kKM-Gqx', '-oEXq0RFD', 'QE PO', 'Active'),
(5, 'XKBQlEpiO', '1TL', 'PO issued', 'Archived'),
(6, '6tVFhhVfG', '1TL', 'PO issued', 'Active'),
(7, 'iITLN7NQJ', 'hihgukGih', 'Testing only', 'Active');

-- Migration number: 0025 	 2023-10-07T05:22:38.977Z
CREATE TABLE `users` (
  `count` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `ID` TEXT(100) NOT NULL,
  `password` TEXT(150) NOT NULL,
  `usertype` TEXT(25) NOT NULL,
  `status` TEXT(25) NOT NULL
);

INSERT INTO `users` (`count`, `ID`, `password`, `usertype`, `status`) VALUES
(3, '2203-2075', '$2a$08$XfFrf8acDJpP3OYsM2qzp.UtATwLfHyw4cxsO12MO8ZChCIKcDr8e', 'Admin', 'Active'),
(12, '2206-8365', '$2a$08$ipiy2Mihdmu0T3Onr1viZeTd8oNNREsa3e8GGbl.ISmkchCntNiIa', 'Staff', 'Deleted'),
(13, 'OKT', '$2a$08$zoUH9nvXfQLnD7TkcqiBWef15prbIw.v16AJA3xCQu5gRIfs1ROGK', 'Superadmin', 'Active'),
(14, '2207-3690', '$2a$08$xX7w/xDfF8bDkgNOM2RupeZFHZchQQn7ilqfsjl5POReDHtyp1Ah6', 'Staff', 'Active'),
(15, '2207-5386', '$2a$08$wy2d9MrER7p/7dAl718A9euObBkK5hVpD9sy51plBDBm18zjD1Oju', 'Staff', 'Active'),
(16, '2207-3590', '$2a$08$x9yZv4HGInf3eLtf...fEelayrdbwLYQP18Cd6kONIGqyZMk5hIfy', 'Staff', 'Active'),
(17, '2207-2434', '$2a$08$tLy7oQG7ePtpu6JsToxksed/TpfcwlCA.zjhiBcNdecEmvYGvkcDe', 'Staff', 'Active'),
(18, '2207-8835', '$2a$08$16AhsiSJ8WEC16KAGJXpfuU6Y0sTTWSk8xuxqcIbw3Izqx.4fGfiq', 'Staff', 'Active'),
(19, '2207-4534', '$2a$08$T2W0Nrf/xjMOvrCgMh58QO841ISeatU6gU.Hg2kms8hPAg6QMpO0e', 'Staff', 'Active'),
(20, '2207-8298', '$2a$08$OvjKy6J6ZvTVH6b7ghitJOHxaJ.VkNhheCTWi5o4KGxAmUa3lRCdm', 'Staff', 'Active');
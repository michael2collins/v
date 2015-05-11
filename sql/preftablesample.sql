--
-- Sample data for table `userpreferences`
--
delete from `users` where id = 1;

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `api_key`, `status`) VALUES
(1, 'default', 'default@natickmartialarts.com', '', '', 1);

delete from `userpreferences`;

INSERT INTO `userpreferences` ( `prefkey`, `prefcolumn`, `preforder`, `user_id`) VALUES
('allstudents', 'ID', 1, 1),
('allstudents', 'FirstName', 2, 1),
('allstudents', 'LastName', 3, 1),
('allstudents', 'CurrentRank', 4, 1),
('allstudents', 'Parent', 5, 1),
('allstudents', 'Email', 6, 1),
('allstudents', 'Email2', 7, 1),
('allstudents', 'Phone', 8, 1),
('allstudents', 'AltPhone', 9, 1),
('allstudents', 'Address', 10, 1),
('allstudents', 'City', 11, 1),
('allstudents', 'State', 12, 1),
('allstudents', 'ZIP', 13, 1);

--
-- Sample data for table `userpreferences`
--
delete from `users` where user_id = 1;

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `api_key`, `status`) VALUES
(1, 'default', 'mark@natickmartialarts.com', '', '', 1);

delete from `userpreferences`;

INSERT INTO `userpreferences` ( `prefkey`, `prefcolumn`, `preforder`, `user_id`) VALUES
('allstudents', 'ID', 1, 1),
('allstudents', 'FirstName', 2, 1),
('allstudents', 'LastName', 3, 1),
('allstudents', 'CurrentRank', 4, 1),
('allstudents', 'Parent', 5, 1),
('allstudents', 'Phone', 6, 1);

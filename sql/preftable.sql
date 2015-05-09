DROP TABLE IF EXISTS `userpreferences`;

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `userpreferences` (
`id` int(11) NOT NULL,
  `prefkey` varchar(250) DEFAULT NULL,
  `prefcolumn` varchar(255) NOT NULL,
  `preforder` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,  
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Indexes for table `users`
--
ALTER TABLE `userpreferences`
 ADD PRIMARY KEY (`id`), ADD KEY `user_id` (`user_id`);


--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `userpreferences`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for table `user_tasks`
--
ALTER TABLE `userpreferences`
ADD CONSTRAINT `userpreferences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

CREATE TABLE `score` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `score` int(10) unsigned NOT NULL,
    `clicks` mediumint(8) unsigned NOT NULL,
    `score_date` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
CREATE DATABASE IF NOT EXISTS lawsuit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE `user` (
`id`  bigint NOT NULL ,
`user_name`  varchar(255) NULL ,
`password`  varchar(255) NULL ,
`real_name`  varchar(255) NULL ,
`mobile`  varchar(11) NOT NULL ,
`level`  int NOT NULL DEFAULT 1,
`dept_id`  bigint NULL ,
`post_id`  bigint NULL ,
`create_time`  datetime NULL ON UPDATE CURRENT_TIMESTAMP ,
`update_time`  datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP ,
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `user` ADD UNIQUE INDEX (`mobile`) ;
ALTER TABLE `user` MODIFY COLUMN `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL AFTER `id`, ADD UNIQUE INDEX `user_name` (`user_name`) USING HASH ;
-- ALTER TABLE `user` ADD COLUMN `real_name`  varchar(255) NULL AFTER `password`;

CREATE TABLE `administrative_division` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` int NOT NULL,
  `level` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `administrative_division` ADD INDEX (`id`, `parent_id`, `level`) ;

CREATE TABLE `dictionary` (
  `id` bigint NOT NULL,
  `parent_id`  bigint NOT NULL DEFAULT -1,
  `dict_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dict_label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dict_value` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

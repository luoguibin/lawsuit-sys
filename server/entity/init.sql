CREATE DATABASE IF NOT EXISTS lawsuit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE `user` (
`id`  bigint NOT NULL ,
`user_name`  varchar(255) NULL ,
`password`  varchar(255) NULL ,
`mobile`  varchar(11) NOT NULL ,
`level`  int NOT NULL DEFAULT 1,
`dept_id`  bigint NULL ,
`post_id`  bigint NULL ,
`create_time`  datetime NULL ON UPDATE CURRENT_TIMESTAMP ,
`update_time`  datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP ,
PRIMARY KEY (`id`)
);

ALTER TABLE `user` ADD UNIQUE INDEX (`mobile`) ;
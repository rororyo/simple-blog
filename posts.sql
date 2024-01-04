create table posts(
	id serial primary key,
	category text,
	title text,
	picture bytea,
	post_content text,
	author text,
	date_created timestamp default current_timestamp
);
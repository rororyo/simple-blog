create table posts(
	id serial primary key,
	category text,
	title text,
	picture bytea,
	post_content text,
	author text,
	date_created timestamp default current_timestamp
);

create table category (
	id serial primary key,
	category_name text
)

create table users(
	id serial primary key,
	email text,
	password text,
	role text,
)


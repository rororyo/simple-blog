-- Database: Simple Blog

-- DROP DATABASE IF EXISTS "Simple Blog";

CREATE DATABASE "Simple Blog"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
-- Table: public.posts

-- DROP TABLE IF EXISTS public.posts;

CREATE TABLE IF NOT EXISTS public.posts
(
    id integer NOT NULL DEFAULT nextval('posts_id_seq'::regclass),
    category_id integer,
    title text COLLATE pg_catalog."default",
    picture text COLLATE pg_catalog."default",
    post_content text COLLATE pg_catalog."default",
    author text COLLATE pg_catalog."default",
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT posts_pkey PRIMARY KEY (id),
    CONSTRAINT posts_id_category_fkey FOREIGN KEY (category_id)
        REFERENCES public.category (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.posts
    OWNER to postgres;

-- Table: public.category

-- DROP TABLE IF EXISTS public.category;

CREATE TABLE IF NOT EXISTS public.category
(
    id integer NOT NULL DEFAULT nextval('category_id_category_seq'::regclass),
    category_name text COLLATE pg_catalog."default",
    CONSTRAINT category_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.category
    OWNER to postgres;
-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    email text COLLATE pg_catalog."default",
    password text COLLATE pg_catalog."default",
    role text COLLATE pg_catalog."default" DEFAULT 'member',
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;

INSERT INTO category (id, category_name) 
VALUES 
    (1, 'Technology'),
    (2, 'Travel'),
    (3, 'Food'),
    (4, 'Fashion'),
    (5, 'Health'),
    (6, 'Sports'),
    (7, 'Technology'),
    (8, 'Travel'),
    (9, 'Food'),
    (10, 'Fashion'),
    (11, 'Health'),
    (12, 'Sports');

insert into users (id, email, password, role) values (1, 'admin@admin.com','$2b$10$Vbmk6y3Otl8vBLj3o7WRWe7sV4fwpsoL/nAodJUbuGC/PBnx/OOmq', 'admin');
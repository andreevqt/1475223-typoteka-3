SET client_min_messages = warning;
--
-- Create users table
--
DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE public.users (
  id bigserial PRIMARY KEY,
  name character varying(100),
  email character varying(100),
  avatar character varying(100),
  password character varying(255)
);


--
-- Create categories table
--
DROP TABLE IF EXISTS public.categories CASCADE;
CREATE TABLE public.categories (
  id bigserial PRIMARY KEY,
  name character varying(100)
);


--
-- Create articles table
--
DROP TABLE IF EXISTS public.articles CASCADE;
CREATE TABLE public.articles (
  id bigserial PRIMARY KEY, 
  title character varying(250),
  announce character varying(250),
  fullText text,
  picture character varying(100),
  author_id bigint NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE ONLY public.articles
  ADD CONSTRAINT author_fk FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE NOT VALID;


--
-- Create comments table
--
DROP TABLE IF EXISTS public.comments CASCADE;
CREATE TABLE public.comments (
  id bigserial PRIMARY KEY,
  text text,
  article_id bigint NOT NULL,
  author_id bigint NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE ONLY public.comments
  ADD CONSTRAINT author_fk FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE NOT VALID;

ALTER TABLE ONLY public.comments
  ADD CONSTRAINT article_fk FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE CASCADE NOT VALID;


--
-- Create articles_categories table
--
DROP TABLE IF EXISTS public.articles_categories;
CREATE TABLE public.articles_categories (
  article_id bigint NOT NULL,
  category_id bigint NOT NULL
);

ALTER TABLE ONLY public.articles_categories
  ADD CONSTRAINT article_fk FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE CASCADE NOT VALID;

ALTER TABLE ONLY public.articles_categories
  ADD CONSTRAINT category_fk FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE NOT VALID;

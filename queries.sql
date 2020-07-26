--
-- Получить список всех категорий (идентификатор, наименование категории)
--
SELECT * FROM categories;


--
-- Получить список категорий для которых создана минимум одна публикация (идентификатор, наименование категории)
--
SELECT DISTINCT categories.id, categories.name 
FROM articles_categories
JOIN categories ON articles_categories.category_id = categories.id
JOIN articles ON articles_categories.article_id = articles.id;


--
-- Получить список категорий с количеством публикаций (идентификатор, наименование категории, количество публикаций в категории)
--
SELECT categories.id, categories.name, COUNT(categories.id) as articles_count
FROM articles_categories
JOIN categories ON articles_categories.category_id = categories.id
JOIN articles ON articles_categories.article_id = articles.id
GROUP BY categories.id;


--
-- Получить список публикаций (идентификатор публикации, заголовок публикации, анонс публикации, дата публикации, имя и фамилия автора, контактный email, количество комментариев, наименование категорий). Сначала свежие публикации.
--
SELECT data.id, data.title, data.announce, data.full_text, data.picture, data.created_at, COUNT(comments.article_id) as comments_count, users.name, users.email FROM 
(
	SELECT articles.*, string_agg(categories.name, ', ') as categories
	FROM articles_categories
	JOIN categories ON articles_categories.category_id = categories.id
	JOIN articles ON articles_categories.article_id = articles.id
	GROUP BY articles.id
) as data
JOIN comments ON comments.article_id = data.id
JOIN users ON users.id = data.author_id
GROUP BY comments.article_id, 
    data.id,
    data.title,
    data.announce,
    data.full_text,
    data.picture,
    data.created_at,
    users.name,
    users.email
ORDER BY data.created_at DESC;


--
-- Получить полную информацию определённой публикации (идентификатор публикации, заголовок публикации, анонс, полный текст публикации, дата публикации, путь к изображению, имя и фамилия автора, контактный email, количество комментариев, наименование категорий)
--
SELECT data.id, data.title, data.announce, data.full_text, data.picture, data.created_at, COUNT(comments.article_id) as comments_count, users.name, users.email FROM 
(
	SELECT articles.*, string_agg(categories.name, ', ') as categories
	FROM articles_categories
	JOIN categories ON articles_categories.category_id = categories.id
	JOIN articles ON articles_categories.article_id = articles.id
	GROUP BY articles.id
) as data
JOIN comments ON comments.article_id = data.id
JOIN users ON users.id = data.author_id
GROUP BY comments.article_id, 
    data.id,
    data.title,
    data.announce,
    data.full_text,
    data.picture,
    data.created_at,
    users.name,
    users.email
HAVING data.id = 1;


--
-- Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария)
--
SELECT comments.id, comments.text, comments.article_id, comments.created_at, users.name, users.email 
FROM comments
JOIN users ON users.id = author_id
ORDER BY created_at DESC
LIMIT 5;

--
-- Получить список комментариев для определённой публикации (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария). Сначала новые комментарии;
--
SELECT comments.id, comments.text, comments.article_id, comments.created_at, users.name, users.email 
FROM comments
JOIN users ON users.id = author_id
WHERE article_id = 1
ORDER BY created_at DESC

--
-- Обновить заголовок определённой публикации на «Как я встретил Новый год»
--
UPDATE articles
SET title = 'Уникальное предложение!'
WHERE id = 1;


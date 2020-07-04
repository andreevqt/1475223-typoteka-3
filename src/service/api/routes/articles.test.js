'use strict';
/* eslint-disable no-undef */

const request = require(`supertest`);
const {
  API_PREFIX,
  http
} = require(`../../constants`);
const {
  app,
  services
} = require(`../../testSetup`);

const articleAttrs = {
  category: [`Разное`],
  fullText: `При покупке с меня бесплатная доставка в черте города. Две страницы заляпаны свежим кофе. Пользовались бережно и только по большим праздникам., Бонусом отдам все аксессуары.`,
  announce: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  title: `Рок — это протест`,
};

const commentAttrs = {
  text: `Какой-то комментарий`
};

describe(`${API_PREFIX}/articles api endpoint`, () => {
  let testArticle = null;
  let testComment = null;

  beforeEach(() => {
    services.articleService.clear();
    testArticle = services.articleService.create(articleAttrs);
    testComment = services.commentService.create(testArticle.id, commentAttrs);
  });

  describe(`GET ${API_PREFIX}/articles`, () => {
    test(`Should return an articles list`, async () => {
      const response = await request(app)
        .get(`${API_PREFIX}/articles`)
        .expect(http.OK);

      const articles = response.body;

      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBe(1);

      const article = articles[0];
      expect(article).toEqual(testArticle);
    });
  });

  describe(`GET ${API_PREFIX}/articles/:articleId`, () => {
    test(`Should get an article by articleId`, async () => {
      const response = await request(app)
        .get(`${API_PREFIX}/articles/${testArticle.id}`)
        .expect(http.OK);

      const article = response.body;
      expect(testArticle).toEqual(article);
    });

    test(`Should return 404 error if articleId is wrong`, async () => {
      const response = await request(app)
        .get(`${API_PREFIX}/articles/1234`);

      expect(response.status).toBe(http.NOT_FOUND);
    });
  });

  describe(`POST ${API_PREFIX}/articles`, () => {
    test(`Should create an article`, async () => {
      const response = await request(app)
        .post(`${API_PREFIX}/articles`)
        .send(articleAttrs)
        .expect(http.CREATED);

      const article = response.body;
      expect(article).toEqual(expect.objectContaining(articleAttrs));
    });

    test(`Should return 400 error if wrong attributes`, async () => {
      const response = await request(app)
        .post(`${API_PREFIX}/articles`)
        .send({...articleAttrs, wrongAttribute: true});

      expect(response.status).toBe(http.BAD_REQUEST);
    });
  });

  describe(`PUT ${API_PREFIX}/articles/:articleId`, () => {
    const toUpdate = {
      title: `Самый лучший музыкальный альбом этого года`,
      announce: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
      fullText: `Программировать не настолько сложно, как об этом говорят. Ёлки — это не просто красивое дерево. Это прочная древесина. Золотое сечение — соотношение двух величин, гармоническая пропорция. Как начать действовать? Для начала просто соберитесь.`,
      category: [`Разное`, `Программирование`]
    };

    test(`Should update an article`, async () => {
      let response = await request(app)
        .put(`${API_PREFIX}/articles/${testArticle.id}`)
        .send(toUpdate)
        .expect(http.OK);

      const updated = response.body;
      expect(updated).toEqual(expect.objectContaining(toUpdate));

      response = await request(app)
        .get(`${API_PREFIX}/articles/${testArticle.id}`)
        .expect(http.OK);

      const received = response.body;
      expect(updated).toEqual(received);
    });

    test(`Should return 404 error if articleId is wrong`, async () => {
      const respone = await request(app)
        .put(`${API_PREFIX}/articles/1234`)
        .send(toUpdate);

      expect(respone.status).toBe(http.NOT_FOUND);
    });
  });

  describe(`DELETE ${API_PREFIX}/articles/:articleId`, () => {
    test(`Should delete an article`, async () => {
      let response = await request(app)
        .delete(`${API_PREFIX}/articles/${testArticle.id}`)
        .expect(http.OK);

      const deleted = response.body;
      expect(deleted).toEqual(testArticle);

      response = await request(app).
        get(`${API_PREFIX}/articles/${testArticle.id}`);

      expect(response.status).toBe(http.NOT_FOUND);
    });

    test(`Should return 404 error if articleId is wrong`, async () => {
      const response = await request(app)
        .delete(`${API_PREFIX}/articles/1234`);

      expect(response.status).toBe(http.NOT_FOUND);
    });
  });

  describe(`GET ${API_PREFIX}/articles/:articleId/comments`, () => {
    test(`Should get comments list by articleId`, async () => {
      const response = await request(app)
        .get(`${API_PREFIX}/articles/${testArticle.id}/comments`)
        .expect(http.OK);

      const comments = response.body;
      expect(Array.isArray(comments)).toBe(true);
      expect(comments.length).toBe(1);
      expect(comments[0]).toEqual(expect.objectContaining(commentAttrs));
    });

    test(`Should return 404 error if articleId is wrong`, async () => {
      const response = await request(app)
        .get(`${API_PREFIX}/articles/1234/comments`);

      expect(response.status).toBe(404);
    });
  });

  describe(`DELETE ${API_PREFIX}/articles/:articleId/comments/:commentId`, () => {
    test(`Should delete comment by id`, async () => {
      let response = await request(app)
        .delete(`${API_PREFIX}/articles/${testArticle.id}/comments/${testComment.id}`)
        .expect(http.OK);

      const comment = response.body;
      expect(comment).toEqual(testComment);

      response = await request(app)
        .get(`${API_PREFIX}/articles/${testArticle.id}/comments/${testComment.id}`);

      expect(response.status).toBe(http.NOT_FOUND);
    });

    test(`Should return 404 error if articleId is wrong`, async () => {
      const response = await request(app)
        .delete(`${API_PREFIX}/articles/1234/comments/${testComment.id}`);

      expect(response.status).toBe(http.NOT_FOUND);
    });
  });

  describe(`POST ${API_PREFIX}/articles/:articleId/comments`, () => {
    const toCreate = {
      text: `Новый комментарий`
    };

    test(`Should create a comment`, async () => {
      let response = await request(app)
        .post(`${API_PREFIX}/articles/${testArticle.id}/comments`)
        .send(toCreate)
        .expect(http.CREATED);

      const created = response.body;
      expect(created).toEqual(expect.objectContaining(toCreate));

      response = await request(app)
        .get(`${API_PREFIX}/articles/${testArticle.id}/comments`)
        .expect(http.OK);

      const comments = response.body;
      expect(comments).toContainEqual(created);
    });

    test(`Should return 404 error if articleId is wrong`, async () => {
      const response = await request(app)
        .post(`${API_PREFIX}/articles/1234`)
        .send(toCreate);

      expect(response.status).toBe(http.NOT_FOUND);
    });

    test(`Should return 400 error if wrong attributes`, async () => {
      const response = await request(app)
        .post(`${API_PREFIX}/articles/${testArticle.id}/comments`)
        .send({...toCreate, someWrongAttr: true});

      expect(response.status).toBe(http.BAD_REQUEST);
    });
  });
});

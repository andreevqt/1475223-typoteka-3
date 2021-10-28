'use strict';
/* eslint-disable no-undef, max-nested-callbacks */

const request = require(`supertest`);
const {
  API_PREFIX,
  http
} = require(`../../constants`);
const {services} = require(`./`);
const {server, setup, teardown} = require(`../../test-setup`);

const articleAttrs = {
  category: [1, 2, 3],
  fullText: `При покупке с меня бесплатная доставка в черте города. Две страницы заляпаны свежим кофе. Пользовались бережно и только по большим праздникам., Бонусом отдам все аксессуары.`,
  announce: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  title: `Рок — это протест, протест внутри вас. Кричите об этом, пусть люди знают...`,
};

const commentAttrs = {
  text: `Какой-то комментарий`
};

beforeAll(async () => {
  await setup();
});

afterAll(async () => {
  await teardown();
});

describe(`${API_PREFIX}/articles api endpoint`, () => {
  let testArticle;
  let testComment;

  beforeEach(async () => {
    const article = await services.articles.create(articleAttrs);
    const comment = await services.comments.create(article, commentAttrs);
    testArticle = (await article.reload()).convertToJSON();
    testComment = comment.convertToJSON();
  });

  describe(`GET ${API_PREFIX}/articles`, () => {
    test(`Should return an articles list`, async () => {
      const response = await request(server)
        .get(`${API_PREFIX}/articles`)
        .expect(http.OK);

      const storedArticles = (await services.articles.findAll())
        .map((article) => article.convertToJSON());
      const articles = response.body.items;

      expect(articles.length).toBe(storedArticles.length);
      expect(storedArticles).toEqual(expect.objectContaining(articles));
    });
  });

  describe(`GET ${API_PREFIX}/articles/:articleId`, () => {
    test(`Should get an article by articleId`, async () => {
      const response = await request(server)
        .get(`${API_PREFIX}/articles/${testArticle.id}`)
        .expect(http.OK);

      const article = response.body;
      expect(testArticle).toEqual(expect.objectContaining(article));
    });

    test(`Should return 404 error if articleId is wrong`, async () => {
      const response = await request(server)
        .get(`${API_PREFIX}/articles/1234`);

      expect(response.status).toBe(http.NOT_FOUND);
    });
  });

  describe(`POST ${API_PREFIX}/articles`, () => {
    test(`Should create an article`, async () => {
      const response = await request(server)
        .post(`${API_PREFIX}/articles`)
        .send(articleAttrs)
        .expect(http.CREATED);

      const article = response.body;
      expect(article.title).toEqual(articleAttrs.title);
      expect(article.announce).toEqual(articleAttrs.announce);
      expect(article.fullText).toEqual(articleAttrs.fullText);
      article.category.forEach((category) => expect(articleAttrs.category).toContain(category.id));
    });

    test(`Should return 400 error if wrong attributes`, async () => {
      let response = await request(server)
        .post(`${API_PREFIX}/articles`)
        .send({...articleAttrs, wrongAttribute: true});
      expect(response.status).toBe(http.BAD_REQUEST);

      // title.length < 30
      response = await request(server)
        .post(`${API_PREFIX}/articles`)
        .send({...articleAttrs, title: `123`});
      expect(response.status).toBe(http.BAD_REQUEST);

      // title.length > 250
      response = await request(server)
        .post(`${API_PREFIX}/articles`)
        .send({...articleAttrs, title: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus cursus est velit. Vestibulum vitae dolor sed erat posuere sodales. Praesent aliquet ex at condimentum tincidunt. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean luctus tempor sagittis. Donec eget molestie lacus. Mauris ut faucibus libero. Nulla ullamcorper aliquam erat, vitae dapibus lectus eleifend eget. Aenean id dolor et erat porttitor mollis in non purus. Maecenas commodo arcu eu mi auctor, quis feugiat massa fringilla. Ut id nulla nec velit ornare blandit. Nullam vulputate nibh nisi, et lobortis felis hendrerit non.`});
      expect(response.status).toBe(http.BAD_REQUEST);

      // no title
      response = await request(server)
        .post(`${API_PREFIX}/articles`)
        .send({...articleAttrs, title: null});
      expect(response.status).toBe(http.BAD_REQUEST);

      // no category
      response = await request(server)
        .post(`${API_PREFIX}/articles`)
        .send({...articleAttrs, category: []});
      expect(response.status).toBe(http.BAD_REQUEST);
    });
  });

  describe(`PUT ${API_PREFIX}/articles/:articleId`, () => {
    const toUpdate = {
      title: `Самый лучший музыкальный альбом этого года`,
      announce: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
      fullText: `Программировать не настолько сложно, как об этом говорят. Ёлки — это не просто красивое дерево. Это прочная древесина. Золотое сечение — соотношение двух величин, гармоническая пропорция. Как начать действовать? Для начала просто соберитесь.`,
    };

    test(`Should update an article`, async () => {
      let response = await request(server)
        .put(`${API_PREFIX}/articles/${testArticle.id}`)
        .send(toUpdate)
        .expect(http.OK);

      const updated = response.body;
      expect(updated).toEqual(expect.objectContaining(toUpdate));

      response = await request(server)
        .get(`${API_PREFIX}/articles/${testArticle.id}`)
        .expect(http.OK);

      const received = response.body;
      expect(updated).toEqual(received);
    });

    test(`Should return 404 error if articleId is wrong`, async () => {
      const respone = await request(server)
        .put(`${API_PREFIX}/articles/1234`)
        .send(toUpdate);

      expect(respone.status).toBe(http.NOT_FOUND);
    });
  });

  describe(`DELETE ${API_PREFIX}/articles/:articleId`, () => {
    test(`Should delete an article`, async () => {
      let response = await request(server)
        .delete(`${API_PREFIX}/articles/${testArticle.id}`)
        .expect(http.OK);

      const deleted = response.body;
      expect(testArticle).toEqual(expect.objectContaining(deleted));

      response = await request(server).
        get(`${API_PREFIX}/articles/${testArticle.id}`);

      expect(response.status).toBe(http.NOT_FOUND);
    });

    test(`Should return 404 error if articleId is wrong`, async () => {
      const response = await request(server)
        .delete(`${API_PREFIX}/articles/1234`);

      expect(response.status).toBe(http.NOT_FOUND);
    });
  });

  describe(`GET ${API_PREFIX}/articles/:articleId/comments`, () => {
    test(`Should get comments list by articleId`, async () => {
      const response = await request(server)
        .get(`${API_PREFIX}/articles/${testArticle.id}/comments`)
        .expect(http.OK);

      const comments = response.body;
      expect(Array.isArray(comments)).toBe(true);
      expect(comments.length).toBe(1);
      expect(comments[0].text).toEqual(commentAttrs.text);
    });

    test(`Should return 404 error if articleId is wrong`, async () => {
      const response = await request(server)
        .get(`${API_PREFIX}/articles/1234/comments`);

      expect(response.status).toBe(http.NOT_FOUND);
    });
  });

  describe(`DELETE ${API_PREFIX}/articles/:articleId/comments/:commentId`, () => {
    test(`Should delete comment by id`, async () => {
      let response = await request(server)
        .delete(`${API_PREFIX}/articles/${testArticle.id}/comments/${testComment.id}`)
        .expect(http.OK);

      const comment = response.body;
      expect(testComment).toEqual(expect.objectContaining(comment));

      response = await request(server)
        .get(`${API_PREFIX}/articles/${testArticle.id}/comments/${testComment.id}`);

      expect(response.status).toBe(http.NOT_FOUND);
    });

    test(`Should return 404 error if articleId is wrong`, async () => {
      const response = await request(server)
        .delete(`${API_PREFIX}/articles/1234/comments/${testComment.id}`);

      expect(response.status).toBe(http.NOT_FOUND);
    });
  });

  describe(`POST ${API_PREFIX}/articles/:articleId/comments`, () => {
    const toCreate = {
      text: `Новый комментарий`
    };

    test(`Should create a comment`, async () => {
      let response = await request(server)
        .post(`${API_PREFIX}/articles/${testArticle.id}/comments`)
        .send(toCreate)
        .expect(http.CREATED);

      const created = response.body;
      expect(created).toEqual(expect.objectContaining(toCreate));

      response = await request(server)
        .get(`${API_PREFIX}/articles/${testArticle.id}/comments`)
        .expect(http.OK);

      const comments = response.body;
      expect(comments).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: created.id,
          text: created.text,
          author: created.author
        })
      ]));
    });

    test(`Should return 404 error if articleId is wrong`, async () => {
      const response = await request(server)
        .post(`${API_PREFIX}/articles/1234`)
        .send(toCreate);

      expect(response.status).toBe(http.NOT_FOUND);
    });

    test(`Should return 400 error if wrong attributes`, async () => {
      const response = await request(server)
        .post(`${API_PREFIX}/articles/${testArticle.id}/comments`)
        .send({...toCreate, someWrongAttr: true});

      expect(response.status).toBe(http.BAD_REQUEST);
    });
  });
});

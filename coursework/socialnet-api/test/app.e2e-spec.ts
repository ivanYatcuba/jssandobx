import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

import { AppModule } from 'src/app.module'

describe('SocialNet Api', () => {
  let app: INestApplication

  let accessToken: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  describe('list posts flow', () => {
    it(`/POST token`, () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/token')
        .set('x-client-id', 'test-client')
        .send({
          login: 'newMe1',
          password: 'qwerty12345',
        })
        .then((result) => {
          accessToken = result.body.accessToken
          expect(result.statusCode).toBe(200)
          expect(result.body).toMatchObject({
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
          })
        })
    })

    it(`/GET posts`, () => {
      return request(app.getHttpServer())
        .get('/api/v1/post/list?limit=100&offset=0')
        .set('x-client-id', 'test-client')
        .set('authorization', `Bearer ${accessToken}`)
        .then((result) => {
          accessToken = result.body.accessToken
          expect(result.statusCode).toBe(200)
          expect(result.body).toMatchObject({
            posts: expect.arrayContaining([
              expect.objectContaining({
                author: expect.any(String),
                content: expect.any(String),
                date: expect.any(String),
                id: expect.any(String),
              }),
            ]),
          })
        })
    })
  })

  afterAll(async () => {
    await app.close()
  })
})

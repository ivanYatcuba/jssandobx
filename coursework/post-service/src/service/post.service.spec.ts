import { Logger } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Cache } from 'cache-manager'
import { PostDto } from 'lib-core/dist/dto/post.dto'
import { PostNotFound } from 'lib-core/dist/error/post'
import { PostRepository } from 'src/repository/post.repository'
import { SelectPostRow } from 'src/repository/rows'

import { PostService } from './post.service'
import { UserService } from './user.service'

describe('PostService', () => {
  let postService: PostService
  let postRepository: PostRepository
  let cacheManager: Cache
  let userService: UserService

  const uid = 'must be uuid'
  const date = new Date()
  const author = '1'
  const authorName = 'tester'
  const content = 'test'

  const expectedSinglePost: PostDto = {
    author: authorName,
    content,
    date,
    id: uid,
  }

  const mockResp: SelectPostRow = {
    author,
    content,
    createdat: date,
    uid: uid,
    updatedat: undefined,
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [Logger, PostRepository, PostService, UserService],
    })
      .useMocker((token) => {
        if (token === 'CACHE_MANAGER') {
          return { get: jest.fn().mockResolvedValue({}), set: jest.fn().mockResolvedValue({}) }
        }

        if (token === 'USER_SERVICE') {
          return { send: jest.fn().mockResolvedValue({}) }
        }

        return {}
      })
      .compile()

    postRepository = moduleRef.get(PostRepository)
    postService = moduleRef.get(PostService)
    cacheManager = moduleRef.get('CACHE_MANAGER')
    userService = moduleRef.get(UserService)

    jest.spyOn(cacheManager, 'get').mockImplementation(async (id) => {
      return undefined
    })

    jest.spyOn(userService, 'getUsernames').mockImplementation(async (req) => {
      return {
        users: [{ userId: author, userName: authorName }],
      }
    })
  })

  describe('getPost', () => {
    it('should return existing post', async () => {
      jest.spyOn(postRepository, 'getPost').mockImplementation(async (id) => {
        return mockResp
      })

      expect(await postService.getPost({ postId: uid })).toStrictEqual(expectedSinglePost)
    })

    it('should return not found post', async () => {
      jest.spyOn(postRepository, 'getPost').mockImplementation(async (id) => {
        return undefined
      })

      await expect(postService.getPost({ postId: uid })).rejects.toThrow(PostNotFound)
    })
  })

  describe('listPosts', () => {
    it('should return list of existing post', async () => {
      jest
        .spyOn(postRepository, 'getPosts')
        .mockImplementation(async (limit: number, offset: number, authorId?: string) => {
          return [mockResp]
        })

      expect(await postService.getPosts({ limit: 0, offset: 0 })).toStrictEqual({
        posts: [expectedSinglePost],
      })
    })
  })
})

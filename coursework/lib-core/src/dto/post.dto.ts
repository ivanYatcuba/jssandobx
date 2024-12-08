export interface UserPostInput {
  content: string
}

export interface PostDto {
  id: string
  content: string
  author: string
  date: Date
}

export interface CreatePostRequest {
  content: string
  authorId: string
}

export interface CreatePostResponse {
  postId: string
}

export interface UpdatePostRequest {
  postId: string
  content: string
  authorId: string
}

export interface ListPostsRequest {
  authorId?: string
  limit?: number
  offset?: number
}

export interface ListPostsResponse {
  posts: PostDto[]
}

export interface DeletePostRequest {
  postId: string
  authorId: string
}

export interface DeletePostResponse {
  postId: string
}

export interface GetPostRequest {
  postId: string
}

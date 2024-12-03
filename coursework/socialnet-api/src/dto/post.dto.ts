export interface PostDto {
  content: string
  authorId: string
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

export interface UpdatePostResponse {
  postId: string
}

export interface ListAuthorsRequest {}

export interface ListAuthorsResponse {
  authorIds: string[]
}

export interface ListPostsRequest {
  authorId?: string
}

export interface ListPostsResponse {
  authorId?: string
}

export interface DeletePostRequest {
  postId: string
  authorId: string
}

export interface DeletePostResponse {
  postId: string
}

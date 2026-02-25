/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  AddReactionParams,
  ApiResponseDto,
  CommentCountItemResponseDto,
  CommentReactionResponseDto,
  CommentResponseDto,
  CountCommentsParams,
  CreateCommentParams,
  DeleteCommentParams,
  ListCommentsParams,
  RemoveReactionParams,
  UpdateCommentParams,
} from '../types';

export class CommentsService {
  constructor(private readonly client: HttpClient) {}

  async deleteComment(params: DeleteCommentParams): Promise<ApiResponseDto<null>> {
    return this.client.request<ApiResponseDto<null>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/db/meta/comment/${encodeURIComponent(String(params.commentId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async updateComment(params: UpdateCommentParams): Promise<ApiResponseDto<CommentResponseDto>> {
    return this.client.request<ApiResponseDto<CommentResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/comment/${encodeURIComponent(String(params.commentId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async listComments(params?: ListCommentsParams): Promise<ApiResponseDto<CommentResponseDto[]>> {
    return this.client.request<ApiResponseDto<CommentResponseDto[]>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/comments`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async createComment(params: CreateCommentParams): Promise<ApiResponseDto<CommentResponseDto>> {
    return this.client.request<ApiResponseDto<CommentResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/comments`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async addReaction(params: AddReactionParams): Promise<ApiResponseDto<CommentReactionResponseDto>> {
    return this.client.request<ApiResponseDto<CommentReactionResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/comments/${encodeURIComponent(String(params.commentId))}/reactions`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async removeReaction(params: RemoveReactionParams): Promise<ApiResponseDto<null>> {
    return this.client.request<ApiResponseDto<null>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/db/meta/comments/${encodeURIComponent(String(params.commentId))}/reactions/${encodeURIComponent(String(params.reaction))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async countComments(params?: CountCommentsParams): Promise<ApiResponseDto<CommentCountItemResponseDto[]>> {
    return this.client.request<ApiResponseDto<CommentCountItemResponseDto[]>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/comments/count`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }
}

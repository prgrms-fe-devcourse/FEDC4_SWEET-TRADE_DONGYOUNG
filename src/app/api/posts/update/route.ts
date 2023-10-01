import { NextResponse } from 'next/server'
import { Environment } from '@/config/environments'
import { POST_CONSTANT } from '@/constants/post'
import { useServerCookie } from '@/hooks/useServerCookie'
import { apiServer } from '@/lib/axiosSever'
import type Post from '@/types/post'

export async function PUT(request: Request) {
  const channelId = Environment.channelId()
  const { CHANNEL_ID } = POST_CONSTANT
  const dislikeChannelId = Environment.dislikeChannelID()

  const { token } = useServerCookie()

  const updatePost = async (
    formData: FormData,
    channelId: string,
    postId?: string,
  ): Promise<Post> => {
    if (formData.has(CHANNEL_ID)) {
      formData.delete(CHANNEL_ID)
    }
    formData.append(CHANNEL_ID, channelId)
    if (postId) {
      formData.delete('postId')
      formData.set('postId', postId)
    }

    const { data } = await apiServer.put('/posts/update', formData, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'multipart/form-data',
      },
    })

    return data
  }

  try {
    const formData = await request.formData()
    const mapping_ID = JSON.parse(
      formData.get('title')?.toString() || '',
    ).mapping_ID
    const updatePostRes = await updatePost(formData, dislikeChannelId).then(
      async () => {
        return await updatePost(formData, channelId, mapping_ID)
      },
    )
    return NextResponse.json(updatePostRes)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response.data.message },
      { status: error.response.status },
    )
  }
}

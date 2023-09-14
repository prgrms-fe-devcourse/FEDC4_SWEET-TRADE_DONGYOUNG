import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { constants } from '@/config/constants'
import { Environment } from '@/config/environments'
import { apiClient } from '@/lib/axios'

export async function POST(request: Request) {
  const formData = await request.formData()
  const channelId = Environment.channelId()
  formData.append('channelId', channelId)

  const cookieStore = cookies()
  const token = JSON.parse(cookieStore.get(constants.AUTH_TOKEN)?.value!)

  const { data } = await apiClient.post(
    `${Environment.baseUrl()}/posts/create`,
    formData,
    {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'multipart/form-data',
      },
    },
  )

  return NextResponse.json(data)
}
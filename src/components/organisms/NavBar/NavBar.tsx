'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Avatar from '@/components/atoms/Avatar'
import FollowToggleButton from '@/components/atoms/FollowToggleButton'
import ImageButton from '@/components/atoms/ImageButton'
import { Text } from '@/components/atoms/Text'
import Assets from '@/config/assets'
import APP_PATH from '@/config/paths'
import useFollow from '@/hooks/useFollow'
import useGetAllUsers from '@/queries/users'
import User from '@/types/user'
import './index.scss'

export default function NavBar() {
  const router = useRouter()
  const { data } = useGetAllUsers()

  return (
    <div className="nav-container color-bg--bg-1">
      <ImageButton
        src={Assets.MainLogo}
        onClick={() => router.push(APP_PATH.home())}
        shape="square"
      />
      <div className="nav-title">
        <Text textStyle="heading1-bold">전체 사용자</Text>
        <div className="user-count color-bg--highlight">
          <Text textStyle="caption1-bold" color="bg-2">
            {data?.length.toString() || ''}
          </Text>
        </div>
      </div>
      <ul className="avatar-list">
        {data?.map((user) => <UserListItem key={user._id} userData={user} />)}
      </ul>
    </div>
  )
}

function UserListItem({ userData }: { userData: User<string> }) {
  const { isFollowing, followToggle, followerCount, unavailable } =
    useFollow(userData)
  const { image, _id, fullName } = userData
  return (
    <li className="avatar-list__item">
      <div className="avatar-list__item--avatar">
        <Link href={APP_PATH.userProfile(_id)} prefetch={false}>
          <Avatar
            src={image}
            size={3}
            text={fullName}
            subText={`${followerCount} Followers`}
          />
        </Link>
      </div>
      <FollowToggleButton
        size="micro"
        isFollowing={isFollowing}
        followToggle={followToggle}
        unavailable={unavailable}
      />
    </li>
  )
}

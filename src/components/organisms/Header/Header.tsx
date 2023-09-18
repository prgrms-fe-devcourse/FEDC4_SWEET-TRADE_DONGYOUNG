'use client'

import { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Avatar from '@/components/atoms/Avatar'
import ImageButton from '@/components/atoms/ImageButton'
import NotificationButton from '@/components/atoms/NotificationButton'
import SearchBar from '@/components/atoms/SearchBar'
import { Text } from '@/components/atoms/Text'
import ModalDropdownList from '@/components/molcules/ModalDropdownList'
import Assets from '@/config/assets'
import { constants } from '@/config/constants'
import APP_PATH from '@/config/paths'
import { validateToken } from '@/services/auth'
import User from '@/types/user'
import './index.scss'

const DynamicDarkModeButton = dynamic(
  () => import('@/components/atoms/DarkModeButton'),
  { ssr: false },
)

export default function Header() {
  const [dropdownClick, setDropdownClick] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<User>()
  const [mode, setMode] = useState(false)

  let token = useRef<string | undefined>(undefined)
  const router = useRouter()
  const pathname = usePathname()

  const handleDropdown = () => {
    setDropdownClick(!dropdownClick)
  }

  const changeDarkMode = (value: boolean) => {
    setMode(value)
  }

  const preventPage = () => {
    if (pathname === APP_PATH.postNew() || pathname.includes('user')) {
      router.push(APP_PATH.home())
      alert('로그인한 회원만 이용가능합니다.') // TODO: replace with toast
    }
  }

  useEffect(() => {
    token.current = Cookies.get(constants.AUTH_TOKEN)
    async function validate() {
      const res = await validateToken()
      if (!res) {
        Cookies.remove(constants.AUTH_TOKEN)
        alert('올바르지 않은 토큰입니다.') // TODO: replace with toast
        router.push(APP_PATH.login())
      }
      setIsLoggedIn(true)
      setCurrentUser(() => res)
    }
    token.current ? validate() : preventPage()
    handleDropdown()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <div className="header-container color-bg--bg-1">
      <SearchBar />
      <div className="header-button-container">
        <NotificationButton />
        <DynamicDarkModeButton changeDarkMode={changeDarkMode} />
      </div>
      {isLoggedIn ? (
        <div className="header-user-container">
          <Avatar
            src={currentUser ? currentUser.image : Assets.PCCImage}
            size={3}
            text={currentUser ? currentUser.fullName : ''}
            textStyle={{
              fontWeight: 'bold',
              paddingLeft: '0.5rem',
            }}
          />
          <ImageButton
            size={1.5}
            src={mode ? Assets.ArrowLightIcon : Assets.ArrowDarkIcon}
            shape="square"
            onClick={handleDropdown}
          />
          {dropdownClick && (
            <ModalDropdownList userId={currentUser ? currentUser._id : ''} />
          )}
        </div>
      ) : (
        <div className="sign-container">
          <Link href={APP_PATH.login()} style={{ padding: '0 2rem' }}>
            <Text textStyle="subtitle1-bold" color="gray-3">
              로그인
            </Text>
          </Link>
          <Link href={APP_PATH.register()} style={{ padding: '0 0.5rem' }}>
            <Text textStyle="subtitle1-bold" color="gray-3">
              회원가입
            </Text>
          </Link>
        </div>
      )}
    </div>
  )
}

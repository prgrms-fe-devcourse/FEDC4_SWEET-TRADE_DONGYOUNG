import React, { Dispatch, SetStateAction } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import { Text } from '@/components/atoms/Text'
import { useDeletePost } from '@/queries/post'
import './index.scss'

type PropsType = {
  postId: string
  isOpen: boolean
  setIsDeleted?: Dispatch<SetStateAction<boolean>>
}

function PostOptionsDropdown({ postId, isOpen, setIsDeleted }: PropsType) {
  const deletePostMutation = useDeletePost(postId)

  const handleDeletePost = () => {
    if (setIsDeleted) {
      setIsDeleted((prevState) => !prevState)
    }
    deletePostMutation.mutate()
  }
  return (
    <div
      className={classNames('modal-dropdown-container', 'color-bg--bg-1', {
        close: !isOpen,
        options: true,
      })}
    >
      <OptimizedLink href={'#'}>
        {/*TODO - 게시글 수정 페이지 링크 */}
        <Text textStyle="body2-bold">게시글 수정</Text>
      </OptimizedLink>
      <div className="logout-button" onClick={handleDeletePost}>
        <Text textStyle="body2-bold">게시글 삭제</Text>
      </div>
    </div>
  )
}

const OptimizedLink = React.memo(
  ({
    href,
    children,
    className,
  }: {
    href: string
    children: React.ReactNode
    className?: string
  }) => (
    <Link href={href} className={className}>
      {children}
    </Link>
  ),
)
OptimizedLink.displayName = 'OptimizedLink'

export default React.memo(PostOptionsDropdown, (prevProps, nextProps) => {
  return (
    prevProps.postId === nextProps.postId &&
    prevProps.isOpen === nextProps.isOpen
  )
})
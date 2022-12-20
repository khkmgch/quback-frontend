import {
  Button,
  Center,
  FileInput,
  Loader,
  Menu,
  SegmentedControl,
  Switch,
  TextInput,
  useMantineTheme,
} from '@mantine/core'
import { IconBook, IconChartDots3, IconStack2, IconStar } from '@tabler/icons'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { BookShelf } from '../../components/Book/BookShelf/BookShelf'
import Charts from '../../components/Chart/Charts/Charts'
import { Layout } from '../../components/Layout'
import { QuestionList } from '../../components/Question/QuestionList/QuestionList'
import { useGetUser } from '../../hooks/user/useGetUser'
import { useQueryUser } from '../../hooks/user/useQueryUser'
import { useToggle } from '../../hooks/useToggle'
import { useUpdateUser } from '../../hooks/user/useUpdateUser'
import { User_WithRelation } from '../../types'
import { profileUtils } from './utils'

const Profile: NextPage = () => {
  const PUBLIC_FOLDER = process.env.NEXT_PUBLIC_FOLDER
  const theme = useMantineTheme()
  const router = useRouter()

  //状態

  //ログインしているユーザー
  const { data: loginUser, status } = useQueryUser()

  //ページに表示するユーザー
  const [user, setUser] = useState<
    Omit<User_WithRelation, 'createdAt' | 'updatedAt' | 'hashedPassword'>
  >({
    id: 0,
    email: '',
    userName: '',
    profilePicture: '',
    coverPicture: '',
    questions: [],
    likeQuestions: [],
    books: [],
    followedBy: [],
    following: [],
  })

  //投稿、本棚、グラフの切り替えのための表示モード
  const [display, setDisplay] = useState('question')

  //このページのユーザーをフォローしているかどうか
  const { state: isFollow, setState: setIsFollow, toggle } = useToggle()

  //ユーザー情報更新に使用する状態
  //ユーザ名
  const [userNameInput, setUserNameInput] = useState('')
  //プロフィール画像
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  //カバー画像
  const [coverPicture, setCoverPicture] = useState<File | null>(null)

  //メソッド
  //ユーザーをフォローするメソッド
  const { followUser } = useUpdateUser()
  //ユーザ名を更新するメソッド
  const { handleSubmitUserName, handleCoverPicture, handleProfilePicture } =
    profileUtils()
  //idでユーザーを取得するメソッド
  const { getUserById } = useGetUser()

  //コンポーネントの状態を初期設定するメソッド
  const init = async (id: string | string[] | undefined) => {
    if (typeof id !== 'string') return
    const response = await getUserById(parseInt(id))
    if (response) {
      const user = response.data
      //状態:userを初期化
      setUser({
        id: user.id,
        email: user.email,
        userName: user.userName,
        profilePicture: user.profilePicture,
        coverPicture: user.coverPicture,
        questions: user.questions,
        likeQuestions: user.likeQuestions,
        books: user.books,
        followedBy: user.followedBy,
        following: user.following,
      })
      //状態:userNameInputを初期化
      setUserNameInput(user.userName)
      //状態:isFollowを初期化
      for (let i = 0; i < user.followedBy.length; i++) {
        const curr = user.followedBy[i]
        //既にフォローしているかどうか探索
        if (curr.followerId === loginUser?.id) {
          setIsFollow(true)
          break
        }
      }
    }
  }
  useEffect(() => {
    const { id } = router.query
    init(id)
  }, [router.query, isFollow, loginUser])

  if (user.id === 0)
    return (
      <Layout title="Profile">
        <Loader />
      </Layout>
    )

  return (
    <Layout title="Profile">
      <div className="relative h-60 w-full lg:w-256">
        <Menu shadow="md" position="right-start" offset={-20} withArrow>
          <Menu.Target>
            <img
              src={
                user?.coverPicture
                  ? PUBLIC_FOLDER + '/' + user.coverPicture
                  : PUBLIC_FOLDER + '/cover/tree.jpeg'
              }
              alt=""
              className="h-48 w-full object-cover"
            />
          </Menu.Target>
          {loginUser?.id === user.id ? (
            <Menu.Dropdown>
              {/* <Menu.Item> */}
              <FileInput
                placeholder="カバー画像を変更"
                size="md"
                variant="unstyled"
                accept="image/png,image/jpeg"
                value={coverPicture}
                onChange={(file) => {
                  setCoverPicture(file)
                  handleCoverPicture(file, user)
                }}
              />
            </Menu.Dropdown>
          ) : (
            <></>
          )}
        </Menu>

        <Menu shadow="md" position="right-start" offset={-20} withArrow>
          <Menu.Target>
            <img
              src={
                user?.profilePicture
                  ? PUBLIC_FOLDER + '/' + user.profilePicture
                  : PUBLIC_FOLDER + '/person/noAvatar.png'
              }
              alt=""
              className="absolute inset-x-0 top-36 m-auto rounded-full object-cover outline outline-2 outline-offset-2 outline-gray-300"
              width={96}
              height={96}
            />
          </Menu.Target>
          {loginUser?.id === user.id ? (
            <Menu.Dropdown>
              <FileInput
                placeholder="プロフィール画像を変更"
                size="md"
                variant="unstyled"
                accept="image/png,image/jpeg"
                value={profilePicture}
                onChange={(file) => {
                  setProfilePicture(file)
                  handleProfilePicture(file, user)
                }}
              />
            </Menu.Dropdown>
          ) : (
            <></>
          )}
        </Menu>
      </div>

      <Menu shadow="md" position="right-start" offset={-20} withArrow>
        <Menu.Target>
          <h4 className="mb-0">{user?.userName}</h4>
        </Menu.Target>
        {loginUser?.id === user.id ? (
          <Menu.Dropdown>
            <form
              onSubmit={(e) => handleSubmitUserName(e, user, userNameInput)}
            >
              <div className="flex items-center">
                <TextInput
                  size="md"
                  placeholder="ユーザ名"
                  variant="unstyled"
                  value={userNameInput || ''}
                  onChange={(e) => setUserNameInput(e.target.value)}
                />

                <Button
                  disabled={userNameInput === ''}
                  color="gray"
                  type="submit"
                >
                  変更
                </Button>
              </div>
            </form>
          </Menu.Dropdown>
        ) : (
          <></>
        )}
      </Menu>
      {/* <h4 className="mb-0">{user?.userName}</h4> */}

      <div className="flex w-72 justify-between">
        <h5>フォロー: {user.following.length}</h5>
        <h5>フォロワー: {user.followedBy.length}</h5>
      </div>

      {loginUser?.id !== user.id && (
        <div className="mb-10 ">
          <Switch
            size="md"
            color={theme.colorScheme === 'dark' ? 'gray' : 'indigo'}
            onLabel={
              <IconStar size={16} stroke={2.5} color={theme.colors.orange[4]} />
            }
            offLabel={
              <IconStar size={16} stroke={2.5} color={theme.colors.indigo[6]} />
            }
            checked={isFollow}
            onChange={() => {
              followUser(loginUser?.id, user.id, isFollow)

              toggle()
            }}
          />
        </div>
      )}

      <div className="w-96">
        <SegmentedControl
          fullWidth
          radius={10}
          color="gray"
          transitionDuration={500}
          transitionTimingFunction="linear"
          value={display}
          onChange={setDisplay}
          data={[
            {
              label: (
                <Center>
                  <IconStack2 size={32} className="text-gray-300" />
                </Center>
              ),
              value: 'question',
            },
            {
              label: (
                <Center>
                  <IconBook size={32} className="text-gray-300" />
                </Center>
              ),
              value: 'book',
            },
            {
              label: (
                <Center>
                  <IconChartDots3 size={32} className="text-gray-300" />
                </Center>
              ),
              value: 'chart',
            },
          ]}
        />
      </div>
      <div className="mt-10 flex  w-full items-center justify-center">
        {loginUser?.id === user.id ? (
          display === 'question' ? (
            <QuestionList isTimeline={false} isMine={true} userId={user.id} />
          ) : display === 'book' ? (
            <BookShelf isMine={true} userId={user.id} />
          ) : display === 'chart' ? (
            <Charts isMine={true} userId={user.id} />
          ) : (
            <></>
          )
        ) : display === 'question' ? (
          <QuestionList isTimeline={false} isMine={false} userId={user.id} />
        ) : display === 'book' ? (
          <BookShelf isMine={false} userId={user.id} />
        ) : display === 'chart' ? (
          <Charts isMine={false} userId={user.id} />
        ) : (
          <></>
        )}
      </div>
    </Layout>
  )
}
export default Profile

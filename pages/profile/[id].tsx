import {
  Center,
  FileInput,
  Loader,
  Menu,
  SegmentedControl,
  Switch,
  useMantineTheme,
} from '@mantine/core'
import { IconBook, IconChartDots3, IconStack2, IconStar } from '@tabler/icons'
import axios from 'axios'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { BookShelf } from '../../components/BookShelf'
import Charts from '../../components/Charts'
import { Layout } from '../../components/Layout'
import { QuestionList } from '../../components/QuestionList'
import { useMutateUser } from '../../hooks/useMutateUser'
import { usePostFile } from '../../hooks/usePostFile'
import { useQueryUser } from '../../hooks/useQueryUser'
import { useToggle } from '../../hooks/useToggle'
import { User_WithRelation } from '../../types'

const Profile: NextPage = () => {
  const PUBLIC_FOLDER = process.env.NEXT_PUBLIC_FOLDER
  const theme = useMantineTheme()
  const router = useRouter()

  //投稿、本棚、グラフの切り替えのための表示モードdisplay
  const [display, setDisplay] = useState('question')

  //ログインしているユーザー
  const { data: loginUser, status } = useQueryUser()

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
  //フォローしているかどうかisFollow
  const { state: isFollow, setState, toggle } = useToggle()
  //フォローとフォロー解除のメソッド
  const handleFollow = async () => {
    const userId = loginUser?.id
    const targetUserId = user.id
    if (userId !== targetUserId) {
      if (!isFollow) {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${targetUserId}/follow`
        )
      } else {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${targetUserId}/unfollow`
        )
      }
      toggle()
    }
  }
  //画像ファイルをアップロードするメソッド
  const { fileUpload } = usePostFile()
  //ユーザー情報を更新するMutation
  const { updateUserMutation } = useMutateUser()

  const [coverPicture, setCoverPicture] = useState<File | null>(null)
  //カバー画像を変更するメソッド
  const handleCoverPicture = async (file: File | null) => {
    setCoverPicture(file)
    if (file !== null) {
      const data = new FormData()

      //ファイル名に時間を足すことで名前の重複を防ぐ
      // const fileName = Date.now() + file.name
      //dataにkeyとvalueを追加する
      // data.append('name', fileName)
      data.append('file', file)
      console.log('data: ', data)

      try {
        //画像APIを叩く
        //アップロード用のapiとメソッドを開発
        const uploaded = await fileUpload(data)
        const coverPictureName = uploaded?.data.fileName
        console.log('uploaded: ', uploaded)
        console.log('coverPictureName: ', uploaded?.data.fileName)
        //ユーザー情報の更新
        updateUserMutation.mutate({
          id: user.id,
          userName: user.userName,
          profilePicture: user.profilePicture || '',
          coverPicture: coverPictureName,
        })
      } catch (err) {
        console.log(err)
      }
    }
  }

  useEffect(() => {
    const { id } = router.query
    if (typeof id === 'string') {
      const fetchUser = async (userId: number) => {
        const response: {
          data: Omit<User_WithRelation, 'hashedPassword'>
        } | null = await axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`)
          .then((res) => res)
          .catch((err) => {
            console.error(err)
            return null
          })
        if (response) {
          const user = response.data
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
          for (let i = 0; i < user.followedBy.length; i++) {
            const curr = user.followedBy[i]
            if (curr.followerId === loginUser?.id) {
              setState(true)
              break
            }
          }
        }
      }
      fetchUser(parseInt(id))
    }
  }, [router.query, isFollow, loginUser])

  if (user.id === 0)
    return (
      <Layout title="Profile">
        <Loader />
      </Layout>
    )

  return (
    <Layout title="Profile">
      <div className="relative h-60 w-256">
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

          <Menu.Dropdown>
            {/* <Menu.Item> */}
            <FileInput
              placeholder="カバー画像を変更"
              size="md"
              variant="unstyled"
              accept="image/png,image/jpeg"
              value={coverPicture}
              onChange={(file) => handleCoverPicture(file)}
            />
            {/* </Menu.Item> */}
          </Menu.Dropdown>
        </Menu>

        {/* <img
          src={
            user?.coverPicture
              ? PUBLIC_FOLDER + user.coverPicture
              : PUBLIC_FOLDER + '/cover/tree.jpeg'
          }
          alt=""
          className="h-48 w-full object-cover"
        /> */}
        <img
          src={
            user?.profilePicture
              ? PUBLIC_FOLDER + user.profilePicture
              : PUBLIC_FOLDER + '/person/noAvatar.png'
          }
          alt=""
          className="absolute inset-x-0 top-36 m-auto rounded-full object-contain outline outline-2 outline-offset-2 outline-gray-300"
          width={96}
          height={96}
        />
      </div>
      <h4 className="mb-0">{user?.userName}</h4>

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
            onChange={() => handleFollow()}
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
      <div className="mt-10">
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

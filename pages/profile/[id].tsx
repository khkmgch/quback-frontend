import {
  Center,
  Loader,
  SegmentedControl,
  Switch,
  useMantineTheme,
} from '@mantine/core'
import { IconBook, IconChartDots3, IconStack2, IconStar } from '@tabler/icons'
import axios from 'axios'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { BookShelf } from '../../components/BookShelf'
import Charts from '../../components/Charts'
import { Layout } from '../../components/Layout'
import { QuestionList } from '../../components/QuestionList'
import { useQueryUser } from '../../hooks/useQueryUser'
import { User_WithRelation } from '../../types'

//SSGの場合
//外部から１回だけデータを持ってくる
//getStaticPropsという名前はnextjs側が用意した名前なので合わせる
// export async function getStaticProps() {
//     const allPostsData = getPostsData();

//     //getStaticProps特有の書き方
//     //return して、Homeコンポーネントに１度だけ渡す
//     return {
//       props: {
//         allPostsData,
//       },
//     };
//   }

//SSRの場合
//contextにはユーザーがリクエストした情報が入る
// export async function getServerSideProps(context) {
//   return {
//     props: {
//       //コンポーネントに渡すためのprops
//     },
//   };
// }

const Profile: NextPage = () => {
  const PUBLIC_FOLDER = process.env.NEXT_PUBLIC_FOLDER
  const theme = useMantineTheme()
  const router = useRouter()
  const { id } = router.query

  const [display, setDisplay] = useState('question')

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

  const [isFollow, setIsFollow] = useState(false)
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
      setIsFollow((prevState) => !prevState)
    }
  }

  useEffect(() => {
    const fetchUser = async (userId: number) => {
      const reaponse: { data: Omit<User_WithRelation, 'hashedPassword'> } =
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`)
      console.log(reaponse)
      const user = reaponse.data
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
          setIsFollow(true)
          break
        }
      }
    }
    if (typeof id === 'string') {
      fetchUser(parseInt(id))
    }
  }, [])

  if (user.id === 0)
    return (
      <Layout title="Profile">
        <Loader />
      </Layout>
    )

  return (
    <Layout title="Profile">
      <div className="relative h-60 w-256">
        <img
          src={
            user?.coverPicture
              ? PUBLIC_FOLDER + user.coverPicture
              : PUBLIC_FOLDER + '/cover/tree.jpeg'
          }
          alt=""
          className="h-48 w-full object-cover"
        />
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

    /* <Layout>
<section>
  <p className={utilStyle.headingMd}>
    Koheiです。プログラミングの学習をしています。
  </p>
</section>

<section className={`${utilStyle.headingMd} ${utilStyle.padding1px}`}>
  <h2>📝エンジニアのブログ</h2>
  <div className={styles.grid}>
    {allPostsData.map(({ id, title, date, thumbnail }) => (
      <article key={id}>
        <Link href={`/posts/${id}`}>
          <img src={`${thumbnail}`} className={styles.thumbnailImage} />
        </Link>
        <Link href={`/posts/${id}`} className={utilStyle.boldText}>
          {title}
        </Link>
        <br />
        <small className={utilStyle.lightText}>{date}</small>
      </article>
    ))}
  </div>
</section>
</Layout> */
  )
}
export default Profile

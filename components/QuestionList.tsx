import { useQueryQuestions } from '../hooks/useQueryQuestions'
import { List, ThemeIcon, Loader } from '@mantine/core'
import { IconCircleDashed } from '@tabler/icons'
import { QuestionItem } from './QuestionItem'
import { useQueryUser } from '../hooks/useQueryUser'
import { FC } from 'react'
import { useQueryTimeline } from '../hooks/useQueryTimeline'

//SSRの場合
//contextにはユーザーがリクエストした情報が入る
// export async function getServerSideProps(context) {
//   return {
//     props: {
//       //コンポーネントに渡すためのprops
//     },
//   }
// }

// useEffect(() => {
//   // useEffect内で、非同期関数を作成して呼び出す必要がある
//   const fetchLikes = async () => {
//     const reaponse = await axios.get(`/posts/profile/${userName}`)

//     // console.log(reaponse)
//     //投稿を降順にソートする
//     setPosts(
//       reaponse.data.sort((post1, post2) => {
//         return new Date(post2.createdAt) - new Date(post1.createdAt)
//       })
//     )
//   }
//   fetchLikes()
// }, [userName, user._id])
type Props = {
  mode: string
}
export const QuestionList: FC<Props> = ({ mode = 'Timeline' }) => {
  //mode === 'Profile'の場合、ログインしているユーザーのQuestion一覧をuseQueryQuestionsから取得
  //mode === 'Timeline'の場合、ログインしているユーザーとフォローしているユーザーのQuestionの一覧をuseQueryTimelineから取得
  const { data: questions, status } =
    mode === 'Profile' ? useQueryQuestions() : useQueryTimeline()
  if (status === 'loading') return <Loader my="lg" color="cyan" />
  return (
    <List
      my="lg"
      spacing="sm"
      size="sm"
      className='list-none'
    >
      {questions?.map((question) => (
        <QuestionItem
          key={question.id}
          id={question.id}
          title={question.title}
          description={question.description}
          isPrivate={question.isPrivate}
          books={question.books}
          likes={question.likes}
          userId={question.userId}
        />
      ))}
    </List>
  )
}

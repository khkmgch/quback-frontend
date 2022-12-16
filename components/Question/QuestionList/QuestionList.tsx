import { List, Loader } from '@mantine/core'
import { QuestionItem } from '../QuestionItem/QuestionItem'
import { FC, useEffect, useState } from 'react'
import { Question_WithRelation, User_WithRelation } from '../../../types'
import { useQueryQuestions } from '../../../hooks/question/useQueryQuestions'
import { useQueryUser } from '../../../hooks/user/useQueryUser'
import { questionListUtils } from './utils'

type Props = {
  isTimeline: boolean
  isMine: boolean
  userId: number
}
export const QuestionList: FC<Props> = ({ isTimeline, isMine, userId }) => {
  //状態

  //Questionの配列
  const [questions, setQuestions] = useState<Question_WithRelation[]>([])

  //ログインしているユーザー
  const { data: loginUser, status: userStatus } = useQueryUser()

  //ログインしているユーザーのQuestionの配列
  const { data: loginQuestions, status: questionStatus } = useQueryQuestions()

  //メソッド

  //fetchQuestions:Questionsを取得するメソッド
  //filterQuestions:タイムラインorプロフィール、公開or非公開によって表示するデータ(questions)を変化させるメソッド
  const { fetchQuestions, filterQuestions } = questionListUtils()

  //apiから取ってきたデータをsetQuestionに渡して状態をセットする初期化メソッド
  //Questionの公開・非公開の状態(isPrivate)によって、filter関数にかける。
  const init = async (
    isTimeline: boolean,
    isMine: boolean,
    loginQuestions: Question_WithRelation[] | undefined,
    loginUser: Omit<User_WithRelation, 'hashedPassword'> | undefined,
    userId: number
  ) => {
    //apiからデータを取ってくる
    let questions = await fetchQuestions(
      isTimeline,
      isMine,
      loginQuestions,
      userId
    )
    //タイムラインorプロフィール、公開or非公開によって取ってきたデータ(questions)にフィルターをかける
    let data: Question_WithRelation[] = await filterQuestions(
      isTimeline,
      isMine,
      loginUser,
      questions
    )
    //コンポーネントの状態:questionsにセット
    if (data.length > 0) {
      setQuestions(data)
    }
  }

  useEffect(() => {
    if (userId !== 0) {
      init(isTimeline, isMine, loginQuestions, loginUser, userId)
    }
  }, [questionStatus, userId, isMine, isTimeline, loginUser, userStatus])

  if (
    questionStatus === 'loading' ||
    userStatus === 'loading' ||
    !loginUser ||
    userId === 0
  )
    return <Loader />
  else
    return (
      <List my="lg" spacing="sm"  className="list-none px-2 w-full md:w-4/5 lg:w-192 ">
        {questions?.map((question) => {
          return (
            <QuestionItem
              key={question.id}
              id={question.id}
              title={question.title}
              description={question.description}
              isPrivate={question.isPrivate}
              createdAt={question.createdAt}
              books={question.books}
              likes={question.likes}
              userId={question.userId}
              isMine={loginUser.id === question.userId}
            />
          )
        })}
      </List>
    )
}

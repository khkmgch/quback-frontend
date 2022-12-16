import { useGetBook } from '../../../../hooks/book/useGetBook'
import { useMutateQuestion } from '../../../../hooks/question/useMutateQuestion'
import { Book_WithRelation } from '../../../../types'

export const bookShelfUtils = () => {
  //本とQuestionを紐づけするapi通信を行うメソッド
  const { linkToBook_QuestionMutation } = useMutateQuestion()

  //本とQuestionを紐づけするメソッド
  const linkTo = (bookId: number, questionId: number | null | undefined) => {
    if (questionId) {
      linkToBook_QuestionMutation.mutate({ questionId, bookId })
    }
  }

  //idで特定のユーザーの本棚を取得するメソッド
  const { getBooksByUserId } = useGetBook()
  //userIdで特定のユーザーの本棚を取得して配列を返すメソッド
  const fetchBooks = async (userId: number) => {
    const response: { data: Book_WithRelation[] } = await getBooksByUserId(userId)
    if (response) {
      return response.data
    } else return []
  }
  return { linkTo, fetchBooks }
}

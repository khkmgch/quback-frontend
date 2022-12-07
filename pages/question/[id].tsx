import { Loader } from '@mantine/core'
import axios from 'axios'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { BookList } from '../../components/BookList'
import { Layout } from '../../components/Layout'
import { QuestionEditForm } from '../../components/QuestionEditForm'
import { EditingQuestion, Question_WithRelation } from '../../types'
const Question: NextPage = () => {
  
  const [editingQuestion, setEditingQuestion] = useState<Omit<Question_WithRelation, "createdAt">>({
    id: 0,
    updatedAt: new Date(),
    title: '',
    description: '',
    isPrivate: false,
    userId: 0,
    books: [],
    likes: [],
  })
  const router = useRouter()

  const updateEditingQuestion = (payload: any) =>
    setEditingQuestion({
      id: payload.id,
      updatedAt: payload.updatedAt,
      title: payload.title,
      description: payload.description,
      isPrivate: payload.isPrivate,
      userId: payload.userId,
      books: payload.books,
      likes: payload.likes,
    })
  useEffect(() => {
    const { id } = router.query
    if (typeof id === 'string') {
      type FetchQuestion = (id: string) => Promise<void>
      const fetchQuestion: FetchQuestion = async (id: string) => {
        const response: { data: Question_WithRelation } | null = await axios
          .get<Question_WithRelation>(
            `${process.env.NEXT_PUBLIC_API_URL}/question/${id}`
          )
          .then((res) => res)
          .catch((err) => {
            console.error(err)
            return null
          })
        if (response) {
          setEditingQuestion(response.data)
        }
      }
      fetchQuestion(id)
    }
  }, [router.query])
  return (
    <Layout title="question">
      {editingQuestion.id !== 0 ? (
        <QuestionEditForm
          question={editingQuestion}
          update={updateEditingQuestion}
        />
      ) : (
        <Loader />
      )}
      <BookList isMine={true} userId={editingQuestion.userId}/>
    </Layout>
  )
}

export default Question

//プロジェクトで使用するデータ型を定義しておく

import { Like, Link } from '@prisma/client'
import { Prisma } from '@prisma/client'

//新規登録orログインの入力フォームに適用するデータ型
export type AuthForm = {
  email: string
  password: string
}
//現在作成中のQuestionを管理するためのデータ型
export type CreatingQuestion = {
  title: string
  isPrivate: boolean
}
//現在編集中のQuestionを管理するためのデータ型
export type EditingQuestion = {
  id: number
  title: string
  description?: string | null
  isPrivate: boolean

  books: Link[]
  likes: Like[]
}
//本の検索でapiから取得するデータ型
export type SearchedData = {
  kind: string
  totalItems: number
  items: Array<any>
}

//Prisma-clientから自動生成されたUser型を拡張
const userWithRelation = Prisma.validator<Prisma.UserArgs>()({
  include: {
    questions: true,
    books: true,
    likeQuestions: true,
    followedBy: true,
    following: true,
  },
})
export type User_WithRelation = Prisma.UserGetPayload<typeof userWithRelation>

//Prisma-clientから自動生成されたQuestion型を拡張
const questionWithRelation = Prisma.validator<Prisma.QuestionArgs>()({
  include: { likes: true, books: true },
})
export type Question_WithRelation = Prisma.QuestionGetPayload<
  typeof questionWithRelation
>

//Prisma-clientから自動生成されたBook型を拡張
const bookWithRelation = Prisma.validator<Prisma.BookArgs>()({
  include: { links: true },
})
export type Book_WithRelation = Prisma.BookGetPayload<typeof bookWithRelation>

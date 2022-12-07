import {
  Button,
  Center,
  Switch,
  Textarea,
  TextInput,
  useMantineTheme,
} from '@mantine/core'
import { Like, Link } from '@prisma/client'
import { IconDatabase, IconLock, IconLockOpen } from '@tabler/icons'
import { FC, FormEvent } from 'react'
import { useMutateQuestion } from '../hooks/useMutateQuestion'
import useStore from '../store'
import {
  Book_WithRelation,
  EditingQuestion,
  Question_WithRelation,
} from '../types'

type Props = {
  question: Omit<Question_WithRelation, 'createdAt'>
  update: (payload: any) => void
}
export const QuestionEditForm: FC<Props> = ({ question, update }) => {
  //useStoreからeditingQuestionを取り出す
  //   const { editingQuestion } = useStore()
  //useStoreからupdateEditingQuestionを取り出す
  //   const update = useStore((state) => state.updateEditingQuestion)
  const { updateQuestionMutation } = useMutateQuestion()
  const theme = useMantineTheme()
  //受け取るイベントに型を付ける。(FormEvent<HTMLFormElement>)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    updateQuestionMutation.mutate({
      id: question.id,
      updatedAt: question.updatedAt,
      title: question.title,
      description: question.description,
      isPrivate: question.isPrivate,
      userId: question.userId,
      books: question.books,
      likes: question.likes,
    })
  }

  return (
    <div className="w-256">
      <form onSubmit={handleSubmit}>
        <TextInput
          size="xl"
          variant="unstyled"
          mt="md"
          placeholder="title"
          //inputは入力がnullになるとエラーになるため、editingQuestion.titleがない場合の''を設定しておく
          value={question.title || ''}
          onChange={(e) => update({ ...question, title: e.target.value })}
        />
        <Switch
          size="md"
          color={theme.colorScheme === 'dark' ? 'gray' : 'indigo'}
          onLabel={
            <IconLock size={16} stroke={2.5} color={theme.colors.orange[4]} />
          }
          offLabel={
            <IconLockOpen
              size={16}
              stroke={2.5}
              color={theme.colors.indigo[6]}
            />
          }
          checked={question.isPrivate}
          onChange={(e) =>
            update({ ...question, isPrivate: e.currentTarget.checked })
          }
        />
        <Textarea
          autosize
          minRows={20}
          size="md"
          mt="md"
          radius="md"
          placeholder="ここに、疑問の答えを書こう。"
          value={question.description || ''}
          onChange={(e) => update({ ...question, description: e.target.value })}
        />

        <div className="mt-5 flex items-center justify-end">
          <Button
            disabled={question.title === ''}
            color="teal"
            variant="light"
            type="submit"
          >
            更新して保存
          </Button>
        </div>
      </form>
    </div>
  )
}

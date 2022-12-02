import {
  Button,
  Center,
  Switch,
  TextInput,
  useMantineTheme,
} from '@mantine/core'
import { IconDatabase, IconLock, IconLockOpen } from '@tabler/icons'
import { FormEvent } from 'react'
import { useMutateQuestion } from '../hooks/useMutateQuestion'
import useStore from '../store'

export const QuestionEditForm = () => {
  //useStoreからeditingQuestionを取り出す
  const { editingQuestion } = useStore()
  //useStoreからupdateEditingQuestionを取り出す
  const update = useStore((state) => state.updateEditingQuestion)
  const { updateQuestionMutation } = useMutateQuestion()
  const theme = useMantineTheme()
  //受け取るイベントに型を付ける。(FormEvent<HTMLFormElement>)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    updateQuestionMutation.mutate({
      id: editingQuestion.id,
      title: editingQuestion.title,
      description: editingQuestion.description,
      isPrivate: editingQuestion.isPrivate,
      books: editingQuestion.books,
      likes: editingQuestion.likes,
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextInput
          mt="md"
          placeholder="title"
          //inputは入力がnullになるとエラーになるため、editingQuestion.titleがない場合の''を設定しておく
          value={editingQuestion.title || ''}
          onChange={(e) =>
            update({ ...editingQuestion, title: e.target.value })
          }
        />
        <TextInput
          mt="md"
          placeholder="description"
          value={editingQuestion.description || ''}
          onChange={(e) =>
            update({ ...editingQuestion, description: e.target.value })
          }
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
          checked={editingQuestion.isPrivate}
          onChange={(e) =>
            update({ ...editingQuestion, isPrivate: e.currentTarget.checked })
          }
        />
        {/* ボタンを中央寄せするためにCenterを使っている */}
        <Center mt="lg">
          <Button
            disabled={editingQuestion.title === ''}
            leftIcon={<IconDatabase size={14} />}
            color="cyan"
            type="submit"
          >
            {editingQuestion.id === 0 ? 'Create' : 'Update'}
          </Button>
        </Center>
      </form>
    </>
  )
}

import { FormEvent } from 'react'
import {
  TextInput,
  Button,
  Center,
  Switch,
  useMantineTheme,
} from '@mantine/core'
import { IconLock, IconLockOpen } from '@tabler/icons'
import useStore from '../../../store'
import { useMutateQuestion } from '../../../hooks/question/useMutateQuestion'

export const QuestionCreateForm = () => {
  const theme = useMantineTheme()

  //メソッド

  //useStoreからcreatingQuestionを取り出す
  const { creatingQuestion } = useStore()
  //useStoreからupdateCreatingQuestionを取り出す
  const update = useStore((state) => state.updateCreatingQuestion)
  //useMutateQuestionから読み込む
  const { createQuestionMutation } = useMutateQuestion()

  //Questionを新規作成するSubmitメソッド
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createQuestionMutation.mutate({
      title: creatingQuestion.title,
      isPrivate: creatingQuestion.isPrivate,
    })
  }
  return (
    <div className="m-4 flex h-56 w-4/5 md:w-192 flex-col bg-white p-4">
      <form onSubmit={handleSubmit}>
        <Switch
          size="md"
          color={theme.colorScheme === 'dark' ? 'gray' : 'pink'}
          styles={(theme) => ({
            root: {},
          })}
          onLabel={
            <IconLock
              size={16}
              stroke={2.5}
              color={theme.colors['custom-yellow'][0]}
            />
          }
          offLabel={
            <IconLockOpen
              size={16}
              stroke={2.5}
              color={theme.colors['custom-red'][1]}
            />
          }
          checked={creatingQuestion.isPrivate}
          onChange={(e) =>
            update({ ...creatingQuestion, isPrivate: e.currentTarget.checked })
          }
        />
        <TextInput
          className="h-20"
          size="lg"
          mt="md"
          placeholder="今、気になっていることは何ですか？"
          variant="unstyled"
          //inputは入力がnullになるとエラーになるため、creatingQuestion.titleがない場合の''を設定しておく
          value={creatingQuestion.title || ''}
          onChange={(e) =>
            update({ ...creatingQuestion, title: e.target.value })
          }
        />
        <hr />

        <Center mt="lg">
          <Button
            disabled={creatingQuestion.title === ''}
            color="gray"
            type="submit"
          >
            作成
          </Button>
        </Center>
      </form>
    </div>
  )
}

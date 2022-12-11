import { FormEvent } from 'react'
import {
  TextInput,
  Button,
  Center,
  Switch,
  useMantineTheme,
} from '@mantine/core'
import { IconDatabase, IconLock, IconLockOpen } from '@tabler/icons'
import useStore from '../store'
import { useMutateQuestion } from '../hooks/useMutateQuestion'

export const QuestionCreateForm = () => {
  //useStoreからcreatingQuestionを取り出す
  const { creatingQuestion } = useStore()
  //useStoreからupdateCreatingQuestionを取り出す
  const update = useStore((state) => state.updateCreatingQuestion)
  //useMutateQuestionから読み込む
  const { createQuestionMutation, updateQuestionMutation } = useMutateQuestion()

  const theme = useMantineTheme()
  //受け取るイベントに型を付ける。(FormEvent<HTMLFormElement>)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createQuestionMutation.mutate({
      title: creatingQuestion.title,
      isPrivate: creatingQuestion.isPrivate,
    })
  }
  return (
    <div className="m-4 flex h-56 w-192 flex-col bg-white p-4">
      <form onSubmit={handleSubmit}>
        <Switch
          size="md"
          color={theme.colorScheme === 'dark' ? 'gray' : 'pink'}
          styles={(theme) => ({
            root: {
              // backgroundColor:theme.colors['custom-blue'][3],
              // '&:hover': {
              //   backgroundColor: theme.fn.darken('#747578', 0.15),
              // },
            },
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
        {/* ボタンを中央寄せするためにCenterを使っている */}
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

// export const QuestionCreateForm = () => {
//   //useStoreからeditedQuestionを取り出す
//   const { editedQuestion } = useStore()
//   //useStoreからupdateEditedQuestionを取り出す
//   const update = useStore((state) => state.updateEditedQuestion)
//   //useMutateQuestionから読み込む
//   const { createQuestionMutation, updateQuestionMutation } = useMutateQuestion()

//   const theme = useMantineTheme()
//   //受け取るイベントに型を付ける。(FormEvent<HTMLFormElement>)
//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     //idの初期値は0なので、0の場合は新規作成、それ以外は更新と判断するように設定
//     if (editedQuestion.id === 0) {
//       createQuestionMutation.mutate({
//         title: editedQuestion.title,
//         description: editedQuestion.description,
//         isPrivate: editedQuestion.isPrivate,
//       })
//     } else {
//       updateQuestionMutation.mutate({
//         id: editedQuestion.id,
//         title: editedQuestion.title,
//         description: editedQuestion.description,
//         isPrivate: editedQuestion.isPrivate,
//       })
//     }
//   }
//   return (
//     <>
//       <form onSubmit={handleSubmit}>
//         <TextInput
//           mt="md"
//           placeholder="title"
//           //inputは入力がnullになるとエラーになるため、editedQuestion.titleがない場合の''を設定しておく
//           value={editedQuestion.title || ''}
//           onChange={(e) => update({ ...editedQuestion, title: e.target.value })}
//         />
//         <TextInput
//           mt="md"
//           placeholder="description"
//           value={editedQuestion.description || ''}
//           onChange={(e) =>
//             update({ ...editedQuestion, description: e.target.value })
//           }
//         />
//         <Switch
//           size="md"
//           color={theme.colorScheme === 'dark' ? 'gray' : 'indigo'}
//           onLabel={
//             <IconLock size={16} stroke={2.5} color={theme.colors.orange[4]} />
//           }
//           offLabel={
//             <IconLockOpen
//               size={16}
//               stroke={2.5}
//               color={theme.colors.indigo[6]}
//             />
//           }
//           checked={editedQuestion.isPrivate}
//           onChange={(e) =>
//             update({ ...editedQuestion, isPrivate: e.currentTarget.checked })
//           }
//         />
//         {/* ボタンを中央寄せするためにCenterを使っている */}
//         <Center mt="lg">
//           <Button
//             disabled={editedQuestion.title === ''}
//             leftIcon={<IconDatabase size={14} />}
//             color="cyan"
//             type="submit"
//           >
//             {editedQuestion.id === 0 ? 'Create' : 'Update'}
//           </Button>
//         </Center>
//       </form>
//     </>
//   )
// }

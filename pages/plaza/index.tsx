import { NextPage } from 'next'
import { Layout } from '../../components/Layout'
import { QuestionCreateForm } from '../../components/Question/QuestionCreateForm/QuestionCreateForm'
import { QuestionList } from '../../components/Question/QuestionList/QuestionList'
import { useQueryUser } from '../../hooks/user/useQueryUser'
import { Loader, Switch, useMantineTheme } from '@mantine/core'
import { QuestionAllList } from '../../components/Question/QuestionAllList/QuestionAllList'
import { IconUserPlus } from '@tabler/icons'
import { useToggle } from '../../hooks/useToggle'

const Plaza: NextPage = () => {
  const theme = useMantineTheme()

  //ログインしているユーザー
  const { data: user, status } = useQueryUser()

  //タイムラインの表示コンテンツを切り替えるための状態<boolean>(全員or友達のみ)
  const { state, toggle } = useToggle()

  if (status === 'loading') {
    return (
      <Layout title="Plaza">
        <Loader />
      </Layout>
    )
  } else
    return (
      <Layout title="Plaza">
        <QuestionCreateForm />
        <Switch
          size="md"
          label={state ? '全員' : '友達のみ'}
          color={theme.colorScheme === 'dark' ? 'gray' : 'indigo'}
          onLabel={
            <IconUserPlus
              size={16}
              stroke={2.5}
              color={theme.colors.orange[4]}
            />
          }
          offLabel={
            <IconUserPlus
              size={16}
              stroke={2.5}
              color={theme.colors.indigo[6]}
            />
          }
          checked={state}
          onChange={toggle}
        />
        {state ? (
          <QuestionAllList />
        ) : typeof user?.id !== 'undefined' ? (
          <QuestionList isTimeline={true} isMine={true} userId={user?.id} />
        ) : (
          <Loader />
        )}
      </Layout>
    )
}

export default Plaza

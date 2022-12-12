import { NextPage } from 'next'
import { Layout } from '../../components/Layout'
import { QuestionCreateForm } from '../../components/QuestionCreateForm'
import { QuestionList } from '../../components/QuestionList'
import { useQueryUser } from '../../hooks/useQueryUser'
import { Loader, Switch, useMantineTheme } from '@mantine/core'
import { QuestionAllList } from '../../components/QuestionAllList'
import { IconUserPlus } from '@tabler/icons'
import { useToggle } from '../../hooks/useToggle'

const Plaza: NextPage = () => {
  const theme = useMantineTheme()
  const { data: user, status } = useQueryUser()

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

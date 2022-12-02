import { Header, Image, Loader } from '@mantine/core'
import { IconClock, IconLogout, IconSettings } from '@tabler/icons'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useQueryUser } from '../hooks/useQueryUser'

type Props = {
  mode: string
}
const HeaderCustom: FC<Props> = ({ mode = 'Home' }) => {
  if (mode === 'Home')
    return (
      <Header
        height={60}
        p="xs"
        className="flex flex-row items-center bg-white"
      >
        <div className="basis-1/4">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="text-2xl font-semibold text-teal-500">
              Qu Back
            </span>
          </Link>
        </div>
        <div className="basis-1/2">center</div>
        <Link href="/auth">
          <div className="basis-1/4">ログイン/新規登録</div>
        </Link>
        {/* Header content */}
      </Header>
    )
  else {
    const PUBLIC_FOLDER = process.env.NEXT_PUBLIC_FOLDER
    //ログアウトのルーティングのためにuseRouterを実行
    const router = useRouter()
    const queryClient = useQueryClient()
    const logout = async () => {
      //カスタムhook(useQueryUser)でapiから取得したデータをブラウザにキャッシュしていたので、
      //ログアウト時にuseQueryClientのremoveQueriesを使って、キャッシュを削除する。
      queryClient.removeQueries(['user'])
      queryClient.removeQueries(['questions'])
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`)
      //index.tsxのログイン画面に遷移
      router.push('/')
    }
    const { data: user, status } = useQueryUser()
    //ステータスがloadingの時は、Loaderコンポーネントを表示させる
    if (status === 'loading') return <Loader />
    else
      return (
        <Header
          height={60}
          p="xs"
          className="flex flex-row items-center bg-white"
        >
          <div className="basis-1/4">
            <Link href="/plaza" style={{ textDecoration: 'none' }}>
              <span className="text-2xl font-semibold text-teal-500">
                Qu Back
              </span>
            </Link>
          </div>
          <div className="flex basis-1/2 flex-row items-center justify-center">
            <Link href="/plaza" className="flex items-center justify-center">
              <IconClock
                size={40}
                className="cursor-pointer text-gray-300 hover:text-indigo-500"
              />
            </Link>
            <Link
              href="/profile"
              className="mx-5 flex items-center justify-center"
            >
              <Image
                src={
                  user?.profilePicture
                    ? PUBLIC_FOLDER + user.profilePicture
                    : PUBLIC_FOLDER + '/person/noAvatar.png'
                }
                alt=""
                className="cursor-pointer rounded-full outline outline-2 outline-offset-2 outline-gray-300 hover:outline-indigo-500"
                radius="xl"
                width={30}
                height={30}
                fit="contain"
              />
            </Link>
            <Link href="/plaza" className="flex items-center justify-center">
              <IconSettings
                size={40}
                className="cursor-pointer text-gray-300 hover:text-indigo-500"
              />
            </Link>
          </div>
          <div className="flex basis-1/4 justify-end">
            <IconLogout
              size={40}
              className="cursor-pointer text-gray-300 hover:text-indigo-500"
              onClick={logout}
            />
          </div>
        </Header>
      )
  }
}

export default HeaderCustom

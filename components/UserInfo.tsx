import { Loader } from '@mantine/core'
import { useQueryUser } from '../hooks/useQueryUser'

export const UserInfo = () => {
  //data: fetchしたデータ(userという名前を付ける。)
  //status:通信のステータス。この中にloadingやerrorなども持っており、
  //余分なuseStateをコンポーネント側に持たせる必要がなくなるので再レンダリングの対策になる。
  const { data: user, status } = useQueryUser()
  //ステータスがloadingの時は、Loaderコンポーネントを表示させる
  if (status === 'loading') return <Loader />
  return <p>{user?.email}</p>
}
import {
  IconBook,
  IconBulb,
  IconCornerRightDown,
  IconQuestionMark,
  IconRotateClockwise,
  IconRotateClockwise2,
} from '@tabler/icons'
import { NextPage } from 'next'
import { Layout } from '../components/Layout'

const Home: NextPage = () => {
  return (
    <Layout title="Home">
      <div className="h-screen w-screen">
        <div className="flex h-1/2 w-full justify-center mb-10">
          <div className="w-192">
            <div className="flex justify-center">
              <IconQuestionMark size={150} />
            </div>
            <div className="flex justify-around mx-10 mt-0">
              <IconCornerRightDown size={90} className="rotate-270 " />
              <IconCornerRightDown size={90} className=""/>
            </div>
            
            <div className="flex justify-around mt-10">
              <IconBulb size={150} />
              <IconBook size={150} />
            </div>
            <div className="flex justify-center">
              <IconCornerRightDown size={90} className="rotate-135" />
            </div>
          </div>
        </div>
        <div className="flex h-1/3 w-full items-center justify-center bg-custom-blue-0">
          <p className="text-center text-2xl font-semibold">
            日々の疑問を簡単に管理
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default Home

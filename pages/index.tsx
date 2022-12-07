import { NextPage } from 'next'
import { Layout } from '../components/Layout'

const Home: NextPage = () => {
  return (
    <Layout title="Home">
      <div className='w-screen h-screen'>
        <div className='w-full h-1/2'></div>
        <div className='w-full h-1/2 bg-custom-blue-0 flex items-center justify-center'>
          <p className='text-2xl text-center font-semibold'>
            日々の疑問を簡単に管理
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default Home

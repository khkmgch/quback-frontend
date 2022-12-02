import { NextPage } from 'next'
import { Layout } from '../components/Layout'

const Home: NextPage = () => {
  return (
    <Layout title="Home">
      <div className="flex flex-col items-center justify-center rounded-md border-2 border-solid border-indigo-600 p-10">
        Welcome to Qu Back!
      </div>
    </Layout>
  )
}

export default Home

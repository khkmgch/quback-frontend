import { Loader } from '@mantine/core'
import { NextPage } from 'next'
import React from 'react'
import { Layout } from '../../components/Layout'
import { QuestionList } from '../../components/QuestionList'
import { useQueryUser } from '../../hooks/useQueryUser'
//SSGの場合
//外部から１回だけデータを持ってくる
//getStaticPropsという名前はnextjs側が用意した名前なので合わせる
// export async function getStaticProps() {
//     const allPostsData = getPostsData();

//     //getStaticProps特有の書き方
//     //return して、Homeコンポーネントに１度だけ渡す
//     return {
//       props: {
//         allPostsData,
//       },
//     };
//   }

//SSRの場合
//contextにはユーザーがリクエストした情報が入る
// export async function getServerSideProps(context) {
//   return {
//     props: {
//       //コンポーネントに渡すためのprops
//     },
//   };
// }

const Profile: NextPage = () => {
  //data: fetchしたデータ(userという名前を付ける。)
  //status:通信のステータス。この中にloadingやerrorなども持っており、
  //余分なuseStateをコンポーネント側に持たせる必要がなくなるので再レンダリングの対策になる。
  const { data: user, status } = useQueryUser()

  //ステータスがloadingの時は、Loaderコンポーネントを表示させる
  if (status === 'loading')
    return (
      <Layout title="Profile">
        <Loader />
      </Layout>
    )

  return (
    <Layout title="Profile">
      <div>Profile</div>
      <p>{user?.email}</p>
      <QuestionList mode='Profile'/>
    </Layout>

    /* <Layout>
<section>
  <p className={utilStyle.headingMd}>
    Koheiです。プログラミングの学習をしています。
  </p>
</section>

<section className={`${utilStyle.headingMd} ${utilStyle.padding1px}`}>
  <h2>📝エンジニアのブログ</h2>
  <div className={styles.grid}>
    {allPostsData.map(({ id, title, date, thumbnail }) => (
      <article key={id}>
        <Link href={`/posts/${id}`}>
          <img src={`${thumbnail}`} className={styles.thumbnailImage} />
        </Link>
        <Link href={`/posts/${id}`} className={utilStyle.boldText}>
          {title}
        </Link>
        <br />
        <small className={utilStyle.lightText}>{date}</small>
      </article>
    ))}
  </div>
</section>
</Layout> */
  )
}
export default Profile

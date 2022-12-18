export default function Home() {
  return <div>Index Page</div>
}

export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: '/game',
      permanent: false,
    },
  }
}

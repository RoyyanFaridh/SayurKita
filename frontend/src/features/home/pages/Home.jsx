import Hero from '../components/Hero'
import Navbar from '../../../components/layouts/Navbar'
import Stats from '../components/Stats'
import FiturUtama from '../components/FiturUtama'
import KondisiMakanan from '../components/KondisiMakanan'

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Stats />
      <FiturUtama />
      <KondisiMakanan />
    </div>
  )
}

export default Home
import Hero from '../components/sections/Hero'
import Navbar from '../components/layouts/Navbar'
import Stats from '../components/sections/Stats'

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Stats />
    </div>
  )
}

export default Home
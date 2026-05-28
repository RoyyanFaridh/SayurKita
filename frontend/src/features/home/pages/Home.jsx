import Hero from '../components/Hero';
import Navbar from '../../../components/layouts/Navbar';
import Stats from '../components/Stats';
import FiturUtama from '../components/FiturUtama';
import KondisiMakanan from '../components/KondisiMakanan';
import FeedSelamatkan from '../components/FeedSelamatkan';
import CaraKerja from '../components/CaraKerja';

function Home() {
  return (
    <>
      <style>{`
        html { scroll-behavior: smooth; }
        * { scrollbar-width: thin; scrollbar-color: #c8d9cd transparent; }
        *::-webkit-scrollbar { width: 5px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb { background: #c8d9cd; border-radius: 999px; }
        *::-webkit-scrollbar-thumb:hover { background: #2A5C40; }
      `}</style>
      <Navbar />
      <Hero />
      <Stats />
      <FiturUtama />
      <KondisiMakanan />
      <FeedSelamatkan />
      <CaraKerja />
    </>
  );
}

export default Home;
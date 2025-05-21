import Advertisement from "../components/Advertisement/Advertisement";
import Category from "../components/Category/Category";
import Event from "../components/Event/Event";

const Home = ({ categories }) => {
  return (
    <main>
      <Advertisement />
      <Category categories={categories} />
      <Event />
    </main>
  );
};

export default Home;

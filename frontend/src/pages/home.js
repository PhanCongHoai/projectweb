import Advertisement from "../components/Advertisement/Advertisement";
import Category from "../components/Category/Category";
import SuggestionSection from "../components/SuggestionSection/SuggestionSection";
import Event from "../components/Event/Event";

const Home = ({ categories }) => {
  return (
    <main>
      <Advertisement />
      <Event />
      <Category categories={categories} />
      <SuggestionSection />
    </main>
  );
};

export default Home;

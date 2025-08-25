import { useParams } from "react-router-dom";
import BusinessList from "./BusinessList";

const CategoryPage = () => {
  const { categoryName } = useParams();

  return (
    <div>
      <BusinessList category={categoryName} />
    </div>
  );
};

export default CategoryPage;

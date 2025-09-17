import { useNavigate } from "react-router-dom";
import CategoryPage from "./Category"

const CategoryPageUI = () => {
  const navigate = useNavigate();
  return (
    <CategoryPage onCategoryClick={(category) => navigate(`/category/${category.slug}`)} />
  )
}

export default CategoryPageUI
import { useNavigate } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";
import { categories } from "../../assets/assets";

const Category = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    const { data } = axiosClient.post("/user/history", { category });
    console.log(data);

    navigate(`/category/${category}`);
  };

  return (
    <div className="p-6 bg-[#FEF6EF]">
      <h2 className="text-2xl font-bold text-center mb-6">
        Business Categories
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => handleCategoryClick(category)}
            className="px-4 py-2 text-black font-semibold rounded-sm border cursor-pointer bg-white border-gray-300 hover:bg-[#FCE2CE] transition duration-300"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Category;

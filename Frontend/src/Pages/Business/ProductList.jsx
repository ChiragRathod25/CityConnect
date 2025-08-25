import { motion } from "framer-motion";
import { useState } from "react";
import { useEffect } from "react";
import { translateText } from "../../utils/translateService"; 
import { useSelector } from "react-redux";
const ProductCard = ({ product}) => {
    return (
        <motion.div
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300 w-full max-w-full sm:w-72"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
        >
            <div className="w-full  h-40 overflow-hidden rounded-lg">
                <img src="../../../assets/nearbygo_logo.webp" alt={product.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-bold mt-3">{product.name}</h3>
            <p className="text-gray-600 mt-1">${product.price}</p>
            <p className="text-gray-500 mt-2 text-sm">{product.description}</p>
        </motion.div>
    );
};

const ProductList = ({business}) => {
    console.log(business);
    const [products, setProducts] = useState(business.products);
    const { language } = useSelector((state) => state.user);
    useEffect(() => {
        const translateProductDetails = async () => {
          const translatedProducts = await Promise.all(
            products.map(async (product) => ({
              ...product,
              name: await translateText(product.name, language),
              description: await translateText(product.description, language),
            }))
          );
      
          setProducts(translatedProducts);
        };
      
        translateProductDetails();
     },[language]);
    const handleDelete = (id) => {
        setProducts(products.filter(product => product.id !== id));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto gap-10 p-4 ">
            {products.map(product => (
                <ProductCard key={product.id} product={product} onDelete={handleDelete} />
            ))}
        </div>
    );
};

export default ProductList;
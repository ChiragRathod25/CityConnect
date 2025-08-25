import React from "react";

const ProductList = ({ products, setEditingProduct, setSelectedSection, setProducts }) => {
  return (
    <div className="max-h-full px-5 overflow-y-auto">
      <h2 className="text-2xl text-center font-bold mb-4">📦 All Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="border rounded-2xl shadow-lg p-4 bg-white"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-36 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-lg font-bold text-green-600 mt-2">
                ${product.price}
              </p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setSelectedSection("addProduct");
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  onClick={() =>
                    setProducts(products.filter((p) => p.id !== product.id))
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No products available.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
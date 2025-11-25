import React, { useEffect, useState } from "react";
import { useCart } from "../../CartContext/CartContext";
import { FaMinus, FaPlus, FaHeart, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const categories = [
  "Breakfast",
  "Lunch",
  "Salad",
  "Snacks",
  "Soups",
  "Desserts",
  "Drinks",
];

const OurHomeMenu = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const { cartItems, addToCart, removeFromCart, updateQuantity, API_BASE } =
    useCart();
  const [menuData, setMenuData] = useState({});

  const buildImageUrl = (path) => {
    if (!path)
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI...";
    return path.startsWith("http")
      ? path
      : `${API_BASE}/uploads/${String(path).replace(/^\/?uploads\//, "")}`;
  };

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/items`, { withCredentials: true })
      .then((res) => {
        const items = Array.isArray(res.data)
          ? res.data
          : res.data?.items ?? [];

        const grouped = items.reduce((acc, item) => {
          const cat = item.category || "Uncategorized";
          (acc[cat] = acc[cat] || []).push(item);
          return acc;
        }, {});

        setMenuData(grouped);
      })
      .catch(console.error);
  }, [API_BASE]);

  const getCartEntry = (id) => cartItems.find((ci) => ci.item?._id === id);
  const getQuantity = (id) => getCartEntry(id)?.quantity || 0;

  const displayItems = (menuData[activeCategory] || []).slice(0, 4);

  return (
    <div className="relative bg-white text-gray-900 px-4 py-20 overflow-hidden">

      {/* Light Pastel Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFEDD5]/60 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FEF9C3]/60 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#FF6B35] to-[#FACC15] bg-clip-text text-transparent"
          >
            Our Exclusive Menu
          </h2>

          <p className="text-gray-600 text-lg sm:text-xl">
            A Symphony of Flavors Crafted Just for You
          </p>
        </motion.div>

        {/* Category Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat, index) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 
                ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-[#FF6B35] to-[#FACC15] text-white shadow-lg"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-[#FACC15]"
                }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayItems.map((item, index) => {
            const qty = getQuantity(item._id);
            const entry = getCartEntry(item._id);
            const discount = item.discount || 0;
            const originalPrice = item.originalPrice || item.price;

            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200"
              >
                {/* Image */}
                <div className="relative h-52 bg-[#FFF7ED] flex items-center justify-center overflow-hidden">
                  
                  {discount > 0 && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-[#FF6B35] to-[#FACC15] text-white px-3 py-1.5 rounded-full text-xs font-bold">
                      {discount}% OFF
                    </div>
                  )}

                  <div className="absolute top-3 right-3 bg-white/90 border px-2 py-1 rounded-lg text-xs flex items-center gap-1 shadow">
                    <FaStar className="text-yellow-400" />
                    <span>{item.rating || 4}</span>
                  </div>

                  <motion.img
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.3 }}
                    src={buildImageUrl(item.imageUrl || item.image)}
                    alt={item.name}
                    className="max-w-full max-h-full object-contain"
                  />

                  <div className="absolute bottom-3 right-3 bg-white/90 border px-2 py-1 rounded-lg text-xs flex items-center gap-1 shadow">
                    <FaHeart className="text-red-500" />
                    <span>{item.hearts || 123}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                    {item.description}
                  </p>

                  {/* Price + Add to Cart */}
                  <div className="flex items-center justify-between pt-2">
                    {/* Price */}
                    <div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FACC15] bg-clip-text text-transparent">
                        ₹{Number(item.price || 0).toFixed(2)}
                      </span>

                      {discount > 0 && (
                        <div className="text-xs text-gray-500 flex gap-2">
                          <span className="line-through">
                            ₹{Number(originalPrice).toFixed(2)}
                          </span>
                          <span className="text-green-500 font-semibold">
                            Save ₹{(originalPrice - item.price).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Cart Buttons */}
                    <div>
                      {qty > 0 ? (
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B35] to-[#FACC15] rounded-full px-3 py-1.5 shadow"
                        >
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-white w-6 h-6 flex items-center justify-center rounded-full"
                            onClick={() =>
                              qty > 1
                                ? updateQuantity(entry._id, qty - 1)
                                : removeFromCart(entry._id)
                            }
                          >
                            <FaMinus className="text-xs" />
                          </motion.button>

                          <span className="px-2 text-white font-bold">
                            {qty}
                          </span>

                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-white w-6 h-6 flex items-center justify-center rounded-full"
                            onClick={() =>
                              updateQuantity(entry._id, qty + 1)
                            }
                          >
                            <FaPlus className="text-xs" />
                          </motion.button>
                        </motion.div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToCart(item, 1)}
                          className="bg-gradient-to-r from-[#FF6B35] to-[#FACC15] text-white px-4 py-2 rounded-full font-semibold text-sm shadow"
                        >
                          Add To Cart
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Full Menu Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center mt-16"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/menu"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF6B35] to-[#FACC15] text-white font-semibold px-8 py-4 rounded-2xl shadow"
            >
              <span>Explore Full Menu</span>
              <span className="text-xl">→</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OurHomeMenu;

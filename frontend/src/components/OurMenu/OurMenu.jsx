import React, { useEffect, useState } from "react";
import { useCart } from "../../CartContext/CartContext";
import { FaMinus, FaPlus, FaHeart, FaStar } from "react-icons/fa";
import axios from "axios";
import { motion } from "framer-motion";

const categories = ["Breakfast", "Lunch", "Salad", "Snacks", "Soups", "Desserts", "Drinks"];

const OurMenu = ({ searchQuery = '' }) => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const { cartItems, addToCart, removeFromCart, updateQuantity, API_BASE } = useCart();
  const [menuData, setMenuData] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const buildImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/200x200?text=No+Image";
    return path.startsWith("http") ? path : `${API_BASE}/uploads/${String(path).replace(/^\/?uploads\//, "")}`;
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/items`, { withCredentials: true });
        const items = Array.isArray(res.data) ? res.data : res.data?.items ?? [];
        const byCategory = items.reduce((acc, item) => {
          const cat = item.category || "Uncategorized";
          (acc[cat] = acc[cat] || []).push(item);
          return acc;
        }, {});
        setMenuData(byCategory);
      } catch (err) {
        console.error("Failed to load menu items", err);
      }
    };
    fetchMenu();
  }, [API_BASE]);

  // Handle search functionality
  useEffect(() => {
    if (searchQuery && searchQuery.trim()) {
      setIsSearching(true);
      const allItems = Object.values(menuData).flat();
      const filtered = allItems.filter(item => 
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, [searchQuery, menuData]);

  const getCartEntry = (itemId) => cartItems.find((ci) => ci.item?._id === itemId);
  const displayItems = isSearching ? searchResults : (menuData[activeCategory] ?? []).slice(0, 12);

  return (
    <div className="relative bg-gradient-to-b from-white via-[#fefce8] to-white text-gray-900 px-4 py-20 overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-yellow-400 to-green-400 bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif" }}>
            {isSearching ? `Search Results for "${searchQuery}"` : "Our Complete Menu"}
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl" style={{ fontFamily: "'Lato', sans-serif" }}>
            {isSearching ? `Found ${searchResults.length} items matching your search` : "Discover All Our Delicious Offerings"}
          </p>
        </motion.div>

        {!isSearching && (
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
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat 
                    ? "bg-gradient-to-r from-pink-400 to-yellow-300 text-white shadow-lg" 
                    : "backdrop-blur-xl bg-white/50 border border-gray-200 text-gray-700 hover:text-gray-900 hover:border-pink-300"
                }`}
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayItems.map((item, index) => {
            const cartEntry = getCartEntry(item._id);
            const quantity = cartEntry?.quantity || 0;
            const cartId = cartEntry?._id;
            const discount = item.discount || 0;
            const originalPrice = item.originalPrice || item.price;

            return (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:border-pink-300 transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative h-56 flex items-center justify-center p-4 overflow-hidden group">
                  {/* Discount Badge */}
                  {discount > 0 && (
                    <div className="absolute top-3 left-3 bg-pink-400 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg z-10 flex items-center gap-1">
                      <span>{discount}% OFF</span>
                    </div>
                  )}
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-yellow-100 px-2 py-1 rounded-lg text-xs flex items-center gap-1 z-10">
                    <FaStar className="text-yellow-500" />
                    <span className="text-gray-800 font-semibold">{item.rating || 4}</span>
                  </div>

                  {/* Image */}
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    src={buildImageUrl(item.imageUrl || item.image)}
                    alt={item.name}
                    className="max-w-full max-h-full object-contain"
                  />

                  {/* Hearts Badge */}
                  <div className="absolute bottom-3 right-3 bg-pink-100 px-2 py-1 rounded-lg text-xs flex items-center gap-1 z-10">
                    <FaHeart className="text-red-500" />
                    <span className="text-gray-800 font-semibold">{item.hearts || 123}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1" style={{ fontFamily: "'Lato', sans-serif" }}>{item.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 min-h-[40px]" style={{ fontFamily: "'Lato', sans-serif" }}>{item.description}</p>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-pink-500">
                        ₹{Number(item.price || 0).toFixed(2)}
                      </span>
                      {discount > 0 && originalPrice && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 line-through text-sm">₹{Number(originalPrice).toFixed(2)}</span>
                          <span className="text-green-500 font-semibold text-xs">Save ₹{(originalPrice - item.price).toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {quantity > 0 ? (
                        <motion.div 
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-2 bg-gradient-to-r from-pink-400 to-yellow-300 rounded-full px-3 py-1.5 shadow-lg"
                        >
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-all"
                            onClick={() => (quantity > 1 ? updateQuantity(cartId, quantity - 1) : removeFromCart(cartId))}
                          >
                            <FaMinus className="text-xs" />
                          </motion.button>
                          <span className="px-2 text-white font-bold min-w-[20px] text-center">{quantity}</span>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-all"
                            onClick={() => updateQuantity(cartId, quantity + 1)}
                          >
                            <FaPlus className="text-xs" />
                          </motion.button>
                        </motion.div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToCart(item, 1)}
                          className="bg-gradient-to-r from-pink-400 to-yellow-300 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300"
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
      </div>
    </div>
  );
};

export default OurMenu;

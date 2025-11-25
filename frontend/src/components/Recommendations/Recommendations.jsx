import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaShoppingCart, FaLightbulb, FaTimes } from 'react-icons/fa';
import { useCart } from '../../CartContext/CartContext';
import axios from 'axios';

const Recommendations = ({ cartItems, onClose }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const { addToCart, cartItems: contextCartItems, API_BASE } = useCart();

  const hasFetchedRef = useRef(false);
  const currentCartLengthRef = useRef(0);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const cartLength = cartItems?.length || 0;
      if (cartLength === 0) {
        setLoading(false);
        setRecommendations([]);
        hasFetchedRef.current = false;
        currentCartLengthRef.current = 0;
        return;
      }
      if (hasFetchedRef.current && currentCartLengthRef.current === cartLength) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        hasFetchedRef.current = false;

        const itemIds = cartItems.map(item => item.item?._id || item.item).filter(Boolean);

        const response = await axios.post('http://localhost:4000/api/recommendations/get', {
          cartItems: itemIds
        });

        if (response.data.success) {
          const recs = response.data.recommendations || [];
          setRecommendations(recs);
          setIsFallback(response.data.fallback || false);
          hasFetchedRef.current = true;
          currentCartLengthRef.current = cartLength;
        } else {
          setRecommendations([]);
        }
      } catch (error) {
        console.error(error);
        setRecommendations([]);
        hasFetchedRef.current = false;
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [cartItems?.length]);

  const buildImageUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${API_BASE}/uploads/${String(path).replace(/^\/?uploads\//, '')}`;
  };

  const getItemQuantityInCart = (itemId) => {
    const cartItem = contextCartItems.find(ci => (ci.item._id || ci.item) === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = async (item) => {
    await addToCart(item._id);
  };

  if (!cartItems || cartItems.length === 0) return null;
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/40 border border-gray-200 rounded-3xl p-6 my-6"
      >
        <div className="flex items-center justify-center gap-3 text-[#FF4C29]">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#FF4C29] border-t-transparent"></div>
          <p style={{ fontFamily: "'Lato', sans-serif" }}>Finding perfect recommendations for you...</p>
        </div>
      </motion.div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="backdrop-blur-xl bg-gradient-to-br from-[#FFF8E1]/50 to-[#FFFAF0]/50 border border-gray-200 rounded-3xl p-6 my-6 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD369]/30 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF4C29] to-[#FFD369] rounded-2xl flex items-center justify-center shadow-lg">
            <FaLightbulb className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FF4C29] to-[#FFD369] bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif" }}>
              {isFallback ? 'Popular Choices' : 'You Might Also Like'}
            </h3>
            <p className="text-gray-600 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
              {isFallback ? 'Customer favorites' : 'Based on your cart items'}
            </p>
          </div>
        </div>
        {onClose && (
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-gray-400 hover:text-[#FF4C29] transition-colors"
          >
            <FaTimes size={20} />
          </motion.button>
        )}
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 relative z-10">
        <AnimatePresence>
          {recommendations.map((item, index) => {
            const quantityInCart = getItemQuantityInCart(item._id);
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="backdrop-blur-xl bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#FFD369]/50 transition-all duration-300 shadow-lg hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative h-32 bg-white/20 flex items-center justify-center p-3 rounded-t-2xl">
                  <img src={buildImageUrl(item.imageUrl || item.image)} alt={item.name} className="w-full h-full object-contain" />
                  <div className="absolute top-2 left-2 flex gap-1">
                    {item.discount > 0 && (
                      <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        -{item.discount}%
                      </span>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {item.rating && (
                      <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                        <FaStar className="text-[10px]" /> {item.rating}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 space-y-2">
                  <h4 className="text-gray-800 font-semibold text-sm truncate" style={{ fontFamily: "'Lato', sans-serif" }}>
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[#FF4C29] font-bold text-lg" style={{ fontFamily: "'Lato', sans-serif" }}>
                        ₹{item.price}
                      </span>
                      {item.discount > 0 && (
                        <span className="text-gray-400 text-xs line-through">
                          ₹{Math.round(item.price / (1 - item.discount / 100))}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  {quantityInCart === 0 ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-gradient-to-r from-[#FF4C29] to-[#FFD369] hover:from-[#FF6B35] hover:to-[#FFD369] text-white font-semibold py-2 rounded-xl flex items-center justify-center gap-2 text-sm transition-all duration-300 shadow-md"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      <FaShoppingCart className="text-xs" /> Add
                    </motion.button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold py-2 rounded-xl text-sm">
                      <FaShoppingCart className="text-xs" /> In Cart ({quantityInCart})
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Info badge */}
      {!isFallback && recommendations.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-4 text-center">
          <p className="text-gray-500 text-xs" style={{ fontFamily: "'Lato', sans-serif" }}>
            💡 These items are frequently ordered together by our customers
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Recommendations;

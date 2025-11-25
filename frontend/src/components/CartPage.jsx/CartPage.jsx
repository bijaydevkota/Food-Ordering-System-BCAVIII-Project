import React, { useState } from "react";
import { useCart } from "../../CartContext/CartContext";
import { Link } from "react-router-dom";
import { FaMinus, FaPlus, FaTimes, FaTrash, FaShoppingBag, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Recommendations from "../Recommendations/Recommendations";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalAmount, API_BASE } = useCart();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());

  const buildImageUrl = (path) => {
    if (!path) return "/fallback-image.svg";
    return path.startsWith("http")
      ? path
      : `${API_BASE}/uploads/${String(path).replace(/^\/?uploads\//, "")}`;
  };

  const handleImageError = (itemId) => setImageErrors(prev => new Set(prev).add(itemId));

  const getImageSrc = (item) => {
    const itemId = item._id;
    if (imageErrors.has(itemId)) return "/fallback-image.svg";
    return buildImageUrl(item.imageUrl || item.image);
  };

  return (
    <div className="relative min-h-screen bg-gray-50 py-20 px-5 md:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 mb-3">
            Your Shopping Cart
          </h1>
          <p className="text-gray-600 text-lg">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center bg-white rounded-3xl p-12 shadow-lg border border-gray-200"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="text-4xl text-white" />
            </div>
            <p className="text-xl text-gray-700 mb-6">Your cart is empty</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/menu"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:from-pink-600 hover:to-yellow-500 transition-all duration-300"
              >
                <FaShoppingBag /> Start Shopping
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-5">
              <AnimatePresence>
                {cartItems.map(({ _id, item, quantity }, index) => (
                  <motion.div
                    key={_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.01 }}
                    className="flex flex-col md:flex-row items-center justify-between bg-white rounded-3xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
                  >
                    {/* Item Image */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="cursor-pointer w-24 h-24 flex-shrink-0 mb-4 md:mb-0 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center p-2"
                      onClick={() => setSelectedImage(getImageSrc(item))}
                    >
                      <img
                        src={getImageSrc(item)}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        onError={() => handleImageError(item._id)}
                      />
                    </motion.div>

                    {/* Item Info */}
                    <div className="flex-1 text-center md:text-left md:ml-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                      <p className="text-pink-500 font-semibold text-lg">
                        ₹ {Number(item.price || 0).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity + Total + Remove */}
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mt-4 md:mt-0">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-gradient-to-r from-pink-500 to-yellow-400 rounded-full px-4 py-2 shadow-lg">
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            quantity > 1 ? updateQuantity(_id, quantity - 1) : removeFromCart(_id)
                          }
                          className="text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-all"
                        >
                          <FaMinus className="text-sm" />
                        </motion.button>
                        <span className="text-lg font-bold text-white min-w-[30px] text-center">
                          {quantity}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(_id, quantity + 1)}
                          className="text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-all"
                        >
                          <FaPlus className="text-sm" />
                        </motion.button>
                      </div>

                      {/* Total Price */}
                      <p className="text-lg font-bold text-yellow-400 min-w-[100px] text-center">
                        ₹{Number((item.price || 0) * quantity).toFixed(2)}
                      </p>

                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(_id)}
                        className="flex items-center gap-2 text-red-500 hover:text-red-400 px-4 py-2 rounded-2xl bg-red-50 hover:bg-red-100 transition-all"
                      >
                        <FaTrash /> <span className="hidden md:inline">Remove</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Recommendations */}
            <Recommendations cartItems={cartItems} />

            {/* Cart Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-12 flex flex-col md:flex-row justify-between text-gray-800 items-center bg-white rounded-3xl p-8 shadow-lg border border-gray-200"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-3 text-red-500 font-semibold px-6 py-3 rounded-2xl border border-gray-300 hover:border-yellow-400 transition-all"
                >
                  <FaShoppingBag /> Continue Shopping
                </Link>
              </motion.div>

              <div className="text-center md:text-right mt-6 md:mt-0 space-y-4">
                <div className="space-y-2">
                  <p className="text-gray-500 text-sm">Total Amount</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-yellow-400">
                    ₹{Number(totalAmount).toFixed(2)}
                  </h2>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/checkout"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition-all"
                  >
                    <span>Proceed to Checkout</span>
                    <FaArrowRight />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative"
            >
              <img
                src={selectedImage}
                alt="Full View"
                className="max-w-[90vw] max-h-[85vh] rounded-3xl shadow-2xl border-2 border-yellow-400"
                onError={(e) => { e.target.src = "/fallback-image.svg"; }}
              />
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedImage(null)}
                className="absolute -top-4 -right-4 bg-gradient-to-br from-pink-500 to-yellow-400 text-white rounded-full p-3 shadow-lg hover:shadow-xl"
              >
                <FaTimes className="text-xl" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartPage;

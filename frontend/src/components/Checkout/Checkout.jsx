import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { useCart } from "../../CartContext/CartContext";
import axios from "axios";

const API_BASE = "http://localhost:4000";

const Checkout = () => {
  const { totalAmount, cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authToken");
  const user = JSON.parse(localStorage.getItem("user"));
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user?.email]);

  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
    }
  }, [token, user, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get("success");
    const session_id = params.get("session_id");
    const payment_status = params.get("payment_status");

    if (success === "true" && session_id) {
      (async () => {
        try {
          setLoading(true);
          setError(null);
          const { data } = await axios.get(
            `${API_BASE}/api/orders/confirm`,
            { params: { session_id }, headers: authHeaders }
          );
          clearCart();
          navigate("/myorder", { state: { order: data } });
        } catch (err) {
          setError(err.response?.data?.message || "Payment confirmation failed. Please contact support");
        } finally {
          setLoading(false);
        }
      })();
    }

    if (payment_status === "cancel") {
      setError("Payment was cancelled or failed. Please contact support");
    }
  }, [location.search, clearCart, navigate, authHeaders]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const subtotal = Number(totalAmount.toFixed(2));
    const tax = Number((subtotal * 0.05).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    const payload = {
      ...formData,
      subtotal,
      tax,
      total,
      items: cartItems.map(({ item, quantity }) => ({
        name: item.name,
        price: item.price,
        quantity,
        imageUrl: item.imageUrl || "",
      })),
    };

    try {
      const { data } = await axios.post(`${API_BASE}/api/orders`, payload, { headers: authHeaders });

      if (formData.paymentMethod === "online") {
        if (!data.checkouturl) throw new Error("Checkout URL missing from server response");
        window.location.href = data.checkouturl;
      } else {
        clearCart();
        navigate("/myorder", { state: { order: data.order } });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/cart"
          className="flex items-center text-orange-500 hover:text-orange-600 transition mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back to Cart
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-gray-900">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-orange-500">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
              <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
            </div>
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} />
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            <Input label="Address" name="address" value={formData.address} onChange={handleInputChange} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="City" name="city" value={formData.city} onChange={handleInputChange} />
              <Input label="Zip Code" name="zipCode" value={formData.zipCode} onChange={handleInputChange} />
            </div>
          </div>

          {/* Payment Detail */}
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-orange-500">Payment Details</h2>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="divide-y divide-gray-200">
                {cartItems.map(({ _id, item, quantity }) => (
                  <div key={_id} className="flex justify-between items-center py-2">
                    <div className="flex gap-2">
                      <span>{item.name}</span>
                      <span className="text-gray-500">x{quantity}</span>
                    </div>
                    <span className="font-medium">₹{(item.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <PaymentSummary totalAmount={totalAmount} />

            {/* Payment Method */}
            <div>
              <label className="block mb-2 font-semibold">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
                className="w-full p-3 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="" className="text-gray-900">Select Method</option>
                <option value="cod" className="text-gray-900">Cash On Delivery</option>
                <option value="online" className="text-gray-900">Online Payment</option>
              </select>
            </div>

            {error && <p className="text-red-500 font-medium text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-600 hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              <FaLock /> {loading ? "Processing..." : "Complete Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label className="block mb-1 font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full p-3 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
    />
  </div>
);

const PaymentSummary = ({ totalAmount }) => {
  const subtotal = Number(totalAmount.toFixed(2));
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  return (
    <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between">
        <span>Subtotal:</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Tax (5%):</span>
        <span>₹{tax.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-bold text-lg text-orange-500">
        <span>Total:</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Checkout;

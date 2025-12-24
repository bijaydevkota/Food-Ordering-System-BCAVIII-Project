import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import {
  FiArrowLeft,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiTruck,
  FiUser,
  FiX,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useNotifications } from "../../NotificationContext/NotificationContext";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());
  const { notifications, fetchNotifications } = useNotifications();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmOrderId, setConfirmOrderId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const API_BASE = "http://localhost:4000";

  const buildImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/100?text=No+Image";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/uploads/")) return `${API_BASE}${path}`;
    if (path.startsWith("uploads/")) return `${API_BASE}/${path}`;
    return `${API_BASE}/uploads/${path}`;
  };

  const handleImageError = (itemId) => {
    setImageErrors(prev => new Set(prev).add(itemId));
  };

  const getImageSrc = (item, orderId) => {
    const itemId = `${orderId}-${item.name}`;
    if (imageErrors.has(itemId)) return "https://via.placeholder.com/100?text=No+Image";
    return buildImageUrl(item.imageUrl);
  };

  const handleMarkAsDelivered = (orderId) => {
    setConfirmOrderId(orderId);
    setConfirmAction('delivered');
    setShowConfirmDialog(true);
  };

  const handleDeleteOrder = (orderId) => {
    setConfirmOrderId(orderId);
    setConfirmAction('delete');
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmOrderId) return;
    setIsProcessing(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error('No authentication token');

      if (confirmAction === 'delivered') {
        const response = await axios.put(
          `${API_BASE}/api/orders/${confirmOrderId}/delivered`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setOrders(prev =>
            prev.map(order =>
              order._id === confirmOrderId
                ? { ...order, status: 'delivered', deliveredAt: new Date().toLocaleString() }
                : order
            )
          );
          fetchOrders();
          setShowConfirmDialog(false);
        } else throw new Error(response.data.message || 'Failed to mark delivered');
      } else if (confirmAction === 'delete') {
        const response = await axios.delete(
          `${API_BASE}/api/orders/${confirmOrderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setOrders(prev => prev.filter(order => order._id !== confirmOrderId));
          setShowConfirmDialog(false);
        } else throw new Error(response.data.message || 'Failed to delete order');
      }
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setIsProcessing(false);
      setConfirmOrderId(null);
      setConfirmAction(null);
    }
  };

  const handleCloseDialog = () => {
    if (!isProcessing) {
      setShowConfirmDialog(false);
      setConfirmOrderId(null);
      setConfirmAction(null);
    }
  };

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Please login to view your orders");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ordersData = response.data.success ? response.data.orders : response.data;

      const formattedOrders = ordersData.map((order) => ({
        ...order,
        items: order.items?.map((entry) => ({
          ...entry,
          item: { ...entry.item },
        })) || [],
        createdAt: new Date(order.createdAt).toLocaleString(),
        paymentStatus: order.paymentStatus?.toLowerCase() || "pending",
        status: order.status || "pending",
        expectedDelivery: order.expectedDelivery
          ? new Date(order.expectedDelivery).toLocaleString()
          : null,
        deliveredAt: order.deliveredAt
          ? new Date(order.deliveredAt).toLocaleString()
          : null,
      }));

      setOrders(formattedOrders);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const hasOrderUpdate = notifications?.some(n => (n.type === 'status_update' || n.type === 'order_status') && n.orderId);
    if (hasOrderUpdate) fetchOrders();
  }, [notifications, fetchOrders]);

  useEffect(() => {
    const id = setInterval(() => fetchNotifications?.(), 2000);
    return () => clearInterval(id);
  }, [fetchNotifications]);

  const statusStyles = {
    pending: { color: "text-yellow-700", bg: "bg-yellow-100", icon: <FiClock />, label: "Pending" },
    processing: { color: "text-blue-700", bg: "bg-blue-100", icon: <FiClock />, label: "Processing" },
    preparing: { color: "text-orange-700", bg: "bg-orange-100", icon: <FiClock />, label: "Preparing" },
    outForDelivery: { color: "text-purple-700", bg: "bg-purple-100", icon: <FiTruck />, label: "On the Way" },
    delivered: { color: "text-green-700", bg: "bg-green-100", icon: <FiCheckCircle />, label: "Delivered" },
    cancelled: { color: "text-red-700", bg: "bg-red-100", icon: <FiX />, label: "Cancelled" },
    succeeded: { color: "text-green-700", bg: "bg-green-100", icon: <FiCheckCircle />, label: "Completed" },
  };

  const getPaymentMethodDetails = (method) => {
    switch (method?.toLowerCase()) {
      case "cod":
        return { label: "Cash on Delivery", class: "bg-yellow-100 text-yellow-800 border border-yellow-300 px-2 py-1 rounded-lg text-sm" };
      default:
        return { label: "Online Payment", class: "bg-green-100 text-green-800 border border-green-300 px-2 py-1 rounded-lg text-sm" };
    }
  };

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-red-600 font-medium">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 flex items-center gap-2 bg-red-200 hover:bg-red-300 text-red-800 px-4 py-2 rounded-lg"
      >
        <FiArrowLeft /> <span>Try again</span>
      </button>
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-700">
      <p>Loading your orders...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center gap-2 text-purple-600 hover:text-purple-500 transition">
            <FiArrowLeft /> <span className="font-bold">Back to Home</span>
          </Link>
          <div className="text-sm text-gray-600">
            Logged in as: <span className="font-medium">{user?.email || "Unknown User"}</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-purple-600">Order History</h2>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <Link
              to="/menu"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
              <thead className="bg-purple-50">
                <tr>
                  <th className="p-4 text-left text-purple-700">Order ID</th>
                  <th className="p-4 text-left text-purple-700">Customer</th>
                  <th className="p-4 text-left text-purple-700">Address</th>
                  <th className="p-4 text-left text-purple-700">Items</th>
                  <th className="p-4 text-left text-purple-700">Total Items</th>
                  <th className="p-4 text-left text-purple-700">Price</th>
                  <th className="p-4 text-left text-purple-700">Payment</th>
                  <th className="p-4 text-left text-purple-700">Status</th>
                  <th className="p-4 text-left text-purple-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);
                  const totalPrice = order.total ?? order.items.reduce((sum, i) => sum + i.item.price * i.quantity, 0);
                  const paymentMethod = getPaymentMethodDetails(order.paymentMethod);
                  const status = statusStyles[order.status] || statusStyles.pending;
                  const paymentStatus = statusStyles[order.paymentStatus] || statusStyles.pending;

                  return (
                    <tr key={order._id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                      <td className="p-4">#{order._id?.slice(-8)}</td>
                      <td className="p-4 flex items-center gap-2">
                        <FiUser />
                        <div>
                          <p className="font-medium">{order.firstName} {order.lastName}</p>
                          <p className="text-xs text-gray-500">{order.phone}</p>
                        </div>
                      </td>
                      <td className="p-4 flex items-start gap-2">
                        <FiMapPin />
                        <div className="text-sm">{order.address}, {order.city} - {order.zipCode}</div>
                      </td>
                      <td className="p-4 space-y-2">
                        {order.items.map((entry, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <img
                              src={getImageSrc(entry.item, order._id)}
                              alt={entry.item.name}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                              onError={() => handleImageError(`${order._id}-${entry.item.name}`)}
                            />
                            <div>
                              <span className="block font-medium">{entry.item.name}</span>
                              <div className="text-sm text-gray-500 flex gap-2">
                                <span>₹{entry.item.price}</span>
                                <span>×{entry.quantity}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </td>
                      <td className="p-4 flex items-center gap-2"><FiBox /> <span>{totalItems}</span></td>
                      <td className="p-4 font-semibold">₹{totalPrice.toFixed(2)}</td>
                      <td className="p-4 flex flex-col gap-2">
                        <span className={paymentMethod.class}>{paymentMethod.label}</span>
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${paymentStatus.bg} ${paymentStatus.color}`}>
                          {paymentStatus.icon} {paymentStatus.label}
                        </span>
                      </td>
                      <td className="p-4 flex flex-col gap-1">
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${status.bg} ${status.color}`}>
                          {status.icon} {status.label}
                        </span>
                        {order.expectedDelivery && order.status === 'outForDelivery' && (
                          <div className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded">Expected: {order.expectedDelivery}</div>
                        )}
                        {order.deliveredAt && (
                          <div className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">Delivered: {order.deliveredAt}</div>
                        )}
                      </td>
                      <td className="p-4 flex flex-col gap-2">
                        {order.status === 'outForDelivery' && (
                          <button
                            onClick={() => handleMarkAsDelivered(order._id)}
                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 border border-green-200 rounded-lg text-sm font-medium transition-all"
                          >
                            <FiCheckCircle /> Confirm Delivery
                          </button>
                        )}
                        {(order.status === 'delivered' || order.status === 'cancelled') && (
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="p-2 text-red-700 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <FiX />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <ConfirmationDialog
          isOpen={showConfirmDialog}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmAction}
          title={confirmAction === 'delivered' ? 'Confirm Delivery' : 'Delete Order'}
          message={confirmAction === 'delivered'
            ? 'Have you received your order? Please confirm delivery.'
            : 'Are you sure you want to delete this order from your history?'}
          confirmText={confirmAction === 'delivered' ? 'Confirm Delivery' : 'Delete Order'}
          cancelText="Cancel"
          type={confirmAction === 'delivered' ? 'success' : 'danger'}
          isLoading={isProcessing}
        />
      </div>
    </div>
  );
};

export default MyOrder;

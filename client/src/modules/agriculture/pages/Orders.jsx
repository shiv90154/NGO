import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Package, Truck, CheckCircle, XCircle, Clock, Eye, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';

const api = import.meta.env.VITE_API_URL;

const Orders = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${api}/agriculture/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
            if (error.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            setUpdatingStatus(true);
            const response = await axios.put(
                `${api}/agriculture/orders/${orderId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );

            if (response.data.success) {
                toast.success(`Order ${newStatus} successfully!`);
                fetchOrders();
            }
        } catch (error) {
            console.error('Error updating order:', error);
            toast.error('Failed to update order status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const cancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        try {
            const response = await axios.put(
                `${api}/agriculture/orders/${orderId}/cancel`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success('Order cancelled successfully!');
                fetchOrders();
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            toast.error(error.response?.data?.message || 'Failed to cancel order');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
            'confirmed': { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, text: 'Confirmed' },
            'processing': { color: 'bg-purple-100 text-purple-800', icon: Package, text: 'Processing' },
            'shipped': { color: 'bg-indigo-100 text-indigo-800', icon: Truck, text: 'Shipped' },
            'delivered': { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Delivered' },
            'cancelled': { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Cancelled' }
        };
        const badge = badges[status] || badges['pending'];
        const Icon = badge.icon;
        return (
            <span className={`${badge.color} text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit`}>
                <Icon size={12} /> {badge.text}
            </span>
        );
    };

    const getPaymentStatusBadge = (status) => {
        const badges = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'partial': 'bg-blue-100 text-blue-800',
            'completed': 'bg-green-100 text-green-800',
            'refunded': 'bg-red-100 text-red-800'
        };
        return <span className={`${badges[status] || 'bg-gray-100 text-gray-800'} text-xs px-2 py-1 rounded-full`}>{status || 'pending'}</span>;
    };

    const toggleExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    if (loading) {
        return (
            <div className="p-4 md:p-8 bg-gray-100 min-h-screen flex items-center justify-center">
                <div className="text-[#1e3a5f] text-xl">Loading orders...</div>
            </div>
        );
    }

    return (
        <>
            <ToastContainer />
            <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center flex-wrap gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] flex items-center gap-2">
                                    <Package size={28} /> My Orders
                                </h1>
                                <p className="text-gray-500 mt-1">Track and manage your orders</p>
                            </div>
                            <button
                                onClick={() => navigate('/agriculture/')}
                                className="bg-[#ff8c42] hover:bg-[#e67e22] px-4 py-2 rounded-lg text-white transition"
                            >
                                ← Dashboard
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <div className="text-2xl mb-2">📦</div>
                            <div className="text-2xl font-bold text-[#1e3a5f]">{orders.length}</div>
                            <div className="text-sm text-gray-500">Total Orders</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <div className="text-2xl mb-2">⏳</div>
                            <div className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.orderStatus === 'pending').length}</div>
                            <div className="text-sm text-gray-500">Pending</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <div className="text-2xl mb-2">🚚</div>
                            <div className="text-2xl font-bold text-blue-600">{orders.filter(o => o.orderStatus === 'shipped' || o.orderStatus === 'processing').length}</div>
                            <div className="text-sm text-gray-500">In Transit</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <div className="text-2xl mb-2">✅</div>
                            <div className="text-2xl font-bold text-green-600">{orders.filter(o => o.orderStatus === 'delivered').length}</div>
                            <div className="text-sm text-gray-500">Delivered</div>
                        </div>
                    </div>

                    {/* Orders List */}
                    {orders.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="text-6xl mb-4">🛒</div>
                            <h3 className="text-xl font-semibold text-[#1e3a5f] mb-2">No Orders Yet</h3>
                            <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
                            <button
                                onClick={() => navigate('/agriculture/products')}
                                className="bg-[#ff8c42] hover:bg-[#e67e22] px-4 py-2 rounded-lg text-white transition"
                            >
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    {/* Order Header */}
                                    <div className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition" onClick={() => toggleExpand(order._id)}>
                                        <div className="flex flex-wrap justify-between items-center gap-4">
                                            <div className="flex items-center gap-4">
                                                <ShoppingBag size={20} className="text-[#ff8c42]" />
                                                <div>
                                                    <p className="font-semibold text-[#1e3a5f]">Order #{order.orderId?.slice(-8) || order._id?.slice(-8)}</p>
                                                    <p className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {getStatusBadge(order.orderStatus)}
                                                <div className="text-right">
                                                    <p className="font-bold text-[#1e3a5f]">₹{order.totalAmount}</p>
                                                    <p className="text-xs text-gray-500">Qty: {order.quantity}</p>
                                                </div>
                                                {expandedOrder === order._id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedOrder === order._id && (
                                        <div className="p-4 bg-gray-50">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {/* Product Details */}
                                                <div>
                                                    <h4 className="font-semibold text-[#1e3a5f] mb-2">Product Details</h4>
                                                    <div className="space-y-1 text-sm">
                                                        <p><span className="text-gray-500">Product ID:</span> {order.productId}</p>
                                                        <p><span className="text-gray-500">Quantity:</span> {order.quantity} units</p>
                                                        <p><span className="text-gray-500">Unit Price:</span> ₹{order.unitPrice}</p>
                                                        <p><span className="text-gray-500">Total Amount:</span> <span className="font-semibold">₹{order.totalAmount}</span></p>
                                                    </div>
                                                </div>

                                                {/* Delivery Address */}
                                                <div>
                                                    <h4 className="font-semibold text-[#1e3a5f] mb-2">Delivery Address</h4>
                                                    <div className="space-y-1 text-sm">
                                                        <p>{order.deliveryAddress?.address}</p>
                                                        <p>Contact: {order.deliveryAddress?.contactPerson} ({order.deliveryAddress?.contactNumber})</p>
                                                    </div>
                                                </div>

                                                {/* Payment Details */}
                                                <div>
                                                    <h4 className="font-semibold text-[#1e3a5f] mb-2">Payment Details</h4>
                                                    <div className="space-y-1 text-sm">
                                                        <p>Status: {getPaymentStatusBadge(order.paymentStatus)}</p>
                                                        <p>Method: {order.paymentMethod || 'Not specified'}</p>
                                                    </div>
                                                </div>

                                                {/* Order Timeline */}
                                                <div>
                                                    <h4 className="font-semibold text-[#1e3a5f] mb-2">Order Timeline</h4>
                                                    <div className="space-y-1 text-sm">
                                                        {order.orderDate && <p>📅 Ordered: {new Date(order.orderDate).toLocaleString()}</p>}
                                                        {order.confirmedAt && <p>✅ Confirmed: {new Date(order.confirmedAt).toLocaleString()}</p>}
                                                        {order.shippedAt && <p>🚚 Shipped: {new Date(order.shippedAt).toLocaleString()}</p>}
                                                        {order.deliveredAt && <p>📦 Delivered: {new Date(order.deliveredAt).toLocaleString()}</p>}
                                                        {order.cancelledAt && <p>❌ Cancelled: {new Date(order.cancelledAt).toLocaleString()}</p>}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                                                {order.orderStatus === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateOrderStatus(order._id, 'confirmed')}
                                                            disabled={updatingStatus}
                                                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white text-sm transition disabled:opacity-50"
                                                        >
                                                            Confirm Order
                                                        </button>
                                                        <button
                                                            onClick={() => cancelOrder(order._id)}
                                                            disabled={updatingStatus}
                                                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white text-sm transition disabled:opacity-50"
                                                        >
                                                            Cancel Order
                                                        </button>
                                                    </>
                                                )}
                                                {order.orderStatus === 'confirmed' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order._id, 'processing')}
                                                        disabled={updatingStatus}
                                                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm transition disabled:opacity-50"
                                                    >
                                                        Start Processing
                                                    </button>
                                                )}
                                                {order.orderStatus === 'processing' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order._id, 'shipped')}
                                                        disabled={updatingStatus}
                                                        className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white text-sm transition disabled:opacity-50"
                                                    >
                                                        Mark as Shipped
                                                    </button>
                                                )}
                                                {order.orderStatus === 'shipped' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order._id, 'delivered')}
                                                        disabled={updatingStatus}
                                                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white text-sm transition disabled:opacity-50"
                                                    >
                                                        Mark as Delivered
                                                    </button>
                                                )}
                                                {order.orderStatus === 'delivered' && (
                                                    <button
                                                        onClick={() => toast.info('Order completed! Thank you for shopping.')}
                                                        className="bg-gray-600 px-4 py-2 rounded-lg text-white text-sm"
                                                    >
                                                        Order Completed
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Orders;
import React, { useEffect, useState } from "react";
import api from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.map((order) => (
        <div key={order._id} className="bg-white shadow p-4 rounded mb-4">
          <p className="font-semibold">Order ID: {order._id}</p>
          <p>Status: {order.status}</p>
          <p>Total: ₹{order.totalAmount}</p>

          <div className="mt-2">
            <p className="font-medium">Courses:</p>
            <ul className="list-disc ml-5">
              {order.courses.map((c) => (
                <li key={c._id}>{c.title} - ₹{c.price}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
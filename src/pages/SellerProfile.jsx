import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const SellerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/seller/${id}`
        );

        setUser(res.data.user);
        setItems(res.data.items || []);
      } catch (error) {
        console.error("Error fetching seller:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-20">
        <p className="text-gray-500 animate-pulse text-lg">
          Loading seller...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-20">
        <p className="text-gray-500 text-lg">Seller not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-gray-100">

      {/* HEADER */}
      <div className="bg-[linear-gradient(to_right,#f97316,#fb923c)] text-white py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h2 className="text-3xl font-bold">{user.name}</h2>
            <p className="opacity-90">{user.email}</p>

            <div className="mt-3 inline-block bg-white text-orange-500 px-4 py-1 rounded-full text-sm font-semibold">
              Verified Seller
            </div>
          </div>

          {/* CHAT BUTTON */}
          <button
            onClick={() => navigate(`/chat/${id}`)}
            className="bg-white text-orange-500 font-semibold px-5 py-2 rounded-lg shadow hover:bg-gray-100 transition"
          >
             Chat with Seller
          </button>

        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Seller Products
        </h3>

        {items.length === 0 ? (
          <p className="text-gray-500">No items found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition border"
              >

                {/* IMAGE */}
                <div className="h-48 bg-gray-100">
                  <img
                    src={
                      item.image
                        ? item.image.startsWith("http")
                          ? item.image
                          : `${import.meta.env.VITE_API_URL}/${item.image}`
                        : "/placeholder.png"
                    }
                    className="w-full h-full object-cover"
                    alt={item.title}
                  />
                </div>

                {/* INFO */}
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </h4>

                  <p className="text-sm text-gray-500 mt-1">
                    {item.category}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <p className="text-orange-600 font-bold text-lg">
                      ₹{item.price}
                    </p>

                    <button
                      onClick={() => setSelectedItem(item)}
                      className="px-4 py-1 text-sm rounded-lg border hover:bg-gray-100 transition"
                    >
                      View
                    </button>
                  </div>
                </div>

              </div>
            ))}

          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="bg-gray-100 flex items-center justify-center h-72">
              <img
                src={
                  selectedItem.image?.startsWith("http")
                    ? selectedItem.image
                    : `${import.meta.env.VITE_API_URL}/${selectedItem.image}`
                }
                className="max-h-full max-w-full object-contain"
                alt={selectedItem.title}
              />
            </div>

            <div className="p-6">

              <h2 className="text-2xl font-bold text-gray-800">
                {selectedItem.title}
              </h2>

              <p className="text-gray-600 mt-2">
                {selectedItem.description}
              </p>

              <div className="flex items-center justify-between mt-5">
                <p className="text-orange-600 font-bold text-xl">
                  ₹{selectedItem.price}
                </p>

                <span className="text-sm text-gray-500">
                  {selectedItem.category}
                </span>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="mt-6 w-full bg-[linear-gradient(to_right,#f97316,#fb923c)] text-white py-2 rounded-xl hover:opacity-90 transition"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default SellerProfile;
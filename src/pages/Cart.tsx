import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase.config";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
interface CartItem {
  id: string;
  productId: string;
  userId: string;
  name: string;
  price: number;
  img: string;
  category: string;
  desc: string;
  quantity: number;
}
const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const userData = JSON.parse(localUser);
      if (userData.email === "azizbeknarzullayevo1o@gmail.com") {
        setIsAdmin(true);
        setCurrentUserId("admin");
        getCartItems("admin");
        return;
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        getCartItems(user.uid);
      } else {
        setCurrentUserId(null);
        setCartItems([]);
      }
    });

    return () => unsubscribe();
  }, []);

  async function getCartItems(id: string) {
    const cartRef = collection(db, "cart");
    const q = query(cartRef, where("userId", "==", id));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as CartItem,
    );
    setCartItems(items);
  }
  async function plus(id: string, current: number) {
    const quantity = doc(db, "cart", id);
    await updateDoc(quantity, {
      quantity: current + 1,
    });
    if (currentUserId) getCartItems(currentUserId);
  }
  async function minus(id: string, current: number) {
    const quantity = doc(db, "cart", id);
    if (current > 1) {
      await updateDoc(quantity, {
        quantity: current - 1,
      });
      if (currentUserId) getCartItems(currentUserId);
    } else {
      removeItem(id);
    }
  }
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  async function removeItem(itemId: string) {
    await deleteDoc(doc(db, "cart", itemId));
    if (currentUserId) getCartItems(currentUserId);
  }
  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <p className="text-2xl mb-4">
            🔒 Savatni ko'rish uchun tizimga kiring!
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/signin")}
              className="btn btn-primary"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="btn btn-success"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            🛒 Savatingiz
          </h1>

          {isAdmin && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
              👑 ADMIN
            </span>
          )}
        </div>

        {cartItems.length > 0 ? (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-4"
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-xl"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg sm:text-base">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-lg font-bold text-emerald-600 mt-2">
                      ${item.price}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
                    <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-2">
                      <button
                        onClick={() => minus(item.id, item.quantity)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-gray-200 transition font-bold text-gray-600"
                      >
                        −
                      </button>

                      <span className="font-semibold text-gray-800 w-8 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => plus(item.id, item.quantity)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-gray-200 transition font-bold text-gray-600"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      🗑️ O'chirish
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-base sm:text-lg font-semibold text-gray-700">
                  Jami:
                </span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-600">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <a
                href="https://t.me/Narzullayev_oo1"
                target="_blank"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition text-decoration-none"
              >
                💳 To'lovga o'tish
              </a>
            </div>
          </>
        ) : (
          <div className="text-center py-16 sm:py-24 text-gray-400">
            <span className="text-5xl sm:text-6xl">🛒</span>
            <p className="text-lg font-medium mt-4">Savatingiz bo'sh</p>
            <p className="text-sm">Mahsulot qo'shing!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

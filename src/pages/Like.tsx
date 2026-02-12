// import {  collection, deleteDoc, doc, getDocs } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { db } from "../firebase.config";
// interface Like {
//   id: string;
//   productId: string;
//   name: string;
//   price: number;
//   img: string;
//   category: string;
//   desc: string;
// }
// const Like = () => {
//   const [likeItems, setlikeItems] = useState<Like[]>([]);

//   useEffect(() => {
//     getLikeItems();
//   }, []);

//   async function getLikeItems() {
//     const like = collection(db, "like");
//     const snapshot = await getDocs(like);
//     const items = snapshot.docs.map(
//       (doc) =>
//         ({
//           id: doc.id,
//           ...doc.data(),
//         }) as Like,
//     );
//     setlikeItems(items);
//   }

//   async function removeLike(id: string) {
//     await deleteDoc(doc(db, "like", id));
//     getLikeItems();
//   }
//   return (
//     <div className="min-h-screen bg-gray-50 px-6 py-10">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
//           ❤️ Yoqtirilgan Mahsulotlar
//         </h1>

//         {likeItems.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//             {likeItems.map((item) => (
//               <div
//                 key={item.id}
//                 className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
//               >
//                 <div className="relative overflow-hidden bg-gray-100">
//                   <img
//                     className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
//                     src={item.img}
//                     alt={item.name}
//                   />
//                   <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-600 px-2.5 py-1 rounded-full shadow-sm">
//                     {item.category}
//                   </span>

//                   <button
//                     onClick={() => removeLike(item.id)}
//                     className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all shadow-sm"
//                   >
//                     ❌
//                   </button>
//                 </div>

//                 <div className="flex flex-col flex-1 p-4 gap-2">
//                   <h5 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">
//                     {item.name}
//                   </h5>
//                   <p className="text-xl font-bold text-emerald-600">
//                     ${item.price}
//                   </p>
//                   <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed flex-1">
//                     {item.desc}
//                   </p>

               
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
//             <span className="text-6xl">💔</span>
//             <p className="text-lg font-medium">Yoqtirilganlar bo'sh</p>
//             <p className="text-sm">Mahsulotlarni yoqtirib qo'shing!</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Like;
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface Like {
  id: string;
  userId: string;
  productId: string;
  name: string;
  price: number;
  img: string;
  category: string;
  desc: string;
}

const Like = () => {
  const navigate = useNavigate();
  const [likeItems, setLikeItems] = useState<Like[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Admin tekshirish
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const userData = JSON.parse(localUser);
      if (userData.email === "azizbeknarzullayevo1o@gmail.com") {
        setIsAdmin(true);
        setCurrentUserId("admin");
        getLikeItems("admin");
        return;
      }
    }

    // Firebase user
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        getLikeItems(user.uid);
      } else {
        setCurrentUserId(null);
        setLikeItems([]);
      }
    });

    return () => unsubscribe();
  }, []);

  async function getLikeItems(userId: string) {
    const likeRef = collection(db, "likes");
    const q = query(likeRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Like,
    );
    setLikeItems(items);
  }

  async function removeLike(itemId: string) {
    try {
      await deleteDoc(doc(db, "likes", itemId));
      if (currentUserId) getLikeItems(currentUserId);
    } catch (error) {
      console.error("❌ O'chirishda xatolik:", error);
    }
  }

  async function addToCart(item: Like) {
    if (!currentUserId) return;

    try {
      const cartRef = collection(db, "cart");
      await addDoc(cartRef, {
        userId: currentUserId,
        productId: item.productId,
        name: item.name,
        price: item.price,
        img: item.img,
        category: item.category,
        desc: item.desc,
        quantity: 1,
        addedAt: new Date().toISOString(),
      });
      alert(`✅ ${item.name} savatga qo'shildi!`);
    } catch (error) {
      console.error("❌ Savatga qo'shishda xatolik:", error);
      alert("Xatolik yuz berdi!");
    }
    navigate("/cart")
  }

  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <p className="text-2xl mb-4">
            🔒 Yoqtirilganlarni ko'rish uchun tizimga kiring!
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
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            ❤️ Yoqtirilgan Mahsulotlar
          </h1>
          {isAdmin && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              👑 ADMIN
            </span>
          )}
        </div>

        {likeItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {likeItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="relative overflow-hidden bg-gray-100">
                  <img
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                    src={item.img}
                    alt={item.name}
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-600 px-2.5 py-1 rounded-full shadow-sm">
                    {item.category}
                  </span>

                  <button
                    onClick={() => removeLike(item.id)}
                    className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all shadow-sm"
                  >
                    ❌
                  </button>
                </div>

                <div className="flex flex-col flex-1 p-4 gap-2">
                  <h5 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">
                    {item.name}
                  </h5>
                  <p className="text-xl font-bold text-emerald-600">
                    ${item.price}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed flex-1">
                    {item.desc}
                  </p>

                  <button
                    onClick={() => addToCart(item)}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-200 mt-2"
                  >
                    🛒 Savatga Qo'shish
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
            <span className="text-6xl">💔</span>
            <p className="text-lg font-medium">Yoqtirilganlar bo'sh</p>
            <p className="text-sm">Mahsulotlarni yoqtirib qo'shing!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Like;

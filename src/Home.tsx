import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, rtdb } from "./firebase.config";
import { useNavigate } from "react-router-dom";
import type { ChatM } from "./pages/Chat";
import { onValue, ref } from "firebase/database";
export interface Product {
  img: string;
  name: string;
  price: number;
  desc: string;
  category: string;
  date: string;
}
const Home = () => {
  useEffect(()=>{
    getDataBase()
  },[])
  const [open, setOpen] = useState(false);
  const [openChat, setchatOpen] = useState(false);
  const [chats, setChats] = useState<ChatM[]>([])
  
  const [imagePreview, setImagePreview] = useState<string>("");
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product>({
    img: "",
    name: "",
    price: 0,
    desc: "",
    category: "",
    date: "",
  });
    function getDataBase() {
      const refDb = ref(rtdb, "chats");
      onValue(refDb, (snapshot) => {
        const data = Object.entries(snapshot.val()).map(([id, value]) => {
          return { id, ...(value as ChatM) };
        });
        setChats(data);
      });
    }
  const addproduct = () => {
    addDoc(collection(db, "products"), {
      img:product.img,
      name: product.name,
      price: product.price,
      desc: product.desc,
      category: product.category,
      date: product.date
    });

    alert("Mahsulot muvaffaqiyatli qo'shildi!");

    setProduct({
      img: "",
      name: "",
      price: 0,
      desc: "",
      category: "",
      date: "",
    });
    setOpen(false);
    navigate("/");
  };
  return (
    <div className="container mx-auto mt-6  ">
      <div className="w-full max-w-[420px] border rounded-xl shadow-lg p-5 sm:p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        <div className="flex flex-col justify-between gap-2">
          <button
            onClick={() => setOpen(true)}
            className="btn btn-primary w-60 "
          >
            ➕ Mahsulot Qo'shish
          </button>
          <button
            onClick={() => setchatOpen(true)}
            className="btn btn-primary w-60"
          >
            Chat ({chats.length})
          </button>
        </div>
      </div>
      <div className="flex">
        {openChat && (
          <div className="w-full max-w-[500px] mt-4 border rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-3 font-bold text-lg flex justify-between">
              💬 Chat Xabarlari ({chats.length})
              <button onClick={()=> setchatOpen(false)}>❌</button>
            </div>

            <div className="flex flex-col gap-2 p-4 bg-gray-50 max-h-[400px] overflow-y-auto">
              {chats.length === 0 ? (
                <p className="text-center text-gray-400 py-6">
                  Hali xabar yo'q...
                </p>
              ) : (
                chats.map((itm, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-white border rounded-xl p-3 shadow-sm hover:shadow-md transition"
                  >
                    <div className="min-w-[32px] h-[32px] rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-gray-800 text-sm">
                        {itm.message}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal oyna */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-[500px]">
            <h2 className="text-2xl font-bold mb-6">Mahsulot Qo'shish</h2>
            <input
              type="file"
              accept="image/*"
              className="form-control mb-3"
              required
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => {
                    const result = reader.result as string;
                    setProduct((prev) => ({ ...prev, img: result }));
                    setImagePreview(result);
                  };
                }
              }}
            />

            {imagePreview && (
              <div className="mb-3 text-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-[140px] h-[140px] sm:w-[200px] sm:h-[200px] object-cover mx-auto rounded-lg"
                />
              </div>
            )}
            <input
              type="text"
              placeholder="Mahsulot nomi..."
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="form-control mb-4 h-[50px]"
            />

            <input
              type="number"
              placeholder="Narxi..."
              // value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: Number(e.target.value) })
              }
              className="form-control mb-4 h-[50px]"
            />
            <select
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
              className="form-control mb-4 h-[50px]"
            >
              <option value="" disabled>
                Kategoriya
              </option>
              <option value="Mobil qurilma">Mobil Qurilma</option>
              <option value="Kiyim">Kiyim</option>
              <option value="Oziq-Ovqat">Oziq-Ovqat</option>
              <option value="Mebel">Mebel</option>
            </select>

            <textarea
              placeholder="Tavsif..."
              value={product.desc}
              onChange={(e) => setProduct({ ...product, desc: e.target.value })}
              className="form-control mb-4 h-[100px]"
            />
            <input
              type="date"
              onChange={(e) => setProduct({ ...product, date: e.target.value })}
              className="form-control mb-4 h-[50px]"
            />

            <div className="flex gap-3">
              <button
                onClick={addproduct}
                className="btn btn-primary flex-1 disabled:opacity-50"
              >
                Qo'shish
              </button>
              <button
                onClick={() => {
                  (setOpen(false), setchatOpen(false));
                }}
                className="btn btn-danger flex-1 disabled:opacity-50"
              >
                ❌ Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

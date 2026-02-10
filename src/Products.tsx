import { useEffect, useState } from "react";
import type { Product } from "./Home";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase.config";
interface Props {
  search: string;
}
const Products = ({ search }: Props) => {
  useEffect(() => {
    getProducts();
  }, []);
  const [category, setCategory] = useState("");
  const [minPrice, setMinprice] = useState<number | "">("");
  const [maxPrice, setMaxprice] = useState<number | "">("");
  const [products, setProducts] = useState<Product[]>([]);
  const [tartib, setTartib] = useState("");

  function Tozalash() {
    setCategory("");
    setMinprice("");
    setMaxprice("");
    setTartib("");
  }

  function getProducts() {
    const products = collection(db, "products");
    getDocs(products).then((res) => {
      const arr = res.docs.map((itm) => {
        return { ...(itm.data() as Product), id: itm.id };
      });
      setProducts(arr);
    });
  }
  const visibleProducts = products
    .filter((itm) =>
      search.trim()
        ? itm.name.toLowerCase().includes(search.toLowerCase()) ||
          itm.category.toLowerCase().includes(search.toLowerCase()) ||
          itm.desc.toLowerCase().includes(search.toLowerCase())
        : true,
    )
    .filter((itm) => (category ? itm.category === category : true))
    .filter((itm) =>
      minPrice !== "" ? itm.price >= minPrice : true,
    )
    .filter((itm) =>
      maxPrice !== "" ? itm.price <= maxPrice : true,
    )
    .sort((a, b) => {
      if (tartib === "up-down") return b.price - a.price;
      if (tartib === "down-up") return a.price - b.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 flex flex-wrap gap-4 items-center justify-between">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition"
          >
            <option value="" >
              Barcha
            </option>
            <option value="Mobil qurilma">📱 Mobil Qurilma</option>
            <option value="Kiyim">👕 Kiyim</option>
            <option value="Oziq-Ovqat">🥗 Oziq-Ovqat</option>
            <option value="Mebel">🪑 Mebel</option>
          </select>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Narxi:</span>
            <input
              type="number"
              className="form-control"
              placeholder="0"
              onChange={(e) => setMinprice(Number(e.target.value))}
            />
            <span className="text-sm text-gray-500">dan</span>
            <input
              type="number"
              placeholder="999999"
              className="form-control"
              onChange={(e) => setMaxprice(Number(e.target.value))}
            />
            <span className="text-sm text-gray-500">gacha</span>
          </div>
          <div>
            <select
              className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition"
              value={tartib}
              onChange={(e) => setTartib(e.target.value)}
            >
              <option value="up-down">⬇️qimmat — arzon</option>
              <option value="down-up">🔝arzon — qimmat</option>
            </select>
          </div>
          <button onClick={() => Tozalash()} className="btn btn-danger">
            ✕ Tozalash
          </button>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center tracking-tight">
          Barcha Mahsulotlar
        </h2>

        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {visibleProducts.map((itm, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-gray-100">
                  <img
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                    src={itm.img}
                    alt={itm.name}
                  />
                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-600 px-2.5 py-1 rounded-full shadow-sm">
                    {itm.category}
                  </span>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 p-4 gap-2">
                  <h5 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">
                    {itm.name}
                  </h5>
                  <p className="text-xl font-bold text-emerald-600">
                    ${itm.price}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed flex-1">
                    {itm.desc}
                  </p>
                  <p className="text-xs text-gray-500">{itm.date}</p>

                  {/* Actions */}
                  <div className="flex gap-2 mt-2">
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 hover:bg-red-50 hover:border-red-200 transition text-lg">
                      ❤️
                    </button>
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-200">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
            <span className="text-6xl">🔍</span>
            <p className="text-lg font-medium">Hech narsa topilmadi</p>
            <p className="text-sm">Boshqa kategoriya yoki filtr tanlang</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

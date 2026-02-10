import { useState } from "react";
import { push, ref } from "firebase/database";
import { rtdb } from "../firebase.config";
export interface ChatM {
  message: string;
}
const Chat = () => {
  const [chat, setChat] = useState<ChatM>({
    message: "",
  });
  function submitUser() {
    const rtDB = ref(rtdb, "chats");
    push(rtDB, chat);
     setChat({ message: "" }); 
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-2">
        <input
          className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Sharh yozing..."
          value={chat.message}
          onChange={(e) => setChat({ ...chat, message: e.target.value })}
        />
        <button
          onClick={submitUser}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap"
        >
          Yuborish
        </button>
      </div>
    </div>
  );
};

export default Chat;

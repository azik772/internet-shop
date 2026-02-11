// import { useState } from "react";
// import { push, ref } from "firebase/database";
// import { rtdb } from "../firebase.config";
// export interface ChatM {
//   message: string;
// }
// const Chat = () => {
//   const [chat, setChat] = useState<ChatM>({
//     message: "",
//   });
//   function submitUser() {
//     const rtDB = ref(rtdb, "chats");
//     push(rtDB, chat);
//      setChat({ message: "" }); 
//   }
//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//       <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-2">
//         <input
//           className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//           placeholder="Sharh yozing..."
//           value={chat.message}
//           onChange={(e) => setChat({ ...chat, message: e.target.value })}
//         />
//         <button
//           onClick={submitUser}
//           className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap"
//         >
//           Yuborish
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chat;
import {  useState } from "react";
import {  push, ref,  } from "firebase/database";
import { rtdb } from "../firebase.config";

export interface ChatM {
  message: string;
}

const Chat = () => {
  const [chat, setChat] = useState({
    message: "",
  });
 

  function submitUser() {
    if (chat.message.trim()) {
      const rtDB = ref(rtdb, "chats");
      push(rtDB, chat);
      setChat({ message: "" });
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submitUser();
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
            Chat
          </h2>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Xabaringizni kiriting..."
                className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                value={chat.message}
                onChange={(e) => setChat({ ...chat, message: e.target.value })}
                onKeyPress={handleKeyPress}
              />
            </div>

            <button
              onClick={submitUser}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
              disabled={!chat.message.trim()}
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Yuborish
              </span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 text-center mt-4">
            Enter tugmasini bosib ham yuborishingiz mumkin
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;

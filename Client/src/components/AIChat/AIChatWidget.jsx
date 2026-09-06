import React, {
     useContext,
     useEffect,
     useRef,
     useState,
} from "react";

import {
     Bot,
     X,
     Send,
     MessageCircle,
     Loader2,
     LogIn,
} from "lucide-react";

import { UserAuthContext } from "../../context/AuthProvider";
import { ThemeContext } from "../../context/ThemeProvider";
import { sendAIMessage } from "../../services/aiService";

import OrderCard from "./OrderCard";
import ProductCard from "./ProductCard";

const AIChatWidget = () => {
     const { authUser, authUserLoading, setOpenLoginDialog } =
          useContext(UserAuthContext);

     const { theme } = useContext(ThemeContext);

     const [isOpen, setIsOpen] = useState(false);
     const [message, setMessage] = useState("");

     const [messages, setMessages] = useState([
          {
               id: "welcome",
               role: "assistant",
               content:
                    "Hi! 👋 I'm your Madhur AI Assistant. I can help you with products, orders, and more.",
          },
     ]);

     const [isLoading, setIsLoading] = useState(false);

     const messagesEndRef = useRef(null);
     const textareaRef = useRef(null);

     // Scroll to the latest message.
     useEffect(() => {
          messagesEndRef.current?.scrollIntoView({
               behavior: "smooth",
          });
     }, [messages, isLoading]);

     // Reset chat whenever the logged-in user changes.
     useEffect(() => {
          setMessages([
               {
                    id: "welcome",
                    role: "assistant",
                    content:
                         "Hi! 👋 I'm your Madhur AI Assistant. I can help you with products, orders, and more.",
               },
          ]);
     }, [authUser?._id]);

     const handleOpen = () => {
          setIsOpen((prev) => !prev);
     };

     const handleLogin = () => {
          setIsOpen(false);
          setOpenLoginDialog(true);
     };

     const handleSendMessage = async () => {
          const trimmedMessage = message.trim();

          if (!trimmedMessage || isLoading) {
               return;
          }

          // AI support requires authentication because
          // order-related tools use the authenticated user's JWT.
          if (!authUser) {
               setIsOpen(true);
               return;
          }

          const userMessage = {
               id: `${Date.now()}-user`,
               role: "user",
               content: trimmedMessage,
          };

          setMessages((prev) => [...prev, userMessage]);
          setMessage("");
          setIsLoading(true);

          try {
               const result = await sendAIMessage(trimmedMessage);

               const assistantResponse =
                    result?.response ||
                    "Sorry, I couldn't generate a response right now.";

               setMessages((prev) => [
                    ...prev,
                    {
                         id: `${Date.now()}-assistant`,
                         role: "assistant",
                         content: assistantResponse,
                         ui: result?.ui || null,
                    },
               ]);
          } catch (error) {
               console.error(
                    "AI CHAT ERROR:",
                    error?.response?.data || error.message
               );

               const status = error?.response?.status;

               let errorMessage =
                    "Sorry, something went wrong. Please try again.";

               if (status === 401) {
                    errorMessage =
                         "Your session has expired. Please log in again.";
               } else if (status === 429) {
                    errorMessage =
                         "The AI assistant is temporarily unavailable because its usage limit has been reached. Please try again later.";
               } else if (status >= 500) {
                    errorMessage =
                         "The AI service is temporarily unavailable. Please try again shortly.";
               }

               setMessages((prev) => [
                    ...prev,
                    {
                         id: `${Date.now()}-error`,
                         role: "assistant",
                         content: errorMessage,
                         isError: true,
                    },
               ]);
          } finally {
               setIsLoading(false);
               textareaRef.current?.focus();
          }
     };

     const handleKeyDown = (event) => {
          if (event.key === "Enter" && !event.shiftKey) {
               event.preventDefault();
               handleSendMessage();
          }
     };

     return (
          <div
               className="
                    fixed
                    bottom-5
                    right-4
                    z-[100]
                    flex
                    flex-col
                    items-end
                    sm:bottom-6
                    sm:right-5
                    md:bottom-8
                    md:right-8
                    lg:bottom-10
                    lg:right-12
               "
          >
               {/* =========================
                   CHAT WINDOW
               ========================== */}
               {isOpen && (
                    <div
                         className={`
                              mb-4
                              flex
                              h-[min(500px,calc(100dvh-105px))]
                              w-[calc(100vw-32px)]
                              max-w-[390px]
                              flex-col
                              overflow-hidden
                              rounded-2xl
                              border
                              shadow-2xl
                              backdrop-blur-xl
                              sm:w-[390px]

                              ${theme === "dark"
                                   ? "border-gray-700 bg-[#1c1c1c]/95 text-white"
                                   : "border-gray-200 bg-white/95 text-gray-900"
                              }
                         `}
                    >
                         {/* =========================
                             HEADER
                         ========================== */}
                         <div
                              className="
                                   flex
                                   items-center
                                   justify-between
                                   bg-[#843E71]
                                   px-3
                                   py-3
                                   text-white
                                   sm:px-4
                              "
                         >
                              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                                   <div
                                        className="
                                             flex
                                             h-9
                                             w-9
                                             shrink-0
                                             items-center
                                             justify-center
                                             rounded-full
                                             bg-white/15
                                             sm:h-10
                                             sm:w-10
                                        "
                                   >
                                        <Bot size={21} />
                                   </div>

                                   <div className="min-w-0">
                                        <h3 className="truncate text-sm font-bold">
                                             Madhur AI Assistant
                                        </h3>

                                        <p className="truncate text-[10px] text-white/75 sm:text-[11px]">
                                             Product & Order Support
                                        </p>
                                   </div>
                              </div>

                              <button
                                   type="button"
                                   onClick={() => setIsOpen(false)}
                                   className="
                                        shrink-0
                                        rounded-full
                                        p-2
                                        transition
                                        hover:bg-white/15
                                   "
                                   aria-label="Close AI assistant"
                              >
                                   <X size={20} />
                              </button>
                         </div>

                         {/* =========================
                             MESSAGES
                         ========================== */}
                         <div
                              className="
                                   scrollbar-hide
                                   min-h-0
                                   flex-1
                                   overflow-y-auto
                                   px-3
                                   py-3
                                   sm:px-4
                                   sm:py-4
                              "
                         >
                              {/* Login message */}
                              {!authUser && !authUserLoading && (
                                   <div
                                        className={`
                                             mb-4
                                             rounded-xl
                                             border
                                             p-3
                                             sm:p-4

                                             ${theme === "dark"
                                                  ? "border-gray-700 bg-[#252525]"
                                                  : "border-gray-200 bg-gray-50"
                                             }
                                        `}
                                   >
                                        <div className="mb-2 flex items-center gap-2">
                                             <LogIn
                                                  size={18}
                                                  className="shrink-0 text-[#843E71]"
                                             />

                                             <p className="text-sm font-semibold">
                                                  Login required
                                             </p>
                                        </div>

                                        <p
                                             className={`
                                                  text-xs
                                                  leading-5
                                                  ${theme === "dark"
                                                       ? "text-gray-300"
                                                       : "text-gray-600"
                                                  }
                                             `}
                                        >
                                             Please log in to use the AI
                                             assistant. This allows me to
                                             securely access your orders and
                                             provide personalized support.
                                        </p>

                                        <button
                                             type="button"
                                             onClick={handleLogin}
                                             className="
                                                  mt-3
                                                  rounded-lg
                                                  bg-[#843E71]
                                                  px-4
                                                  py-2
                                                  text-xs
                                                  font-semibold
                                                  text-white
                                                  transition
                                                  hover:bg-[#71345f]
                                             "
                                        >
                                             Login
                                        </button>
                                   </div>
                              )}

                              {/* Chat messages */}
                              {messages.map((item) => (
                                   <div
                                        key={item.id}
                                        className={`
                                             mb-3
                                             flex
                                             ${item.role === "user"
                                                  ? "justify-end"
                                                  : "justify-start"
                                             }
                                        `}
                                   >
                                        <div
                                             className={`
                                                  max-w-[88%]
                                                  rounded-2xl
                                                  px-3
                                                  py-2.5
                                                  text-sm
                                                  leading-6
                                                  sm:max-w-[82%]
                                                  sm:px-4
                                                  sm:py-3

                                                  ${item.role === "user"
                                                       ? "rounded-br-md bg-[#843E71] text-white"
                                                       : theme === "dark"
                                                            ? "rounded-bl-md bg-[#2b2b2b] text-gray-100"
                                                            : "rounded-bl-md bg-gray-100 text-gray-800"
                                                  }

                                                  ${item.isError
                                                       ? "border border-red-300 dark:border-red-800"
                                                       : ""
                                                  }
                                             `}
                                        >
                                             <div>
                                                  <div className="whitespace-pre-wrap break-words">
                                                       {item.content}
                                                  </div>

                                                  {item.ui?.type === "order" && (
                                                       <OrderCard
                                                            order={item.ui.order}
                                                            theme={theme}
                                                       />
                                                  )}

                                                  {item.ui?.type === "orders" && (
                                                       <>
                                                            {item.ui.displayMode === "latest" &&
                                                                 item.ui.latestOrder && (
                                                                      <OrderCard
                                                                           order={item.ui.latestOrder}
                                                                           theme={theme}
                                                                      />
                                                                 )}

                                                            {item.ui.displayMode === "all" &&
                                                                 item.ui.orders?.length > 0 && (
                                                                      <div className="mt-3 space-y-3">
                                                                           {item.ui.orders.map((order) => (
                                                                                <OrderCard
                                                                                     key={order.id}
                                                                                     order={order}
                                                                                     theme={theme}
                                                                                />
                                                                           ))}
                                                                      </div>
                                                                 )}
                                                       </>
                                                  )}

                                                  {item.ui?.type === "product" && (
                                                       <ProductCard
                                                            product={item.ui.product}
                                                            theme={theme}
                                                       />
                                                  )}
                                             </div>
                                        </div>
                                   </div>
                              ))}

                              {/* Loading */}
                              {isLoading && (
                                   <div className="mb-3 flex justify-start">
                                        <div
                                             className={`
                                                  flex
                                                  items-center
                                                  gap-2
                                                  rounded-2xl
                                                  rounded-bl-md
                                                  px-4
                                                  py-3
                                                  text-sm

                                                  ${theme === "dark"
                                                       ? "bg-[#2b2b2b] text-gray-200"
                                                       : "bg-gray-100 text-gray-700"
                                                  }
                                             `}
                                        >
                                             <Loader2
                                                  size={16}
                                                  className="animate-spin"
                                             />

                                             <span>Thinking...</span>
                                        </div>
                                   </div>
                              )}

                              <div ref={messagesEndRef} />
                         </div>

                         {/* =========================
                             INPUT
                         ========================== */}
                         <div
                              className={`
                                   border-t
                                   p-2.5
                                   sm:p-3

                                   ${theme === "dark"
                                        ? "border-gray-700 bg-[#1a1a1a]"
                                        : "border-gray-200 bg-white"
                                   }
                              `}
                         >
                              <div className="flex items-end gap-2">
                                   <textarea
                                        ref={textareaRef}
                                        value={message}
                                        onChange={(event) =>
                                             setMessage(event.target.value)
                                        }
                                        onKeyDown={handleKeyDown}
                                        disabled={!authUser || isLoading}
                                        rows={1}
                                        placeholder={
                                             authUser
                                                  ? "Ask about products or orders..."
                                                  : "Login to chat..."
                                        }
                                        className={`
                                             max-h-28
                                             min-h-[44px]
                                             flex-1
                                             resize-none
                                             rounded-xl
                                             border
                                             px-3
                                             py-2.5
                                             text-[13px]
                                             outline-none
                                             transition
                                             sm:text-sm

                                             ${theme === "dark"
                                                  ? "border-gray-700 bg-[#252525] text-white placeholder:text-gray-500 focus:border-[#843E71]"
                                                  : "border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-[#843E71]"
                                             }

                                             ${!authUser
                                                  ? "cursor-not-allowed opacity-60"
                                                  : ""
                                             }
                                        `}
                                        onInput={(event) => {
                                             event.target.style.height =
                                                  "auto";

                                             event.target.style.height = `${Math.min(
                                                  event.target.scrollHeight,
                                                  112
                                             )}px`;
                                        }}
                                   />

                                   <button
                                        type="button"
                                        onClick={handleSendMessage}
                                        disabled={
                                             !authUser ||
                                             !message.trim() ||
                                             isLoading
                                        }
                                        className="
                                             flex
                                             h-11
                                             w-11
                                             shrink-0
                                             items-center
                                             justify-center
                                             rounded-xl
                                             bg-[#843E71]
                                             text-white
                                             transition
                                             hover:bg-[#71345f]
                                             disabled:cursor-not-allowed
                                             disabled:opacity-40
                                        "
                                        aria-label="Send message"
                                   >
                                        <Send size={18} />
                                   </button>
                              </div>

                              <p
                                   className={`
                                        mt-2
                                        px-1
                                        text-[9px]
                                        sm:text-[10px]

                                        ${theme === "dark"
                                             ? "text-gray-500"
                                             : "text-gray-400"
                                        }
                                   `}
                              >
                                   Press Enter to send · Shift + Enter for a
                                   new line
                              </p>
                         </div>
                    </div>
               )}

               {/* =========================
                   FLOATING BUTTON
               ========================== */}
               <button
                    type="button"
                    onClick={handleOpen}
                    className="
                         group
                         flex
                         h-14
                         w-14
                         shrink-0
                         items-center
                         justify-center
                         rounded-full
                         bg-[#843E71]
                         text-white
                         shadow-xl
                         transition-all
                         duration-300
                         hover:scale-105
                         hover:bg-[#71345f]
                         active:scale-95
                    "
                    aria-label={
                         isOpen
                              ? "Close AI assistant"
                              : "Open AI assistant"
                    }
               >
                    {isOpen ? (
                         <X size={24} />
                    ) : (
                         <MessageCircle
                              size={25}
                              className="
                                   transition-transform
                                   duration-300
                                   group-hover:scale-110
                              "
                         />
                    )}
               </button>
          </div>
     );
};

export default AIChatWidget;
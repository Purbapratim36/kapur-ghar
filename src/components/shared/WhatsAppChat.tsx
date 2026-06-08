"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden border border-border"
          >
            <div className="bg-[#075E54] p-4 text-white">
              <h3 className="font-semibold">Kapur Ghar Support</h3>
              <p className="text-xs text-white/80 mt-0.5">
                Typically replies within minutes
              </p>
            </div>
            <div className="p-4 bg-[#ECE5DD]">
              <div className="bg-white rounded-lg p-3 shadow-sm text-sm">
                <p>Namaskar! 🙏</p>
                <p className="mt-1">
                  How can we help you today? Ask us about our Mekhela Sador
                  collection or any orders.
                </p>
                <span className="text-[10px] text-gray-400 float-right mt-1">
                  Now
                </span>
              </div>
            </div>
            <div className="p-3">
              <a
                href={`https://wa.me/${phoneNumber}?text=Hi%20Kapur%20Ghar!%20I'm%20interested%20in%20your%20collection.`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-[#25D366] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#20BD5A] transition-colors"
              >
                Start Chat
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        aria-label="WhatsApp Chat"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}

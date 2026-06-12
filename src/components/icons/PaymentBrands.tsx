// Inline SVG logos for major Indian payment brands. All credit-card logos use
// the official wordmarks (simplified) and brand colours. UPI app logos use
// recognisable mark + accent colour. Sized via the `className` prop.

export function VisaLogo({ className = "h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 22" className={className} aria-label="Visa">
      <rect width="64" height="22" rx="3" fill="#1A1F71" />
      <path
        fill="#fff"
        d="M27.3 6.6l-4.2 10.6h-2.7l-2.1-8.1c-.1-.5-.3-.7-.7-.9-.7-.4-1.8-.7-2.8-.9l.1-.3h4.4c.6 0 1.1.4 1.2 1.1l1.1 5.9 2.7-7zm10.7 7.1c0-2.6-3.6-2.7-3.6-3.9 0-.4.3-.7 1.1-.8.4 0 1.5-.1 2.7.5l.5-2.1c-.7-.2-1.5-.5-2.5-.5-2.6 0-4.5 1.4-4.5 3.4 0 1.5 1.3 2.3 2.4 2.8 1.1.5 1.4.8 1.4 1.3 0 .7-.8 1-1.6 1-1.3 0-2.1-.4-2.7-.6l-.5 2.2c.6.3 1.7.5 2.9.5 2.8 0 4.5-1.4 4.6-3.5zm6.7 3.5h2.4l-2.1-10.6h-2.2c-.5 0-.9.3-1.1.7l-3.9 9.9h2.7l.5-1.5h3.3zm-2.9-3.5l1.4-3.7.8 3.7zm-10.5-7.1l-2.1 10.6h-2.6l2.1-10.6z"
      />
    </svg>
  );
}

export function MastercardLogo({ className = "h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 30" className={className} aria-label="Mastercard">
      <rect width="48" height="30" rx="3" fill="#fff" stroke="#e5e7eb" strokeWidth="0.6" />
      <circle cx="20" cy="15" r="8" fill="#EB001B" />
      <circle cx="28" cy="15" r="8" fill="#F79E1B" />
      <path
        d="M24 9.4a8 8 0 0 1 0 11.2 8 8 0 0 1 0-11.2z"
        fill="#FF5F00"
      />
    </svg>
  );
}

export function RupayLogo({ className = "h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 70 22" className={className} aria-label="RuPay">
      <rect width="70" height="22" rx="3" fill="#fff" stroke="#e5e7eb" strokeWidth="0.6" />
      <text
        x="5"
        y="15"
        fontFamily="Arial,sans-serif"
        fontSize="11"
        fontWeight="700"
        fill="#0D6F3E"
      >
        Ru
      </text>
      <text
        x="20"
        y="15"
        fontFamily="Arial,sans-serif"
        fontSize="11"
        fontWeight="700"
        fill="#F26522"
      >
        Pay
      </text>
      <circle cx="55" cy="11" r="2" fill="#F26522" />
      <circle cx="62" cy="11" r="2" fill="#0D6F3E" />
    </svg>
  );
}

export function AmexLogo({ className = "h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 22" className={className} aria-label="American Express">
      <rect width="64" height="22" rx="3" fill="#006FCF" />
      <text
        x="32"
        y="14.5"
        textAnchor="middle"
        fontFamily="Arial,sans-serif"
        fontSize="6"
        fontWeight="700"
        letterSpacing="1"
        fill="#fff"
      >
        AMERICAN EXPRESS
      </text>
    </svg>
  );
}

export function UpiLogo({ className = "h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 22" className={className} aria-label="UPI">
      <rect width="48" height="22" rx="3" fill="#fff" stroke="#e5e7eb" strokeWidth="0.6" />
      <path d="M8 4l-3 14h2.5L10.5 4z" fill="#FF6B35" />
      <path d="M12 4l-3 14h2.5L14.5 4z" fill="#0F7C2A" />
      <text
        x="20"
        y="15"
        fontFamily="Arial,sans-serif"
        fontSize="10"
        fontWeight="700"
        fill="#1F2937"
      >
        UPI
      </text>
    </svg>
  );
}

export function PhonePeLogo({ className = "h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 22" className={className} aria-label="PhonePe">
      <rect width="22" height="22" rx="3" fill="#5F259F" />
      <path
        fill="#fff"
        d="M11 5.5c-3 0-5.4 2.4-5.4 5.4 0 1.6.7 3 1.8 4l1.4-1.4c-.8-.7-1.2-1.6-1.2-2.6 0-1.9 1.5-3.4 3.4-3.4 1 0 1.9.4 2.6 1.1l1.4-1.4A5.4 5.4 0 0 0 11 5.5zm0 3a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z"
      />
    </svg>
  );
}

export function GooglePayLogo({ className = "h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 22" className={className} aria-label="Google Pay">
      <rect width="22" height="22" rx="3" fill="#fff" stroke="#e5e7eb" strokeWidth="0.6" />
      <path
        fill="#4285F4"
        d="M14.3 11.2c0-.4 0-.7-.1-1.1H11v2h1.9c-.1.4-.3.8-.7 1v.8l1.1.1c.7-.6 1-1.6 1-2.8z"
      />
      <path
        fill="#34A853"
        d="M11 14.7c.9 0 1.7-.3 2.3-.8l-1.1-.9c-.3.2-.7.3-1.2.3-.9 0-1.7-.6-2-1.5H7.9v.9c.6 1.2 1.8 2 3.1 2z"
      />
      <path
        fill="#FBBC05"
        d="M9 11.8c-.1-.2-.1-.5-.1-.8s0-.5.1-.8v-.9H7.9c-.3.6-.5 1.2-.5 1.8s.2 1.2.5 1.7L9 11.8z"
      />
      <path
        fill="#EA4335"
        d="M11 8.5c.5 0 1 .2 1.4.5l1-1c-.6-.6-1.4-.9-2.4-.9-1.3 0-2.5.8-3.1 2L9 10c.3-.9 1.1-1.5 2-1.5z"
      />
    </svg>
  );
}

export function PaytmLogo({ className = "h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 22" className={className} aria-label="Paytm">
      <rect width="48" height="22" rx="3" fill="#fff" stroke="#e5e7eb" strokeWidth="0.6" />
      <text
        x="5"
        y="14.5"
        fontFamily="Arial,sans-serif"
        fontSize="9"
        fontWeight="800"
        fill="#002970"
      >
        pay
      </text>
      <text
        x="22"
        y="14.5"
        fontFamily="Arial,sans-serif"
        fontSize="9"
        fontWeight="800"
        fill="#00B9F1"
      >
        tm
      </text>
    </svg>
  );
}

export function BhimLogo({ className = "h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 22" className={className} aria-label="BHIM">
      <rect width="48" height="22" rx="3" fill="#fff" stroke="#e5e7eb" strokeWidth="0.6" />
      <text
        x="24"
        y="14.5"
        textAnchor="middle"
        fontFamily="Arial,sans-serif"
        fontSize="9"
        fontWeight="800"
        letterSpacing="0.5"
      >
        <tspan fill="#F26522">BH</tspan>
        <tspan fill="#0D6F3E">IM</tspan>
      </text>
    </svg>
  );
}

export function NetBankingLogo({ className = "h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 22" className={className} aria-label="Net Banking">
      <rect width="22" height="22" rx="3" fill="#fff" stroke="#e5e7eb" strokeWidth="0.6" />
      <path
        fill="#1F2937"
        d="M11 4l-6 3v1.5h12V7zm-4 6v5H5v1h12v-1h-2v-5h-1v5h-2v-5h-1v5H9v-5z"
      />
    </svg>
  );
}

export function WalletLogo({ className = "h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 22" className={className} aria-label="Wallet">
      <rect width="22" height="22" rx="3" fill="#fff" stroke="#e5e7eb" strokeWidth="0.6" />
      <path
        fill="#CC0000"
        d="M5 7v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2h-4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h4V8a1 1 0 0 0-1-1H6a1 1 0 0 0-1 0z"
      />
      <circle cx="14" cy="12" r="1" fill="#fff" />
    </svg>
  );
}

export function CodTruckLogo({ className = "h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 22" className={className} aria-label="Cash on Delivery">
      <rect width="22" height="22" rx="3" fill="#fff" stroke="#e5e7eb" strokeWidth="0.6" />
      <path
        fill="#C5A258"
        d="M3 7h9v8H5l-2-2zm10 1h4l3 3v4h-2a2 2 0 1 1-4 0h-1V8zm4 1v3h2.5L17.5 9z"
      />
      <circle cx="6.5" cy="16" r="1.5" fill="#1F2937" />
      <circle cx="14.5" cy="16" r="1.5" fill="#1F2937" />
    </svg>
  );
}

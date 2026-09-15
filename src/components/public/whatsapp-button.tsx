"use client"

import { usePathname } from "next/navigation"

const PHONE = "21694108023"

// Event + ticket pages only
const ALLOWED_PATHS = ["/evenement", "/programme", "/pass-evenement", "/pass-formation", "/pass-duo"]

export function WhatsappButton() {
  const pathname = usePathname()
  const isAllowed = ALLOWED_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))
  if (!isAllowed) return null

  return (
    <a
      href={`https://wa.me/${PHONE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactez-nous sur WhatsApp"
      className="group fixed bottom-4 right-4 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-premium-lg hover:scale-105 transition-transform"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40" />
      <svg
        viewBox="0 0 32 32"
        className="relative w-7 h-7 fill-white"
        aria-hidden="true"
      >
        <path d="M16.004 3C9.377 3 4 8.373 4 14.994c0 2.29.638 4.487 1.85 6.41L4 29l7.77-1.816a12.96 12.96 0 0 0 4.234.71h.005c6.627 0 12.003-5.373 12.003-11.994C28.012 8.373 22.63 3 16.004 3Zm0 21.86h-.004a10.83 10.83 0 0 1-5.522-1.514l-.396-.235-4.61 1.078 1.096-4.494-.258-.412a10.79 10.79 0 0 1-1.664-5.79c0-5.976 4.874-10.84 10.863-10.84 2.902 0 5.629 1.13 7.68 3.183a10.766 10.766 0 0 1 3.178 7.665c0 5.977-4.875 10.84-10.863 10.84Zm5.95-8.126c-.326-.163-1.928-.951-2.227-1.06-.298-.109-.516-.163-.733.163-.217.326-.842 1.06-1.032 1.278-.19.217-.38.245-.706.082-.326-.163-1.377-.507-2.622-1.612-.969-.862-1.623-1.927-1.813-2.253-.19-.326-.02-.502.143-.664.147-.146.326-.38.489-.57.163-.19.217-.326.326-.544.109-.217.054-.407-.027-.57-.082-.163-.733-1.762-1.005-2.415-.264-.635-.532-.549-.733-.559l-.624-.011c-.217 0-.57.082-.868.407-.298.326-1.14 1.114-1.14 2.716 0 1.602 1.167 3.15 1.33 3.368.163.217 2.297 3.505 5.565 4.916.778.336 1.385.537 1.858.687.78.248 1.49.213 2.052.13.626-.094 1.928-.788 2.2-1.55.271-.761.271-1.413.19-1.55-.082-.136-.298-.217-.624-.38Z" />
      </svg>
    </a>
  )
}

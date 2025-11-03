import React from 'react'

type SolProps = {
  onOpen?: () => void
}

export function Sol({ onOpen }: SolProps) {
  return (
    <button
      onClick={onOpen}
      aria-label="Open Sol chat"
      title="Sol — AI Assistant"
      className="w-9 h-9 rounded-full bg-[#CFE7D0] flex items-center justify-center text-[#2F4F36] font-semibold border border-white/40 shadow-sm hover:scale-105 transition-transform duration-150"
    >
      S
    </button>
  )
}

export default Sol

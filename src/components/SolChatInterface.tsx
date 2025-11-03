import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Send, Mic, Camera, Video, MessageCircle, Square } from 'lucide-react'
import { Button } from './ui/button'

type Message =
  | { id: string; type: 'text'; author: 'user' | 'sol'; text: string }
  | { id: string; type: 'audio' | 'image' | 'video'; author: 'user' | 'sol'; url: string }

export default function SolChatInterface({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Media refs
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<BlobPart[]>([])

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [recording, setRecording] = useState(false)
  const [videoRecording, setVideoRecording] = useState(false)

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function pushMessage(msg: Message) {
    setMessages((m) => [...m, msg])
  }

  async function handleSendText() {
    if (!input.trim()) return
    const id = Date.now().toString()
    pushMessage({ id, type: 'text', author: 'user', text: input.trim() })
    setInput('')

    // Mock response from Sol — replace with real API call
    setTimeout(() => {
      pushMessage({ id: id + '-r', type: 'text', author: 'sol', text: `I heard: "${input.trim()}". I'm here to help you with your wellness journey. How can I support you today?` })
    }, 700)
  }

  async function ensureMicrophone() {
    if (!mediaStreamRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        mediaStreamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch (e) {
        console.warn('getUserMedia failed', e)
      }
    } else if (videoRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current
    }
  }

  async function startVoiceRecord() {
    await ensureMicrophone()
    if (!mediaStreamRef.current) return
    recordedChunksRef.current = []
    const options = { mimeType: 'audio/webm;codecs=opus' }
    const mr = new MediaRecorder(mediaStreamRef.current, options)
    mediaRecorderRef.current = mr
    mr.ondataavailable = (e) => {
      if (e.data && e.data.size) recordedChunksRef.current.push(e.data)
    }
    mr.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' })
      const url = URL.createObjectURL(blob)
      pushMessage({ id: Date.now().toString(), type: 'audio', author: 'user', url })
      // Optionally send to Sol API and get response
    }
    mr.start()
    setRecording(true)
  }

  function stopVoiceRecord() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    setRecording(false)
  }

  async function takePhoto() {
    await ensureMicrophone()
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      pushMessage({ id: Date.now().toString(), type: 'image', author: 'user', url })
    }, 'image/jpeg')
  }

  function startVideoRecording() {
    if (!mediaStreamRef.current) return
    recordedChunksRef.current = []
    const options = { mimeType: 'video/webm;codecs=vp9' }
    const mr = new MediaRecorder(mediaStreamRef.current, options)
    mediaRecorderRef.current = mr
    mr.ondataavailable = (e) => {
      if (e.data && e.data.size) recordedChunksRef.current.push(e.data)
    }
    mr.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      pushMessage({ id: Date.now().toString(), type: 'video', author: 'user', url })
    }
    mr.start()
    setVideoRecording(true)
  }

  function stopVideoRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    setVideoRecording(false)
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <div className="min-h-screen">
      {/* Header Bar */}
      <div className="h-[72px] bg-[#F5F5ED] border-b border-[#C8C8BC]">
        <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[#7A9A79] hover:text-[#5A5A52] transition-all duration-200 hover:-translate-x-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Sol Chat</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#A8C5A7] flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-[#FDFDF8]" />
            </div>
            <div>
              <div className="text-[16px] font-semibold text-[#5A5A52]">Sol</div>
              <div className="text-[12px] text-[#8B8B7E]">AI Wellness Assistant</div>
            </div>
          </div>

          <div className="text-[16px] text-[#8B8B7E]">
            {currentDate}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="flex gap-8 h-[calc(100vh-160px)]">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Messages Container */}
            <div className="flex-1 rounded-[16px] glassmorphism-card mb-6 overflow-hidden flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-6 min-h-0">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center min-h-[400px]">
                    <div className="w-20 h-20 rounded-full bg-[#D4E7D4] flex items-center justify-center mb-6">
                      <MessageCircle className="w-10 h-10 text-[#7A9A79]" />
                    </div>
                    <h3 className="text-[24px] font-semibold text-[#5A5A52] mb-2">
                      Welcome to Sol Chat
                    </h3>
                    <p className="text-[16px] text-[#8B8B7E] max-w-[400px]">
                      I'm here to support your wellness journey. Ask me anything, share your thoughts, or use voice, photo, or video to connect with me.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex items-start gap-3 ${m.author === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {m.author === 'sol' && (
                          <div className="w-8 h-8 rounded-full bg-[#A8C5A7] flex items-center justify-center flex-shrink-0 mt-1">
                            <MessageCircle className="w-4 h-4 text-[#FDFDF8]" />
                          </div>
                        )}
                        <div
                          className={`rounded-[16px] p-4 max-w-[75%] ${
                            m.author === 'user'
                              ? 'bg-[#A8C5A7] text-[#FDFDF8]'
                              : 'bg-[#F5F5ED] text-[#5A5A52]'
                          } shadow-gentle`}
                        >
                          {m.type === 'text' && (
                            <p className="text-[16px] leading-[24px] break-words whitespace-pre-wrap">{m.text}</p>
                          )}
                          {m.type === 'audio' && (
                            <div className="flex items-center gap-2">
                              <Mic className="w-4 h-4" />
                              <audio controls src={m.url} className="flex-1" />
                            </div>
                          )}
                          {m.type === 'image' && (
                            <img
                              src={m.url}
                              alt="capture"
                              className="rounded-[12px] max-w-full h-auto shadow-gentle"
                            />
                          )}
                          {m.type === 'video' && (
                            <video
                              controls
                              src={m.url}
                              className="rounded-[12px] max-w-full h-auto shadow-gentle"
                            />
                          )}
                        </div>
                        {m.author === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-[#D4E7D4] flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-[#7A9A79] font-semibold text-xs">You</span>
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="rounded-[16px] glassmorphism-card p-6 flex-shrink-0">
              {/* Text Input */}
              <div className="flex items-center gap-3 mb-4">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendText()
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-[12px] bg-[#FDFDF8] border-2 border-[#D4E7D4] text-[16px] text-[#5A5A52] placeholder:text-[#C8C8BC] focus:outline-none focus:border-[#A8C5A7] transition-all duration-200"
                />
                <Button
                  onClick={handleSendText}
                  disabled={!input.trim()}
                  className="h-12 px-6 rounded-[24px] bg-[#A8C5A7] hover:bg-[#7A9A79] text-[#FDFDF8] font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-1 hover:scale-105 flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>

              {/* Media Controls */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => {
                    if (!recording) startVoiceRecord()
                    else stopVoiceRecord()
                  }}
                  variant="outline"
                  className={`flex-1 h-12 px-4 rounded-[24px] border-2 font-semibold transition-all duration-200 ${
                    recording
                      ? 'border-red-400 bg-red-50 text-red-600 hover:bg-red-100'
                      : 'border-[#A8C5A7] text-[#A8C5A7] hover:bg-[#D4E7D4]'
                  }`}
                >
                  {recording ? (
                    <>
                      <Square className="w-4 h-4 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Voice
                    </>
                  )}
                </Button>

                <Button
                  onClick={takePhoto}
                  variant="outline"
                  className="h-12 px-4 rounded-[24px] border-2 border-[#A8C5A7] text-[#A8C5A7] hover:bg-[#D4E7D4] font-semibold transition-all duration-200"
                >
                  <Camera className="w-4 h-4" />
                </Button>

                <Button
                  onClick={() => {
                    if (!videoRecording) startVideoRecording()
                    else stopVideoRecording()
                  }}
                  variant="outline"
                  className={`h-12 px-4 rounded-[24px] border-2 font-semibold transition-all duration-200 ${
                    videoRecording
                      ? 'border-red-400 bg-red-50 text-red-600 hover:bg-red-100'
                      : 'border-[#A8C5A7] text-[#A8C5A7] hover:bg-[#D4E7D4]'
                  }`}
                >
                  <Video className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-[12px] text-[#8B8B7E] mt-4 text-center">
                Privacy: All media stays local unless you choose to share it.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-[380px] space-y-6">
            <div className="rounded-[16px] glassmorphism-card p-6">
              <h4 className="text-[20px] font-semibold text-[#5A5A52] mb-4">
                About Sol
              </h4>
              <p className="text-[14px] text-[#8B8B7E] leading-[22px] mb-4">
                Sol is your AI wellness companion, designed to support you on your journey to better mental health and self-care.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F9E5A7] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageCircle className="w-4 h-4 text-[#5A5A52]" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#5A5A52] mb-1">
                      Chat Anytime
                    </div>
                    <div className="text-[12px] text-[#8B8B7E]">
                      Share your thoughts, feelings, or questions
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D4E7D4] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mic className="w-4 h-4 text-[#5A5A52]" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#5A5A52] mb-1">
                      Voice & Media
                    </div>
                    <div className="text-[12px] text-[#8B8B7E]">
                      Use voice, photos, or video to express yourself
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#A8C5A7] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageCircle className="w-4 h-4 text-[#FDFDF8]" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#5A5A52] mb-1">
                      Supportive Guidance
                    </div>
                    <div className="text-[12px] text-[#8B8B7E]">
                      Get personalized insights and encouragement
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[16px] glassmorphism-card p-6">
              <h4 className="text-[20px] font-semibold text-[#5A5A52] mb-4">
                Quick Tips
              </h4>
              <div className="space-y-2">
                <div className="text-[14px] text-[#8B8B7E]">
                  • Be open and honest about how you're feeling
                </div>
                <div className="text-[14px] text-[#8B8B7E]">
                  • Ask specific questions for better guidance
                </div>
                <div className="text-[14px] text-[#8B8B7E]">
                  • Use voice messages for longer reflections
                </div>
                <div className="text-[14px] text-[#8B8B7E]">
                  • Check in regularly to track your progress
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden elements for media capture */}
      <div className="hidden">
        <video ref={videoRef} autoPlay playsInline muted />
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}

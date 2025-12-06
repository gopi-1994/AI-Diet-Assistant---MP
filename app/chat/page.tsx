"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Star, User, Menu, X, LogOut } from 'lucide-react'
import Link from "next/link"

interface Message {
  role: "user" | "assistant"
  content: string
}

const FormattedMessage = ({ content }: { content: string }) => {
  const lines = content.split('\n')
  
  return (
    <div className="space-y-3 text-sm">
      {lines.map((line, idx) => {
        // Handle table rows
        if (line.includes('|')) {
          const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell)
          
          if (idx > 0 && lines[idx - 1]?.includes('---')) {
            // This is a data row in a table
            return (
              <div key={idx} className="grid grid-cols-2 gap-4 bg-slate-600 p-3 rounded">
                {cells.map((cell, cellIdx) => (
                  <div key={cellIdx} className="text-slate-200">{cell}</div>
                ))}
              </div>
            )
          } else if (line.includes('---')) {
            // Separator row, skip rendering
            return null
          } else {
            // Header row
            return (
              <div key={idx} className="grid grid-cols-2 gap-4 font-semibold text-blue-300 mb-2">
                {cells.map((cell, cellIdx) => (
                  <div key={cellIdx}>{cell}</div>
                ))}
              </div>
            )
          }
        }
        
        // Handle section headers (bold with emoji)
        if (line.match(/^[🗓️📋💪📈🍽️🕖🕛🥗🚶💧⚖️]/)) {
          return (
            <div key={idx} className="font-semibold text-base text-blue-300 mt-4 mb-2">
              {line}
            </div>
          )
        }
        
        // Handle bullet points
        if (line.startsWith('•')) {
          return (
            <div key={idx} className="text-slate-300 ml-4 mb-1">
              {line}
            </div>
          )
        }
        
        // Handle bold sections (**text**)
        if (line.includes('**')) {
          const parts = line.split(/\*\*(.*?)\*\*/)
          return (
            <div key={idx} className="text-slate-300 mb-2">
              {parts.map((part, partIdx) => 
                partIdx % 2 === 1 ? (
                  <span key={partIdx} className="font-semibold text-blue-300">{part}</span>
                ) : (
                  <span key={partIdx}>{part}</span>
                )
              )}
            </div>
          )
        }
        
        // Regular text
        if (line.trim()) {
          return (
            <div key={idx} className="text-slate-300 leading-relaxed">
              {line}
            </div>
          )
        }
        
        return null
      })}
    </div>
  )
}

export default function ChatPage() {
  const [userData, setUserData] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUser = localStorage.getItem("currentUser")
      if (currentUser) {
        const user = JSON.parse(currentUser)
        setUserData(user)
        console.log("[v0] User data loaded:", user)
        
        const defaultMessages: Message[] = [
          {
            role: "assistant",
            content: `Hey ${user.firstName}, let's begin with your amazing weight loss journey!`,
          },
          {
            role: "user",
            content: "Okay, Give me the diet plans as a beginner level",
          },
          {
            role: "assistant",
            content: `Once I have that, I'll build a 3-month weight-loss plan that includes:\n\n📋 Weekly calorie and protein targets\n🍽️ Meal plan template (breakfast/lunch/dinner/snacks)\n💪 Workout and hydration guide\n📈 Monthly adjustment phase to avoid plateaus\n\nCould you share those details?`,
          },
          {
            role: "user",
            content: "I like chicken in my food.",
          },
          {
            role: "assistant",
            content: `Perfect — thanks, ${user.firstName}! 👌\n\n⚖️ GOAL OVERVIEW\nParameter | Value\n---|---\nCurrent weight | ${user.weight} kg\nTarget (3 months) | ${user.goalWeight} kg\nApproach | Moderate calorie deficit + high protein diet + daily walking\nTarget calories/day | ${user.dailyCalories} kcal\nProtein goal | 90–110 g/day\nExpected fat loss | 0.8–1 kg per week\n\n🗓️ 3-MONTH STRUCTURE\n\n**Month 1 – Reset & Habit Building**\n• Focus: portion control, hydration, 30 min daily walk\n• Cut refined carbs (sugar, white bread, fried foods)\n• Include one cheat meal/week\n\n**Month 2 – Fat Loss Acceleration**\n• Add light strength/resistance training 2–3×/week\n• Focus on protein and fiber-rich foods\n• Track calorie intake (apps: MyFitnessPal / HealthifyMe)\n\n**Month 3 – Lean Phase & Maintenance Prep**\n• Slightly increase protein (~110 g/day)\n• Walk 45–60 min daily\n• Keep total calories steady\n\n🍽️ DAILY MEAL PLAN TEMPLATE (With Chicken)\n\n🕖 **Breakfast** (~400 kcal, 25g protein)\n• 3 boiled eggs or 2 eggs + 2 egg whites\n• 2 slices brown bread / 1 roti\n• 1 fruit (apple/papaya/orange)\n• Black coffee / green tea (no sugar)\n\n🕛 **Lunch** (~600 kcal, 35–40g protein)\n• 1 cup brown rice / 2 rotis\n• Grilled chicken (150–200g) with dal\n• 1 cup mixed vegetables or salad\n• 1 cup curd (optional)\n\n🕖 **Dinner** (~500 kcal, 30g protein)\n• Grilled chicken (150g)\n• 1 roti or small portion of rice\n• Steamed/boiled veggies\n• Herbal tea before bed\n\n🥗 **Optional Snack** (if hungry)\n• 5 almonds + 2 walnuts\n• Green tea / black coffee\n• 1 scoop whey protein\n\n🚶 **ACTIVITY & FITNESS PLAN**\nDay | Activity\n---|---\nMon–Sat | 30–45 min brisk walk\nTue/Thu/Sat | Optional: beginner strength workout\nSunday | Rest & stretching\n\nGoal: ${user.recommendedDailySteps?.toLocaleString()} steps/day\n\n💧 **HYDRATION & LIFESTYLE**\n• 2.5–3 L water/day\n• Sleep: 7–8 hours/night\n• Avoid alcohol/sugar drinks\n• Track weight every Sunday morning\n\nWould you like me to adjust this plan or have any other questions?`,
          },
          {
            role: "user",
            content: "I'm looking for some healthy cooking recipes that can help me reach my weight loss goal.",
          },
          {
            role: "assistant",
            content: `That's a great choice! Here's a YouTube video with nutritious and easy-to-follow recipes perfectly aligned with your weight loss journey:\n\n👉 Watch here: https://youtu.be/AF8ykw6IKQQ?si=KJ2ZlXk0yD0ki-c-\n\nThese recipes are designed to be:\n• High in protein for muscle retention\n• Low in calories but filling\n• Simple to prepare at home\n• Perfect for your chicken preferences\n\nI recommend watching it and picking 2-3 recipes to rotate in your meal plan. Let me know if you need help adjusting any recipes or have questions!`,
          },
        ]
        setMessages(defaultMessages)
      }
      setLoading(false)
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    window.location.href = "/"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setSending(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()
      const assistantMessage = { role: "assistant" as const, content: data.content }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    )
  }

  if (!userData) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">No user data found</p>
          <a href="/signup" className="text-blue-400 hover:text-blue-300">
            Go back to signup
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-slate-700 rounded-lg transition"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome, {userData?.firstName}!</h1>
              <p className="text-slate-300 mt-1">
                Ready to burn some calories and reach your goal weight? Let's become a healthy version of yourself!
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="bg-slate-700 p-3 rounded">
            <p className="text-slate-400 text-sm">Goal Weight</p>
            <p className="text-lg font-bold text-blue-400">{userData?.goalWeight} kg</p>
          </div>
          <div className="bg-slate-700 p-3 rounded">
            <p className="text-slate-400 text-sm">Daily Calories</p>
            <p className="text-lg font-bold text-green-400">{userData?.dailyCalories}</p>
          </div>
          <div className="bg-slate-700 p-3 rounded">
            <p className="text-slate-400 text-sm">Daily Steps</p>
            <p className="text-lg font-bold text-yellow-400">{userData?.recommendedDailySteps?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMenuOpen(false)}>
          <div
            className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700 p-4 z-50 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">
                  {userData?.firstName} {userData?.lastName}
                </p>
                <p className="text-slate-400 text-xs">{userData?.email}</p>
              </div>
            </div>

            <div className="flex-1">
              <div className="bg-slate-700 rounded p-4 mb-4">
                <p className="text-slate-400 text-xs uppercase tracking-wide">Profile Information</p>
                <div className="mt-3 space-y-2 text-sm">
                  <p className="text-slate-300">
                    <span className="text-slate-400">Gender:</span> {userData?.gender}
                  </p>
                  <p className="text-slate-300">
                    <span className="text-slate-400">BMI:</span> {userData?.bmi?.toFixed(1)}
                  </p>
                  <p className="text-slate-300">
                    <span className="text-slate-400">Diet:</span> {userData?.vegan ? "Vegan" : "Non-Vegan"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Link href="/profile" onClick={() => setMenuOpen(false)}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white justify-start">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">
                Hi {userData?.firstName}! I'm your AI health coach. Ask me anything about your diet plan, workouts, or
                health goals!
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, idx) => (
                <div key={idx} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} gap-3`}>
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-2xl px-4 py-3 rounded-lg ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-100"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <FormattedMessage content={message.content} />
                    ) : (
                      message.content
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700 bg-slate-800/50 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your health coach..."
            disabled={sending}
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
          />
          <Button type="submit" disabled={sending} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
            {sending ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
    </main>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { User, ArrowLeft, LogOut } from 'lucide-react'
import Link from "next/link"

interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  gender: string
  age: number
  height: number
  weight: number
  bmi: number
  vegan: boolean
  dietType: string
  lifestyle: string
  workoutRoutine: string
  dailySteps: number
  goalWeight: number
  dailyCalories: number
  recommendedDailySteps: number
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUser = localStorage.getItem("currentUser")
      if (currentUser) {
        const user = JSON.parse(currentUser)
        if (!user.bmi && user.height && user.weight) {
          const heightInMeters = user.height / 100
          user.bmi = user.weight / (heightInMeters * heightInMeters)
        }
        console.log("[v0] Profile - User data loaded:", user)
        setUserData(user)
      }
      setLoading(false)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    window.location.href = "/"
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
          <Link href="/signup">
            <Button className="bg-blue-600 hover:bg-blue-700">Go back to signup</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/chat">
            <Button variant="ghost" className="text-white hover:bg-slate-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Chat
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* User Info Card */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {userData.firstName} {userData.lastName}
              </h2>
              <p className="text-slate-400">{userData.email}</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700 p-4 rounded">
              <p className="text-slate-400 text-sm">Gender</p>
              <p className="text-lg font-semibold text-white mt-1">{userData.gender}</p>
            </div>
            <div className="bg-slate-700 p-4 rounded">
              <p className="text-slate-400 text-sm">Age</p>
              <p className="text-lg font-semibold text-white mt-1">{userData.age} years</p>
            </div>
            <div className="bg-slate-700 p-4 rounded">
              <p className="text-slate-400 text-sm">Height</p>
              <p className="text-lg font-semibold text-white mt-1">{userData.height} cm</p>
            </div>
            <div className="bg-slate-700 p-4 rounded">
              <p className="text-slate-400 text-sm">Current Weight</p>
              <p className="text-lg font-semibold text-white mt-1">{userData.weight} kg</p>
            </div>
            <div className="bg-slate-700 p-4 rounded">
              <p className="text-slate-400 text-sm">BMI</p>
              <p className="text-lg font-semibold text-yellow-400 mt-1">{(userData.bmi || 0).toFixed(1)}</p>
            </div>
          </div>
        </div>

        {/* Diet & Lifestyle */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Diet & Lifestyle</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700 p-4 rounded">
              <p className="text-slate-400 text-sm">Diet Type</p>
              <p className="text-lg font-semibold text-white mt-1">{userData.dietType}</p>
            </div>
            <div className="bg-slate-700 p-4 rounded">
              <p className="text-slate-400 text-sm">Vegan</p>
              <p className="text-lg font-semibold text-white mt-1">{userData.isVegan ? "Yes" : "No"}</p>
            </div>
            <div className="bg-slate-700 p-4 rounded">
              <p className="text-slate-400 text-sm">Lifestyle</p>
              <p className="text-lg font-semibold text-white mt-1">{userData.lifestyle}</p>
            </div>
            <div className="bg-slate-700 p-4 rounded">
              <p className="text-slate-400 text-sm">Workout Routine</p>
              <p className="text-lg font-semibold text-white mt-1">{userData.workoutRoutine}</p>
            </div>
          </div>
        </div>

        {/* Health Goals */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Your Health Goals</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded">
              <p className="text-blue-100 text-sm">Goal Weight</p>
              <p className="text-3xl font-bold text-white mt-1">{userData.goalWeight} kg</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded">
              <p className="text-green-100 text-sm">Daily Calories</p>
              <p className="text-3xl font-bold text-white mt-1">{userData.dailyCalories}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded">
              <p className="text-yellow-100 text-sm">Daily Steps Goal</p>
              <p className="text-3xl font-bold text-white mt-1">{userData.recommendedDailySteps?.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded">
              <p className="text-purple-100 text-sm">Current Daily Steps</p>
              <p className="text-3xl font-bold text-white mt-1">{userData.dailySteps?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">3-Month Transformation Plan</h3>
          <p className="text-slate-300 mb-4">
            With a daily calorie intake of{" "}
            <span className="font-semibold text-green-400">{userData.dailyCalories}</span> calories and walking{" "}
            <span className="font-semibold text-yellow-400">
              {userData.recommendedDailySteps?.toLocaleString()} steps
            </span>{" "}
            daily, you can reach your goal weight of{" "}
            <span className="font-semibold text-blue-400">{userData.goalWeight} kg</span> within 3 months.
          </p>
          <div className="bg-slate-700 p-4 rounded text-slate-300">
            <p className="text-sm">
              💡 Tip: Stay consistent with your diet and exercise routine for best results. You've got this!
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex gap-4">
          <Link href="/chat" className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Continue to Chat</Button>
          </Link>
          <Button onClick={handleLogout} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </main>
  )
}

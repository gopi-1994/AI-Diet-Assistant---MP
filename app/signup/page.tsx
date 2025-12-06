"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [gender, setGender] = useState("male")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [age, setAge] = useState("")
  const [workoutRoutine, setWorkoutRoutine] = useState("moderate")
  const [isVegan, setIsVegan] = useState(false)
  const [dietType, setDietType] = useState("balanced")
  const [lifestyle, setLifestyle] = useState("moderate")
  const [dailySteps, setDailySteps] = useState(7500)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{
    goalWeight: number
    dailyCalories: number
    dailySteps: number
  } | null>(null)

  const calculateBMI = () => {
    if (!height || !weight) return null
    const heightInMeters = Number.parseFloat(height) / 100
    return Number.parseFloat(weight) / (heightInMeters * heightInMeters)
  }

  const handleGenerateDiet = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!firstName || !lastName || !email || !password || !confirmPassword || !height || !weight || !age) {
      setError("Please fill in all fields")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    const currentWeight = Number.parseFloat(weight)
    const bmi = calculateBMI()

    if (!bmi) {
      setError("Invalid height or weight")
      return
    }

    const heightInMeters = Number.parseFloat(height) / 100
    const targetBMI = 23
    const goalWeight = Math.round(targetBMI * heightInMeters * heightInMeters * 10) / 10

    const weightDifference = Math.abs(currentWeight - goalWeight)
    const caloriesPerPound = 3500
    const totalCaloriesToBurn = weightDifference * caloriesPerPound
    const weeks = 12
    const dailyCalorieDeficit = Math.round(totalCaloriesToBurn / (weeks * 7))

    let baseDailyCalories = 2000
    if (gender === "female") baseDailyCalories = 1800
    if (lifestyle === "sedentary") baseDailyCalories -= 200
    if (lifestyle === "very_active") baseDailyCalories += 300

    if (isVegan) baseDailyCalories -= 50

    const targetDailyCalories = baseDailyCalories - dailyCalorieDeficit

    const recommendedDailySteps = Math.max(dailySteps, Math.round(dailySteps * 1.2))

    setResults({
      goalWeight,
      dailyCalories: Math.max(1200, targetDailyCalories),
      dailySteps: Math.min(recommendedDailySteps, 15000),
    })
  }

  const handleSignUp = async () => {
    try {
      setLoading(true)

      if (!results) return

      const userData = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        password,
        gender,
        height,
        weight,
        age,
        workoutRoutine,
        isVegan,
        dietType,
        lifestyle,
        dailySteps,
        goalWeight: results.goalWeight,
        dailyCalories: results.dailyCalories,
        recommendedDailySteps: results.dailySteps,
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem("currentUser", JSON.stringify(userData))

      const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]")
      allUsers.push(userData)
      localStorage.setItem("allUsers", JSON.stringify(allUsers))

      console.log("[v0] User saved successfully:", userData)

      router.push(`/chat?userId=${userData.id}`)
    } catch (err) {
      console.error("[v0] Error in handleSignUp:", err)
      setError(err instanceof Error ? err.message : "Failed to create account")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Start Your Journey</h1>
          <p className="text-slate-400">Create your personalized diet plan</p>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 shadow-2xl">
          <form onSubmit={handleGenerateDiet} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-slate-200">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-slate-200">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-200">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Gender</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={(e) => setGender(e.target.value)}
                    className="accent-blue-500"
                  />
                  <span className="text-slate-300">Male</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={(e) => setGender(e.target.value)}
                    className="accent-blue-500"
                  />
                  <span className="text-slate-300">Female</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-slate-200">
                Age
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="1"
                max="120"
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height" className="text-slate-200">
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-slate-200">
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {calculateBMI() && (
              <div className="p-3 bg-slate-700 rounded border border-slate-600">
                <p className="text-slate-200">
                  Current BMI: <span className="font-semibold text-blue-400">{calculateBMI()?.toFixed(1)}</span>
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-slate-200">Diet Preference</Label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVegan}
                  onChange={(e) => setIsVegan(e.target.checked)}
                  className="accent-blue-500"
                />
                <span className="text-slate-300">I am Vegan</span>
              </label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietType" className="text-slate-200">
                Diet Type
              </Label>
              <select
                id="dietType"
                value={dietType}
                onChange={(e) => setDietType(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded p-2 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="balanced">Balanced</option>
                <option value="lowcarb">Low Carb</option>
                <option value="highprotein">High Protein</option>
                <option value="lowfat">Low Fat</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lifestyle" className="text-slate-200">
                Lifestyle
              </Label>
              <select
                id="lifestyle"
                value={lifestyle}
                onChange={(e) => setLifestyle(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded p-2 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Lightly Active</option>
                <option value="moderate">Moderately Active</option>
                <option value="very_active">Very Active</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workoutRoutine" className="text-slate-200">
                Workout Routine
              </Label>
              <select
                id="workoutRoutine"
                value={workoutRoutine}
                onChange={(e) => setWorkoutRoutine(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded p-2 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="moderate">Moderate</option>
                <option value="intense">Intense</option>
                <option value="athletic">Athletic</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-slate-200">Daily Walking Steps</Label>
                <span className="text-blue-400 font-semibold">{dailySteps.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="3000"
                max="15000"
                step="3000"
                value={dailySteps}
                onChange={(e) => setDailySteps(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>3000</span>
                <span>15000</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-700/50 rounded text-red-400 text-sm">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Generate Diet Plan
            </Button>
          </form>

          {results && (
            <div className="mt-8 p-6 bg-slate-700 rounded-lg border border-slate-600 space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">Your Personalized Plan</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800 p-4 rounded border border-slate-600">
                  <p className="text-slate-400 text-sm mb-1">Goal Weight</p>
                  <p className="text-2xl font-bold text-blue-400">{results.goalWeight} kg</p>
                </div>
                <div className="bg-slate-800 p-4 rounded border border-slate-600">
                  <p className="text-slate-400 text-sm mb-1">Daily Calories</p>
                  <p className="text-2xl font-bold text-green-400">{results.dailyCalories}</p>
                </div>
                <div className="bg-slate-800 p-4 rounded border border-slate-600">
                  <p className="text-slate-400 text-sm mb-1">Daily Steps</p>
                  <p className="text-2xl font-bold text-yellow-400">{results.dailySteps.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm">
                Reach your goal weight in <strong>3 months</strong> by following this plan. Stay consistent!
              </p>

              <Button
                onClick={handleSignUp}
                disabled={loading}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Sign Up & Start Journey"}
              </Button>
            </div>
          )}

          <div className="text-center mt-8">
            <p className="text-slate-400">
              Already have an account?{" "}
              <a href="/" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

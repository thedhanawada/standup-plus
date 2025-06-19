"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Calendar, BarChart3, Users, Zap, ArrowRight, CheckCircle } from "lucide-react"
import LoginForm from "./LoginForm"

export function AuthOverlay({ show }: { show: boolean }) {
  const features = [
    {
      icon: Zap,
      title: "Quick Daily Logging",
      description: "Add your daily updates in seconds with smart tagging and project organization"
    },
    {
      icon: Calendar,
      title: "Visual Progress Tracking",
      description: "See your consistency with beautiful calendar views and streak tracking"
    },
    {
      icon: BarChart3,
      title: "AI-Powered Summaries",
      description: "Get intelligent weekly and monthly summaries of your progress"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share updates with your team and stay aligned on project goals"
    }
  ]

  const demoEntries = [
    {
      text: "Completed user authentication flow and fixed mobile responsiveness issues. Started working on the new dashboard components.",
      tags: ["frontend", "auth"],
      projects: ["webapp-v2"]
    },
    {
      text: "Reviewed 3 PRs, pair programmed with Sarah on the API optimization. Database queries are now 40% faster!",
      tags: ["backend", "performance"],
      projects: ["api-optimization"]
    },
    {
      text: "Led sprint planning meeting, defined user stories for next iteration. Team is aligned on Q1 priorities.",
      tags: ["planning", "leadership"],
      projects: ["sprint-planning"]
    }
  ]

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 overflow-y-auto"
        >
          <div className="container mx-auto px-4 py-8 lg:py-16">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
              
              {/* Left Column - Hero Content */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                {/* Hero Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                      <Sparkles className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      StandUp+
                    </span>
                  </div>
                  
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    Daily standups made 
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> effortless</span>
                  </h1>
                  
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Transform your daily updates into powerful insights. Track progress, maintain streaks, and keep your team aligned with beautiful, AI-powered standup management.
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                    >
                      <feature.icon className="h-6 w-6 text-purple-600 mb-2" />
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Demo Preview */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                >
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    See what daily updates look like
                  </h3>
                  <div className="space-y-3">
                    {demoEntries.slice(0, 2).map((entry, index) => (
                      <div key={index} className="text-sm">
                        <p className="text-gray-700 mb-2">{entry.text}</p>
                        <div className="flex flex-wrap gap-1">
                          {entry.tags?.map((tag) => (
                            <span key={tag} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                              #{tag}
                            </span>
                          ))}
                          {entry.projects?.map((project) => (
                            <span key={project} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {project}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                      + Track streaks, export reports, and get AI summaries
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Column - Auth Form */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="lg:pl-8"
              >
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto lg:max-w-none border border-white/20">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Start tracking today</h2>
                    <p className="text-gray-600">Join thousands of developers and teams already using StandUp+</p>
                  </div>
                  
                  <LoginForm />
                  
                  <div className="mt-8 space-y-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        Guest mode stores data locally. Sign in to sync across devices.
                      </p>
                    </div>
                    
                    {/* Social Proof */}
                    <div className="border-t border-gray-100 pt-6">
                      <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Real-time sync</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>AI-powered</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Team ready</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional CTAs */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 text-center space-y-4"
                >
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">✨ Pro tip</p>
                    <p className="text-sm text-gray-700">
                      Start with guest mode to explore all features, then sign in to keep your data forever.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 
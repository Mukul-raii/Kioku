"use client";

import Experience from "@/components/experience";
import { Squares } from "@/components/ui/squares-background";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-slate-950 relative ">
      {/* Background with squares animation */}
      <div className="fixed inset-0 w-full h-full">
        <Squares
          direction="down"
          speed={0.5}
          squareSize={90}
          borderColor="#333"
          hoverFillColor="#222"
        />
      </div>
      
      {/* Main content container */}
      <div className="relative z-10 max-w-7xl mx-auto h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Hero section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Dynamic text animation */}
          <div className="mb-10">
            <motion.div 
              className="flex flex-col gap-2 text-4xl md:text-6xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <div className="overflow-hidden">
                <motion.p 
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  className="bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text"
                >
                  More than Note Taking
                </motion.p>
              </div>
              <div className="overflow-hidden">
                <motion.p 
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.6, duration: 0.7 }}
                  className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text"
                >
                  More than Quiz
                </motion.p>
              </div>
              <div className="overflow-hidden">
                <motion.p 
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.8, duration: 0.7 }}
                  className="text-5xl md:text-7xl font-extrabold text-white"
                >
                  It's <span className="text-yellow-400">kioku</span>
                </motion.p>
              </div>
            </motion.div>
          </div>
          
          {/* Tagline and description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              Relearn Less. <span className="text-indigo-400">Retain More.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Master anything with AI-powered spaced repetition.
            </p>
            
            {/* Call to action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-all shadow-lg hover:shadow-indigo-500/40">
                Get Started
              </button>
              <button className="px-8 py-3 bg-transparent border border-gray-600 hover:border-gray-400 rounded-lg text-gray-300 hover:text-white font-medium transition-all">
                How It Works
              </button>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Features showcase preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="absolute bottom-8 w-full flex justify-center"
        >
          <div className="flex gap-4 text-sm text-gray-400">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
              AI-Powered
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
              Spaced Repetition
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              Smart Flashcards
            </div>
          </div>
        </motion.div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">

        <Experience />
      </div>
    </div>
  );
}
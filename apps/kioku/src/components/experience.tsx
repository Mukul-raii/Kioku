import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { BookOpen, Brain, Lightbulb, MessageCircle } from "lucide-react";

export default function Experience() {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/60 transition-colors">
            Explore
          </Badge>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Choose Your Practice
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Personalize your learning journey with our research-backed methods designed to optimize knowledge retention.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Reflect Card */}
          <Card className="overflow-hidden border border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="h-2 bg-blue-500"></div>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-blue-900/30">
                  <BookOpen className="h-6 w-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-100">
                  Reflect
                </h2>
              </div>
              <p className="text-slate-300">
                Anchor your thoughts, organize your notes, and build clarity with guided reflection prompts.
              </p>
            </CardContent>
          </Card>

          {/* Revise Card */}
          <Card className="overflow-hidden border border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="h-2 bg-purple-500"></div>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-purple-900/30">
                  <Brain className="h-6 w-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-100">
                  Revise
                </h2>
              </div>
              <p className="text-slate-300">
                Strengthen your long-term memory by revisiting key learnings through active recall sessions.
              </p>
            </CardContent>
          </Card>

          {/* Rewire Card */}
          <Card className="overflow-hidden border border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="h-2 bg-indigo-500"></div>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-indigo-900/30">
                  <Lightbulb className="h-6 w-6 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-100">
                  Rewire
                </h2>
              </div>
              <p className="text-slate-300">
                Uncover weak spots in your knowledge and reinforce them using spaced repetition techniques.
              </p>
            </CardContent>
          </Card>

          {/* Respond Card */}
          <Card className="overflow-hidden border border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="h-2 bg-green-500"></div>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-green-900/30">
                  <MessageCircle className="h-6 w-6 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-100">
                  Respond
                </h2>
              </div>
              <p className="text-slate-300">
                Challenge your understanding with personalized quiz cards and smart feedback loops.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
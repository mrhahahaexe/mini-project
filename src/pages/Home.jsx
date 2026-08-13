import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Trash2, ShieldAlert, MessageSquare, ArrowRight, Apple, Flame, LogIn } from 'lucide-react';

export default function Home({ user }) {
  const stats = [
    { id: 1, val: "1.3B Tons", label: "Food wasted globally every year", desc: "Equivalent to 1/3 of all food produced.", icon: Trash2, color: "text-rose-500 bg-rose-50 dark:bg-rose-950/30" },
    { id: 2, val: "$1,500", label: "Average household cost", desc: "Annual value of edible food thrown away per family.", icon: Trash2, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30" },
    { id: 3, val: "8-10%", label: "Global greenhouse emissions", desc: "Created by decomposing food in landfills.", icon: ShieldAlert, color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30" }
  ];

  const features = [
    { title: "Smart Recipe Matcher", desc: "Tell us what you have, and we'll calculate match scores to give you recipes you can make right now.", link: user ? "/search" : "/login?mode=signup", icon: Sparkles },
    { title: "AI Cooking Coach", desc: "Ask our conversational AI about safe substitutions, cooking temperatures, and meal ideas.", link: user ? "/chat" : "/login?mode=signup", icon: MessageSquare },
    { title: "Nutrition Tracker", desc: "Track calories, water intake, and macronutrients of meals you cook to reach your fitness goals.", link: user ? "/dashboard" : "/login?mode=signup", icon: Flame }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Decorative Blur Orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-400/25 dark:bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-400/20 dark:bg-orange-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary-100/60 dark:bg-primary-950/55 border border-primary-200/30 text-primary-700 dark:text-primary-400 text-xs font-bold uppercase tracking-wider animate-bounce">
              <Sparkles className="h-4 w-4" />
              <span>Zero-Waste Cooking AI</span>
            </div>
            
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-slate-900 dark:text-white leading-[1.1] sm:leading-[1.05]">
              Turn What's Left Into{' '}
              <span className="bg-gradient-to-r from-primary-600 to-emerald-500 dark:from-primary-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Something Delicious
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-350 max-w-xl mx-auto lg:mx-0 font-medium">
              Millions of households waste food simply because they don't know what to cook. Create an account to enter ingredients and let AI recommend the perfect recipe.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              {user ? (
                <>
                  <Link
                    to="/search"
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl font-bold bg-primary-600 hover:bg-primary-750 text-white shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-200 group"
                  >
                    <span>Find Recipes Now</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/chat"
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-200"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Chat with Chef AI</span>
                  </Link>
                </>
              ) : (
                <Link
                  to="/login?mode=signup"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl font-bold bg-primary-600 hover:bg-primary-750 text-white shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-200 group"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Get Started</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>

          {/* Hero Image / Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-800 animate-float">
              <img
                src="/hero_illustration.jpg"
                alt="Chef kitchen table with ingredients"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-bold uppercase">
                    <Apple className="h-4 w-4" />
                    <span>Ingredient First</span>
                  </div>
                  <h3 className="font-display font-bold text-lg">Smart Leftovers Rescue</h3>
                  <p className="text-xs text-slate-300 font-medium">Use everything in your fridge, save money, and save the planet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Food Waste Statistics */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200/50 dark:border-slate-800/40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white tracking-tight">
              Why Zero-Waste Cooking Matters
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Throwing away food isn't just bad for your pocket—it's one of the largest contributors to global environmental issues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.id} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                  <div className={`p-4 rounded-2xl w-fit ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="block font-display font-black text-3xl text-slate-900 dark:text-white">
                      {stat.val}
                    </span>
                    <span className="block font-semibold text-slate-700 dark:text-slate-350 text-sm">
                      {stat.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {stat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Breakdown Cards */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white tracking-tight">
            Key Application Features
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Everything you need to cook smarter, eat healthier, and reduce waste in your kitchen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Link
                key={idx}
                to={feature.link}
                className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-lg hover:border-primary-500/30 dark:hover:border-primary-500/20 transition-all duration-300"
              >
                <div className="p-3 bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-350 rounded-2xl w-fit group-hover:bg-primary-50 group-hover:text-primary-600 dark:group-hover:bg-primary-950/40 dark:group-hover:text-primary-400 transition-colors duration-200">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-slate-800 dark:text-slate-100 mt-6 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-450 mt-3 font-medium leading-relaxed">
                  {feature.desc}
                </p>
                <div className="flex items-center space-x-1 text-xs font-bold text-primary-600 dark:text-primary-400 mt-6 group-hover:translate-x-1.5 transition-transform duration-200">
                  <span>Explore</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Hero Tip CTA Banner */}
      <section className="mb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-r from-primary-600 to-emerald-600 rounded-3xl p-8 sm:p-12 md:p-16 text-white shadow-xl overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-80 h-80 rounded-full border-4 border-white/10 -z-0"></div>
          <div className="absolute left-0 top-0 -translate-x-1/4 -translate-y-1/4 w-60 h-60 rounded-full bg-white/5 -z-0"></div>
          
          <div className="relative z-10 max-w-2xl space-y-6">
            <h2 className="font-display font-black text-3xl sm:text-4xl">
              Zero Waste, Maximum Taste.
            </h2>
            <p className="text-primary-100 sm:text-lg font-medium leading-relaxed">
              Don't throw away expired food or brown bananas! Our database features guides on safe consumption and creative recipes for overripe items.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/tips"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl font-bold bg-white text-primary-700 hover:bg-slate-100 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Apple className="h-5 w-5 text-primary-600" />
                <span>Healthy Tips</span>
              </Link>
              <Link
                to="/safety"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl font-bold bg-primary-750 text-white hover:bg-primary-800 border border-primary-500/20 transition-all duration-200"
              >
                <ShieldAlert className="h-5 w-5" />
                <span>Food Safety Guides</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

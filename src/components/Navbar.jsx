import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, ChefHat, BookOpen, MessageSquare, ShieldAlert, Sparkles, LayoutDashboard, User, LogIn, LogOut } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check local storage or system preference
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  const publicNavItems = [
    { name: 'Food Safety', path: '/safety', icon: ShieldAlert },
    { name: 'Healthy Tips', path: '/tips', icon: BookOpen }
  ];

  const authNavItems = [
    { name: 'Find Recipes', path: '/search', icon: Sparkles },
    { name: 'AI Chat', path: '/chat', icon: MessageSquare },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Food Safety', path: '/safety', icon: ShieldAlert },
    { name: 'Healthy Tips', path: '/tips', icon: BookOpen }
  ];

  const navItems = user ? authNavItems : publicNavItems;

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const isAuthPage = location.pathname === '/login';

  return (
    <>
      <nav className="sticky top-0 z-50 w-full glass bg-white/70 dark:bg-slate-900/85 shadow-sm border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0 group">
              <div className="p-2 bg-gradient-to-tr from-primary-600 to-emerald-400 rounded-xl text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform duration-200">
                <ChefHat className="h-6 w-6" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-primary-600 to-emerald-600 dark:from-primary-400 dark:to-emerald-400 bg-clip-text text-transparent">
                LeftOver Chef
              </span>
            </Link>

            {/* Desktop Navigation Links (hidden on Auth page) */}
            {!isAuthPage && (
              <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-200 ${
                        active
                          ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-100/50 dark:border-primary-900/30'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-primary-500 transition-colors duration-200"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Login / User Status Button (hidden on Auth page) */}
              {!isAuthPage && (
                user ? (
                  <Link
                    to="/profile"
                    className="hidden sm:flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-xl border border-primary-200/50 dark:border-primary-900/40 bg-primary-50/60 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 font-bold text-xs hover:scale-[1.02] transition-all"
                  >
                    <img src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`} alt="Avatar" className="h-6 w-6 rounded-full bg-primary-200" />
                    <span className="truncate max-w-[90px]">{user.name}</span>
                  </Link>
                ) : (
                  <Link
                    to="/login?mode=signin"
                    className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-primary-600 hover:bg-primary-750 text-white font-bold text-xs shadow-md shadow-primary-500/10 hover:scale-105 transition-all"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                )
              )}

              {/* Hamburger Menu Button (mobile only, hidden on Auth page) */}
              {!isAuthPage && (
                <button
                  onClick={() => setIsOpen(true)}
                  className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850"
                  aria-label="Open Navigation Menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-out Drawer */}
      <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        />
        {/* Panel */}
        <div className={`absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between px-4 h-16 border-b border-slate-200 dark:border-slate-800">
            <span className="font-display font-bold text-lg text-slate-900 dark:text-white">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close Navigation Menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="px-2 py-3 space-y-1">
            {/* Account Banner in Drawer */}
            {user ? (
              <div className="p-3 mb-2 rounded-2xl bg-primary-50 dark:bg-primary-950/40 border border-primary-100/50 dark:border-primary-900/30 flex items-center justify-between">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity"
                >
                  <img src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`} alt="Avatar" className="h-8 w-8 rounded-full bg-primary-200 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</span>
                    <span className="block text-[10px] text-primary-600 dark:text-primary-400 font-semibold truncate">View Profile →</span>
                  </div>
                </Link>
                <button
                  onClick={() => { onLogout(); setIsOpen(false); }}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ml-2"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login?mode=signup"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center space-x-2 w-full mb-3 py-3 rounded-xl bg-primary-600 text-white font-bold text-sm shadow-md"
              >
                <LogIn className="h-4 w-4" />
                <span>Get Started</span>
              </Link>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    active
                      ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-100/50 dark:border-primary-900/30'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

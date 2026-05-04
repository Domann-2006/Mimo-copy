import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  MessageSquare, 
  User, 
  LogOut,
  Flame,
  Star
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../lib/firebase';
import { motion } from 'framer-motion';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { name: 'Community', href: '/community', icon: MessageSquare },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { profile, user } = useAuth();
  const location = useLocation();

  const handleSignOut = () => auth.signOut();

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Mesh Background Blobs */}
      <div className="mesh-blobs">
        <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-indigo-600/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[150px]" />
      </div>

      {/* Sidebar */}
      <aside className="w-24 m-6 glass rounded-[2.5rem] flex flex-col items-center py-10 gap-10 z-10 hidden md:flex">
        <Link to="/" className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 transition-transform hover:scale-110">
          <Star className="text-white w-7 h-7" />
        </Link>

        <nav className="flex flex-col gap-8">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`p-3 rounded-xl transition-all duration-300 relative group ${
                  isActive 
                    ? 'text-cyan-400 bg-white/5 shadow-inner' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <item.icon className="w-6 h-6" />
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-cyan-400 rounded-full"
                  />
                )}
                {/* Tooltip */}
                <span className="absolute left-full ml-4 px-3 py-1 bg-black/90 text-white text-[10px] uppercase font-bold tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="mt-auto mb-4 flex flex-col items-center gap-4">
            <button
              onClick={handleSignOut}
              className="p-3 text-slate-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 rounded-2xl border-2 border-cyan-500/50 p-0.5 overflow-hidden">
              <img 
                src={profile?.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${profile?.displayName}`} 
                className="w-full h-full rounded-[14px] object-cover bg-slate-800" 
                alt="Profile"
              />
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 pr-6 py-6 overflow-hidden relative z-10">
        <header className="flex justify-between items-center glass rounded-[2rem] px-8 py-5 mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Welcome back, {profile?.displayName?.split(' ')[0]}!
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5 tracking-wide">
              You're on a <span className="text-orange-400 font-bold">{profile?.streak} day streak</span>. Keep it up!
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-5 py-2.5 border border-white/5">
              <span className="text-orange-400 font-bold text-lg">🔥 {profile?.streak || 0}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Streak</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-5 py-2.5 border border-white/5">
              <span className="text-cyan-400 font-bold text-lg">⚡ {profile?.points || 0}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">XP</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-5 py-2.5 border border-white/5">
              <span className="text-indigo-400 font-bold text-lg">💎 {profile?.level || 1}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Level</span>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={location.key}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </section>
      </main>
    </div>
  );
}

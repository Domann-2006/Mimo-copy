import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Zap, Users } from 'lucide-react';

export default function Login() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 font-sans relative overflow-hidden">
      {/* Mesh Background Blobs */}
      <div className="mesh-blobs">
        <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-indigo-600/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card p-12 relative z-10"
      >
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400 blur-2xl opacity-20" />
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-cyan-500/20 transform rotate-12 relative">
              <Star className="text-white w-10 h-10" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-transparent">
              CodeQuest
            </h1>
            <p className="text-slate-400 font-medium text-sm tracking-wide">
              Master the future of technology <br />in high definition.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/5">
              <Zap className="w-6 h-6 mb-2 text-yellow-500" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Fast Lab</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/5">
              <Users className="w-6 h-6 mb-2 text-cyan-500" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Live Coop</span>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-cyan-500/10 flex items-center justify-center space-x-3 group"
          >
            <ShieldCheck className="w-6 h-6 group-hover:animate-pulse" />
            <span>ENTER THE ACADEMY</span>
          </button>

          <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-slate-600">
            Secure Neural Link Established
          </p>
        </div>
      </motion.div>
    </div>
  );
}

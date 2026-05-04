import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { UserProfile } from '../types';

export default function Leaderboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => doc.data() as UserProfile));
    });
    return unsubscribe;
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-24">
      <div className="text-center space-y-4">
        <div className="inline-flex p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-3xl mb-4 relative group">
          <div className="absolute inset-0 bg-cyan-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <Trophy className="w-14 h-14 text-cyan-400 relative z-10" />
        </div>
        <h1 className="text-5xl font-black uppercase italic tracking-tighter">Elite Registry</h1>
        <p className="text-slate-500 font-medium tracking-wide">Competition drives evolution. Assert your dominance.</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="divide-y divide-white/5">
          {users.map((u, i) => (
            <motion.div
              key={u.uid}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-10 hover:bg-white/[0.03] transition-colors relative group"
            >
              <div className="flex items-center gap-10 relative z-10">
                <div className={`w-10 text-center font-black text-3xl tabular-nums ${i < 3 ? 'text-cyan-400' : 'opacity-10'}`}>
                  {i + 1}
                </div>
                
                <div className="relative">
                  <div className="w-20 h-20 rounded-[2rem] overflow-hidden border-2 border-white/10 group-hover:border-cyan-500/50 transition-colors">
                    <img 
                      src={u.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${u.displayName}`} 
                      className="w-full h-full object-cover bg-slate-800"
                      alt={u.displayName}
                    />
                  </div>
                  {i === 0 && (
                    <motion.div
                      animate={{ rotate: [12, -12, 12] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Crown className="absolute -top-4 -right-4 w-10 h-10 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]" />
                    </motion.div>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">{u.displayName}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="px-3 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded text-[10px] font-black uppercase tracking-widest">
                      Tier {u.level}
                    </span>
                    <div className="flex items-center gap-2 text-orange-500">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">In Ascension</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right flex flex-col justify-end">
                <p className="text-5xl font-black tabular-nums bg-gradient-to-br from-white to-slate-600 bg-clip-text text-transparent italic leading-[0.8] mb-2">{u.points}</p>
                <p className="text-[10px] uppercase font-black tracking-[0.2rem] text-slate-600">Total XP Energy</p>
              </div>

              {/* Hover effect highlight */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

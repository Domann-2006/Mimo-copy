import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  Rocket, 
  Flame, 
  Trophy, 
  ArrowRight,
  Code2,
  Cpu,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

const featuredCourses = [
  { id: 'js-begin', title: 'JavaScript Mastery', lang: 'JS', color: 'bg-yellow-400', icon: Code2, desc: 'Learn the language of the web.' },
  { id: 'py-found', title: 'Python Foundations', lang: 'PY', color: 'bg-blue-500', icon: Cpu, desc: 'The perfect start for beginners.' },
  { id: 'web-dev', title: 'Fullstack Web', lang: 'WEB', color: 'bg-green-500', icon: Globe, desc: 'Build modern applications.' },
];

export default function Dashboard() {
  const { profile } = useAuth();

  return (
    <div className="space-y-10 pb-12">
      {/* Active Lesson Hero */}
      <section className="glass-card p-10 flex flex-col relative overflow-hidden group min-h-[350px]">
        <div className="absolute -right-24 -top-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] group-hover:bg-cyan-500/20 transition-all duration-700" />
        
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-2xl gap-6">
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.3em] bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">
              In Progress
            </span>
          </div>

          <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
            Mastering <br />
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              Neural Systems
            </span>
          </h2>
          
          <p className="text-slate-400 text-lg leading-relaxed max-w-md">
            Unit 4: Advanced Logic Gates. Dive into the core architectures that power the modern world.
          </p>

          <div className="pt-4 flex items-center gap-6">
             <Link 
              to="/lesson/demo"
              className="px-8 py-4 bg-white text-slate-950 font-black rounded-2xl hover:bg-cyan-50 transition-all flex items-center gap-3 group"
            >
              <span>CONTINUE LAB</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Progress Bar at bottom */}
        <div className="absolute bottom-10 left-10 right-10 space-y-3">
          <div className="flex justify-between items-end">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Curriculum Completion</p>
            <p className="text-xl font-black text-cyan-400 italic">68%</p>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '68%' }}
              className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
            />
          </div>
        </div>
      </section>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Network Streak', value: profile?.streak || 0, unit: 'Days', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Total Energy', value: profile?.points || 0, unit: 'XP', icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          { label: 'Access Tier', value: profile?.level || 1, unit: 'Level', icon: Star, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 group hover:border-white/20 transition-all"
          >
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-6 border border-white/5`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black tabular-nums">{stat.value}</p>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{stat.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Catalog Preview */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">Recommended Modules</h2>
          <Link to="/courses" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
            View Repository
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCourses.map((course, i) => (
            <Link key={course.id} to={`/lesson/demo`}>
              <motion.div
                whileHover={{ y: -5 }}
                className="glass-card p-10 flex flex-col h-full group transition-all hover:bg-white/[0.08]"
              >
                <div className={`${course.color}/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-white/5 relative`}>
                  <div className={`absolute inset-0 ${course.color} blur-xl opacity-20`} />
                  <course.icon className={`w-8 h-8 text-white relative z-10`} />
                </div>
                
                <h3 className="text-2xl font-black uppercase tracking-tight mb-3 group-hover:text-cyan-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">
                  {course.desc}
                </p>
                
                <div className="flex items-center text-[10px] font-bold tracking-[0.2em] uppercase mt-auto text-slate-500 group-hover:text-white transition-all">
                  <span>Infiltrate</span>
                  <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

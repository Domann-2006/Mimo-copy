import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Cpu, 
  Globe, 
  Database, 
  Layers, 
  Search,
  Filter,
  Star as StarIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Course } from '../types';

const INITIAL_COURSES: Course[] = [
  { id: 'js-begin', title: 'JavaScript Mastery', lang: 'JS', difficulty: 'beginner', lessonsCount: 12, description: 'Master the fundamentals of the worlds most popular language.', image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=60' },
  { id: 'py-found', title: 'Python Foundations', lang: 'PY', difficulty: 'beginner', lessonsCount: 15, description: 'Learn automation, data science, and web development with Python.', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60' },
  { id: 'react-adv', title: 'React Performance', lang: 'JS', difficulty: 'advanced', lessonsCount: 10, description: 'Deep dive into hooks, reconciliation, and rendering optimization.', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60' },
  { id: 'sql-data', title: 'SQL & Database Design', lang: 'SQL', difficulty: 'intermediate', lessonsCount: 8, description: 'Store, query, and manage data like a professional engineer.', image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60' },
];

export default function CourseList() {
  const [courses] = useState<Course[]>(INITIAL_COURSES);
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [search, setSearch] = useState('');

  const filteredCourses = courses.filter(c => 
    (filter === 'all' || c.difficulty === filter) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter">Repository</h1>
          <p className="text-slate-400 font-medium tracking-wide">Available neural modules for infiltration.</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search databases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-6 py-3 glass rounded-2xl text-sm focus:outline-none focus:border-white/20 transition-colors w-[240px] text-white"
            />
          </div>
          <div className="flex p-1 bg-white/5 border border-white/5 rounded-2xl">
            {['all', 'beginner', 'intermediate', 'advanced'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-white shadow-sm text-black' : 'text-slate-500 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredCourses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group grid grid-cols-1 md:grid-cols-5 glass-card overflow-hidden hover:bg-white/[0.08] transition-all"
          >
            <div className="md:col-span-2 relative overflow-hidden">
              <img 
                src={course.image} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" 
                alt={course.title} 
              />
              <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent transition-colors" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 text-cyan-400">
                  {course.language}
                </span>
              </div>
            </div>
            
            <div className="md:col-span-3 p-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-black leading-tight uppercase italic tracking-tighter group-hover:text-cyan-400 transition-colors">{course.title}</h3>
                <div className="flex items-center space-x-1 text-yellow-500">
                  <StarIcon className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold font-sans">4.9</span>
                </div>
              </div>
              
              <p className="text-slate-400 text-sm mb-6 flex-1 leading-relaxed">{course.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                <div className="space-y-1 text-left">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-600">Complexity</p>
                  <p className="text-sm font-black uppercase tracking-tight text-slate-300">{course.lessonsCount} Core Concepts</p>
                </div>
                <Link 
                  to={`/lesson/${course.id}`}
                  className="bg-white text-slate-950 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform"
                >
                  Initiate
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

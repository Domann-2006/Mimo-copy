import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Share2, 
  ThumbsUp, 
  Plus,
  Send,
  User as UserIcon,
  Code as CodeIcon,
  HelpCircle
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { ForumPost } from '../types';
import { formatDistanceToNow } from 'date-fns';

export default function Community() {
  const { profile, user } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [activeTab, setActiveTab] = useState<'discussion' | 'project' | 'help'>('discussion');

  useEffect(() => {
    const q = query(collection(db, 'forum'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ForumPost)));
    });
    return unsubscribe;
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent || !newPostTitle || !user) return;
    
    setIsPosting(true);
    try {
      await addDoc(collection(db, 'forum'), {
        title: newPostTitle,
        content: newPostContent,
        authorId: user.uid,
        authorName: profile?.displayName || 'Anonymous',
        authorPhoto: user.photoURL || '',
        tags: [],
        type: activeTab,
        upvotes: 0,
        createdAt: new Date().toISOString()
      });
      setNewPostTitle('');
      setNewPostContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <div className="space-y-2">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter">Broadcasting</h1>
        <p className="text-slate-400 font-medium tracking-wide">Establish neural links with other academy students.</p>
      </div>

      {/* Post Composer */}
      <div className="glass-card p-10 shadow-2xl shadow-cyan-500/5">
        <form onSubmit={handlePost} className="space-y-8">
          <div className="flex p-1 bg-white/5 border border-white/5 rounded-2xl w-fit">
            {(['discussion', 'project', 'help'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTab(t)}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === t ? 'bg-white text-slate-950 shadow-inner' : 'text-slate-500 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <input 
            type="text" 
            placeholder="SUBJECT LINE"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            className="w-full text-3xl font-black uppercase italic tracking-tighter border-none focus:ring-0 placeholder:text-slate-800 bg-transparent text-white"
          />
          
          <textarea 
            placeholder="Transmitting data..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows={3}
            className="w-full border-none focus:ring-0 text-slate-300 bg-transparent resize-none font-medium leading-relaxed"
          />

          <div className="flex items-center justify-between pt-8 border-t border-white/5">
            <div className="flex items-center space-x-6 text-slate-600">
              <CodeIcon className="w-5 h-5 cursor-pointer hover:text-cyan-400 transition-colors" />
              <Share2 className="w-5 h-5 cursor-pointer hover:text-indigo-400 transition-colors" />
            </div>
            <button
              disabled={isPosting || !newPostContent}
              className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 shadow-xl shadow-white/5"
            >
              <span>{isPosting ? 'TRANSFUSING...' : 'UPLINK DATA'}</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Feed */}
      <div className="space-y-8">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-10 hover:border-white/20 transition-all hover:bg-white/[0.02]"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/5 p-0.5 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center">
                  {post.authorPhoto ? (
                    <img src={post.authorPhoto} className="w-full h-full object-cover rounded-[14px]" alt={post.authorName} />
                  ) : (
                    <UserIcon className="w-7 h-7 text-slate-700" />
                  )}
                </div>
                <div>
                  <h4 className="font-black text-sm tracking-tight text-white uppercase italic">{post.authorName}</h4>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-slate-500 mt-1">
                    Node Active {post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) : 'Just now'} ago
                  </p>
                </div>
              </div>
              <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/5 ${
                post.type === 'project' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                post.type === 'help' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
              }`}>
                {post.type}
              </span>
            </div>

            <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 leading-none text-white">{post.title}</h3>
            <p className="text-slate-400 font-medium leading-relaxed mb-10">{post.content}</p>

            <div className="flex items-center gap-8 border-t border-white/5 pt-8">
              <button className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors group">
                <ThumbsUp className="w-4 h-4 group-hover:scale-125 transition-transform" />
                <span className="text-[10px] font-black tracking-widest">{post.upvotes} UPVOTES</span>
              </button>
              <button className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors group">
                <MessageSquare className="w-4 h-4 group-hover:scale-125 transition-transform" />
                <span className="text-[10px] font-black tracking-widest">12 BURSTS</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

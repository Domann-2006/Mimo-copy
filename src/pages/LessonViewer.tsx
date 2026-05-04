import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  ChevronLeft,
  MessageSquareCode,
  Sparkles
} from 'lucide-react';
import { getCodeHelp } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc, increment, arrayUnion } from 'firebase/firestore';

export default function LessonViewer() {
  const { id } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState('// Write your code here...\nconsole.log("Hello CodeQuest!");');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);

  // Mock lesson data
  const lesson = {
    title: "Introduction to Variables",
    content: `
      ## The Power of Variables
      
      Variables are like containers for storing data. In JavaScript, we usually use \`let\` or \`const\`.
      
      ### Task:
      Create a variable named \`score\` and set its value to \`100\`. Then, print it using \`console.log\`.
    `,
    solution: "let score = 100;\nconsole.log(score);",
    initialCode: "let score = 0;\n// Update the score and log it\n"
  };

  const handleRun = () => {
    setIsRunning(true);
    setIsCorrect(null);
    let logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args) => {
      logs.push(args.map(a => String(a)).join(' '));
    };

    try {
      new Function(code)();
      setOutput(logs.join('\n'));
      
      if (code.includes('score = 100') || code.includes('score=100')) {
        setIsCorrect(true);
        handleSuccess();
      } else {
        setIsCorrect(false);
      }
    } catch (err) {
      setOutput(`Error: ${err instanceof Error ? err.message : String(err)}`);
      setIsCorrect(false);
    } finally {
      console.log = originalLog;
      setIsRunning(false);
    }
  };

  const handleSuccess = async () => {
    if (!profile) return;
    const userRef = doc(db, 'users', profile.uid);
    await updateDoc(userRef, {
      points: increment(10),
      streak: increment(1),
      lastActive: new Date().toISOString()
    });
  };

  const askAi = async () => {
    setIsAskingAi(true);
    const hint = await getCodeHelp(code, output, lesson.title);
    setAiHint(hint || "Try checking your syntax!");
    setIsAskingAi(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] glass rounded-[2.5rem] overflow-hidden">
      {/* Lesson Header */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-white/5">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h2 className="font-black italic uppercase tracking-tight text-sm">
              {lesson.title}
            </h2>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              Module 01 • Fundamental Logic
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="w-1/12 h-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Instruction Section */}
        <div className="w-1/3 border-r border-white/10 flex flex-col bg-white/[0.02]">
          <div className="flex-1 overflow-y-auto p-10 space-y-6">
             <div 
              className="prose prose-invert prose-sm max-w-none prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter text-slate-400"
              dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br/>') }} 
            />
          </div>
          
          <div className="p-8 space-y-4">
            <button 
              onClick={askAi}
              disabled={isAskingAi}
              className="w-full flex items-center justify-center gap-3 py-4 glass border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50 group"
            >
              {isAskingAi ? (
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-400 group-hover:animate-pulse" />
                  <span>Request Hint</span>
                </>
              )}
            </button>

            <AnimatePresence>
              {aiHint && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-cyan-500/10 border border-cyan-500/20 p-5 rounded-2xl text-[11px] leading-relaxed relative text-cyan-200/80 italic"
                >
                  <button onClick={() => setAiHint(null)} className="absolute top-2 right-2 text-cyan-400 opacity-50 hover:opacity-100">×</button>
                  {aiHint}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Code Editor Section */}
        <div className="flex-1 flex flex-col bg-slate-900/50">
          <div className="h-12 border-b border-white/5 flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">Execution Chamber</span>
            </div>
            <button 
              onClick={handleRun}
              disabled={isRunning}
              className="bg-cyan-500 text-slate-950 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isRunning ? 'Initiating...' : 'Execute'}</span>
            </button>
          </div>

          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 24 },
                fontFamily: "'JetBrains Mono', monospace",
                backgroundColor: 'transparent',
                lineNumbers: 'on',
                glyphMargin: false,
                folding: false,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 0,
              }}
            />
          </div>

          <div className="h-1/3 bg-black/40 border-t border-white/10 flex flex-col relative overflow-hidden">
            <div className="h-8 border-b border-white/5 px-6 flex items-center">
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-600">Terminal Output</span>
            </div>
            <div className="flex-1 p-8 font-mono text-[13px] overflow-y-auto text-cyan-100/60 leading-relaxed">
              {output || <span className="opacity-20 italic font-sans uppercase">Awaiting system response...</span>}
            </div>
            
            <AnimatePresence>
              {isCorrect !== null && (
                <motion.div 
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  className={`absolute inset-x-0 bottom-0 p-8 flex items-center justify-between backdrop-blur-2xl border-t ${isCorrect ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'}`}
                >
                  <div className="flex items-center gap-5">
                    <div className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                      {isCorrect ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
                    </div>
                    <div className="text-left">
                      <p className={`font-black uppercase italic text-2xl tracking-tighter leading-none ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {isCorrect ? 'Validation Success' : 'Sequence Error'}
                      </p>
                      <p className="text-xs text-slate-300 font-medium mt-1">
                        {isCorrect ? 'Identity verified. Redirecting to next node.' : 'Check the log and recalibrate your approach.'}
                      </p>
                    </div>
                  </div>
                  {isCorrect && (
                    <button 
                      onClick={() => navigate('/')}
                      className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
                    >
                      <span>NEXT NODE</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function Code2({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

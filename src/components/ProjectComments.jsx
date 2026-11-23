import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Send, User, MessageSquare, Loader2, LogIn } from 'lucide-react';

const MOCK_COMMENTS = [
  { id: 'm1', authorName: 'Alice V.', content: 'Just completed this project! Implementing SGD from scratch really solidified the math for me.', timestamp: { toDate: () => new Date(Date.now() - 3600000 * 2) } },
  { id: 'm2', authorName: 'Bob K.', content: 'Make sure you double check the derivative formulas before writing the backpropagation loop, had a small sign bug.', timestamp: { toDate: () => new Date(Date.now() - 3600000 * 24) } }
];

export function ProjectComments({ projectId }) {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setUsingMock(false);

    try {
      const q = query(
        collection(db, 'project-comments'),
        where('projectId', '==', projectId),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const list = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });
          setComments(list.length > 0 ? list : MOCK_COMMENTS);
          setIsLoading(false);
        },
        (error) => {
          console.warn('Firestore fallback: using mock comments.', error);
          setComments(MOCK_COMMENTS);
          setUsingMock(true);
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      setComments(MOCK_COMMENTS);
      setUsingMock(true);
      setIsLoading(false);
    }
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    const commentData = {
      projectId,
      authorId: currentUser.uid,
      authorName: (currentUser.displayName || currentUser.email?.split('@')[0] || 'learner').slice(0, 60),
      content: newComment.trim().slice(0, 2000),
      timestamp: serverTimestamp()
    };

    setNewComment('');

    if (usingMock) {
      setComments(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          authorName: commentData.authorName,
          content: commentData.content,
          timestamp: { toDate: () => new Date() }
        }
      ]);
      return;
    }

    try {
      await addDoc(collection(db, 'project-comments'), commentData);
    } catch (err) {
      console.error('Failed to save comment:', err);
    }
  };

  return (
    <div className="mt-4 p-4 bg-bg-raise rounded-xl border border-border-line space-y-4 animate-slide-up">
      <div className="flex items-center gap-2 border-b border-border-line pb-2">
        <MessageSquare size={16} className="text-phase-violet" />
        <h4 className="text-xs font-mono text-text-main font-bold uppercase tracking-wider">Community Project Discussion</h4>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 size={16} className="animate-spin text-phase-violet" />
        </div>
      ) : (
        <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-1">
          {comments.map((c) => (
            <div key={c.id} className="text-xs bg-surface p-3 rounded-lg border border-border-line space-y-1">
              <div className="flex justify-between items-center text-[10px] text-text-faint">
                <span className="font-bold text-text-dim flex items-center gap-1">
                  <User size={10} />
                  {c.authorName}
                </span>
                <span>{c.timestamp?.toDate ? c.timestamp.toDate().toLocaleDateString() : 'Just now'}</span>
              </div>
              <p className="text-text-main leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Share an insight or ask a question..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 bg-surface border border-border-line rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-phase-violet focus:ring-1 focus:ring-phase-violet/20"
          />
          <button
            type="submit"
            className="p-2 rounded-lg bg-phase-violet text-white hover:bg-phase-violet/85 transition-colors cursor-pointer"
            aria-label="Send comment"
          >
            <Send size={12} />
          </button>
        </form>
      ) : (
        <div className="text-[11px] text-text-faint text-center py-2 border-t border-dashed border-border-line">
          🔒 Please log in to join the discussion.
        </div>
      )}
    </div>
  );
}

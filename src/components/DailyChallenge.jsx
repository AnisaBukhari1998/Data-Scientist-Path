import { useState, useMemo, useCallback } from 'react';
import { Zap, CheckCircle2, RotateCcw, Code, Clock } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { playClick, playSuccess } from '../utils/audioEngine';

/* ─── Challenge Pool (45 High-Quality Questions) ─── */
const CHALLENGES = [
  { id: 1, type: 'Python', question: 'What does `zip(a, b)` return in Python?', answer: 'An iterator of tuples pairing elements from a and b by index.', difficulty: 'Easy' },
  { id: 2, type: 'SQL', question: 'What is the difference between WHERE and HAVING?', answer: 'WHERE filters rows before grouping. HAVING filters groups after GROUP BY.', difficulty: 'Easy' },
  { id: 3, type: 'Stats', question: 'What is the Central Limit Theorem?', answer: 'The sampling distribution of the mean approaches a normal distribution as sample size increases, regardless of the population distribution.', difficulty: 'Medium' },
  { id: 4, type: 'ML', question: 'Explain the bias-variance tradeoff.', answer: 'Bias = error from simplifying assumptions (underfitting). Variance = error from sensitivity to training data (overfitting). We aim to minimize both.', difficulty: 'Medium' },
  { id: 5, type: 'Python', question: 'What is a decorator in Python?', answer: 'A function that takes another function as input and extends its behavior without modifying it. Uses @decorator syntax.', difficulty: 'Medium' },
  { id: 6, type: 'SQL', question: 'What are window functions? Give an example.', answer: 'Functions that perform calculations across a set of rows related to the current row. Example: ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC).', difficulty: 'Hard' },
  { id: 7, type: 'Stats', question: 'What is a p-value?', answer: 'The probability of observing results at least as extreme as the observed, assuming the null hypothesis is true. Lower p = stronger evidence against H0.', difficulty: 'Easy' },
  { id: 8, type: 'ML', question: 'How does gradient descent work?', answer: 'Iteratively updates parameters in the direction of steepest descent of the loss function. Step size controlled by learning rate.', difficulty: 'Medium' },
  { id: 9, type: 'Python', question: 'What is the GIL and why does it matter?', answer: 'Global Interpreter Lock — a mutex in CPython that allows only one thread to execute Python bytecode at a time, limiting true parallelism for CPU-bound tasks.', difficulty: 'Hard' },
  { id: 10, type: 'ML', question: 'What is cross-validation and why use it?', answer: 'A technique to evaluate models by partitioning data into k folds, training on k-1 and validating on 1, rotating through all folds. Reduces overfitting to a single split.', difficulty: 'Easy' },
  { id: 11, type: 'Stats', question: 'Explain Type I vs Type II errors.', answer: 'Type I (False Positive): Rejecting a true null hypothesis. Type II (False Negative): Failing to reject a false null hypothesis.', difficulty: 'Easy' },
  { id: 12, type: 'Python', question: 'What is the difference between deepcopy and shallow copy?', answer: 'Shallow copy creates a new object but references the same nested objects. Deepcopy recursively copies all nested objects, creating truly independent copies.', difficulty: 'Medium' },
  { id: 13, type: 'ML', question: 'What is regularization? Name two types.', answer: 'A technique to prevent overfitting by adding a penalty term to the loss. L1 (Lasso) adds absolute weights, L2 (Ridge) adds squared weights.', difficulty: 'Medium' },
  { id: 14, type: 'SQL', question: 'What is a CTE and when would you use one?', answer: 'Common Table Expression — a named temporary result set defined with WITH clause. Useful for readable recursive queries and breaking down complex queries.', difficulty: 'Medium' },
  { id: 15, type: 'ML', question: 'What is the difference between Random Forest and Gradient Boosting?', answer: 'Random Forest builds independent trees in parallel and averages their predictions (Bagging). Gradient Boosting builds sequential trees, each correcting errors of the previous one (Boosting).', difficulty: 'Medium' },
  { id: 16, type: 'SQL', question: 'Explain the difference between UNION and UNION ALL.', answer: 'UNION combines results of two queries and removes duplicate rows. UNION ALL combines all rows including duplicates, which is much faster.', difficulty: 'Easy' },
  { id: 17, type: 'Python', question: 'What is a generator in Python and why is it useful?', answer: 'A function that returns an iterator using the `yield` keyword. It evaluates items lazily, saving memory compared to list data structures.', difficulty: 'Medium' },
  { id: 18, type: 'Stats', question: 'What is overfitting and how do you detect it?', answer: 'Overfitting is when a model learns noise in training data. It is detected when training performance is high but validation/testing performance is poor.', difficulty: 'Easy' },
  { id: 19, type: 'ML', question: 'What is the role of activation functions in Neural Networks?', answer: 'They introduce non-linearities into the network, allowing it to learn complex, non-linear boundaries rather than simple linear mappings.', difficulty: 'Medium' },
  { id: 20, type: 'SQL', question: 'How do you handle NULL values in a SQL aggregation?', answer: 'Aggregations like SUM/AVG ignore NULLs. To replace them, use COALESCE(column, fallback_value) or IFNULL/ISNULL depending on database dialect.', difficulty: 'Easy' },
  { id: 21, type: 'Stats', question: 'Explain covariance vs correlation.', answer: 'Covariance measures the direction of a linear relationship between variables. Correlation normalizes this between -1 and 1 to measure strength and direction.', difficulty: 'Medium' },
  { id: 22, type: 'ML', question: 'What is the difference between K-Means and KNN?', answer: 'K-Means is an unsupervised clustering algorithm. KNN is a supervised classification/regression algorithm based on spatial distance to nearest neighbors.', difficulty: 'Easy' },
  { id: 23, type: 'Python', question: 'What is list comprehension? Give an example.', answer: 'A concise way to create lists. Example: `squares = [x**2 for x in range(10)]`.', difficulty: 'Easy' },
  { id: 24, type: 'ML', question: 'Explain TF-IDF and its purpose in NLP.', answer: 'Term Frequency-Inverse Document Frequency — measures how important a word is to a document relative to a corpus. Helps filter common filler words.', difficulty: 'Medium' },
  { id: 25, type: 'Stats', question: 'What is multicollinearity and why is it an issue?', answer: 'When independent variables in a regression model are highly correlated. It increases standard errors of coefficients, making parameter estimates unstable.', difficulty: 'Hard' },
  { id: 26, type: 'ML', question: 'What is PCA (Principal Component Analysis)?', answer: 'An unsupervised dimensionality reduction technique that projects data onto orthogonal axes of maximum variance (principal components).', difficulty: 'Medium' },
  { id: 27, type: 'ML', question: 'Explain the ROC curve and AUC score.', answer: 'ROC plots True Positive Rate vs False Positive Rate at different thresholds. AUC measures the area under this curve. 1 is perfect classifier, 0.5 is random.', difficulty: 'Hard' },
  { id: 28, type: 'ML', question: 'What is an Out-of-Bag (OOB) error in Random Forest?', answer: 'An internal validation score. Each tree is trained on a bootstrap sample; OOB error is measured by evaluating trees on data they did not see.', difficulty: 'Hard' },
  { id: 29, type: 'SQL', question: 'What is a self-join? Explain a scenario.', answer: 'A query joining a table to itself. Useful for querying hierarchical relationships, e.g., finding the manager name of an employee in an employee table.', difficulty: 'Medium' },
  { id: 30, type: 'Stats', question: 'What is a parameter vs a statistic?', answer: 'A parameter is a descriptive metric of an entire population. A statistic is a descriptive metric calculated from a sample of that population.', difficulty: 'Easy' },
  { id: 31, type: 'Stats', question: 'What is A/B testing?', answer: 'A randomized experiment comparing two versions (A and B) of a variable to determine which performs better using statistical hypothesis testing.', difficulty: 'Easy' },
  { id: 32, type: 'ML', question: 'Explain precision and recall.', answer: 'Precision = TP / (TP + FP) (minimizes false alarms). Recall = TP / (TP + FN) (minimizes missed targets). Optimize precision for spam detection, recall for medical diagnosis.', difficulty: 'Medium' },
  { id: 33, type: 'Python', question: 'What is *args and **kwargs in Python?', answer: '*args allows passing a variable number of positional arguments as a tuple. **kwargs allows passing a variable number of keyword arguments as a dict.', difficulty: 'Medium' },
  { id: 34, type: 'Python', question: 'What is a lambda function in Python?', answer: 'An anonymous, inline single-expression function. Example: `add_one = lambda x: x + 1`. Useful for passing short callbacks.', difficulty: 'Easy' },
  { id: 35, type: 'SQL', question: 'Explain difference between RANK() and DENSE_RANK().', answer: 'RANK() leaves gaps in ordering after duplicate ranks (e.g., 1, 2, 2, 4). DENSE_RANK() leaves no gaps (e.g., 1, 2, 2, 3).', difficulty: 'Medium' },
  { id: 36, type: 'ML', question: 'What is transfer learning?', answer: 'A technique where a model pre-trained on a massive dataset (e.g., ImageNet) is fine-tuned on a smaller, target dataset to speed up training and boost accuracy.', difficulty: 'Medium' },
  { id: 37, type: 'ML', question: 'Explain SVM margins.', answer: 'Support Vector Machines find the hyperplane that maximizes the margin (distance between support vectors of different classes). Hard margin requires zero errors; soft margin allows some.', difficulty: 'Hard' },
  { id: 38, type: 'ML', question: 'What is learning rate scheduling?', answer: 'Adjusting the learning rate during training. Typically, it is decayed over epochs (e.g., cosine annealing) to allow fine-tuning as loss converges.', difficulty: 'Medium' },
  { id: 39, type: 'ML', question: 'Explain early stopping.', answer: 'A regularization technique that monitors validation loss during training and halts optimization once validation performance begins to degrade.', difficulty: 'Easy' },
  { id: 40, type: 'SQL', question: 'How does an index speed up queries? What is the trade-off?', answer: 'Creates lookup trees (e.g., B-Trees) so rows are found without full table scans. Trade-off: slows down INSERT/UPDATE writes and consumes memory.', difficulty: 'Hard' },
  { id: 41, type: 'Stats', question: 'What is probability vs likelihood?', answer: 'Probability calculates chance of outcomes given fixed parameters. Likelihood evaluates parameters given observed data.', difficulty: 'Hard' },
  { id: 42, type: 'Stats', question: 'Explain Bayes Theorem.', answer: 'P(A|B) = P(B|A) * P(A) / P(B). Calculates posterior probability of event A given prior knowledge of conditions related to the event.', difficulty: 'Medium' },
  { id: 43, type: 'ML', question: 'What is Supervised vs Unsupervised learning?', answer: 'Supervised learning trains on labeled inputs (targets provided). Unsupervised learning trains on unlabeled data to find hidden clusters/structures.', difficulty: 'Easy' },
  { id: 44, type: 'ML', question: 'Explain MAE vs MSE loss functions.', answer: 'MAE (L1 loss) is the sum of absolute errors; it is robust to outliers. MSE (L2 loss) is the sum of squared errors; it penalizes large errors heavily.', difficulty: 'Medium' },
  { id: 45, type: 'ML', question: 'What is data leakage and how do you prevent it?', answer: 'When training data contains information about the target that wouldn\'t be available during inference. Prevent by separating test splits before preprocessing.', difficulty: 'Hard' }
];

function getDailyChallenge() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  return CHALLENGES[dayOfYear % CHALLENGES.length];
}

export function DailyChallenge() {
  const challenge = useMemo(() => getDailyChallenge(), []);
  const { addXp } = useProgress();
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem('daily-challenge-date');
    return saved === new Date().toDateString();
  });

  const handleReveal = () => {
    playClick();
    setShowAnswer(true);
  };

  const handleComplete = useCallback(() => {
    localStorage.setItem('daily-challenge-date', new Date().toDateString());
    setCompleted(true);
    // Synthesize arpeggio arpeggio chime!
    playSuccess();
    // Award +25 XP
    addXp(25);
  }, [addXp]);

  const difficultyColor = challenge.difficulty === 'Easy' ? 'text-phase-teal bg-phase-teal/10' :
    challenge.difficulty === 'Medium' ? 'text-phase-amber bg-phase-amber/10' : 'text-phase-brick bg-phase-brick/10';

  return (
    <div className="flat-card p-6 border border-border-line animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-mono text-text-faint uppercase tracking-wider flex items-center gap-2">
          <Zap size={14} className="text-phase-amber" />
          Daily Challenge
        </h3>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${difficultyColor}`}>
            {challenge.difficulty}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-bg-raise text-text-faint border border-border-line">
            {challenge.type}
          </span>
        </div>
      </div>

      <p className="text-text-main font-medium text-lg mb-4 font-display leading-tight">{challenge.question}</p>

      {!showAnswer && !completed ? (
        <button
          onClick={handleReveal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-phase-violet/10 text-phase-violet hover:bg-phase-violet/20 transition-colors cursor-pointer"
        >
          <Code size={16} />
          Reveal Answer
        </button>
      ) : (
        <div className="space-y-4 animate-slide-up">
          <div className="p-4 bg-bg-raise rounded-xl border border-border-line">
            <p className="text-text-dim text-sm leading-relaxed">{challenge.answer}</p>
          </div>
          {!completed ? (
            <div className="flex gap-3">
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-phase-teal/10 text-phase-teal hover:bg-phase-teal/20 transition-colors cursor-pointer"
              >
                <CheckCircle2 size={16} />
                Got It! (+25 XP)
              </button>
              <button
                onClick={() => {
                  playClick();
                  setShowAnswer(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-bg-raise text-text-dim hover:text-text-main border border-border-line transition-colors cursor-pointer"
              >
                <RotateCcw size={16} />
                Try Again
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-phase-teal text-sm font-semibold animate-scale-in">
              <CheckCircle2 size={16} />
              Challenge completed today! +25 XP Awarded.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

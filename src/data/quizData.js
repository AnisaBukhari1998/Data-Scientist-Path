const rawQuizData = {
  "programming-basics": [
    {
      id: 1,
      question: "Which of the following describes the purpose of the Global Interpreter Lock (GIL) in CPython?",
      options: ["To prevent multiple processes from executing Python bytecodes at once", "To prevent multiple threads from executing Python bytecodes at once", "To manage garbage collection across distributed systems", "To ensure variable scoping in nested functions"],
      correctAnswer: 1,
      explanation: "The GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes simultaneously in CPython."
    },
    {
      id: 2,
      question: "What is the primary advantage of using a generator expression over a list comprehension in Python when processing large datasets?",
      options: ["It executes significantly faster due to C-level optimization", "It evaluates eagerly, making debugging easier", "It yields items one by one, reducing memory footprint", "It automatically caches results for future calls"],
      correctAnswer: 2,
      explanation: "Generators use lazy evaluation, yielding elements one at a time, which keeps memory usage low compared to list comprehensions that load everything into memory."
    },
    {
      id: 3,
      question: "In Python, which of the following is true about how dictionaries (since version 3.6) store their elements?",
      options: ["They maintain insertion order using a compact array of indices and a separate array of key-value pairs", "They use a Red-Black tree to maintain sorted order of keys", "They are strictly unordered and rely solely on open addressing", "They store elements in a linked list based on hash collisions"],
      correctAnswer: 0,
      explanation: "Since Python 3.6, dictionaries use a more compact memory layout that inherently maintains insertion order by storing indices in a sparse array and actual entries in a dense array."
    },
    {
      id: 4,
      question: "When optimizing pandas DataFrames, which technique is most effective for reducing memory usage of categorical text data with low cardinality?",
      options: ["Converting the dtype to 'object'", "Applying gzip compression to the column", "Converting the dtype to 'category'", "Using the np.float16 dtype"],
      correctAnswer: 2,
      explanation: "Converting to 'category' stores the unique values once and uses integer arrays for the mapping, significantly reducing memory usage for low cardinality string columns."
    },
    {
      id: 5,
      question: "What does the SQL window function `RANK()` do when encountering ties?",
      options: ["Assigns consecutive ranks without leaving gaps", "Assigns the same rank and leaves gaps in subsequent ranks", "Randomly assigns different ranks to tied values", "Throws an error if an ORDER BY clause doesn't uniquely identify rows"],
      correctAnswer: 1,
      explanation: "RANK() assigns the same rank to tied values and skips subsequent ranks (e.g., 1, 2, 2, 4)."
    },
    {
      id: 6,
      question: "In NumPy, what are the broadcasting rules when performing operations on two arrays of different shapes?",
      options: ["Dimensions are compared element-wise from left to right", "Dimensions must exactly match or one must be a scalar", "Dimensions are compared from right to left; they must be equal or one must be 1", "Arrays are flattened, operated on, and then reshaped to the larger shape"],
      correctAnswer: 2,
      explanation: "NumPy compares dimensions starting from the trailing (rightmost) dimensions. Two dimensions are compatible if they are equal, or if one of them is 1."
    },
    {
      id: 7,
      question: "Which of the following best describes a 'Closure' in Python?",
      options: ["A function that takes another function as an argument", "An anonymous function defined with the lambda keyword", "A nested function that retains access to variables from its enclosing lexical scope", "A decorator that modifies a class method"],
      correctAnswer: 2,
      explanation: "A closure occurs when a nested function captures and remembers the values in its enclosing scope, even if the outer function has finished execution."
    },
    {
      id: 8,
      question: "What is the time complexity of searching for an element in a Python set in the worst-case scenario (e.g., severe hash collisions)?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correctAnswer: 2,
      explanation: "While average case lookup in a set is O(1), the worst case (e.g., all elements hash to the same bucket) requires scanning the bucket, resulting in O(n)."
    },
    {
      id: 9,
      question: "In SQL, what is the fundamental difference between a Common Table Expression (CTE) and a Temporary Table?",
      options: ["Temporary tables are stored in memory only, CTEs are written to disk", "CTEs exist only for the duration of a single query execution, while temporary tables exist for the duration of the session", "CTEs cannot be recursive, whereas temporary tables can handle recursion", "Temporary tables cannot be indexed, whereas CTEs automatically index on join columns"],
      correctAnswer: 1,
      explanation: "A CTE is scoped to a single statement (SELECT, INSERT, UPDATE, DELETE), whereas a temporary table typically persists for the session (or transaction) and can be indexed."
    },
    {
      id: 10,
      question: "When executing a SQL query, what is the logical order of processing the clauses?",
      options: ["SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY", "FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY", "FROM, SELECT, WHERE, GROUP BY, HAVING, ORDER BY", "SELECT, WHERE, FROM, GROUP BY, HAVING, ORDER BY"],
      correctAnswer: 1,
      explanation: "Logical execution starts by determining the dataset (FROM, JOIN), filtering (WHERE), aggregating (GROUP BY, HAVING), selecting the columns (SELECT), and finally sorting (ORDER BY)."
    },
    {
      id: 11,
      question: "Which regular expression feature allows you to check if a pattern exists ahead in the string without consuming characters?",
      options: ["Non-capturing group", "Lookahead assertion", "Backreference", "Greedy quantifier"],
      correctAnswer: 1,
      explanation: "Lookaheads (?=...) assert that a pattern matches next but do not consume characters, allowing the matching engine to stay at the same position."
    },
    {
      id: 12,
      question: "What is the role of `__slots__` in a Python class definition?",
      options: ["To define private methods that cannot be overridden", "To prevent the instantiation of the class", "To restrict attribute creation and save memory by avoiding the creation of `__dict__`", "To list the interfaces the class implements"],
      correctAnswer: 2,
      explanation: "Defining `__slots__` tells Python not to use a dynamic dictionary for attributes, which saves memory when creating many instances of a class."
    },
    {
      id: 13,
      question: "What happens when a Python script utilizes `multiprocessing` instead of `threading`?",
      options: ["It bypasses the GIL by spawning separate OS processes with their own memory space", "It runs multiple threads within the same CPython process, sharing the same memory", "It creates lightweight coroutines scheduled by an event loop", "It compiles the Python code to C to run concurrently"],
      correctAnswer: 0,
      explanation: "The multiprocessing module bypasses the GIL by creating new processes, each with its own Python interpreter and memory space, allowing true parallelism."
    },
    {
      id: 14,
      question: "In standard object-oriented programming, what is a Metaclass in Python?",
      options: ["A class that inherits from all other base classes", "A class used to instantiate other classes, defining how classes behave", "An abstract base class that cannot be instantiated", "A utility class that only contains static methods"],
      correctAnswer: 1,
      explanation: "A metaclass is a 'class of a class'. Just as a class defines the behavior of its instances, a metaclass defines the behavior of classes themselves (e.g., type)."
    },
    {
      id: 15,
      question: "Which combination of SQL joins will return all records from Table A and Table B, filling in NULLs where there is no match?",
      options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
      correctAnswer: 3,
      explanation: "FULL OUTER JOIN combines the results of both left and right outer joins, returning all rows from both tables and substituting NULLs for missing matches."
    },
    {
      id: 16,
      question: "When writing concurrent code in Python with `asyncio`, what does the `await` keyword do?",
      options: ["It pauses the entire operating system thread until the operation finishes", "It suspends execution of the current coroutine, yielding control back to the event loop", "It creates a new thread to run the awaited function", "It blocks the event loop from executing other coroutines"],
      correctAnswer: 1,
      explanation: "`await` pauses the execution of the specific coroutine and hands control back to the event loop so other tasks can run while waiting for I/O."
    },
    {
      id: 17,
      question: "Which indexing structure is typically used by relational databases to optimize range queries?",
      options: ["Hash Index", "B-Tree (or B+ Tree) Index", "Bitmap Index", "Inverted Index"],
      correctAnswer: 1,
      explanation: "B-Tree (and specifically B+ Tree) indices maintain sorted data and allow for efficient range queries (e.g., BETWEEN, >, <), unlike hash indices."
    },
    {
      id: 18,
      question: "What does 'duck typing' refer to in Python?",
      options: ["Strictly checking variable types at compile time", "A programming style where an object's suitability is determined by its methods and properties rather than its actual class", "Automatically converting variables to the required type during execution", "Using dynamic linking for C extensions"],
      correctAnswer: 1,
      explanation: "Duck typing means 'if it walks like a duck and quacks like a duck, it is a duck.' Type checking is deferred to runtime by checking for the presence of methods/attributes."
    },
    {
      id: 19,
      question: "What is the primary advantage of columnar databases (e.g., Parquet, Redshift) over row-oriented databases for analytics workloads?",
      options: ["Faster single-row inserts and updates", "Enforcing strict foreign key constraints more efficiently", "Highly efficient compression and reading only necessary columns for aggregations", "Better support for unstructured JSON documents"],
      correctAnswer: 2,
      explanation: "Columnar databases store data column-by-column, allowing excellent compression for uniform data types and avoiding reading unnecessary columns from disk during aggregations."
    },
    {
      id: 20,
      question: "In Git, what exactly does a 'commit' object contain?",
      options: ["A complete copy of all modified files", "A diff of changes made since the last commit", "A pointer to a tree object representing the snapshot of the project, plus metadata like author and parent commits", "A list of patches applied sequentially on top of the initial repo state"],
      correctAnswer: 2,
      explanation: "Git does not store diffs. A commit stores metadata and a pointer to the root 'tree' object, which represents a complete snapshot of the directory structure and files."
    },
    {
      id: 21,
      question: "Which of the following is true regarding decorators in Python?",
      options: ["They are parsed at runtime every time the decorated function is called", "They must always return a class", "They are evaluated at module import time (function definition time)", "They can only be applied to functions, not classes"],
      correctAnswer: 2,
      explanation: "The decorator function itself is executed immediately when the module is imported and the decorated function is defined, wrapping the original function."
    },
    {
      id: 22,
      question: "What does the MapReduce paradigm essentially entail?",
      options: ["Mapping data to in-memory tables, then reducing the database size", "Applying a mapping function to key-value pairs, shuffling results, then applying a reduce function to aggregate by key", "Mapping relational schemas to NoSQL documents, reducing join overhead", "Mapping machine learning features, then reducing dimensionality via PCA"],
      correctAnswer: 1,
      explanation: "MapReduce processes data in two phases: 'Map' applies a function to data chunks yielding key-value pairs, and 'Reduce' aggregates those pairs by key."
    },
    {
      id: 23,
      question: "In Python, which built-in function should be used to combine two lists, `list1` and `list2`, into a list of tuples?",
      options: ["zip(list1, list2)", "combine(list1, list2)", "concat(list1, list2)", "merge(list1, list2)"],
      correctAnswer: 0,
      explanation: "`zip()` takes iterables and aggregates them in a tuple, returning an iterator of tuples."
    },
    {
      id: 24,
      question: "What is the conceptual difference between a DataFrame in Pandas and an RDD in PySpark?",
      options: ["Pandas DataFrames are strictly typed, RDDs are not", "Pandas DataFrames reside in a single machine's memory, RDDs are distributed across a cluster", "Pandas DataFrames are immutable, RDDs are mutable", "Pandas DataFrames use lazy evaluation, RDDs use eager evaluation"],
      correctAnswer: 1,
      explanation: "Pandas DataFrames load data into the memory of a single node. RDDs (Resilient Distributed Datasets) are distributed collections partitioned across a cluster."
    },
    {
      id: 25,
      question: "Which SQL clause is specifically used to filter the results of aggregated data (after a GROUP BY)?",
      options: ["WHERE", "FILTER", "HAVING", "LIMIT"],
      correctAnswer: 2,
      explanation: "The HAVING clause was added to SQL because the WHERE clause cannot be used with aggregate functions."
    },
    {
      id: 26,
      question: "What happens when you use `yield from` in Python 3?",
      options: ["It throws an error if not inside an async function", "It delegates execution to a subgenerator, yielding values directly to the caller", "It yields a value and immediately terminates the generator", "It converts a list into a generator"],
      correctAnswer: 1,
      explanation: "`yield from` allows a generator to delegate part of its operations to another generator, yielding values from the subgenerator transparently."
    },
    {
      id: 27,
      question: "What does an 'EXPLAIN' statement do in SQL?",
      options: ["Translates SQL syntax into plain English", "Executes the query and explains the results format", "Returns the execution plan that the database query optimizer has chosen", "Automatically optimizes the table schema for faster queries"],
      correctAnswer: 2,
      explanation: "EXPLAIN displays the execution plan the database engine intends to use, showing how it will join tables, use indexes, and scan rows."
    },
    {
      id: 28,
      question: "In the context of algorithm design, what does Dynamic Programming primarily rely on?",
      options: ["Randomized heuristics", "Overlapping subproblems and optimal substructure", "Greedy local choices", "Dividing the problem into completely independent subproblems"],
      correctAnswer: 1,
      explanation: "Dynamic programming optimizes by breaking a problem into overlapping subproblems (saving their results via memoization/tabulation) and combining optimal solutions to subproblems."
    },
    {
      id: 29,
      question: "Why is modifying a list while iterating over it in a Python `for` loop generally considered bad practice?",
      options: ["It causes an immediate SyntaxError", "The iterator uses an internal index, and modifying the list changes lengths, causing items to be skipped or processed twice", "It forces Python to recompile the list into a tuple", "It creates a memory leak due to circular references"],
      correctAnswer: 1,
      explanation: "Iteration over a list tracks the current index. If items are inserted/removed, the indices shift, leading to skipped elements or IndexErrors."
    },
    {
      id: 30,
      question: "What is a 'Correlated Subquery' in SQL?",
      options: ["A subquery that runs independently of the outer query exactly once", "A subquery that references columns from the outer query, forcing it to be evaluated for every row of the outer query", "A subquery used solely for statistical correlation calculations", "A subquery that is joined with the outer query using a CROSS JOIN"],
      correctAnswer: 1,
      explanation: "A correlated subquery depends on data from the outer query, meaning it must be evaluated iteratively (row-by-row) against the outer query results."
    }
  ],
  "math-stats-eda": [
    {
      id: 31,
      question: "In the context of Principal Component Analysis (PCA), what do the eigenvectors of the covariance matrix represent?",
      options: ["The variance of the data along each dimension", "The coordinates of the data points in the new space", "The principal components, representing the directions of maximum variance", "The error terms for the linear projection"],
      correctAnswer: 2,
      explanation: "The eigenvectors of the covariance matrix define the principal components (axes) along which the variance of the data is maximized."
    },
    {
      id: 32,
      question: "What is the relationship between Maximum Likelihood Estimation (MLE) and Maximum A Posteriori (MAP) estimation?",
      options: ["MLE is a special case of MAP where a uniform prior is assumed", "MAP is a special case of MLE assuming a Gaussian prior", "MLE incorporates prior knowledge, whereas MAP relies entirely on data", "There is no mathematical relationship; they optimize different loss functions entirely"],
      correctAnswer: 0,
      explanation: "MAP incorporates a prior distribution (P(theta)). If the prior is uniform (a constant), the MAP estimate mathematically reduces precisely to the MLE."
    },
    {
      id: 33,
      question: "Which of the following describes a Type II error in hypothesis testing?",
      options: ["Rejecting a true null hypothesis (False Positive)", "Failing to reject a false null hypothesis (False Negative)", "Rejecting a true alternative hypothesis", "Accepting the alternative hypothesis incorrectly"],
      correctAnswer: 1,
      explanation: "A Type II error occurs when the test fails to detect an effect that is actually present (failing to reject the null hypothesis when it is false)."
    },
    {
      id: 34,
      question: "In optimization, how does Newton's method differ from standard Gradient Descent?",
      options: ["Newton's method uses only first-order derivatives", "Newton's method incorporates second-order derivatives (the Hessian) to adjust the step size based on curvature", "Newton's method is strictly a stochastic method", "Newton's method guarantees finding the global minimum for non-convex functions"],
      correctAnswer: 1,
      explanation: "Gradient descent uses only the gradient (first derivative). Newton's method uses the Hessian (second derivative) to approximate the function quadratically, allowing faster convergence."
    },
    {
      id: 35,
      question: "What is the primary purpose of Kernel Density Estimation (KDE)?",
      options: ["To perform nonlinear dimensionality reduction", "To compute the correlation matrix of high-dimensional data", "To estimate the underlying probability density function of a continuous random variable", "To impute missing values using a kernel function"],
      correctAnswer: 2,
      explanation: "KDE is a non-parametric way to estimate the probability density function (PDF) of a random variable, essentially creating a smoothed histogram."
    },
    {
      id: 36,
      question: "Kullback-Leibler (KL) Divergence is asymmetric. What does this mean in the context of approximating a true distribution P with Q?",
      options: ["KL(P||Q) cannot be used as a distance metric", "KL(P||Q) equals KL(Q||P) only if both are Gaussian", "KL(P||Q) is always negative, while KL(Q||P) is positive", "The divergence measures the exact geometric distance between centroids of P and Q"],
      correctAnswer: 0,
      explanation: "KL divergence is asymmetric (KL(P||Q) != KL(Q||P)) and does not satisfy the triangle inequality, so it is a divergence measure, not a true mathematical distance metric."
    },
    {
      id: 37,
      question: "Under which condition does Ordinary Least Squares (OLS) regression produce best linear unbiased estimates (BLUE)?",
      options: ["When the residuals are normally distributed, even with heteroscedasticity", "When the Gauss-Markov assumptions are satisfied", "When the features are highly collinear", "When the dependent variable is categorical"],
      correctAnswer: 1,
      explanation: "The Gauss-Markov theorem states that OLS estimators are BLUE if the errors have zero mean, homoscedasticity, and no autocorrelation (and predictors are strictly exogenous)."
    },
    {
      id: 38,
      question: "What happens to the p-value of a statistical test as the sample size increases, assuming a tiny but non-zero true effect exists?",
      options: ["It approaches 1", "It approaches 0", "It remains constant", "It oscillates based on standard error"],
      correctAnswer: 1,
      explanation: "With a large enough sample size, statistical tests have enough power to detect even trivially small effects, driving the p-value toward 0."
    },
    {
      id: 39,
      question: "Which matrix factorization technique decomposes a matrix into a product of three matrices: U, Sigma, and V-transpose?",
      options: ["Cholesky Decomposition", "QR Decomposition", "Singular Value Decomposition (SVD)", "LU Decomposition"],
      correctAnswer: 2,
      explanation: "SVD decomposes a matrix into U (left singular vectors), Sigma (diagonal matrix of singular values), and V^T (right singular vectors)."
    },
    {
      id: 40,
      question: "What is 'multicollinearity' in multiple regression, and why is it problematic?",
      options: ["When the dependent variable has multiple categories, preventing linear fit", "When independent variables are highly correlated, causing large variance in coefficient estimates", "When residuals are correlated over time, invalidating t-tests", "When the regression equation includes polynomial terms"],
      correctAnswer: 1,
      explanation: "Multicollinearity occurs when predictors are highly correlated. It makes coefficient estimates extremely sensitive to small changes in the model, inflating standard errors."
    },
    {
      id: 41,
      question: "What does a Beta distribution commonly model in Bayesian statistics?",
      options: ["The number of events occurring in a fixed interval of time", "The distribution of sample variances", "The prior probability distribution for binomial/Bernoulli parameters", "The distribution of extreme values in a dataset"],
      correctAnswer: 2,
      explanation: "The Beta distribution is defined on the interval [0,1] and serves as the conjugate prior for the Bernoulli, binomial, negative binomial, and geometric distributions."
    },
    {
      id: 42,
      question: "In Exploratory Data Analysis, what does a Q-Q (Quantile-Quantile) plot primarily help determine?",
      options: ["The correlation between two variables", "Whether a dataset follows a specific theoretical distribution (like normal)", "The optimal number of clusters for K-means", "The severity of class imbalance in categorical data"],
      correctAnswer: 1,
      explanation: "A Q-Q plot compares the quantiles of the data against the quantiles of a theoretical distribution. If the data follows the distribution, points lie roughly on a straight line."
    },
    {
      id: 43,
      question: "What is the phenomenon called where the volume of the space increases so fast that the available data become sparse, hampering model performance?",
      options: ["Bias-Variance Tradeoff", "The Curse of Dimensionality", "Heteroscedasticity", "Overdispersion"],
      correctAnswer: 1,
      explanation: "The 'curse of dimensionality' refers to various phenomena that arise when analyzing data in high-dimensional spaces, notably that data points become sparse and distant from each other."
    },
    {
      id: 44,
      question: "How does the Isolation Forest algorithm isolate anomalies?",
      options: ["By calculating the distance to the k-nearest neighbors", "By using a dense neural network to reconstruct inputs and flagging high loss", "By recursively partitioning data and flagging points that require fewer splits to be isolated", "By projecting data into a lower dimension and finding points far from the origin"],
      correctAnswer: 2,
      explanation: "Isolation Forest builds random decision trees. Anomalies are 'few and different' and thus require fewer random splits to be isolated compared to normal points (shorter path lengths)."
    },
    {
      id: 45,
      question: "What does 'Simpson’s Paradox' demonstrate in data analysis?",
      options: ["A trend appears in different groups of data but disappears or reverses when the groups are combined", "The variance of errors increases as the predictor variable increases", "Increasing model complexity always decreases training error but increases test error", "Two independently normally distributed variables have a uniform joint distribution"],
      correctAnswer: 0,
      explanation: "Simpson's Paradox occurs when a trend or relationship found within specific groups is completely reversed when the groups are aggregated."
    },
    {
      id: 46,
      question: "What does the Jacobian matrix represent for a vector-valued function of multiple variables?",
      options: ["The second-order partial derivatives of the function", "The eigenvalues of the function's transformation", "The matrix of all first-order partial derivatives", "The inverse of the covariance matrix"],
      correctAnswer: 2,
      explanation: "The Jacobian matrix contains all first-order partial derivatives of a vector-valued function, representing the best linear approximation to the function near a given point."
    },
    {
      id: 47,
      question: "In the context of dealing with missing data, what does 'Missing at Random' (MAR) mean?",
      options: ["The missingness is completely random and independent of any observed or unobserved variables", "The probability of being missing depends only on observed data, not on the missing data itself", "The missingness depends explicitly on the value that is missing", "The missing data can only be handled by dropping the rows"],
      correctAnswer: 1,
      explanation: "MAR means the propensity for a data point to be missing is related to some of the observed data, but not the missing data itself. (If unrelated to anything, it's MCAR)."
    },
    {
      id: 48,
      question: "When applying the MICE (Multiple Imputation by Chained Equations) algorithm, what is the core methodology?",
      options: ["It replaces missing values with the mean of the column repeatedly", "It uses PCA to project data to a subspace, imputing based on components", "It models each feature conditionally on the other features, iteratively updating imputations", "It clusters the data and imputes the cluster centroid"],
      correctAnswer: 2,
      explanation: "MICE operates on the assumption that missing values can be estimated by modeling each variable as a function of the others, cycling through them iteratively."
    },
    {
      id: 49,
      question: "If A and B are independent events, what is the conditional probability P(A|B)?",
      options: ["P(A) * P(B)", "P(A)", "P(B)", "P(A) / P(B)"],
      correctAnswer: 1,
      explanation: "For independent events, the occurrence of B gives no information about A. Thus, P(A|B) = P(A)."
    },
    {
      id: 50,
      question: "What is a characteristic of the Poisson distribution?",
      options: ["It models the time between events in a Poisson process", "Its mean and variance are strictly equal", "It is continuous and defined for all real numbers", "It is heavily skewed to the left for large values of lambda"],
      correctAnswer: 1,
      explanation: "A key mathematical property of the Poisson distribution is that its expected value (mean) is equal to its variance, both represented by lambda (λ)."
    },
    {
      id: 51,
      question: "What metric is most appropriate for measuring the monotonic relationship between two variables, without assuming linearity?",
      options: ["Pearson Correlation Coefficient", "Spearman Rank Correlation Coefficient", "Cosine Similarity", "R-squared"],
      correctAnswer: 1,
      explanation: "Spearman correlation uses ranks rather than raw values, measuring how well the relationship can be described by a monotonic function, not necessarily linear."
    },
    {
      id: 52,
      question: "In hypothesis testing, what does the 'Statistical Power' of a test indicate?",
      options: ["The probability of rejecting the null hypothesis when it is false (1 - Beta)", "The probability of rejecting the null hypothesis when it is true (Alpha)", "The minimum sample size needed to run the test", "The probability that the alternative hypothesis is absolutely true"],
      correctAnswer: 0,
      explanation: "Power is the probability that the test correctly rejects a false null hypothesis, essentially its ability to detect an effect when there is one."
    },
    {
      id: 53,
      question: "If you want to apply a log transformation to heavily right-skewed data containing zero values, which transformation is statistically robust?",
      options: ["log(x)", "log(x^2)", "log(x + 1) or log1p", "sqrt(x)"],
      correctAnswer: 2,
      explanation: "Since log(0) is undefined (negative infinity), adding a constant (usually 1, known as log1p) safely handles zeroes while retaining the benefits of the log transform."
    },
    {
      id: 54,
      question: "Which optimization algorithm uses an exponentially decaying average of past gradients to smooth out the updates?",
      options: ["Vanilla Gradient Descent", "Momentum", "Newton-Raphson", "L-BFGS"],
      correctAnswer: 1,
      explanation: "Gradient descent with Momentum uses a moving average (exponentially decaying) of past gradients to accelerate convergence in the right direction and dampen oscillations."
    },
    {
      id: 55,
      question: "What is the primary difference between a generative model and a discriminative model in statistics?",
      options: ["Generative models use neural networks, while discriminative models use trees", "Generative models learn the joint probability P(X, Y), while discriminative models learn the conditional probability P(Y|X)", "Discriminative models can generate new synthetic data points", "Generative models are purely unsupervised"],
      correctAnswer: 1,
      explanation: "Generative models map how data is generated by modeling P(X, Y), allowing data generation. Discriminative models focus purely on drawing boundaries by modeling P(Y|X)."
    },
    {
      id: 56,
      question: "What happens to the confidence interval for a mean when you increase the required confidence level (e.g., 95% to 99%) while keeping sample size constant?",
      options: ["The interval becomes narrower", "The interval becomes wider", "The interval stays the same but the p-value drops", "The interval becomes exactly zero"],
      correctAnswer: 1,
      explanation: "To be more confident that the interval contains the true population parameter, you must cast a wider net, making the interval wider."
    },
    {
      id: 57,
      question: "According to Bayes' Theorem, what is the 'evidence' or marginal likelihood?",
      options: ["P(A|B)", "P(B|A)", "P(A)", "P(B)"],
      correctAnswer: 3,
      explanation: "In P(A|B) = [P(B|A)P(A)] / P(B), P(B) is the evidence (the total probability of the observed data under all possible hypotheses)."
    },
    {
      id: 58,
      question: "What statistical test is commonly used to determine if there is a significant association between two categorical variables?",
      options: ["Student's t-test", "ANOVA", "Pearson's r", "Chi-square Test of Independence"],
      correctAnswer: 3,
      explanation: "The Chi-square test compares observed frequencies of categorical data against expected frequencies to determine if the variables are independent."
    },
    {
      id: 59,
      question: "When applying t-SNE for dimensionality reduction, what is the hyperparameter 'perplexity' roughly equivalent to?",
      options: ["The learning rate of the optimization step", "The number of principal components to retain", "A guess about the number of close neighbors each point has", "The maximum number of iterations allowed"],
      correctAnswer: 2,
      explanation: "Perplexity in t-SNE can be interpreted as a smooth measure of the effective number of neighbors. It dictates how to balance attention between local and global aspects of your data."
    },
    {
      id: 60,
      question: "What is the distinguishing feature of a stationary time series?",
      options: ["It exhibits a strong upward or downward trend over time", "Its statistical properties like mean and variance are constant over time", "It uses moving averages exclusively for forecasting", "It has missing values at strictly periodic intervals"],
      correctAnswer: 1,
      explanation: "A time series is stationary if its statistical properties do not change over time, meaning no trend and constant variance, which is a prerequisite for models like ARMA."
    }
  ],
  "machine-learning": [
    {
      id: 61,
      question: "In a Random Forest, what is the primary purpose of using Out-Of-Bag (OOB) error?",
      options: ["To tune hyperparameters like learning rate", "To evaluate the model's performance without needing a separate validation set", "To impute missing values during tree construction", "To calculate the Gini impurity for feature splits"],
      correctAnswer: 1,
      explanation: "Each tree in a Random Forest is trained on a bootstrap sample. The data not included in this sample (out-of-bag) can be used as a built-in validation set to estimate generalization error."
    },
    {
      id: 62,
      question: "How does the 'Kernel Trick' allow Support Vector Machines (SVMs) to solve non-linear classification problems?",
      options: ["By adding polynomial features explicitly to the dataset before training", "By using a neural network as the underlying classifier", "By implicitly mapping the input features into a high-dimensional space where a linear hyperplane can separate the classes", "By clustering the data first and applying linear SVMs to each cluster"],
      correctAnswer: 2,
      explanation: "The kernel trick computes the dot product of two vectors in a higher-dimensional space without explicitly transforming them, allowing a linear model to capture non-linear patterns."
    },
    {
      id: 63,
      question: "What does the 'C' parameter control in a Support Vector Machine?",
      options: ["The degree of the polynomial kernel", "The trade-off between maximizing the margin and minimizing classification errors on the training data", "The learning rate of the gradient descent optimizer", "The number of support vectors selected"],
      correctAnswer: 1,
      explanation: "A smaller C encourages a larger margin (softer margin, more violations allowed), preventing overfitting. A larger C tries to classify all training examples correctly, potentially leading to a smaller margin (harder margin)."
    },
    {
      id: 64,
      question: "In Gradient Boosting, what role does a 'Learning Rate' (or shrinkage) play?",
      options: ["It determines the depth of the individual decision trees", "It scales the contribution of each subsequent tree, requiring more trees but usually improving generalization", "It controls the random sampling of features for each tree", "It dictates the batch size for stochastic gradient descent"],
      correctAnswer: 1,
      explanation: "Shrinkage scales the predictions of each tree by the learning rate. A smaller learning rate means each tree contributes less, making the model learn slower but generally achieve better performance."
    },
    {
      id: 65,
      question: "Why is XGBoost often faster and more scalable than traditional Gradient Boosting Machines (GBMs)?",
      options: ["It inherently uses a single giant tree instead of many small ones", "It relies entirely on linear models as base learners rather than trees", "It uses an approximate algorithm for split finding (e.g., histogram-based) and supports parallel processing", "It skips the gradient calculation and uses random splits"],
      correctAnswer: 2,
      explanation: "XGBoost uses advanced techniques like histogram-based split finding, column block structures for parallel learning, and cache-aware access, significantly speeding up training."
    },
    {
      id: 66,
      question: "When evaluating a binary classifier on a highly imbalanced dataset (e.g., 99% negative, 1% positive), why is PR-AUC (Precision-Recall Area Under Curve) often preferred over ROC-AUC?",
      options: ["ROC-AUC cannot be calculated for imbalanced datasets", "PR-AUC focuses on the positive minority class, whereas ROC-AUC can be overly optimistic due to the abundance of true negatives", "ROC-AUC assumes a Gaussian distribution of the classes", "PR-AUC directly minimizes log-loss"],
      correctAnswer: 1,
      explanation: "ROC-AUC includes the True Negative Rate. In highly imbalanced data, true negatives dominate, making the ROC curve look artificially good. PR-AUC focuses only on positive predictions."
    },
    {
      id: 67,
      question: "In K-Means clustering, what does the K-Means++ initialization algorithm aim to achieve?",
      options: ["To automatically determine the optimal value of K", "To initialize centroids far away from each other to speed up convergence and avoid poor local minima", "To allow clusters to have non-spherical shapes", "To assign weights to features based on their variance"],
      correctAnswer: 1,
      explanation: "K-Means++ selects the first centroid randomly, then selects subsequent centroids with a probability proportional to their distance from the nearest existing centroid, spreading them out."
    },
    {
      id: 68,
      question: "What is the primary difference between L1 (Lasso) and L2 (Ridge) Regularization?",
      options: ["L1 squares the weights; L2 takes the absolute value", "L2 can force weights exactly to zero, performing feature selection; L1 cannot", "L1 adds a penalty equal to the absolute value of weights, often driving some to exactly zero (sparsity); L2 penalizes squared weights", "L1 is used for classification; L2 is used for regression"],
      correctAnswer: 2,
      explanation: "L1 regularization (Lasso) uses an absolute value penalty, which creates sparse models by setting less important feature weights to exactly zero. L2 shrinks weights but rarely to zero."
    },
    {
      id: 69,
      question: "In hierarchical clustering, which linkage criterion merges the two clusters whose merger yields the smallest increase in total within-cluster variance?",
      options: ["Single Linkage", "Complete Linkage", "Average Linkage", "Ward's Method"],
      correctAnswer: 3,
      explanation: "Ward's method minimizes the total within-cluster variance. At each step, it merges the pair of clusters that leads to the minimum increase in total within-cluster variance."
    },
    {
      id: 70,
      question: "Which of the following scenarios describes 'Data Leakage' in Machine Learning?",
      options: ["The model is deployed and its performance degrades over time", "The test set is used to tune hyperparameters, or future information is accidentally included in the training features", "Memory leaks occur during the training of deep neural networks", "The model predicts the majority class for all instances"],
      correctAnswer: 1,
      explanation: "Data leakage happens when information from outside the training dataset (like the test set or future data) is used to create the model, leading to overly optimistic performance estimates."
    },
    {
      id: 71,
      question: "What is the main objective of the SMOTE (Synthetic Minority Over-sampling Technique) algorithm?",
      options: ["To undersample the majority class by removing points near the decision boundary", "To generate synthetic examples for the minority class by interpolating between existing minority instances", "To assign higher weights to the minority class in the loss function", "To extract features that maximize class separability"],
      correctAnswer: 1,
      explanation: "SMOTE creates new, synthetic instances of the minority class by finding nearest neighbors in the minority class and interpolating points between them."
    },
    {
      id: 72,
      question: "In a Naive Bayes classifier, what problem does Laplace Smoothing solve?",
      options: ["Overfitting on text data with too many features", "The zero-probability problem when a feature value in the test set never occurred in the training set for a specific class", "The assumption that all features are independent", "The instability of matrix inversion when features are correlated"],
      correctAnswer: 1,
      explanation: "If a feature-class combination is missing from the training data, its conditional probability is zero, nullifying the entire calculation. Laplace smoothing adds a small count to avoid this."
    },
    {
      id: 73,
      question: "When building a Decision Tree for classification, what does 'Entropy' measure?",
      options: ["The depth of the tree", "The computational cost of evaluating a split", "The amount of impurity, disorder, or uncertainty in a set of examples", "The margin between different classes"],
      correctAnswer: 2,
      explanation: "Entropy is a measure of impurity. A node with equal numbers of positive and negative examples has high entropy (1.0), while a purely homogeneous node has zero entropy."
    },
    {
      id: 74,
      question: "Why does the K-Nearest Neighbors (KNN) algorithm degrade in performance as the number of features (dimensions) increases significantly?",
      options: ["Because distance metrics become meaningless as the distance between any two points approaches the same value (Curse of Dimensionality)", "Because the algorithm requires inverting a matrix that becomes singular", "Because KNN attempts to fit a global linear model which fails in high dimensions", "Because the number of necessary nearest neighbors k must equal the number of dimensions"],
      correctAnswer: 0,
      explanation: "In high-dimensional spaces, the volume expands exponentially, making data sparse. The distance to the nearest neighbor becomes nearly identical to the distance to the farthest neighbor."
    },
    {
      id: 75,
      question: "In cross-validation, what is the specific advantage of using Stratified K-Fold over standard K-Fold?",
      options: ["It shuffles the data faster", "It ensures that each fold contains roughly the same proportion of target class labels as the original dataset", "It prevents overlapping data between training and test folds", "It automatically handles time-series data without look-ahead bias"],
      correctAnswer: 1,
      explanation: "Stratification ensures that the class distribution in each fold mirrors the original dataset, which is crucial for imbalanced classification tasks."
    },
    {
      id: 76,
      question: "What does the log-loss (cross-entropy loss) function heavily penalize?",
      options: ["Predictions that are exactly 0.5", "Confident but incorrect predictions (e.g., predicting 0.99 for a false class)", "Having too many features in the model", "Predictions that are unconfident (e.g., near 0.5) but correct"],
      correctAnswer: 1,
      explanation: "Log-loss evaluates the probabilities assigned to predictions. A highly confident wrong prediction yields a massive penalty because the log of a value near zero approaches negative infinity."
    },
    {
      id: 77,
      question: "Which ensemble technique builds models sequentially, where each new model tries to correct the errors made by the previous ones?",
      options: ["Bagging", "Boosting", "Stacking", "Voting"],
      correctAnswer: 1,
      explanation: "Boosting (like AdaBoost or Gradient Boosting) trains weak learners sequentially, with each subsequent model focusing on the residuals or misclassifications of the ensemble so far."
    },
    {
      id: 78,
      question: "What is the key difference between LightGBM and XGBoost regarding how they grow decision trees?",
      options: ["LightGBM uses depth-wise (level-wise) growth, while XGBoost uses leaf-wise (best-first) growth", "LightGBM uses leaf-wise (best-first) growth, while traditional XGBoost uses depth-wise growth", "LightGBM can only build decision stumps (depth 1)", "XGBoost does not use decision trees; it uses linear models"],
      correctAnswer: 1,
      explanation: "LightGBM grows trees leaf-wise, splitting the leaf that yields the maximum loss reduction, which is faster and often more accurate but prone to overfitting on small data. XGBoost traditionally grows level-wise."
    },
    {
      id: 79,
      question: "When evaluating a clustering algorithm using the Silhouette Score, what does a score near +1 indicate?",
      options: ["The clusters are highly overlapping", "The data point is far away from the neighboring clusters and well-matched to its own cluster", "The number of clusters is exactly optimal", "The algorithm failed to converge"],
      correctAnswer: 1,
      explanation: "A Silhouette Score ranges from -1 to 1. A high score near +1 means the sample is far from neighboring clusters and very close to samples in its own cluster (dense, well-separated clusters)."
    },
    {
      id: 80,
      question: "What is 'GroupKFold' cross-validation designed to prevent?",
      options: ["Leakage that occurs when data from the same distinct group (e.g., same patient) appears in both training and test folds", "The imbalance of class labels across folds", "The over-representation of numerical vs categorical features", "Using too much memory during parallel training"],
      correctAnswer: 0,
      explanation: "GroupKFold ensures that all records belonging to a specific group (like multiple scans from one patient) are entirely in either the training set or the test set, preventing optimistic leakage."
    },
    {
      id: 81,
      question: "In the context of evaluating a ranking algorithm or recommender system, what does NDCG (Normalized Discounted Cumulative Gain) account for that standard Precision does not?",
      options: ["The binary classification threshold", "The position (rank) of the relevant items, giving higher scores to relevant items placed higher up", "The total number of users in the system", "The computational cost of generating the recommendations"],
      correctAnswer: 1,
      explanation: "NDCG measures ranking quality. 'Discounted' means the value of a correct recommendation is logarithmically penalized the lower it appears in the ranked list."
    },
    {
      id: 82,
      question: "For a dataset with strictly categorical features containing many distinct levels (high cardinality), which algorithm handles this natively and efficiently without requiring one-hot encoding?",
      options: ["Logistic Regression", "Support Vector Machines", "CatBoost", "K-Nearest Neighbors"],
      correctAnswer: 2,
      explanation: "CatBoost (Categorical Boosting) uses ordered target encoding natively during training to handle high-cardinality categorical features efficiently without memory-intensive one-hot encoding."
    },
    {
      id: 83,
      question: "What does the bias-variance tradeoff imply about a model that is extremely complex (e.g., a very deep decision tree)?",
      options: ["It will have high bias and high variance", "It will have low bias and high variance (prone to overfitting)", "It will have high bias and low variance (prone to underfitting)", "It will have low bias and low variance (ideal state)"],
      correctAnswer: 1,
      explanation: "A highly complex model can memorize the training data (low bias/error on training set) but will fluctuate wildly on unseen data (high variance)."
    },
    {
      id: 84,
      question: "In a Multi-Layer Perceptron (MLP), what guarantees that the model can approximate any continuous function, provided it has enough hidden units?",
      options: ["The Backpropagation Theorem", "The Universal Approximation Theorem", "The Central Limit Theorem", "The Gauss-Markov Theorem"],
      correctAnswer: 1,
      explanation: "The Universal Approximation Theorem states that a feed-forward network with a single hidden layer containing a finite number of neurons can approximate continuous functions on compact subsets of R^n."
    },
    {
      id: 85,
      question: "Why is an Isolation Forest particularly well-suited for high-dimensional tabular data anomaly detection compared to distance-based methods like LOF (Local Outlier Factor)?",
      options: ["It computes distances using Mahalanobis distance instead of Euclidean", "It doesn't rely on expensive distance calculations, bypassing the curse of dimensionality by isolating points via random feature splits", "It uses a deep neural network to compress dimensions", "It requires no hyperparameters whatsoever"],
      correctAnswer: 1,
      explanation: "Distance-based methods degrade in high dimensions and are computationally heavy (O(n^2)). Isolation Forests use random partitioning (O(n log n)), making them highly scalable and effective."
    },
    {
      id: 86,
      question: "What is the primary motivation for using a custom asymmetric loss function in a regression task?",
      options: ["To speed up gradient descent convergence", "Because overestimating a value has a vastly different business cost than underestimating it", "To enforce sparsity in the feature weights", "To convert the regression task into a classification task"],
      correctAnswer: 1,
      explanation: "In many business problems (e.g., inventory forecasting), predicting too high (excess stock) might cost less than predicting too low (stockout). An asymmetric loss penalizes one direction more."
    },
    {
      id: 87,
      question: "In standard PCA, features must usually be scaled (e.g., standard scaler) before fitting. Why is this?",
      options: ["Because PCA uses Gradient Descent which requires scaled data", "Because PCA seeks to maximize variance, so variables on larger scales will disproportionately dominate the principal components", "Because the covariance matrix cannot be computed on unscaled data", "To ensure that all principal components are orthogonal"],
      correctAnswer: 1,
      explanation: "PCA calculates directions of maximum variance. If one feature is measured in thousands and another in decimals, the algorithm will incorrectly identify the first feature as the most important solely due to its scale."
    },
    {
      id: 88,
      question: "Which of the following is an unsupervised learning algorithm used for finding association rules in transactional datasets?",
      options: ["Random Forest", "Apriori Algorithm", "Gradient Boosting", "Linear Discriminant Analysis"],
      correctAnswer: 1,
      explanation: "The Apriori algorithm identifies frequent individual items in the database and extends them to larger item sets, forming association rules (e.g., Market Basket Analysis)."
    },
    {
      id: 89,
      question: "What does an ROC curve plot?",
      options: ["Precision vs. Recall at various classification thresholds", "True Positive Rate vs. False Positive Rate at various classification thresholds", "Accuracy vs. Loss across training epochs", "F1 Score vs. Threshold"],
      correctAnswer: 1,
      explanation: "The Receiver Operating Characteristic (ROC) curve plots the True Positive Rate (Sensitivity/Recall) against the False Positive Rate (1 - Specificity) across all possible classification thresholds."
    },
    {
      id: 90,
      question: "How does 'Cost-Sensitive Learning' handle imbalanced classes during model training?",
      options: ["By undersampling the majority class equal to the minority class", "By synthetically generating new samples", "By modifying the algorithm's loss function to impose a heavier penalty for misclassifying the minority class", "By automatically adjusting the classification threshold to 0.1"],
      correctAnswer: 2,
      explanation: "Cost-sensitive learning incorporates the misclassification costs directly into the training algorithm (e.g., class weights), forcing the optimizer to pay more attention to the minority class."
    }
  ],
  "deep-learning": [
    {
      id: 91,
      question: "What is the 'Vanishing Gradient Problem' in Deep Neural Networks?",
      options: ["Gradients become extremely large, causing numeric overflow and NaN losses", "Gradients become vanishingly small during backpropagation in deep networks, preventing early layers from learning", "The loss function reaches exactly zero, halting training", "The learning rate decays to zero too quickly"],
      correctAnswer: 1,
      explanation: "When gradients are propagated backward through many layers (especially with sigmoid/tanh activations), they get multiplied by small derivatives, shrinking exponentially and stalling learning in early layers."
    },
    {
      id: 92,
      question: "Why is the ReLU (Rectified Linear Unit) activation function widely preferred over Sigmoid in deep networks?",
      options: ["It bounds the output between 0 and 1", "It is fully differentiable at all points including zero", "It mitigates the vanishing gradient problem because its derivative is exactly 1 for all positive inputs", "It automatically centers the data at zero"],
      correctAnswer: 2,
      explanation: "For any positive input, the gradient of ReLU is 1. This prevents gradients from vanishing when chaining derivatives during backpropagation across many layers."
    },
    {
      id: 93,
      question: "In a Convolutional Neural Network (CNN), what does a 'Dilated Convolution' achieve?",
      options: ["It reduces the number of channels in the feature map", "It increases the receptive field of the filter without increasing the number of parameters by inserting spaces between kernel elements", "It shrinks the spatial dimensions of the image exactly like max pooling", "It replaces the convolution operation with standard matrix multiplication"],
      correctAnswer: 1,
      explanation: "Dilated (or atrous) convolutions expand the filter by inserting zeros between its elements. This enlarges the receptive field to capture broader context without adding weights."
    },
    {
      id: 94,
      question: "What is the primary function of the 'Forget Gate' in an LSTM (Long Short-Term Memory) cell?",
      options: ["To decide what new information should be added to the cell state", "To output the final hidden state to the next layer", "To decide what information from the previous cell state should be discarded or kept", "To normalize the input data to prevent exploding gradients"],
      correctAnswer: 2,
      explanation: "The forget gate looks at the previous hidden state and the current input, outputting a number between 0 and 1 for each number in the cell state to dictate how much of the old memory to retain."
    },
    {
      id: 95,
      question: "In the Transformer architecture, what is the mathematical formula for Scaled Dot-Product Attention?",
      options: ["Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V", "Attention(Q, K, V) = softmax(Q * K^T) * V", "Attention(Q, K, V) = ReLU(Q * K^T / d_k) * V", "Attention(Q, K, V) = (Q * K^T * V) / sqrt(d_k)"],
      correctAnswer: 0,
      explanation: "The attention scores are calculated by the dot product of Queries (Q) and Keys (K), scaled down by the square root of the key dimension (d_k) to prevent extremely small gradients in the softmax, then multiplied by Values (V)."
    },
    {
      id: 96,
      question: "Why is 'Positional Encoding' necessary in standard Transformer models?",
      options: ["To project the input embeddings into a higher dimensional space", "Because self-attention operations are permutation-invariant and lack any inherent notion of sequence order", "To prevent overfitting on long sequences", "To encode the position of the bounding box in vision transformers"],
      correctAnswer: 1,
      explanation: "Unlike RNNs or CNNs, the self-attention mechanism processes all tokens simultaneously without order. Positional encodings are added to the input embeddings to inject sequence order information."
    },
    {
      id: 97,
      question: "How does the Adam optimizer differ from standard Stochastic Gradient Descent (SGD)?",
      options: ["Adam computes the exact Hessian matrix for second-order optimization", "Adam computes adaptive learning rates for each parameter using estimates of first and second moments of the gradients", "Adam uses a constant learning rate that never decays", "Adam evaluates the entire dataset before making a single update"],
      correctAnswer: 1,
      explanation: "Adam (Adaptive Moment Estimation) combines the benefits of RMSProp and Momentum, maintaining exponentially decaying averages of past gradients (momentum) and past squared gradients (adaptive learning rates per parameter)."
    },
    {
      id: 98,
      question: "What phenomenon is Batch Normalization primarily theorized to address during training (according to the original paper)?",
      options: ["Overfitting by randomly dropping activations", "Internal Covariate Shift, where the distribution of each layer's inputs changes during training as the parameters of previous layers change", "The exploding gradient problem in RNNs", "Data imbalance in mini-batches"],
      correctAnswer: 1,
      explanation: "The original paper claimed Batch Normalization reduces 'Internal Covariate Shift' by normalizing layer inputs to have zero mean and unit variance. (Later research suggests it also smooths the optimization landscape)."
    },
    {
      id: 99,
      question: "During inference (testing), how does Dropout behave?",
      options: ["It continues to randomly zero out neurons at the same probability as training", "It zeroes out completely different neurons to create an ensemble effect", "It is turned off, and the weights are scaled by the dropout probability to account for the larger number of active neurons", "It is turned off, and the learning rate is halved"],
      correctAnswer: 2,
      explanation: "During inference, we want deterministic predictions. Dropout is disabled, and to ensure the expected output of a neuron remains the same, the weights are scaled by (1 - dropout_rate), or scaling occurs during training (inverted dropout)."
    },
    {
      id: 100,
      question: "What is the core idea behind the 'Reparameterization Trick' in Variational Autoencoders (VAEs)?",
      options: ["It changes the loss function from MSE to Cross-Entropy", "It allows backpropagation through a random sampling operation by moving the stochasticity to an auxiliary noise variable (epsilon)", "It replaces the encoder network with a non-parametric kernel", "It dynamically changes the number of layers during training"],
      correctAnswer: 1,
      explanation: "You cannot backpropagate through a random node. The trick rewrites the sample z as `z = mu + sigma * epsilon`, where epsilon is random noise. Now the gradient can flow deterministically through mu and sigma."
    },
    {
      id: 101,
      question: "In Generative Adversarial Networks (GANs), what is 'Mode Collapse'?",
      options: ["When the generator produces a highly diverse set of images that look like pure noise", "When the discriminator becomes too weak and accepts all images", "When the generator learns to produce only one or a small subset of outputs that fool the discriminator, ignoring the full diversity of the data", "When the network architecture collapses due to vanishing gradients"],
      correctAnswer: 2,
      explanation: "Mode collapse occurs when the generator discovers a single realistic output that fools the discriminator and continually produces only that output, failing to model the entire data distribution."
    },
    {
      id: 102,
      question: "Which loss function is specifically designed to handle extreme class imbalance in object detection by down-weighting the loss assigned to well-classified examples?",
      options: ["Huber Loss", "Focal Loss", "Contrastive Loss", "Triplet Loss"],
      correctAnswer: 1,
      explanation: "Focal Loss adds a modulating factor to the standard cross-entropy loss. It dynamically scales the loss based on prediction confidence, heavily penalizing hard/misclassified examples and ignoring easy ones."
    },
    {
      id: 103,
      question: "In Transfer Learning, what does 'Fine-Tuning' generally entail?",
      options: ["Training a network from scratch on a new dataset", "Using a pre-trained network as a fixed feature extractor and only training a new linear classifier on top", "Unfreezing the top layers (or all layers) of a pre-trained network and jointly training them with the new classifier at a very low learning rate", "Replacing the activation functions of the pre-trained model"],
      correctAnswer: 2,
      explanation: "Fine-tuning goes beyond fixed feature extraction. It involves unfreezing some or all of the pre-trained weights and updating them slightly (using a low learning rate) on the new task data."
    },
    {
      id: 104,
      question: "What is the primary advantage of a 1x1 Convolution in a CNN architecture (e.g., Inception network)?",
      options: ["To increase the spatial dimensions of the image", "To act as a cross-channel parametric pooling layer, reducing (or increasing) dimensionality in the channel depth without altering spatial dimensions", "To replace fully connected layers at the end of the network", "To apply a Gaussian blur to the image"],
      correctAnswer: 1,
      explanation: "A 1x1 convolution computes a linear combination of the channels at each pixel location. It is heavily used for dimensionality reduction along the channel axis (bottleneck layers) to save computation."
    },
    {
      id: 105,
      question: "What does 'Label Smoothing' do when training a classification network?",
      options: ["It removes noisy labels from the training set", "It applies a Gaussian filter to the input images", "It softens the hard one-hot encoded targets (e.g., 1.0 becomes 0.9, and 0.0 becomes 0.01), preventing the model from becoming overly confident", "It averages the predictions of multiple models"],
      correctAnswer: 2,
      explanation: "Label smoothing replaces hard 0 and 1 targets with slightly softened values. This prevents the network from driving weights to infinity to push softmax outputs to exactly 1, acting as a regularizer."
    },
    {
      id: 106,
      question: "In the context of self-supervised learning, what is the goal of Contrastive Loss (e.g., SimCLR)?",
      options: ["To minimize the difference between an image and its autoencoded reconstruction", "To maximize the agreement between differently augmented views of the same data point, while minimizing agreement with other data points", "To generate realistic fake images to fool a discriminator", "To predict the next word in a sequence"],
      correctAnswer: 1,
      explanation: "Contrastive learning learns representations by pulling together embeddings of augmented versions of the same image (positive pairs) and pushing apart embeddings of different images (negative pairs)."
    },
    {
      id: 107,
      question: "What is the 'Receptive Field' of a neuron in a CNN?",
      options: ["The specific activation function applied to the neuron", "The number of output channels produced by the filter", "The local region of the original input volume that affects the activation of that specific neuron", "The total number of parameters in the convolutional layer"],
      correctAnswer: 2,
      explanation: "The receptive field is the specific spatial area in the original input image that a neuron's activation depends on. As you go deeper into the network, the receptive field grows."
    },
    {
      id: 108,
      question: "Why do Transformer models use 'Multi-Head Attention' instead of a single attention mechanism?",
      options: ["To reduce the memory footprint of the model", "To allow the model to jointly attend to information from different representation subspaces at different positions", "To replace the feed-forward neural network layers", "Because a single head cannot calculate softmax over large sequences"],
      correctAnswer: 1,
      explanation: "Multi-head attention projects Queries, Keys, and Values multiple times into different smaller dimensions. Each 'head' learns to focus on different types of relationships (e.g., syntax vs. semantics)."
    },
    {
      id: 109,
      question: "What does 'Weight Decay' essentially equate to in deep learning optimizers like SGD?",
      options: ["L1 Regularization", "L2 Regularization", "Dropout", "Learning rate annealing"],
      correctAnswer: 1,
      explanation: "In standard SGD, weight decay is mathematically equivalent to L2 regularization, as it adds a penalty proportional to the sum of squared weights to the loss, effectively decaying the weights at each step."
    },
    {
      id: 110,
      question: "In sequence-to-sequence models with attention (pre-Transformer), what does the attention mechanism compute?",
      options: ["A fixed-size context vector for the entire input sequence", "A dynamic context vector at each decoding step, created by taking a weighted sum of the encoder hidden states", "The positional encodings of the input words", "The exact translation dictionary mapping"],
      correctAnswer: 1,
      explanation: "Unlike a basic Seq2Seq model that squashes the input into one fixed vector, attention computes a new context vector at every output step by weighing the relevance of all input encoder states."
    },
    {
      id: 111,
      question: "What is the purpose of 'Gradient Clipping'?",
      options: ["To force small gradients to exactly zero to induce sparsity", "To cap the maximum value of gradients during backpropagation to prevent the Exploding Gradient problem", "To limit the maximum value of the weights in the network", "To stop training early if the loss doesn't improve"],
      correctAnswer: 1,
      explanation: "Gradient clipping bounds the gradients to a maximum threshold (either by value or by norm). It is particularly common in RNNs to prevent massive gradients from causing numeric overflow (NaNs)."
    },
    {
      id: 112,
      question: "Which of the following is true about the GeLU (Gaussian Error Linear Unit) activation function?",
      options: ["It is exactly zero for all negative numbers, like ReLU", "It bounds the output between -1 and 1", "It weighs inputs by their cumulative density function (CDF) under a standard Gaussian, allowing a smooth, non-monotonic curve for negative values", "It requires complex conjugate math to compute"],
      correctAnswer: 2,
      explanation: "GeLU is formulated as x * P(X <= x). Unlike ReLU, it has a smooth, curved shape for negative values, allowing a small negative output before asymptoting to zero, which improves performance in models like BERT."
    },
    {
      id: 113,
      question: "In object detection, what is 'Non-Maximum Suppression' (NMS) used for?",
      options: ["To suppress gradients during inference", "To remove the background class from predictions", "To filter out redundant, overlapping bounding box predictions for the same object by keeping only the one with the highest confidence", "To shrink the image size to increase inference speed"],
      correctAnswer: 2,
      explanation: "Object detectors often output multiple overlapping bounding boxes for a single object. NMS removes boxes that have high overlap (IoU) with a higher-confidence box, leaving one clean detection."
    },
    {
      id: 114,
      question: "What problem does 'Teacher Forcing' solve in training Recurrent Neural Networks for sequence generation?",
      options: ["It prevents the network from learning the syntax of the language", "It accelerates training by feeding the actual true output from the previous time step into the next time step, rather than the model's own (potentially incorrect) prediction", "It forces the student model to mimic a larger teacher model (Knowledge Distillation)", "It restricts the vocabulary size to prevent memory errors"],
      correctAnswer: 1,
      explanation: "Without teacher forcing, a wrong prediction early on cascades errors through the sequence, making learning very slow. Supplying the ground truth as the next input stabilizes and speeds up training."
    },
    {
      id: 115,
      question: "What is the key architectural feature of a ResNet (Residual Network)?",
      options: ["It uses exclusively 1x1 convolutions", "It completely removes pooling layers", "It introduces skip connections (or shortcut connections) that bypass one or more layers, adding the input to the output of the block", "It uses recurrent cells instead of convolutional filters"],
      correctAnswer: 2,
      explanation: "Skip connections allow the gradient to flow directly through the network without passing through non-linear activation functions, mitigating the vanishing gradient problem and enabling extremely deep networks."
    },
    {
      id: 116,
      question: "When computing the loss for a multi-class classification problem where classes are mutually exclusive, which activation function and loss function pair is standard?",
      options: ["Sigmoid activation + Mean Squared Error", "Softmax activation + Categorical Cross-Entropy", "Softmax activation + Binary Cross-Entropy", "ReLU activation + Huber Loss"],
      correctAnswer: 1,
      explanation: "Softmax normalizes the final layer outputs into a probability distribution that sums to 1. Categorical Cross-Entropy computes the loss between this predicted distribution and the one-hot encoded true label."
    },
    {
      id: 117,
      question: "In the context of Vision Transformers (ViT), how is an image initially processed before self-attention is applied?",
      options: ["It is passed through a deep CNN to extract a feature map", "It is flattened entirely into a single 1D vector of pixels", "It is split into a grid of fixed-size non-overlapping patches, and each patch is linearly projected into an embedding vector", "It is converted to grayscale and downsampled"],
      correctAnswer: 2,
      explanation: "ViT divides the image into a grid of patches (e.g., 16x16 pixels). Each patch is flattened and linearly projected into an embedding (a 'token'), which is then fed into the standard Transformer encoder."
    },
    {
      id: 118,
      question: "What is 'Knowledge Distillation' in deep learning?",
      options: ["Extracting rule-based logic from a trained neural network", "Training a smaller, simpler 'student' model to mimic the outputs or soft probabilities of a larger, complex 'teacher' model", "Compressing the weights of a model using Huffman coding", "Using a GAN to generate training data for a classifier"],
      correctAnswer: 1,
      explanation: "Knowledge Distillation compresses a large model into a smaller one. The student learns not just from the hard labels but from the 'soft targets' (logits/probabilities) produced by the teacher, transferring generalization."
    },
    {
      id: 119,
      question: "Why is the learning rate often 'warmed up' (gradually increased from a very small value) at the beginning of training Transformer models?",
      options: ["To prevent the hardware from overheating", "Because initial random weights cause high variance in gradients, which combined with adaptive optimizers like Adam, can push weights into bad local minima if the LR is too high initially", "To allow the data loader to cache the dataset", "Because the softmax function requires large inputs to compute derivatives"],
      correctAnswer: 1,
      explanation: "Early in training, gradients are large and unstable. A high learning rate with Adam can lead to huge weight updates that ruin the network's capacity. Warmup slowly scales the learning rate as statistics stabilize."
    },
    {
      id: 120,
      question: "What does the 'Masked Language Modeling' (MLM) objective entail in pre-training models like BERT?",
      options: ["Predicting the next sentence in a document", "Translating a masked sentence into another language", "Randomly replacing a percentage of input tokens with a [MASK] token and training the model to predict the original vocabulary id of those masked tokens based on context", "Masking out the loss gradient for padding tokens"],
      correctAnswer: 2,
      explanation: "BERT is bidirectional. To prevent it from trivially 'seeing itself' in the sequence, 15% of tokens are masked out, and the model must use both left and right context to predict the missing words."
    }
  ],
  "deployment": [
    {
      id: 121,
      question: "What is the primary function of a Dockerfile?",
      options: ["To orchestrate multiple containers across a cluster of machines", "To define the sequence of commands needed to assemble a Docker image", "To act as a package manager for Python dependencies", "To monitor the resource usage of running containers"],
      correctAnswer: 1,
      explanation: "A Dockerfile is a text document containing all the commands a user could call on the command line to assemble a container image."
    },
    {
      id: 122,
      question: "In Kubernetes, what is a 'Pod'?",
      options: ["A physical server running containerized applications", "The smallest and most basic deployable object, representing a single instance of a running process in a cluster", "A network load balancer", "A persistent storage volume attached to a container"],
      correctAnswer: 1,
      explanation: "A Pod encapsulates one or more applications (containers), storage resources, a unique network IP, and options that govern how the containers should run."
    },
    {
      id: 123,
      question: "Which deployment strategy involves running a new version of a model alongside the old version, but only the old version serves real user traffic while the new version's predictions are just logged for evaluation?",
      options: ["Blue-Green Deployment", "Canary Deployment", "Shadow Deployment", "A/B Testing"],
      correctAnswer: 2,
      explanation: "In a Shadow Deployment, the new model processes live traffic to test its behavior and performance without affecting actual users, as its predictions are just recorded."
    },
    {
      id: 124,
      question: "What is the primary difference between Data Drift and Concept Drift in production ML systems?",
      options: ["Data drift refers to changes in the model's codebase; Concept drift refers to changes in the infrastructure", "Data drift means the distribution of the input features has changed; Concept drift means the relationship between the features and the target variable has changed", "Data drift only happens in batch processing; Concept drift happens in real-time streaming", "They are identical terms used interchangeably"],
      correctAnswer: 1,
      explanation: "Data Drift (covariate shift) means P(X) changed (e.g., users got older). Concept Drift means P(Y|X) changed (e.g., users of the same age now prefer different products)."
    },
    {
      id: 125,
      question: "What is the main advantage of converting a PyTorch or TensorFlow model to ONNX (Open Neural Network Exchange) format?",
      options: ["It automatically trains the model to higher accuracy", "It encrypts the model weights for secure deployment", "It provides a standardized representation allowing the model to be run on different frameworks and hardware accelerators efficiently", "It automatically converts a regression model into a classification model"],
      correctAnswer: 2,
      explanation: "ONNX is an open format built to represent machine learning models, allowing interoperability between various frameworks (e.g., PyTorch to ONNX to TensorRT)."
    },
    {
      id: 126,
      question: "In the context of REST APIs using FastAPI or Flask, what does serialization primarily refer to when serving an ML model?",
      options: ["Running the model on sequential CPUs rather than parallel GPUs", "Converting complex data structures (like Pandas DataFrames or NumPy arrays) into a standard format like JSON so it can be transmitted over HTTP", "Training the model one batch at a time", "Assigning a unique serial number to every prediction request"],
      correctAnswer: 1,
      explanation: "Serialization is the process of translating data structures or object states into a format (e.g., JSON, XML) that can be stored or transmitted and reconstructed later."
    },
    {
      id: 127,
      question: "Why might a team choose gRPC over traditional REST for inter-microservice communication in an ML pipeline?",
      options: ["gRPC uses JSON, which is faster to parse than REST's XML", "gRPC relies entirely on HTTP/1.1, making it highly compatible with older browsers", "gRPC uses Protocol Buffers and HTTP/2, offering lower latency, binary serialization, and multiplexing", "gRPC automatically trains models via Remote Procedure Calls"],
      correctAnswer: 2,
      explanation: "gRPC uses Protocol Buffers (a binary format) and HTTP/2, making it significantly faster, more compact, and more efficient than typical JSON-over-REST."
    },
    {
      id: 128,
      question: "What is Post-Training Quantization?",
      options: ["A technique to compress a model by reducing the precision of its weights (e.g., from 32-bit floats to 8-bit integers) after it has been fully trained", "A method to discretize continuous input features into bins", "A technique to increase the size of the neural network to capture quantum effects", "The process of calculating the exact confidence interval for a prediction"],
      correctAnswer: 0,
      explanation: "Quantization reduces the memory footprint and speeds up inference by converting high-precision floating-point weights into lower-precision formats like INT8, often with minimal accuracy loss."
    },
    {
      id: 129,
      question: "Which tool is standard for defining and orchestrating complex Directed Acyclic Graphs (DAGs) for data and ML pipelines?",
      options: ["Prometheus", "Apache Airflow", "Docker Swarm", "Grafana"],
      correctAnswer: 1,
      explanation: "Apache Airflow is a platform created by the community to programmatically author, schedule, and monitor workflows defined as DAGs of tasks."
    },
    {
      id: 130,
      question: "What does MLflow's 'Model Registry' provide?",
      options: ["A centralized store to manage the full lifecycle of ML models, including versioning, stage transitions (e.g., Staging to Production), and annotations", "A cloud marketplace to buy and sell pre-trained models", "An automated hyperparameter tuning engine", "A container orchestration system identical to Kubernetes"],
      correctAnswer: 0,
      explanation: "The MLflow Model Registry is a centralized repository that provides model lineage, versioning, stage transitions, and annotations to manage models in production."
    },
    {
      id: 131,
      question: "In Canary deployments, what is the core strategy?",
      options: ["Deploying the new model only in isolated geographic regions", "Gradually shifting a small percentage of traffic to the new model, monitoring it, and then rolling it out entirely if stable", "Replacing the old model completely but keeping a backup in case of failure", "Running both models but only charging users for the better prediction"],
      correctAnswer: 1,
      explanation: "Canary releases slowly roll out the change to a small subset of users before rolling it out to the entire infrastructure, minimizing the impact of potential bugs."
    },
    {
      id: 132,
      question: "What is the primary purpose of a 'Feature Store' in an ML architecture?",
      options: ["To store the final output predictions of the models in a database", "To act as a centralized repository for organizing, storing, and serving curated features for both offline training and online real-time inference", "To store the hyperparameters used during model training", "To archive old versions of the raw data lake"],
      correctAnswer: 1,
      explanation: "A Feature Store ensures consistency between the features used for offline training and online serving, reducing point-in-time leakage and duplication of data engineering work."
    },
    {
      id: 133,
      question: "When deploying a model on AWS Lambda (Serverless), what is a 'Cold Start'?",
      options: ["The time it takes to freeze a model's weights before deployment", "The latency incurred when a function is invoked for the first time or after a period of inactivity, requiring the provider to spin up a new container", "A technique to slowly increase the learning rate", "The process of cooling down GPUs in a data center"],
      correctAnswer: 1,
      explanation: "A cold start happens when a serverless function is triggered, but no idle container is available. The cloud provider must provision a container, load the runtime, and load the code, causing delay."
    },
    {
      id: 134,
      question: "What does the Multi-Armed Bandit algorithm optimize in the context of A/B testing models in production?",
      options: ["It purely explores all models equally forever", "It purely exploits the best model from day one", "It balances exploration (trying different models to gather data) and exploitation (sending more traffic to the currently best-performing model) to minimize regret", "It ensures a strictly 50/50 split of traffic at all times"],
      correctAnswer: 2,
      explanation: "Unlike static A/B testing, Multi-Armed Bandits dynamically adjust traffic routing to favor the winning variation earlier, reducing the opportunity cost (regret) of sending users to the inferior model."
    },
    {
      id: 135,
      question: "For a real-time fraud detection system, which type of inference architecture is strictly required?",
      options: ["Batch Inference", "Offline Inference", "Streaming / Real-time (Online) Inference", "Federated Learning"],
      correctAnswer: 2,
      explanation: "Fraud detection typically requires sub-second latency to block a transaction before it completes. This mandates an online, real-time inference architecture."
    },
    {
      id: 136,
      question: "What is the purpose of SHAP (SHapley Additive exPlanations) values in a production environment?",
      options: ["To compress the model weights for faster inference", "To provide local interpretability, explaining exactly how much each feature contributed to a specific individual prediction", "To automatically tune the model's hyperparameters", "To encrypt the model's inputs for privacy"],
      correctAnswer: 1,
      explanation: "SHAP values interpret the output of any machine learning model by assigning each feature an importance value for a specific prediction, crucial for auditing and trust."
    },
    {
      id: 137,
      question: "In Kubernetes, how does an 'Ingress' differ from a basic 'Service'?",
      options: ["An Ingress is only for internal cluster traffic, while a Service is external", "An Ingress manages external access to the services in a cluster (typically HTTP), providing routing rules, SSL termination, and name-based virtual hosting", "An Ingress is a persistent volume, while a Service is networking", "They are exactly the same concept"],
      correctAnswer: 1,
      explanation: "While a Service exposes an application, an Ingress acts as an intelligent router/API Gateway sitting in front of multiple Services, handling HTTP routing, SSL, and load balancing."
    },
    {
      id: 138,
      question: "What does 'Network Pruning' do to a neural network prior to deployment?",
      options: ["It removes neurons, channels, or connections with weights close to zero to reduce model size and speed up inference without significantly harming accuracy", "It restricts the network from accessing the internet", "It truncates the input data to a fixed length", "It flattens the network into a single layer"],
      correctAnswer: 0,
      explanation: "Pruning removes redundant or unimportant weights from a trained network, yielding a sparse network that requires less memory and computes faster."
    },
    {
      id: 139,
      question: "What combination of tools is considered the industry standard for monitoring the health, metrics, and alerts of ML infrastructure?",
      options: ["Jupyter and Pandas", "Prometheus (for metrics scraping/storage) and Grafana (for visualization)", "Airflow and MLflow", "Docker and Kubernetes"],
      correctAnswer: 1,
      explanation: "Prometheus is a time-series database optimized for scraping metrics, and Grafana is the standard dashboarding tool used to visualize those metrics and set up alerts."
    },
    {
      id: 140,
      question: "What is a 'Triton Inference Server' (by NVIDIA)?",
      options: ["A database for storing raw tabular data", "A framework for training large language models", "An open-source software that provides a single standardized inference server to deploy, serve, and scale AI models from multiple frameworks on GPUs and CPUs", "A cloud-based IDE for data scientists"],
      correctAnswer: 2,
      explanation: "Triton standardizes model deployment, allowing models trained in TensorFlow, PyTorch, ONNX, etc., to be served efficiently with features like dynamic batching on both CPUs and GPUs."
    },
    {
      id: 141,
      question: "In CI/CD (Continuous Integration / Continuous Deployment) for Machine Learning (CT/CD), what does 'Continuous Training' refer to?",
      options: ["Training the model manually once a year", "An automated pipeline that retrains the model on new data, validates it, and triggers a deployment if performance improves", "Leaving a neural network training indefinitely on the same data", "Continuously generating synthetic data"],
      correctAnswer: 1,
      explanation: "In MLOps, CT implies that the system automatically detects data drift or a schedule, extracts new data, retrains the model, evaluates it against the current production model, and promotes it if better."
    },
    {
      id: 142,
      question: "What is the primary drawback of using a fully synchronous REST API for a deep learning model that takes 15 seconds to run inference?",
      options: ["REST APIs cannot send JSON data", "The client connection might timeout waiting for the response, and it ties up server threads", "REST APIs only support integer inputs", "REST APIs cannot be containerized"],
      correctAnswer: 1,
      explanation: "Synchronous HTTP requests hold the connection open. For long-running ML tasks, this leads to timeouts and thread exhaustion. Asynchronous processing (e.g., via Celery/Redis or Kafka) is preferred."
    },
    {
      id: 143,
      question: "What is 'Dynamic Batching' (or In-flight Batching) in model serving?",
      options: ["Training the model on different batch sizes randomly", "The serving engine holding individual incoming requests for a few milliseconds to group them into a batch before passing them to the GPU, maximizing throughput", "Batching the data lake into smaller files", "Changing the neural network's architecture dynamically"],
      correctAnswer: 1,
      explanation: "GPUs are highly efficient at processing batches. Dynamic batching delays requests slightly to form a batch, drastically increasing total throughput with only a minor latency penalty."
    },
    {
      id: 144,
      question: "When measuring service reliability, what is an SLI (Service Level Indicator)?",
      options: ["A legally binding contract with the customer", "The internal target goal (e.g., 99.9%)", "A carefully defined quantitative measure of some aspect of the level of service that is provided (e.g., the exact percentage of HTTP 200 responses)", "The penalty paid if the service goes down"],
      correctAnswer: 2,
      explanation: "An SLI is the actual metric (what you measure). An SLO (Objective) is the target for that SLI. An SLA (Agreement) is the business contract tied to the SLO."
    },
    {
      id: 145,
      question: "What does 'Data Serialization' format like Apache Arrow provide over traditional CSV?",
      options: ["It is human-readable in any text editor", "It is an in-memory columnar format optimized for analytical operations, allowing zero-copy reads and high-speed data transfer", "It inherently trains machine learning models on the fly", "It converts all data to string format"],
      correctAnswer: 1,
      explanation: "Apache Arrow provides a standardized columnar memory format, enabling lightning-fast data processing and zero-copy data sharing between languages (e.g., Python and C++) without serialization overhead."
    },
    {
      id: 146,
      question: "Why is tracking 'Prediction Distributions' crucial in ML monitoring?",
      options: ["To ensure the model outputs a normal distribution", "Because ground truth labels are often delayed or unavailable in real-time, making changes in the output distribution an early proxy indicator of drift", "To calculate the learning rate for the next epoch", "To balance the load across servers"],
      correctAnswer: 1,
      explanation: "In production, you rarely know immediately if a prediction is right or wrong. By monitoring the statistical distribution of the predictions themselves, you can quickly detect if the model's behavior shifts."
    },
    {
      id: 147,
      question: "What is 'Federated Learning'?",
      options: ["Training a centralized model in a single massive data center", "A distributed machine learning approach where the model is trained across multiple decentralized edge devices or servers holding local data samples, without exchanging the raw data", "A method to merge multiple different algorithms into one ensemble", "Deploying models exclusively on federated cloud providers"],
      correctAnswer: 1,
      explanation: "Federated learning protects privacy by sending the model to the data (e.g., smartphones), computing local updates, and sending only the parameter updates back to a central server to be aggregated."
    },
    {
      id: 148,
      question: "When dealing with Blue-Green deployments, what is the 'Green' environment?",
      options: ["The legacy environment that is scheduled for deprecation", "The idle environment running the new version of the application, waiting for traffic to be switched over from the Blue environment", "The environment used exclusively for training models", "The database storage layer"],
      correctAnswer: 1,
      explanation: "In Blue-Green, Blue is typically the live production environment. Green is an identical environment with the new version. Once tested, a router switches all traffic from Blue to Green instantly."
    },
    {
      id: 149,
      question: "What is the primary function of a tool like DVC (Data Version Control)?",
      options: ["To version control the source code of the application", "To track, version, and share massive data files and machine learning models alongside Git, without storing the actual large files in Git", "To orchestrate Kubernetes clusters", "To serve models via REST APIs"],
      correctAnswer: 1,
      explanation: "Git struggles with large binary files. DVC tracks data and models using metadata files stored in Git, while the actual heavy files are pushed to remote storage like S3."
    },
    {
      id: 150,
      question: "What does 'Out-of-Distribution (OOD) Detection' attempt to solve in production models?",
      options: ["Identifying when incoming data points are significantly different from the training data distribution, allowing the system to flag them for human review or fallback", "Detecting outliers in the training data to remove them", "Distributing the model weights across multiple GPUs", "Ensuring the output classes are perfectly balanced"],
      correctAnswer: 0,
      explanation: "Models are notoriously overconfident on data they've never seen. OOD detection flags inputs that are too far from the training manifold, preventing confident but absurd predictions."
    }
  ]
};

const phase5Questions = [
  {
    id: 151,
    question: "What is the primary role of a Vector Database in a Retrieval-Augmented Generation (RAG) architecture?",
    options: ["To store the final generated text outputs for caching", "To perform semantic search by comparing dense vector embeddings of queries against document embeddings", "To fine-tune the Large Language Model on domain-specific data", "To route user requests to the appropriate microservice"],
    correctAnswer: 1,
    explanation: "Vector databases store data as high-dimensional vectors and enable fast similarity searches, allowing the RAG system to retrieve the most semantically relevant documents for a given query."
  },
  {
    id: 152,
    question: "In the context of Large Language Models, what does 'LoRA' (Low-Rank Adaptation) accomplish?",
    options: ["It significantly reduces the number of trainable parameters during fine-tuning by injecting small rank-decomposition matrices into transformer layers", "It compresses the model's vocabulary size to speed up inference", "It allows the model to connect directly to external SQL databases", "It forces the model to unlearn toxic or biased behaviors"],
    correctAnswer: 0,
    explanation: "LoRA freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer, dramatically reducing the memory and compute required for fine-tuning."
  },
  {
    id: 153,
    question: "What is a major advantage of using 'Few-Shot Prompting' over 'Zero-Shot Prompting'?",
    options: ["It permanently alters the model's underlying weights to improve performance", "It guarantees that the model will not hallucinate facts", "It provides the model with examples of the desired input/output format within the prompt, guiding it to produce more accurate and consistently formatted responses", "It reduces the token count of the prompt, saving API costs"],
    correctAnswer: 2,
    explanation: "Few-shot prompting includes examples (shots) in the prompt context. This conditions the model to follow a specific pattern, tone, or format without needing to update its weights."
  },
  {
    id: 154,
    question: "When deploying machine learning models, what is 'Model Drift' (or Concept Drift)?",
    options: ["When the physical server running the model overheats and drops requests", "When the statistical properties of the target variable change over time, causing model predictions to become less accurate", "When the model's source code becomes outdated and incompatible with new library versions", "When the model outputs drift randomly due to floating-point errors"],
    correctAnswer: 1,
    explanation: "Concept drift happens when the relationship between the input data and the target variable changes over time (e.g., user behavior shifts), leading to degraded model performance."
  },
  {
    id: 155,
    question: "Which of the following best describes the 'Chain-of-Thought' (CoT) prompting technique?",
    options: ["Linking multiple LLMs together in a pipeline", "Asking the model to output a single final answer without any reasoning", "Prompting the model to generate intermediate reasoning steps before arriving at a final answer, improving performance on complex tasks", "Using blockchain technology to verify the model's outputs"],
    correctAnswer: 2,
    explanation: "Chain-of-Thought prompting encourages the model to 'think out loud' by generating intermediate steps, which significantly improves its ability to solve logic, math, and reasoning problems."
  },
  {
    id: 156,
    question: "What is the primary function of an 'Agent' in the context of LLM applications (like LangChain or LlamaIndex)?",
    options: ["To act as a firewall against prompt injection attacks", "To autonomously decide which tools or APIs to call to fulfill a user request, based on the LLM's reasoning", "To serve as the primary storage layer for user conversation history", "To compress the model for deployment on mobile devices"],
    correctAnswer: 1,
    explanation: "An Agent uses an LLM as a reasoning engine to determine a sequence of actions. It can decide to use external tools (like calculators, web search, or APIs) to gather information before answering."
  },
  {
    id: 157,
    question: "In MLOps, what is the purpose of a 'Feature Store'?",
    options: ["To sell machine learning models to other companies", "To store the hyperparameters used during model training", "To centralize, standardize, and serve curated machine learning features for both offline training and online inference", "To store user feedback and ratings on model predictions"],
    correctAnswer: 2,
    explanation: "A Feature Store ensures that features used for training perfectly match the features used in production (inference), preventing training-serving skew and enabling feature reuse."
  },
  {
    id: 158,
    question: "What is 'Quantization' in the context of deep learning deployment?",
    options: ["Increasing the precision of model weights to 64-bit floats for better accuracy", "Converting the model's weights and activations from higher precision (like FP32) to lower precision (like INT8) to reduce memory usage and increase inference speed", "Adding quantum noise to the training data to improve robustness", "Deploying the model across a quantum computing cluster"],
    correctAnswer: 1,
    explanation: "Quantization reduces the precision of the numbers used to represent the model. This makes the model much smaller and faster to run, usually with a negligible drop in accuracy."
  },
  {
    id: 159,
    question: "When evaluating an LLM generation pipeline, what does the 'RAGAS' (Retrieval Augmented Generation Assessment) framework primarily measure?",
    options: ["The training speed of the underlying transformer model", "The latency of the vector database queries", "Metrics like Faithfulness (no hallucinations) and Answer Relevance based on the retrieved context", "The total number of parameters in the LLM"],
    correctAnswer: 2,
    explanation: "RAGAS evaluates RAG systems across multiple dimensions, such as whether the answer is faithful to the retrieved context and whether the retrieved context is relevant to the user's query."
  },
  {
    id: 160,
    question: "What is a 'Shadow Deployment' in MLOps?",
    options: ["Deploying a model without telling the end users", "Routing all live traffic to the new model immediately to test its limits", "Deploying a new model alongside the current one, routing live traffic to both, but only returning the current model's predictions to the user while logging the new model's predictions for evaluation", "Shutting down the primary model entirely and relying on a fallback heuristic"],
    correctAnswer: 2,
    explanation: "Shadow deployment allows you to safely evaluate how a new model performs on real-world, live traffic without impacting the user experience, as its outputs are only logged, not served."
  }
];

const extraQuestions = [
  // --- Phase 1: Foundations (IDs 161-170) ---
  {
    id: 161,
    question: "When writing a metaclass in Python, what is the primary difference between overriding __new__ and overriding __init__?",
    options: [
      "__new__ is called to create the class instance (type object), whereas __init__ is called to initialize the newly created class object.",
      "__init__ allocates the class namespace memory, whereas __new__ populates it.",
      "__new__ is only called for subclasses, whereas __init__ is called for the base class.",
      "__new__ operates on class methods, whereas __init__ operates on class attributes."
    ],
    correctAnswer: 0,
    explanation: "__new__ is the allocator method that creates and returns the class object. __init__ is the initializer method that configures the class after creation."
  },
  {
    id: 162,
    question: "Which pattern is required to write a Python decorator that accepts custom parameters (e.g. @decorator(name='test'))?",
    options: [
      "A decorator class with only the __call__ method",
      "Three nested functions: the outer accepts parameters, the middle accepts the function, the inner wraps execution",
      "A standard decorator using the functools.wraps helper with a single parameter",
      "A function that returns a generator yielding callable closures"
    ],
    correctAnswer: 1,
    explanation: "To pass parameters to a decorator, you need an outer function to capture the parameters, which returns the actual decorator function, which in turn returns the wrapper closure."
  },
  {
    id: 163,
    question: "How does CPython's garbage collection handle reference cycles between objects?",
    options: [
      "It relies solely on reference counting, ignoring reference cycles which leak memory.",
      "It runs a cycle-detection algorithm using double-linked lists of all container objects (tracked generators, lists, dicts).",
      "It forces the developer to manually invoke the gc.collect() method for all circular objects.",
      "It periodically compiles all reference loops to assembly static memory blocks."
    ],
    correctAnswer: 1,
    explanation: "While reference counting handles immediate deallocations, CPython uses a cyclic garbage collector that periodically scans container objects for self-referential reference loops."
  },
  {
    id: 164,
    question: "In statistical hypothesis testing, how are the Type I error rate (alpha) and statistical power related?",
    options: [
      "They are independent and can be minimized simultaneously without increasing sample size.",
      "As alpha decreases, the probability of committing a Type II error increases, which decreases statistical power.",
      "As alpha increases, statistical power always decreases.",
      "Type I error is equivalent to the inverse of statistical power."
    ],
    correctAnswer: 1,
    explanation: "Lowering alpha (making the test stricter) makes it harder to reject the null hypothesis, thereby increasing the Type II error rate (beta). Since Power = 1 - beta, power decreases."
  },
  {
    id: 165,
    question: "What is a key disadvantage of utilizing a Hash Index over a B-Tree Index in a relational database?",
    options: [
      "Hash indexes require quadratic lookup time",
      "Hash indexes do not support range scans or inequality operations efficiently",
      "Hash indexes are always stored in virtual memory swap spaces",
      "Hash indexes cannot handle composite keys"
    ],
    correctAnswer: 1,
    explanation: "Hash indexes operate using key-to-bucket mappings (O(1) exact match lookup), making them useless for range queries (e.g. WHERE val > 10) which B-Trees excel at."
  },
  {
    id: 166,
    type: "open-ended",
    question: "Explain how you would write a custom decorator in Python that caches the output of a function (memoization) and handles keyword arguments.",
    explanation: "The user should describe creating a dictionary cache, creating a nested wrapper function that serializes arguments/kwargs (e.g. converting kwargs to a tuple of sorted items) to serve as dict keys, and using functools.wraps."
  },
  {
    id: 167,
    type: "open-ended",
    question: "Describe the Central Limit Theorem (CLT) and why it is critical for constructing confidence intervals on sample statistics.",
    explanation: "The user should state that as sample size n increases, the sampling distribution of the mean approaches a normal distribution, regardless of the population distribution shape, allowing us to use z/t distributions for confidence intervals."
  },
  {
    id: 168,
    type: "open-ended",
    question: "How does a B-Tree index speed up range queries in SQL? Explain the tree traversal structure.",
    explanation: "The user should explain that a B-Tree is a self-balancing search tree. Leaf nodes are linked sequentially in a double-linked list, allowing the query planner to find the start node in O(log n) and traverse the leaves sequentially."
  },
  {
    id: 169,
    question: "Which pandas merge function is designed for merging time-series datasets on timestamps that do not match exactly?",
    options: [
      "pd.merge_asof",
      "pd.concat",
      "df.join(how='outer')",
      "pd.merge(how='cross')"
    ],
    correctAnswer: 0,
    explanation: "pd.merge_asof is specialized for merging on nearby keys (e.g. matching a transaction with the most recent exchange rate timestamp prior to it)."
  },
  {
    id: 170,
    question: "What is the result of using the window frame clause 'ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING' in a SQL aggregation query?",
    options: [
      "It aggregates over all rows from the beginning of the partition to the current row.",
      "It aggregates over a moving frame consisting of the previous row, the current row, and the next row.",
      "It restricts the calculation to rows containing unique values only.",
      "It skips the current row and aggregates the adjacent boundaries only."
    ],
    correctAnswer: 1,
    explanation: "This clause specifies a sliding frame that includes the row immediately prior, the current row, and the row immediately following, totaling a window size of 3 rows."
  },

  // --- Phase 2: Core ML (IDs 171-180) ---
  {
    id: 171,
    question: "What is the primary difference in how features are sampled between Random Forests and Gradient Boosted Trees (XGBoost)?",
    options: [
      "Random Forest samples features once per tree, whereas XGBoost samples features at each split node level.",
      "Random Forest uses all features at every node, whereas XGBoost selects features randomly.",
      "Random Forest uses bagging for columns, whereas XGBoost only samples rows.",
      "Both sample features identically at the root node level only."
    ],
    correctAnswer: 0,
    explanation: "Random Forest selects a random subset of features to consider at each node split. XGBoost supports feature sampling per tree, per level, or per node split."
  },
  {
    id: 172,
    question: "What does the Mercer Theorem guarantee in Support Vector Machine (SVM) kernel methods?",
    options: [
      "That the hyperplane will always separate the classes with zero training error",
      "That any symmetric positive semi-definite kernel function corresponds to an inner product in some Hilbert space",
      "That the learning rate will decay exponentially",
      "That the SVM optimization will converge in linear time"
    ],
    correctAnswer: 1,
    explanation: "Mercer's theorem states that any positive semi-definite kernel can be expressed as an inner product, guaranteeing that the dual optimization remains convex."
  },
  {
    id: 173,
    question: "Why does L1 regularization (LASSO) yield sparse models with zero coefficients, whereas L2 (Ridge) does not?",
    options: [
      "L1's penalty has a constant gradient magnitude that pushes coefficients exactly to zero at the coordinate axes.",
      "L2 regularization increases the size of coefficients randomly.",
      "L1 uses a smooth quadratic boundary that avoids zero points.",
      "L2 is solved analytically, whereas L1 uses non-iterative heuristics."
    ],
    correctAnswer: 0,
    explanation: "The L1 penalty is |w| (absolute value), which has sharp corners (non-differentiable points) at zero. Optimization frequently lands on these corners, yielding sparse solutions."
  },
  {
    id: 174,
    question: "What is the primary objective of Propensity Score Matching in causal inference study design?",
    options: [
      "To maximize the treatment effect across all subgroups",
      "To balance covariates between treated and control groups in observational studies to mimic a randomized experiment",
      "To predict the treatment variable with maximum accuracy",
      "To test for correlation between the outcome and independent features"
    ],
    correctAnswer: 1,
    explanation: "Propensity matching scores the probability of receiving treatment. Matching treated and control units with similar scores balances confounding variables, reducing bias."
  },
  {
    id: 175,
    question: "In highly imbalanced datasets, why is the Precision-Recall AUC (PR-AUC) preferred over the ROC-AUC score?",
    options: [
      "PR-AUC is faster to compute.",
      "ROC-AUC is sensitive to changes in the majority (negative) class, masking poor performance on the minority (positive) class.",
      "PR-AUC is mathematically bounded between -1 and 1.",
      "PR-AUC ignores false positives entirely."
    ],
    correctAnswer: 1,
    explanation: "ROC-AUC uses False Positive Rate (FPR), which has the majority class count in its denominator. A huge majority class makes FPR tiny, keeping ROC-AUC deceptively high."
  },
  {
    id: 176,
    type: "open-ended",
    question: "Explain the bias-variance tradeoff. How does increasing model complexity affect training and test errors?",
    explanation: "The user should state that bias is error from erroneous assumptions (underfitting) and variance is error from sensitivity to small fluctuations (overfitting). More complexity decreases training error but increases test error once variance dominates."
  },
  {
    id: 177,
    type: "open-ended",
    question: "Describe how coordinate descent handles the non-differentiable penalty at zero in LASSO regression.",
    explanation: "The user should explain that coordinate descent updates one parameter at a time. It uses the soft-thresholding operator: if the partial derivative correlation is smaller than lambda, it sets the coefficient exactly to zero."
  },
  {
    id: 178,
    type: "open-ended",
    question: "What is propensity score matching, and when would you use it over a randomized controlled trial (RCT)?",
    explanation: "The user should explain that propensity score matching matches treated and control observations based on conditional probability scores. Used in observational studies when RCTs are unethical or logistically impossible."
  },
  {
    id: 179,
    question: "What is a major risk when using SMOTE (Synthetic Minority Over-sampling Technique) to balance data?",
    options: [
      "It causes model coefficients to drift to negative infinity",
      "It can create noisy synthetic points along the boundary between classes, leading to overfitting and class overlap",
      "It reduces the size of the dataset, causing underfitting",
      "It removes critical outliers from the majority class"
    ],
    correctAnswer: 1,
    explanation: "SMOTE creates synthetic points along lines connecting minority neighbors. If neighbors are outliers or near the decision boundary, SMOTE creates points in majority territory, causing overlap."
  },
  {
    id: 180,
    question: "Mathematically, how does Entropy differ from Gini Impurity when evaluating splits in a Decision Tree?",
    options: [
      "Entropy uses logarithmic scaling (-p log2 p), making it more computationally expensive than Gini (1 - sum(p^2)).",
      "Gini impurity is mathematically bounded between 0 and infinity.",
      "Entropy only supports binary splits, whereas Gini supports multi-way splits.",
      "There is no difference; they yield identical numerical values."
    ],
    correctAnswer: 0,
    explanation: "Entropy calculates information content using log2, which requires division/log CPU calculations. Gini uses simple squaring, making it faster to calculate."
  },

  // --- Phase 3: Deep Learning (IDs 181-190) ---
  {
    id: 181,
    question: "What is the computational complexity of the self-attention mechanism in the standard Transformer with respect to sequence length N?",
    options: [
      "O(N)",
      "O(N log N)",
      "O(N^2)",
      "O(N^3)"
    ],
    correctAnswer: 2,
    explanation: "Calculating self-attention requires computing the dot-product between Queries (Q) and Keys (K) for all tokens, which is an N x N matrix multiplication, leading to O(N^2) complexity."
  },
  {
    id: 182,
    question: "How does the Adam optimizer utilize first and second moments to adjust learning rates?",
    options: [
      "It scales learning rates by the exponential moving average of gradients (first moment) and squared gradients (second moment).",
      "It multiplies the learning rate by the loss curvature.",
      "It computes the Hessian matrix dynamically to adjust rates.",
      "It uses gradient clipping to prevent gradient explosions."
    ],
    correctAnswer: 0,
    explanation: "Adam tracks the mean of gradients (first moment, for momentum) and uncentered variance of gradients (second moment, for scaling step size per parameter)."
  },
  {
    id: 183,
    question: "What is a critical difference in how Batch Normalization behaves during training versus inference?",
    options: [
      "During inference, it updates running mean and variance variables dynamically.",
      "During training, it uses batch statistics; during inference, it freezes statistics and uses accumulated running mean and variance.",
      "It behaves identically in both phases.",
      "It is bypassed entirely during inference."
    ],
    correctAnswer: 1,
    explanation: "To prevent batch dependency in production, Batch Norm freezes its metrics at inference, using the global population mean and variance estimated during training."
  },
  {
    id: 184,
    question: "Why do residual connections (skip connections) in ResNets mitigate the vanishing gradient problem?",
    options: [
      "They scale the gradients by a factor of 10 at each layer.",
      "They allow gradients to flow directly back through the identity mapping without being multiplied by weights.",
      "They convert the model into a linear regression system.",
      "They compress the activation sizes during backpropagation."
    ],
    correctAnswer: 1,
    explanation: "The skip connection adds the input directly to the layer output: F(x) + x. In backprop, the gradient contains a term of +1, ensuring gradients can flow backward even if F'(x) approaches 0."
  },
  {
    id: 185,
    question: "Which gate in an LSTM cell is responsible for deciding how much of the new candidate state should update the cell memory?",
    options: [
      "Forget Gate",
      "Input Gate",
      "Output Gate",
      "Reset Gate"
    ],
    correctAnswer: 1,
    explanation: "The Input Gate (multiplied by the candidate state tanh output) controls how much new information gets written to the long-term cell state."
  },
  {
    id: 186,
    type: "open-ended",
    question: "Describe the mathematical mechanism of self-attention in Transformers. Why does it scale quadratically with sequence length?",
    explanation: "The user should write the formula Softmax(QK^T / sqrt(d_k))V. Explain that Q (Query) and K (Key) matrices of length N are multiplied, resulting in an N x N similarity matrix, which scales quadratically (O(N^2))."
  },
  {
    id: 187,
    type: "open-ended",
    question: "Explain the vanishing gradient problem in deep neural networks. How do residual connections solve this?",
    explanation: "The user should explain that chain rule multiplication of small gradients (e.g. sigmoid derivatives) causes gradients to decay exponentially. Skip connections add the identity term F(x) + x, adding a constant 1 to backprop derivatives."
  },
  {
    id: 188,
    type: "open-ended",
    question: "How does Batch Normalization differ from Layer Normalization, particularly in terms of batch dependency?",
    explanation: "The user should state that Batch Norm normalizes across the batch dimension for each feature, making it dependent on batch size and values. Layer Norm normalizes across all features for a single training example, removing batch dependency."
  },
  {
    id: 189,
    question: "In PyTorch, what is the role of the 'Autograd' engine?",
    options: [
      "It automatically optimizes SQL queries",
      "It calculates Jacobian-vector products dynamically during backward passes to compute gradients for leaf nodes",
      "It compiles model code into C++ binaries automatically",
      "It runs hyperparameter grid searches in parallel"
    ],
    correctAnswer: 1,
    explanation: "Autograd tracks operations on tensors to construct a directed acyclic graph (DAG), which is traversed backward to compute derivatives automatically."
  },
  {
    id: 190,
    question: "What is the key characteristic of the GELU (Gaussian Error Linear Unit) activation function compared to ReLU?",
    options: [
      "GELU is bounded between 0 and 1, whereas ReLU goes to infinity.",
      "GELU is a smooth, non-monotonic curve that weights inputs by their value according to the normal distribution cumulative distribution function.",
      "GELU is completely linear, whereas ReLU is non-linear.",
      "GELU is only calculated in 8-bit integers."
    ],
    correctAnswer: 1,
    explanation: "GELU scales the input x by the probability that a normal distribution variable is less than x. This makes it smooth and differentiable everywhere, outperforming ReLU in transformers."
  },

  // --- Phase 4: Storytelling/Deployment (IDs 191-200) ---
  {
    id: 191,
    question: "Which statistical test is commonly used in model monitoring to detect data drift by comparing two continuous distributions?",
    options: [
      "Two-sample Kolmogorov-Smirnov (KS) test",
      "Chi-Square test of independence",
      "One-way ANOVA",
      "Fisher's Exact test"
    ],
    correctAnswer: 0,
    explanation: "The KS test computes the maximum distance between the empirical cumulative distribution functions of two datasets, identifying if a feature's distribution has drifted."
  },
  {
    id: 192,
    question: "What is the primary advantage of multi-stage builds in Docker containerization?",
    options: [
      "It speeds up container download times by splitting the image across multiple registries.",
      "It allows separating build-time dependencies (compilers, SDKs) from runtime environments, resulting in significantly smaller production images.",
      "It runs the container using multiple host CPUs simultaneously.",
      "It automatically encrypts the container source code."
    ],
    correctAnswer: 1,
    explanation: "Multi-stage builds allow you to compile code in a heavy image and copy only the compiled binaries/artifacts into a clean, minimal base image (like Alpine), reducing image size."
  },
  {
    id: 193,
    question: "How does FastAPI manage synchronous (def) endpoints differently from asynchronous (async def) endpoints under the hood?",
    options: [
      "FastAPI runs def endpoints in an external thread pool to prevent blocking the event loop, whereas async def endpoints run directly on the event loop.",
      "FastAPI runs def endpoints faster than async def endpoints.",
      "def endpoints are converted to async def automatically using compiler macros.",
      "async def endpoints can only access vector databases."
    ],
    correctAnswer: 0,
    explanation: "If you define an endpoint as regular 'def', FastAPI runs it in a thread pool to avoid blocking the single-threaded event loop. 'async def' runs directly, expecting non-blocking code."
  },
  {
    id: 194,
    question: "What is the purpose of specifying a 'Model Signature' in MLflow?",
    options: [
      "To cryptographically sign the model file to verify publisher authenticity",
      "To define the schema (input names, types, and outputs) of the model for validation and auto-documentation",
      "To store the author's contact information in the metadata",
      "To limit model deployment to specific hardware nodes"
    ],
    correctAnswer: 1,
    explanation: "An MLflow model signature documents expected input and output data types, enabling automated model validation and serving interfaces to check incoming request structures."
  },
  {
    id: 195,
    question: "In Prometheus monitoring, what is the key difference between a Counter and a Gauge metric?",
    options: [
      "Counters can decrease, whereas Gauges can only increase.",
      "Counters only increase (except on resets), whereas Gauges can go up and down to represent current states.",
      "Counters are stored in databases, Gauges are stored in memory.",
      "Gauges are only calculated once per day."
    ],
    correctAnswer: 1,
    explanation: "A Counter tracks cumulative counts (e.g. total API requests). A Gauge represents a variable value (e.g. CPU temperature, current queue size) that fluctuates."
  },
  {
    id: 196,
    type: "open-ended",
    question: "Explain how you would set up a monitoring system to detect data drift in a deployed model using the Kolmogorov-Smirnov (KS) test.",
    explanation: "The user should explain caching raw feature distributions during training, scheduling a job to pull production inference inputs, applying the KS-test to compare distributions, and alerting if the p-value falls below alpha."
  },
  {
    id: 197,
    type: "open-ended",
    question: "Describe the benefit of multi-stage Docker builds when containerizing a PyTorch model for production. Why is size critical?",
    explanation: "The user should explain that PyTorch and build SDKs are huge. Multi-stage builds let you compile CUDA/wheels in a builder stage, copy only what is needed to a minimal production runtime, reducing cold-start times."
  },
  {
    id: 198,
    type: "open-ended",
    question: "How do asynchronous endpoints in FastAPI handle multiple requests concurrently compared to synchronous endpoints?",
    explanation: "The user should explain that regular def synchronous endpoints block threads in a thread pool. Async def endpoints run on the single-threaded event loop, yielding control (await) during I/O operations, letting other tasks execute."
  },
  {
    id: 199,
    question: "What is the purpose of Triton Inference Server's Dynamic Batching feature?",
    options: [
      "It dynamically splits model weights across multiple servers.",
      "It groups individual inference requests arriving within a short time window into a single batch to maximize GPU utilization.",
      "It compiles the model weights from float32 to float16 dynamically.",
      "It schedules batch training jobs automatically."
    ],
    correctAnswer: 1,
    explanation: "GPU throughput is maximized when processing batches. Dynamic batching collects multiple individual requests arriving milliseconds apart and runs them as a batch on the GPU."
  },
  {
    id: 200,
    question: "In Kubernetes model deployments, what is the difference between a Liveness Probe and a Readiness Probe?",
    options: [
      "Liveness checks if the container is running; readiness checks if the container is ready to accept traffic.",
      "Readiness checks if the container is active; liveness checks if the API keys are correct.",
      "Both are identical and run sequentially.",
      "Liveness runs on host nodes; readiness runs inside pod virtual machines."
    ],
    correctAnswer: 0,
    explanation: "A liveness probe tells Kubernetes when to restart a crashed container. A readiness probe tells Kubernetes when the container is fully loaded (e.g. weights loaded) and can receive requests."
  },

  // --- Phase 5: LLMs & Capstone (IDs 201-210) ---
  {
    id: 201,
    question: "How does QLoRA (Quantized Low-Rank Adaptation) quantize transformer weights during fine-tuning?",
    options: [
      "It quantizes weights to 4-bit NormalFloat (NF4), saving memory while maintaining weight precision distributions.",
      "It converts all weights to boolean matrices.",
      "It compresses the model weights using gzip.",
      "It runs the entire model in 1-bit binary values."
    ],
    correctAnswer: 0,
    explanation: "QLoRA uses NormalFloat 4 (NF4), which is an information-theoretically optimal quantization for normally distributed weights, keeping memory minimal during fine-tuning."
  },
  {
    id: 202,
    question: "What does the Parent Document Retriever do in a Retrieval-Augmented Generation (RAG) system?",
    options: [
      "It retrieves only the parent metadata header.",
      "It indexes documents into small chunks for semantic search, but retrieves the larger parent document context to pass to the LLM.",
      "It groups documents by author credentials.",
      "It translates document languages automatically."
    ],
    correctAnswer: 1,
    explanation: "Smaller chunks are better for vector search lookup, but larger contexts are better for LLMs to generate answers. Parent Document Retrieval bridges this by searching small chunks but returning parents."
  },
  {
    id: 203,
    question: "What is the purpose of the policy clipping mechanism in Proximal Policy Optimization (PPO)?",
    options: [
      "To clip the output token lengths during text generation",
      "To prevent the policy update from stepping too far from the previous policy, maintaining training stability",
      "To clip negative gradients to zero",
      "To limit the model to small batch sizes"
    ],
    correctAnswer: 1,
    explanation: "PPO clips the probability ratio between new and old policies in the objective function, preventing destructive updates and keeping RLHF training stable."
  },
  {
    id: 204,
    question: "Which technique is most effective for mitigating Prompt Injection attacks in production LLM applications?",
    options: [
      "Encoding the prompt in base64 format",
      "Implementing structured schema parsing, separation of user instructions via XML tags, and secondary guardrail classification models",
      "Limiting the prompt to less than 20 words",
      "Disabling context retrieval entirely"
    ],
    correctAnswer: 1,
    explanation: "Mitigation requires defense-in-depth: separating system instructions from untrusted user inputs with strict parsing delimiters and routing input to classifier guardrails (like Llama Guard)."
  },
  {
    id: 205,
    question: "What does the 'ReAct' framework combine to enable LLM agents to solve complex reasoning problems?",
    options: [
      "Recurrent neural networks and Active learning",
      "Reasoning (generating thoughts) and Acting (calling external tools/APIs) in an interleaved loop",
      "React.js frontend rendering and Python backends",
      "Reinforcement learning and Auto-tuning"
    ],
    correctAnswer: 1,
    explanation: "ReAct interleaves thinking and execution steps: 'Thought -> Action -> Observation -> Thought', letting the agent reason about its goals before invoking tools."
  },
  {
    id: 206,
    type: "open-ended",
    question: "Explain how QLoRA manages to fine-tune massive LLMs on consumer-grade hardware. Detail NF4 quantization and double quantization.",
    explanation: "The user should explain NF4 quantization (4-bit optimal float representation), Double Quantization (quantizing the quantization constants to save additional bits), and page optimizers for memory spikes."
  },
  {
    id: 207,
    type: "open-ended",
    question: "Describe parent-document retrieval in RAG. How does it balance small retrieval chunks with large generation contexts?",
    explanation: "The user should explain that documents are split into tiny child chunks for precise vector embedding matches, but when a chunk is selected, the database retrieves the larger parent document context to give the generator complete context."
  },
  {
    id: 208,
    type: "open-ended",
    question: "Explain the ReAct prompt template framework. How does it enable LLM agents to interface with external tools?",
    explanation: "The user should explain that ReAct prompts structure the LLM to output a sequence of: Thought (internal reasoning), Action (tool selection and arguments), and expect an Observation (tool output) in a repeating loop."
  },
  {
    id: 209,
    question: "How does semantic matching in LLM prompt caching differ from exact matching?",
    options: [
      "It caches queries based on vector embedding cosine similarity rather than matching strings exactly, saving API costs on synonymous prompts.",
      "It is always slower than generating a new response.",
      "It converts prompts to SQL tables.",
      "It is only used for image models."
    ],
    correctAnswer: 0,
    explanation: "Semantic caching embeds incoming queries and checks if a semantically equivalent query exists in the cache (above a similarity threshold), serving the cached output."
  },
  {
    id: 210,
    question: "What is the primary benefit of Speculative Decoding in LLM serving?",
    options: [
      "It allows the model to predict the future search terms of users.",
      "It uses a smaller draft model to generate candidate tokens quickly, which are validated in parallel by the target large model, increasing inference speed.",
      "It removes the need for multi-head attention.",
      "It reduces the size of model parameters on disk."
    ],
    correctAnswer: 1,
    explanation: "Speculative decoding lets a small, fast model guess several tokens ahead, and the large model checks them all in a single forward pass, yielding up to 2-3x speedups."
  },
  
  // --- Phase 1: Foundations (IDs 211-220) ---
  {
    id: 211,
    question: "In Python, what is the side effect of initializing a multi-dimensional list using multiplication: arr = [[0]*3]*3?",
    options: [
      "All nested lists reference the exact same list object in memory, meaning modifying one modifies all.",
      "It raises a TypeError due to nested type multiplication constraints.",
      "It allocates memory using contiguous C arrays, which increases run speed.",
      "It makes the list immutable."
    ],
    correctAnswer: 0,
    explanation: "Multiplication copy-replicates object references. The outer list will contain 3 references pointing to the single identical inner list object."
  },
  {
    id: 212,
    question: "Why does the statement 0.1 + 0.2 == 0.3 evaluate to False in Python and standard IEEE 754 float arithmetic?",
    options: [
      "Python represents float variables using base-10 indices internally.",
      "Decimal fractions like 0.1, 0.2, and 0.3 cannot be represented exactly in binary floating-point representation, causing roundoff errors.",
      "CPython parses floats as integer denominators only.",
      "Float variables are rounded to 8-bit precision by the C compiler."
    ],
    correctAnswer: 1,
    explanation: "Because numbers are represented in binary (base-2), fractional values like 0.1 require an infinite repeating binary expansion, leading to truncation and tiny precision discrepancies."
  },
  {
    id: 213,
    question: "When is it highly beneficial to construct an 'Expression-Based (or Functional) Index' in SQL?",
    options: [
      "When the index should only run on numeric columns",
      "When queries frequently filter or join using a function applied to a column (e.g., WHERE LOWER(email) = ...)",
      "When indexing columns containing large binary objects (BLOBs)",
      "When queries filter using GROUP BY clauses exclusively"
    ],
    correctAnswer: 1,
    explanation: "Normally, applying a function like LOWER(col) disables standard indexes. Creating an index directly on LOWER(col) allows the database to perform index scans."
  },
  {
    id: 214,
    question: "Which built-in Python module is designed to profile memory allocation overhead and identify leaks by capturing traceback metrics?",
    options: [
      "sys",
      "tracemalloc",
      "profile",
      "timeit"
    ],
    correctAnswer: 1,
    explanation: "tracemalloc is a debug tool that traces memory blocks allocated by Python, providing detailed diagnostics on which lines of code allocate the most memory."
  },
  {
    id: 215,
    question: "How do relational databases (like PostgreSQL) sort NULL values when running an ORDER BY query without explicit modifiers?",
    options: [
      "NULL values are ignored entirely and removed from sorting.",
      "NULLs are treated as the highest values (sorted last in ASC, first in DESC by default in Postgres).",
      "NULL values are placed randomly at each query execution.",
      "NULLs are always sorted first regardless of direction."
    ],
    correctAnswer: 1,
    explanation: "In Postgres, NULLs are treated as larger than any other value, meaning they sort last in ASC and first in DESC unless 'NULLS FIRST' or 'NULLS LAST' is specified."
  },
  {
    id: 216,
    type: "open-ended",
    question: "Explain what happens when you write arr = [[0]*3]*3 in Python and then modify arr[0][0] = 5.",
    explanation: "The user should state that since replication copies references, all three rows point to the same list. Modifying one cell will reflect the change at index 0 across all three rows: [[5,0,0],[5,0,0],[5,0,0]]."
  },
  {
    id: 217,
    type: "open-ended",
    question: "Why does 0.1 + 0.2 not equal 0.3 exactly in Python? Explain double-precision floating-point representation.",
    explanation: "The user should explain that computer processors represent floats using IEEE 754 binary double precision. Fractions like 0.1 have repeating decimals in binary, leading to tiny rounding errors when added."
  },
  {
    id: 218,
    type: "open-ended",
    question: "What is an expression-based (or functional) index in SQL, and when is it beneficial?",
    explanation: "The user should state that it is an index created on the result of an expression or function rather than just column values. Useful when queries filter on functional columns like WHERE LOWER(username) or date extractions."
  },
  {
    id: 219,
    question: "What is the primary benefit of utilizing the .query() method over standard boolean indexing in pandas?",
    options: [
      "It parses expressions using numexpr, optimizing execution speed and memory for large datasets by avoiding temporary copies.",
      "It allows querying databases directly without loading data into memory.",
      "It supports SQL syntax natively without any translation.",
      "It makes the DataFrame immutable."
    ],
    correctAnswer: 0,
    explanation: "pandas .query() evaluates expressions using 'numexpr' under the hood. This avoids generating temporary intermediate boolean array objects in memory, speeding up large calculations."
  },
  {
    id: 220,
    question: "In SQL, how does a LEFT OUTER JOIN handle mismatched rows in the right table?",
    options: [
      "It excludes them from the output entirely.",
      "It returns all columns from the left table and populates columns from the right table with NULL.",
      "It throws a constraint violation exception.",
      "It duplicates matching rows from the left table."
    ],
    correctAnswer: 1,
    explanation: "LEFT OUTER JOIN returns all rows from the left table. If no match exists on the right, the right-side columns are filled with NULLs in the result set."
  },

  // --- Phase 2: Core ML (IDs 221-230) ---
  {
    id: 221,
    question: "What does a high Variance Inflation Factor (VIF > 5 or 10) indicate about a feature in a regression model?",
    options: [
      "The feature has a high linear correlation with the target variable.",
      "The feature has high multicollinearity with other independent variables, inflating coefficient variance.",
      "The feature is an outlier that must be removed.",
      "The feature has high heteroscedasticity."
    ],
    correctAnswer: 1,
    explanation: "VIF measures how much the variance of an estimated regression coefficient is increased due to collinearity. A high score means the feature is highly redundant."
  },
  {
    id: 222,
    question: "How is Out-Of-Bag (OOB) error calculated during Random Forest training?",
    options: [
      "By testing on an external holdout set created before training starts.",
      "Using cross-validation folds.",
      "For each tree, evaluating predictions on the subset of training samples (approx. 36.8%) that were not selected in the bootstrap sample.",
      "Evaluating predictions only on out-of-distribution training outliers."
    ],
    correctAnswer: 2,
    explanation: "Bootstrap sampling selects about 63.2% of data for training. The remaining 36.8% (out-of-bag samples) act as a built-in validation set to estimate generalization error."
  },
  {
    id: 223,
    question: "Why is the classic K-Means clustering algorithm guaranteed to converge to a local minimum?",
    options: [
      "Because the number of potential partitions of the dataset is infinite.",
      "Because each iteration of Lloyd's algorithm (assigning points and updating centroids) monotonically decreases the within-cluster sum of squares (WCSS).",
      "Because it is mathematically equivalent to gradient ascent.",
      "Because it runs coordinate descent on a convex surface."
    ],
    correctAnswer: 1,
    explanation: "Lloyd's algorithm updates assignment and centroid coordinates. Each step decreases or keeps constant the WCSS objective. Since partitions are finite, convergence is guaranteed."
  },
  {
    id: 224,
    question: "How does heteroscedasticity impact ordinary least squares (OLS) linear regression models?",
    options: [
      "It biases the estimated coefficients.",
      "It causes standard error estimates to be incorrect, invalidating hypothesis tests, p-values, and confidence intervals.",
      "It causes OLS to overfit training data completely.",
      "It restricts the model to binary variables."
    ],
    correctAnswer: 1,
    explanation: "Heteroscedasticity (non-constant residual variance) does not bias OLS coefficients, but it violates the assumption of constant variance, making standard errors (and p-values) incorrect."
  },
  {
    id: 225,
    question: "In Ridge Regression (L2 regularization), what is the geometric shape of the parameter constraint boundary?",
    options: [
      "A diamond (hypersphere under L1 norm)",
      "A sphere (hypersphere under L2 norm)",
      "A cube (hypercube)",
      "An irregular polygon"
    ],
    correctAnswer: 1,
    explanation: "Ridge regularization penalizes the sum of squared weights: sum(w^2) <= t. This represents a hypersphere (or circle in 2D) boundary in parameter space."
  },
  {
    id: 226,
    type: "open-ended",
    question: "How does a residual plot help diagnose heteroscedasticity in linear regression?",
    explanation: "The user should state that a residual plot maps residuals against fitted values. Constant variance shows as a random cloud. Heteroscedasticity exhibits a pattern, like a fan or funnel shape, showing variance shifts."
  },
  {
    id: 227,
    type: "open-ended",
    question: "Explain what Out-Of-Bag (OOB) error is in Random Forests and how it is computed without validation sets.",
    explanation: "The user should explain that since trees train on bootstrap samples, about 36.8% of rows are left out per tree. We collect predictions for each row using only trees that didn't train on that row, calculating average validation error."
  },
  {
    id: 228,
    type: "open-ended",
    question: "Why is K-means clustering not guaranteed to converge to the global minimum? How does K-means++ help?",
    explanation: "The user should explain that K-means is sensitive to initial centroid selection, easily getting stuck in local minima. K-means++ spaces out initial centroids by picking new centroids with probability proportional to distance squared."
  },
  {
    id: 229,
    question: "In Support Vector Machines (SVM), how does decreasing the cost parameter C impact model margin and bias?",
    options: [
      "It narrows the margin, increasing model variance (overfitting).",
      "It widens the margin and allows more training errors, increasing bias but decreasing variance (underfitting).",
      "It forces the margin to zero, creating a linear classifier.",
      "It has no impact on model bias or margins."
    ],
    correctAnswer: 1,
    explanation: "Parameter C controls the penalty for training errors. A smaller C allows more violations (soft margin), widening the margin. This increases bias but improves generalization."
  },
  {
    id: 230,
    question: "During Principal Component Analysis (PCA), how are the principal component directions determined?",
    options: [
      "By calculating the correlation coefficients between all features",
      "By diagonalizing the covariance matrix of the normalized features to extract the eigenvectors (components) and eigenvalues (variance explained)",
      "Using gradient descent optimization",
      "By fitting linear regression lines through the origin"
    ],
    correctAnswer: 1,
    explanation: "PCA calculates eigenvectors of the feature covariance matrix. The eigenvectors represent direction vectors, and their corresponding eigenvalues quantify the amount of variance in those directions."
  },

  // --- Phase 3: Deep Learning (IDs 231-240) ---
  {
    id: 231,
    question: "Why is Kaiming (He) normal initialization preferred over Xavier (Glorot) initialization for ReLU networks?",
    options: [
      "It runs faster on GPU architectures.",
      "ReLU zero-out behavior (halving variance) is accounted for by scaling weight variance by 2/fan_in instead of 1/fan_in.",
      "It bounds weights between -1 and 1.",
      "It forces weights to be positive integers."
    ],
    correctAnswer: 1,
    explanation: "ReLU sets negative inputs to zero, reducing the variance of activations by half at each layer. He normal initialization multiplies the weights by sqrt(2/fan_in) to maintain variance."
  },
  {
    id: 232,
    question: "In Inverted Dropout, why are the activations scaled by 1/(1-p) during training?",
    options: [
      "To increase training speed",
      "To ensure that the expected value of activations at test time is scale-matched to training time without modifications",
      "To prevent vanishing gradients in sigmoid layers",
      "To limit model parameters"
    ],
    correctAnswer: 1,
    explanation: "During training, a fraction p of neurons is set to 0. To keep the activation scale consistent for inference (where dropout is off), we scale training activations by 1/(1-p)."
  },
  {
    id: 233,
    question: "What does a Cosine Annealing learning rate schedule do during training?",
    options: [
      "It drops the learning rate abruptly at fixed step intervals.",
      "It decreases and increases the learning rate following a cosine curve, allowing the model to escape local minima during peaks.",
      "It keeps the learning rate constant.",
      "It scales the learning rate by the cosine similarity of the weights."
    ],
    correctAnswer: 1,
    explanation: "Cosine annealing slowly decreases the learning rate, then increases it back up (annealing with restarts) to help the optimizer break out of saddle points and search new valleys."
  },
  {
    id: 234,
    question: "Given a 2D input of size 32x32, a kernel size of 5x5, padding of 2, and stride of 1, what is the output width of the convolution layer?",
    options: [
      "28",
      "30",
      "32",
      "34"
    ],
    correctAnswer: 2,
    explanation: "Using the formula: (W - K + 2P)/S + 1, we get: (32 - 5 + 4)/1 + 1 = 31/1 + 1 = 32."
  },
  {
    id: 235,
    question: "What is the derivative of the Binary Cross-Entropy Loss function with respect to model prediction y_hat?",
    options: [
      "(y_hat - y) / (y_hat * (1 - y_hat))",
      "y_hat - y",
      "1 / (1 + e^-y_hat)",
      "-(y/y_hat) + (1-y)/(1-y_hat)"
    ],
    correctAnswer: 3,
    explanation: "The loss is L = -y log(y_hat) - (1-y) log(1-y_hat). Taking the derivative dL/dy_hat yields -y/y_hat + (1-y)/(1-y_hat)."
  },
  {
    id: 236,
    type: "open-ended",
    question: "Why do we scale activations by 1/(1-p) during training in Inverted Dropout?",
    explanation: "The user should state that since dropout turns off a fraction p of nodes, the output sum would drop. Scaling training activations by 1/(1-p) keeps the expected value matching inference time, where dropout is deactivated."
  },
  {
    id: 237,
    type: "open-ended",
    question: "Explain the output size calculation of a 2D convolution layer given inputs, kernel size, padding, and stride.",
    explanation: "The user should state the formula (Input_Size - Kernel_Size + 2 * Padding) / Stride + 1. If the division is not an integer, floor rounding is typically applied depending on library config."
  },
  {
    id: 238,
    type: "open-ended",
    question: "Why is He (Kaiming) weight initialization preferred over Xavier initialization for ReLU activation layers?",
    explanation: "The user should explain that Xavier assumes linear activations. ReLU cuts off half the values, dividing variance by 2. He normal balances this by scaling weight variance by 2/fan_in to prevent signals vanishing."
  },
  {
    id: 239,
    question: "Why does the Multi-Head Attention formula scale the QK^T dot-product by 1/sqrt(d_k)?",
    options: [
      "To prevent dot-products from growing extremely large in magnitude for high dimensions, which would push the softmax function into regions with tiny gradients.",
      "To normalize values between -1 and 1.",
      "To convert values to normal distributions.",
      "To speed up GPU matrix operations."
    ],
    correctAnswer: 0,
    explanation: "For large dimensions, dot products grow large, causing softmax outputs to be extremely close to 1 or 0 (saturated). The scale factor prevents this gradient-vanishing saturation."
  },
  {
    id: 240,
    question: "In PyTorch, what is the key difference between JIT compiler trace mode (torch.jit.trace) and script mode (torch.jit.script)?",
    options: [
      "Trace mode compiles only linear layers; script mode compiles convolutional layers.",
      "Trace mode runs code through mock inputs and records operations (ignoring dynamic conditionals); script mode parses the AST to compile dynamic control flow.",
      "Trace mode is slower than script mode.",
      "Trace mode can only run on CPU."
    ],
    correctAnswer: 1,
    explanation: "Trace records execution using a sample input (static graph, ignoring if/else conditions not met). Script parses PyTorch Python code directly, compiling dynamic logic."
  },

  // --- Phase 4: Deployment (IDs 241-250) ---
  {
    id: 241,
    question: "Why is it standard practice to copy requirements.txt and run 'pip install' in a Dockerfile BEFORE copying the rest of the application source code?",
    options: [
      "To verify requirements first.",
      "To leverage Docker's layer caching, preventing slow dependency rebuilds when only app source code changes.",
      "To compile python code into runtime wheels.",
      "To limit host permissions."
    ],
    correctAnswer: 1,
    explanation: "Docker caches layers sequentially. If you copy requirements first, the 'pip install' layer is cached and skipped during builds unless requirements.txt itself changes."
  },
  {
    id: 242,
    question: "In FastAPI, what is the role of custom Exception Handlers?",
    options: [
      "To catch syntax errors in python code before run",
      "To intercept specific runtime exceptions globally and format them into standardized JSON error responses for the client",
      "To restart the server container automatically",
      "To write error tracebacks to remote databases"
    ],
    correctAnswer: 1,
    explanation: "Exception handlers map specific errors (e.g. database errors, validation failures) to clean responses, preventing raw internal tracebacks from leaking to API consumers."
  },
  {
    id: 243,
    question: "What is the primary difference in how MLflow handles 'Parameters' versus 'Artifacts'?",
    options: [
      "Parameters are numbers/strings; artifacts are heavy files (like model weights, plots, CSV logs) saved to storage pools.",
      "Parameters are immutable; artifacts can be edited.",
      "Parameters are logged to Git; artifacts are sent to Docker.",
      "They are identical."
    ],
    correctAnswer: 0,
    explanation: "Parameters are key-value metadata strings (e.g. learning_rate=0.01). Artifacts are output files, datasets, images, or serialized weights tracked in remote storage."
  },
  {
    id: 244,
    question: "What does the Population Stability Index (PSI) quantify in model monitoring?",
    options: [
      "Model training stability over epochs",
      "How much a feature or target prediction distribution has shifted between two datasets (e.g., training baseline vs. production inference)",
      "The accuracy of the model predictions",
      "The density of vector database items"
    ],
    correctAnswer: 1,
    explanation: "PSI measures distribution shifts. PSI < 0.1 indicates stability, 0.1 to 0.25 suggests moderate shift, and > 0.25 indicates significant shift (data drift)."
  },
  {
    id: 245,
    question: "How does Prometheus retrieve metrics from target microservices (like a FastAPI model service)?",
    options: [
      "It queries databases where logs are stored.",
      "Services push metrics to Prometheus endpoints continuously.",
      "Prometheus pulls (scrapes) metrics by making periodic HTTP GET requests to a exposed endpoint (e.g. /metrics) on the service.",
      "It reads system CPU metrics from host drivers directly."
    ],
    correctAnswer: 2,
    explanation: "Prometheus is a pull-based monitoring system. It periodically hits configured metrics endpoints on monitored services to scrape current metric values."
  },
  {
    id: 246,
    type: "open-ended",
    question: "Explain why you should copy the 'requirements.txt' file in Docker before copying the rest of your app source code.",
    explanation: "The user should explain that Docker uses layer caching. Since dependencies change rarely compared to code, copying requirements first and running install avoids invalidating the cache, saving time."
  },
  {
    id: 247,
    type: "open-ended",
    question: "What does the Population Stability Index (PSI) measure in ML model monitoring? How do you interpret its score?",
    explanation: "The user should state it measures distribution shift between two datasets. Interpret: PSI < 0.1 means no change, 0.1-0.25 is moderate shift, and > 0.25 indicates significant shift (drift) requiring retraining."
  },
  {
    id: 248,
    type: "open-ended",
    question: "How do you implement a global custom exception handler in FastAPI to capture database connection errors?",
    explanation: "The user should mention using the @app.exception_handler(DatabaseError) decorator, returning a custom JSONResponse with a clean error message and standard status code (e.g., 503)."
  },
  {
    id: 249,
    question: "In Triton Inference Server, what is required inside the model configuration file (config.pbtxt)?",
    options: [
      "The model's complete training code",
      "Definitions for backend, max_batch_size, input and output tensor shapes, and data types",
      "A copy of the SQLite schema",
      "Developer credentials and API tokens"
    ],
    correctAnswer: 1,
    explanation: "Triton requires config.pbtxt to declare model properties (e.g. float32 tensor dimensions, GPU instances) so it can allocate hardware memory and map inputs."
  },
  {
    id: 250,
    question: "What is the purpose of Kubernetes Horizontal Pod Autoscaler (HPA)?",
    options: [
      "To balance network requests across pods",
      "To dynamically scale the number of pod replicas up or down based on observed CPU/memory utilization or custom metrics",
      "To move pods to different servers physically",
      "To update model weights across nodes"
    ],
    correctAnswer: 1,
    explanation: "HPA queries pod metrics. If CPU usage exceeds a target threshold, it instructs the controller to spawn more pods, scaling back down when load decreases."
  },

  // --- Phase 5: LLMs & Capstone (IDs 251-260) ---
  {
    id: 251,
    question: "Which QLoRA parameter handles saving additional bit overhead by quantizing the quantization constants themselves?",
    options: [
      "Double Quantization",
      "Paged Optimizers",
      "LoRA Alpha",
      "NormalFloat Quantization"
    ],
    correctAnswer: 0,
    explanation: "Double Quantization quantizes the quantization constants of the 4-bit block scales, saving approximately 0.37 bits per parameter (about 3GB of VRAM on a 65B model)."
  },
  {
    id: 252,
    question: "What is the core idea behind Semantic Chunking in vector database document preparation?",
    options: [
      "Splitting documents exactly at 500-character boundaries.",
      "Evaluating distances between consecutive sentences using embeddings, splitting only when semantic distance exceeds a threshold.",
      "Splitting only at paragraph markers.",
      "Translating the text before chunking."
    ],
    correctAnswer: 1,
    explanation: "Unlike static token splitting, semantic chunking measures semantic similarity between sentences, splitting text only when the topic changes, keeping related contexts intact."
  },
  {
    id: 253,
    question: "What does prompt compression (such as LLMLingua) attempt to optimize?",
    options: [
      "LLM weight sizing",
      "Removing redundant or low-information tokens from long prompts using mutual information metrics, reducing latency and costs while keeping context",
      "Compressing responses to binary streams",
      "Forcing the LLM to output small paragraphs"
    ],
    correctAnswer: 1,
    explanation: "Long contexts are expensive and slow. LLMLingua calculates token perplexities to prune useless filler words, reducing prompt sizes by up to 2-5x without losing crucial context."
  },
  {
    id: 254,
    question: "In guardrail frameworks (like Guardrails AI), what happens when an LLM response violates a structured constraint (e.g., outputs invalid JSON)?",
    options: [
      "The server restarts automatically.",
      "The framework can execute automated re-asking (prompting the model with the validation error to fix its response) or trigger fallbacks.",
      "The user's account is suspended.",
      "It is ignored and served anyway."
    ],
    correctAnswer: 1,
    explanation: "Guardrails validate outputs against XML/Pydantic schemas. If a check fails, it can automatically compile the error into a re-ask prompt so the model can self-correct."
  },
  {
    id: 255,
    question: "What does the ReAct framework do to coordinate actions in LLM agent pipelines?",
    options: [
      "It uses React components to render actions.",
      "It structures prompts in an interleaved loop of Thought (reasoning), Action (tool selection), and Observation (environment feedback).",
      "It trains reinforcement models directly.",
      "It uses blockchain state transitions."
    ],
    correctAnswer: 1,
    explanation: "ReAct prompts the LLM to output reasoning thoughts alongside actions. By reading observations from tool execution, the agent adjusts its thoughts dynamically."
  },
  {
    id: 256,
    type: "open-ended",
    question: "Explain how semantic chunking works in document preparation for vector databases. How is the split determined?",
    explanation: "The user should explain that semantic chunking embeds consecutive sentences, calculates similarity distance (e.g. cosine distance) between adjacent sentences, and splits when a spike in distance indicates a topic change."
  },
  {
    id: 257,
    type: "open-ended",
    question: "Describe how prompt compression techniques like LLMLingua reduce prompt tokens without losing query intent.",
    explanation: "The user should explain using a small LLM to compute likelihoods/perplexities of prompt tokens, removing low-perplexity tokens that carry little semantic information while preserving the key query semantics."
  },
  {
    id: 258,
    type: "open-ended",
    question: "Explain how LLM guardrails (like Guardrails AI or NeMo Guardrails) validate structured JSON schemas at runtime.",
    explanation: "The user should explain parsing LLM output, running validation checks (regex, type checks, schema matchers), and triggering automatic recovery rules (re-asking the model or serving a safe default) if validation fails."
  },
  {
    id: 259,
    question: "In Speculative Decoding, what constraint is placed on the vocabulary of the draft model?",
    options: [
      "It must be completely different from the target model.",
      "It must share the exact same tokenizer and vocabulary mapping as the target large model to validate token likelihoods correctly.",
      "It can only contain numbers.",
      "It must be under 1000 tokens."
    ],
    correctAnswer: 1,
    explanation: "Since the target large model needs to evaluate the joint probability of the draft tokens in a single forward pass, both models must share the same tokenizer and vocabulary space."
  },
  {
    id: 260,
    question: "How does Semantic Cache eviction determine which cached prompts to remove?",
    options: [
      "Based on Least Recently Used (LRU) or Least Frequently Used (LFU) strategies applied to the vector database collection.",
      "By deleting the longest prompts first.",
      "By removing prompts containing numbers.",
      "Randomly at each server cycle."
    ],
    correctAnswer: 0,
    explanation: "To keep prompt cache sizes in check, semantic cache systems apply classic database eviction rules (like LRU/LFU) based on query metadata timestamps and hits."
  }
];

export const QUIZ_DATA = {
  phase1: [
    ...rawQuizData["programming-basics"],
    ...rawQuizData["math-stats-eda"],
    ...extraQuestions.filter(q => q.id >= 161 && q.id <= 170),
    ...extraQuestions.filter(q => q.id >= 211 && q.id <= 220)
  ],
  phase2: [
    ...rawQuizData["machine-learning"],
    ...extraQuestions.filter(q => q.id >= 171 && q.id <= 180),
    ...extraQuestions.filter(q => q.id >= 221 && q.id <= 230)
  ],
  phase3: [
    ...rawQuizData["deep-learning"],
    ...extraQuestions.filter(q => q.id >= 181 && q.id <= 190),
    ...extraQuestions.filter(q => q.id >= 231 && q.id <= 240)
  ],
  phase4: [
    ...rawQuizData["deployment"],
    ...extraQuestions.filter(q => q.id >= 191 && q.id <= 200),
    ...extraQuestions.filter(q => q.id >= 241 && q.id <= 250)
  ],
  phase5: [
    ...phase5Questions,
    ...extraQuestions.filter(q => q.id >= 201 && q.id <= 210),
    ...extraQuestions.filter(q => q.id >= 251 && q.id <= 260)
  ]
};

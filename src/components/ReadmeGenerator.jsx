import React, { useState } from 'react';
import { X, Copy, Check, FileText } from 'lucide-react';

export function ReadmeGenerator({ isOpen, onClose, projectTitle }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generatedReadme = `# ${projectTitle}

## Overview
Briefly describe the purpose of this project, the problem it solves, and its overall goal.

## Data Source
Describe where the data came from, its size, and key features.
- **Source**: [Link to data](#)
- **Size**: X rows, Y columns
- **Key Features**: Feature A, Feature B, Target Variable

## Methodology
Outline the steps taken during the project:
1. **Data Cleaning**: Handling missing values, outliers, etc.
2. **Exploratory Data Analysis (EDA)**: Key insights and visualizations.
3. **Feature Engineering**: Creating new predictive features.
4. **Modeling**: Algorithms used (e.g., Random Forest, XGBoost) and why.
5. **Evaluation**: Metrics used (e.g., RMSE, Accuracy, F1-Score).

## Results
Summarize the final model performance and the main takeaways.
- **Best Model**: [Model Name]
- **Performance**: [Metric] = [Value]
- **Insights**: What business value or conclusion did this analysis provide?

## Setup & Installation
Instructions to reproduce the environment and run the code.

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/your-repo-name.git

# Navigate to directory
cd your-repo-name

# Install dependencies
pip install -r requirements.txt
\`\`\`

## Technologies Used
- Python
- Pandas, NumPy
- Scikit-Learn
- Matplotlib, Seaborn
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReadme);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface rounded-3xl p-6 md:p-8 max-w-3xl w-full relative shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-phase-teal/10 rounded-lg">
              <FileText className="text-phase-teal" size={24} />
            </div>
            <h2 className="text-2xl font-display font-bold text-text-main">
              README Builder
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-text-faint hover:text-text-main hover:bg-bg-raise rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="text-text-dim mb-4 text-sm">
          A high-quality README is crucial for your portfolio. Copy this template to your GitHub repository and fill in the details.
        </p>

        <div className="flex-1 overflow-hidden flex flex-col bg-bg-main border border-border-line rounded-xl relative">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-surface border border-border-line hover:border-phase-teal hover:text-phase-teal text-text-dim rounded-lg shadow-sm font-mono text-xs transition-colors"
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              {copied ? 'COPIED!' : 'COPY MARKDOWN'}
            </button>
          </div>
          <pre className="flex-1 overflow-y-auto p-6 text-sm font-mono text-text-dim whitespace-pre-wrap">
            {generatedReadme}
          </pre>
        </div>
      </div>
    </div>
  );
}

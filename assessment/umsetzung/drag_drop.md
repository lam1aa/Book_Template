---
jupytext:
  formats: md:myst
  text_representation:
    extension: .md
    format_name: myst
kernelspec:
  display_name: Python 3
  language: python
  name: python3
---

# How to Use the Drag-and-Drop Quiz in Your Jupyter Book

## Installation and Setup

1. **Save the Python code** as a file called `drag_drop_quiz.py` in your Jupyter Book project directory.

2. **Import and use in your notebook cells**:

```{code-cell} ipython3
# Import the quiz class
import sys
sys.path.append("../../quadriga")  # Go up two levels: umsetzung -> assessment -> Book_Template
from assessment import DragDropQuiz

# Create a quiz instance
quiz = DragDropQuiz()

# Create your quiz with a simple method call
quiz.create_matching_quiz(
    title="Quiz 1: Match the concepts",
    descriptions=["Concept 1", "Concept 2", "Concept 3"],
    options=["Definition 1", "Definition 2", "Definition 3", "Extra Option"],  # More options than needed
    correct_mapping={
        "Concept 1": "Definition 1", 
        "Concept 2": "Definition 2", 
        "Concept 3": "Definition 3"
    },
    feedback_messages={
        "correct": "Excellent work! All matches are perfect!!!",
        "incorrect": "No matches found. Please try again!",
        "partial": "Good progress! You got {{correct}} out of {{total}} correct."
    }
)

```

## Features

✅ **Simple Python interface** - Authors only need one method call  
✅ **No HTML/CSS knowledge required** - Everything is handled automatically  
✅ **Works in built Jupyter Books** - Generates static HTML/CSS/JavaScript  
✅ **Drag and drop functionality** - Intuitive user interaction  
✅ **Automatic feedback** - Shows correct/incorrect results  
✅ **Reset functionality** - Users can start over  
✅ **Responsive design** - Works on different screen sizes  
✅ **German language support** - Includes German text and placeholders

## Parameters Explained

- **`title`**: The main question or instruction for the quiz
- **`descriptions`**: List of items that users will drag (the "questions")
- **`options`**: List of target areas where items can be dropped (the "answers")
- **`correct_mapping`**: Dictionary that defines which description goes with which option
- **`show_feedback`**: Optional parameter to enable/disable feedback (default: True)


## How It Works

1. **Python generates HTML/CSS/JavaScript** dynamically based on your content
2. **Each quiz gets a unique ID** to avoid conflicts
3. **All styling is embedded** so it works in the static build
4. **JavaScript handles interactions** without external dependencies
5. **State is managed in memory** (no localStorage needed)


## Customization

The quiz system is designed to be simple for authors, but if you need to customize the appearance, you can modify the CSS styles in the `_generate_html` method of the `DragDropQuiz` class.


## new one

```{code-cell} ipython3

from jupyterquiz import display_quiz
from IPython.display import HTML, display

# Load CSS
display(HTML("""
<link rel="stylesheet" href="../../_static/drag_drop.css">
"""))

# Load JavaScript
display(HTML("""
<script src="../../_static/drag_drop.js"></script>
"""))


question = [{
    "type": "drag_drop",
    "question": "Match the concepts with their definitions:",
    "descriptions": [
        "Stores data values",
        "Reusable block of code", 
        "Repeats code multiple times"
    ],
    "options": [
        "Variable",
        "Function", 
        "Loop"
    ],
    "correct_mapping": {
        "Stores data values": "Variable",
        "Reusable block of code": "Function",
        "Repeats code multiple times": "Loop"
    }
}]

display_quiz(question)
```
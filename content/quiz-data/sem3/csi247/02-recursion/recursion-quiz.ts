export const quizData = [
  {
    "group": "Base case and termination",
    "question": "What must a correct recursive case do besides call the same method?",
    "options": [
      "Move toward a reachable base case",
      "Allocate an array",
      "Use a loop",
      "Return void"
    ],
    "correctIndex": 0,
    "explanation": "Termination requires a measure that gets closer to a base case.",
    "optionFeedback": [
      "Correct. Without progress the calls never reach the base case.",
      "Recursion does not need an array; many recursive methods (factorial, power) use only integers.",
      "A loop is what recursion replaces. Having one does not make the calls stop.",
      "A recursive method can return any type. The return type has nothing to do with whether the calls terminate."
    ]
  },
  {
    "group": "Base case and termination",
    "question": "What happens when sumTo(0) is called?",
    "code": "static int sumTo(int n) {\n    if (n == 1) {\n        return 1;\n    }\n    return n + sumTo(n - 1);\n}",
    "options": [
      "It returns 0",
      "It returns 1",
      "It ends in a StackOverflowError",
      "It throws ArrayIndexOutOfBoundsException"
    ],
    "correctIndex": 2,
    "explanation": "The argument goes 0, -1, -2 and so on and never equals 1, so the calls pile up until the stack is full. A base case n <= 1 would stop it.",
    "optionFeedback": [
      "The method never returns a value for 0: there is no case that answers 0.",
      "1 is returned only when n equals 1. The argument starts at 0 and moves away from 1.",
      "Correct. The base case is one step too late for this input.",
      "There is no array in this method. The failure is the stack filling with calls."
    ]
  },
  {
    "group": "Base case and termination",
    "question": "A recursive power method returns 0 in its base case (y == 0) and otherwise returns x * power(x, y - 1). What does power(2, 3) return?",
    "options": [
      "8",
      "0",
      "1",
      "It ends in a StackOverflowError"
    ],
    "correctIndex": 1,
    "explanation": "The base case value is multiplied into every result, so the whole product is 0. The base case of a product must return 1, the identity for multiplication.",
    "optionFeedback": [
      "8 is the correct power, but this method multiplies by 0 at the end of the chain.",
      "Correct. 2 * (2 * (2 * 0)) is 0.",
      "1 would be the answer for power(2, 0) with the right base case. Here the base case returns 0.",
      "The calls do terminate: y goes 3, 2, 1, 0 and meets the base case."
    ]
  },
  {
    "group": "Tracing",
    "question": "Each recursive Java call receives…",
    "options": [
      "Its own stack frame with parameters and locals",
      "The caller's exact local-variable storage",
      "No return address",
      "A new class"
    ],
    "correctIndex": 0,
    "explanation": "Calls are separate invocations even when they execute the same method body.",
    "optionFeedback": [
      "Correct. That is why every call has its own n.",
      "If the calls shared storage, each call would overwrite the n of the call waiting below it.",
      "Every call needs a return address so that it can resume the caller.",
      "Calls create frames, not classes. The class is the same for every call."
    ]
  },
  {
    "group": "Tracing",
    "question": "In return n + sumTo(n - 1), when is n added?",
    "options": [
      "When the child result returns during unwinding",
      "Before the child call starts",
      "Only at compilation",
      "Never"
    ],
    "correctIndex": 0,
    "explanation": "The parent frame waits until its child supplies a value.",
    "optionFeedback": [
      "Correct. The addition cannot happen until sumTo(n - 1) has returned.",
      "The right-hand operand is not known until the child call finishes.",
      "Java evaluates this at run time, not at compilation.",
      "The addition does happen, once the child returns."
    ]
  },
  {
    "group": "Tracing",
    "question": "With base cases fib(0) = 0 and fib(1) = 1, how many calls in total does fib(5) make?",
    "options": [
      "5",
      "8",
      "15",
      "25"
    ],
    "correctIndex": 2,
    "explanation": "The calls per argument for fib(5) are 1, 1, 2, 3, 5, 3 for n = 5 down to 0, a total of 15. In general fib(n) makes 2 * fib(n + 1) - 1 calls.",
    "optionFeedback": [
      "5 is the value of fib(5), not the number of calls.",
      "8 is the value of fib(6). The calls are far more than the value.",
      "Correct. The calls form a tree, and the same smaller values are called repeatedly.",
      "25 is the number of calls for fib(6)."
    ]
  },
  {
    "group": "Tracing",
    "question": "How many times is fib(2) called while fib(5) is evaluated?",
    "options": [
      "1",
      "2",
      "3",
      "5"
    ],
    "correctIndex": 2,
    "explanation": "fib(2) is called from fib(3) inside fib(4), from fib(4), and from fib(3) directly under fib(5): three times.",
    "optionFeedback": [
      "Only one call would mean no repeated work, but the tree recomputes the same values.",
      "fib(3) is called twice, but fib(2) is called from both of those and from fib(4).",
      "Correct. The counts follow the Fibonacci numbers.",
      "5 is the number of times fib(1) is called, not fib(2)."
    ]
  },
  {
    "group": "Cost and conversion",
    "question": "A recursive call changes n to n + 1 while the base case is n == 0 and n starts positive. What happens?",
    "options": [
      "It moves away and can overflow the stack",
      "It terminates immediately",
      "It becomes iterative",
      "It returns null"
    ],
    "correctIndex": 0,
    "explanation": "The changing input does not progress toward the base case.",
    "optionFeedback": [
      "Correct. n grows and never reaches 0.",
      "The base case is true only when n is 0, so the call does not stop at once.",
      "Java never converts a recursion into a loop on its own.",
      "An int method cannot return null."
    ]
  },
  {
    "group": "Base case and termination",
    "question": "factL(0) returns 1. What does factR(0) do when its base case is n == 1?",
    "code": "public static long factR(int n) {\n    if (n == 1)\n        return 1;\n    return n * factR(n - 1);\n}",
    "options": [
      "It returns 1",
      "It returns 0",
      "It ends in a StackOverflowError",
      "It does not compile"
    ],
    "correctIndex": 2,
    "explanation": "From 0 the argument goes -1, -2 and so on and never equals 1, so the calls pile up until the stack is full. The loop version does not run for 0 and returns its starting value 1.",
    "optionFeedback": [
      "The loop returns 1; the recursion has no case that answers 0.",
      "0! is 1 and nothing in factR returns 0 for this input.",
      "Correct. The base case does not cover every input that can reach the method.",
      "The method compiles; the problem appears when it runs."
    ]
  },
  {
    "group": "Base case and termination",
    "question": "The lecture's version of factR has no base case. What is the outcome of factR(5)?",
    "code": "public long factR(int n) {\n    long prod;\n    prod = n * factR(n - 1);\n    return prod;\n}",
    "options": [
      "It returns 120",
      "It returns 0",
      "It ends in a StackOverflowError",
      "It prints nothing and stops normally"
    ],
    "correctIndex": 2,
    "explanation": "Every call makes another call and none returns, so the frames fill the stack. This is the lecture's example of infinite recursion; the cause is the missing base case.",
    "optionFeedback": [
      "120 needs a base case to stop the calls and start the multiplying.",
      "No call ever returns, so no value is produced.",
      "Correct. Infinite recursion is reported as a StackOverflowError.",
      "The method never finishes normally."
    ]
  },
  {
    "group": "Base case and termination",
    "question": "What does the compiler report for the line return = n * factR(n - 1); ?",
    "options": [
      "error: illegal start of expression",
      "error: missing return statement",
      "error: incompatible types",
      "It compiles without a message"
    ],
    "correctIndex": 0,
    "explanation": "return is followed by =, which cannot start an expression. Deleting the = repairs it.",
    "optionFeedback": [
      "Correct. The message points at the = after return.",
      "There is a return statement; the fault is its syntax.",
      "The types are not the problem; the line is not valid syntax.",
      "It is not valid Java."
    ]
  },
  {
    "group": "Tracing",
    "question": "How many calls does factR(7) make, and what does it return?",
    "options": [
      "7 calls; 5040",
      "6 calls; 720",
      "7 calls; 720",
      "8 calls; 5040"
    ],
    "correctIndex": 0,
    "explanation": "The calls are for n = 7, 6, 5, 4, 3, 2, 1: seven calls. The result is 7 x 6 x 5 x 4 x 3 x 2 x 1 = 5040.",
    "optionFeedback": [
      "Correct. One call per level, and the results come back 1, 2, 6, 24, 120, 720, 5040.",
      "720 is 6!, and there are seven calls, not six.",
      "720 is 6!; 7! is 5040.",
      "There is no extra call: factR(1) is the base case and is the seventh call."
    ]
  },
  {
    "group": "Tracing",
    "question": "How many calls does power(2, 8) make?",
    "options": [
      "8",
      "9",
      "16",
      "256"
    ],
    "correctIndex": 1,
    "explanation": "The exponent goes 8, 7, ..., 0, which is nine values. A call is made for each, so the number of calls is one more than the exponent.",
    "optionFeedback": [
      "8 forgets the call for y = 0, the base case.",
      "Correct. y + 1 calls.",
      "The calls form a chain with one call per value of y, not two per value.",
      "256 is the value returned, not the number of calls."
    ]
  },
  {
    "group": "Tracing",
    "question": "fibonacci(6) makes 25 calls. How many does fibonacci(9) make?",
    "options": [
      "9",
      "34",
      "109",
      "25"
    ],
    "correctIndex": 2,
    "explanation": "The recursive fibonacci calls itself twice, so the number of calls grows quickly: 25 for 6 and 109 for 9. The value of fibonacci(9) is 34.",
    "optionFeedback": [
      "9 would be the passes of the loop version.",
      "34 is the value returned by fibonacci(9), not the number of calls.",
      "Correct. The calls form a tree, and small values are called again and again.",
      "25 is the number of calls for fibonacci(6)."
    ]
  },
  {
    "group": "Tracing",
    "question": "Which of the Lab 3 methods makes a tree of calls rather than a chain?",
    "options": [
      "factorial",
      "fibonacci",
      "power",
      "all three"
    ],
    "correctIndex": 1,
    "explanation": "fibonacci calls itself twice in its recursive case. factorial and power call themselves once, so their calls form a chain.",
    "optionFeedback": [
      "factorial makes one call per level.",
      "Correct. Two recursive calls give a tree.",
      "power makes one call per value of y.",
      "Only the method with two recursive calls makes a tree."
    ]
  },
  {
    "group": "Tracing",
    "question": "How many boxes are on the call stack when factR(4) reaches its base case, counting main?",
    "options": [
      "4",
      "5",
      "3",
      "2"
    ],
    "correctIndex": 1,
    "explanation": "The boxes are main, factR(4), factR(3), factR(2) and factR(1). Each has its own n, and factR(1) is on top.",
    "optionFeedback": [
      "4 forgets main, which is waiting for factR(4).",
      "Correct. Four calls of factR and main.",
      "That leaves out factR(4) and factR(1), or main.",
      "The stack is as deep as the chain of calls that have not yet returned."
    ]
  },
  {
    "group": "Cost and conversion",
    "question": "The iterative and the recursive versions of power(2, 8) are both tested. What is the difference in output?",
    "options": [
      "None: both give 256",
      "The recursive version gives 128",
      "The iterative version gives 256 and the recursive one gives 8",
      "It depends on the computer"
    ],
    "correctIndex": 0,
    "explanation": "For valid input the two versions print the same value. They differ in cost: nine calls against eight passes of the loop.",
    "optionFeedback": [
      "Correct. Both give 256.",
      "Both compute 2 to the 8, which is 256.",
      "8 is the exponent, not a result of either method.",
      "The value of a power does not depend on the computer."
    ]
  }
];

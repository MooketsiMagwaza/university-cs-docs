export const quizData = [
  {
    question: "What makes a function higher-order?",
    options: [
      "It is defined with more than two equations",
      "It takes a function as an argument or returns one as its result",
      "It is recursive",
      "It has a polymorphic type",
    ],
    correctIndex: 1,
    explanation: "map, filter, foldr, and zipWith all take a function as an argument. This is possible because functions are first-class values in Haskell.",
  },
  {
    question: "Why does `\\x -> x + 1 5` fail?",
    options: [
      "Lambdas cannot use numbers",
      "The body extends rightwards, so it is read as x + (x applied to 5)",
      "A lambda needs a type signature",
      "The backslash must be escaped",
    ],
    correctIndex: 1,
    explanation: "A lambda body extends as far right as possible, so 1 5 is parsed as an application. Parenthesise the lambda when applying it: (\\x -> x + 1) 5.",
  },
  {
    question: "`add x y = x + y` is really which of these?",
    options: [
      "add = \\x y -> x + y, which takes both arguments at once",
      "add = \\x -> (\\y -> x + y)",
      "add = (x, y) -> x + y",
      "A function of a tuple",
    ],
    correctIndex: 1,
    explanation: "This is currying. add takes x and returns a function that awaits y. Every multi-argument Haskell function works this way, which is what makes partial application possible.",
  },
  {
    question: "Given `f :: Int -> Int -> Int -> Int`, what is the type of `f 1 2`?",
    options: [
      "Int",
      "Int -> Int",
      "Int -> Int -> Int",
      "A type error, since f needs three arguments",
    ],
    correctIndex: 1,
    explanation: "Each supplied argument consumes one arrow. Two arguments leave one arrow, so f 1 2 is a function of type Int -> Int. Supplying fewer arguments is legal, not an error.",
  },
  {
    question: "Which expression correctly uses `div` as an infix operator?",
    options: [
      "7 div 2",
      "7 `div` 2",
      "7 'div' 2",
      "(div) 7 2 written infix",
    ],
    correctIndex: 1,
    explanation: "Back quotes convert a two-argument function into an operator. Single quotes denote a Char, and a bare name written between arguments is a parse error.",
  },
  {
    question: "What does the section `(*2)` denote?",
    options: [
      "The number 2 multiplied by itself",
      "The doubling function, \\x -> x * 2",
      "A tuple containing 2",
      "An incomplete expression",
    ],
    correctIndex: 1,
    explanation: "A section supplies one side of an operator, producing a function awaiting the other. (*2) fixes the right operand, giving \\x -> x * 2.",
  },
  {
    question: "Why does `(-5)` not work as a section?",
    options: [
      "Sections cannot use arithmetic operators",
      "It parses as the negative literal five",
      "Subtraction is not associative",
      "It requires backticks instead",
    ],
    correctIndex: 1,
    explanation: "The minus sign also marks negative numbers, so (-5) is the value negative five. Use subtract 5 to build the function. Left sections such as (5-) are unaffected.",
  },
  {
    question: "What do the signatures of map and filter guarantee about result length?",
    options: [
      "Both preserve length",
      "map preserves length; filter may shorten",
      "map may shorten; filter preserves length",
      "Neither says anything about length",
    ],
    correctIndex: 1,
    explanation: "map produces one result per element so the length is unchanged, though [a] -> [b] allows the element type to change. filter returns [a] and may drop elements, so it is the same length or shorter.",
  },
  {
    question: "What is `takeWhile (<4) [1,2,3,9,1]`?",
    options: [
      "[1,2,3,1]",
      "[1,2,3]",
      "[9]",
      "[1,2,3,9,1]",
    ],
    correctIndex: 1,
    explanation: "takeWhile returns the longest prefix satisfying the predicate and stops permanently at the first failure, so it never reaches the trailing 1. filter would give [1,2,3,1].",
  },
  {
    question: "What is `foldr (-) 0 [1,2,3]`?",
    options: [
      "-6",
      "2",
      "6",
      "0",
    ],
    correctIndex: 1,
    explanation: "Replace every cons with the operator and [] with the base value: 1 - (2 - (3 - 0)) = 1 - (2 - 3) = 1 - (-1) = 2. foldl nests to the left instead and gives -6.",
  },
  {
    question: "Which correctly defines `and` as a fold?",
    options: [
      "foldr && True",
      "foldr (&&) True",
      "foldr (&&) False",
      "foldl (&&) []",
    ],
    correctIndex: 1,
    explanation: "The operator must be parenthesised because a bare operator is not a valid expression. True is the correct base value: it is the identity for &&, so it leaves the result unchanged for a non-empty list.",
  },
  {
    question: "What does `((*2) . (+1)) 5` evaluate to?",
    options: [
      "11",
      "12",
      "10",
      "7",
    ],
    correctIndex: 1,
    explanation: "Composition reads right to left: (+1) is applied first giving 6, then (*2) gives 12. Reversing the order to ((+1) . (*2)) 5 would give 11 instead.",
  },
  {
    "question": "zipWith (+) [1,2,3] [10,20]. What happens, and why?",
    "options": [
      "[11,22] — zipWith stops as soon as the shorter list runs out",
      "A runtime error, because the lists have different lengths",
      "[11,22,3] — the leftover element from the longer list passes through unchanged",
      "[11,22,33] — zipWith pads the shorter list with 0"
    ],
    "correctIndex": 0,
    "explanation": "zipWith walks both lists together, applying its function pairwise. Once the second list runs out after two elements, there is nothing left to pair the first list's third element with, so zipWith simply stops there.",
    "optionFeedback": [
      "Correct — zipWith produces a result exactly as long as the shorter list, with no error and no complaint.",
      "Unequal lengths are not an error for zipWith; it silently stops instead of raising an exception.",
      "zipWith never carries an unpaired element through unchanged — an element with nothing to pair against is simply left out of the result.",
      "zipWith never invents a padding value such as 0; it strictly needs a genuine element from each list at every position it produces."
    ]
  },
  {
    "question": "zipWith (\\n s -> s ++ show n) [1,2,3] [\"a\",\"b\",\"c\"] mixes an Integer and a String into one String. Could this combining function have been written as a plain operator section instead?",
    "options": [
      "No — it needs two operations (show, then ++) on two different types, which a single-operator section cannot express",
      "Yes — (++ show) would do exactly the same thing",
      "Yes — zipWith always requires a section, never a lambda",
      "No — zipWith cannot accept lambdas at all, only named functions"
    ],
    "correctIndex": 0,
    "explanation": "A section fixes one operand of a single operator. This rule first converts n to a String with show, then combines it with s using ++ — two different operations across two different types, exactly the situation that calls for a lambda instead of a section.",
    "optionFeedback": [
      "Correct — show has to run before ++ can combine the results, and a section cannot sequence two operations like that.",
      "(++ show) does not even type-check as written: show still needs to be applied to n before ++ can combine the two Strings.",
      "zipWith has no such requirement — it accepts any two-argument function, whether that's a named function, a lambda, or (where the shape allows) a section.",
      "zipWith accepts lambdas freely, exactly as shown in this example — there is no restriction against them."
    ]
  },
];

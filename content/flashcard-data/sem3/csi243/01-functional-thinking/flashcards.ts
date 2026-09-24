export const flashcardData = [
  {
    front: "Programming paradigm",
    back: "A general approach to structuring programs and expressing solutions. Functional and imperative programming are two paradigms.",
  },
  {
    front: "Expression",
    back: "A piece of code that evaluates to a value, such as 2 + 3 or if score >= 50 then \"Pass\" else \"Fail\".",
  },
  {
    front: "Pure function",
    back: "A function whose result depends only on its arguments and whose evaluation causes no observable side effect.",
  },
  {
    front: "Referential transparency",
    back: "The property that an expression can be replaced by its value without changing the program's observable behaviour.",
  },
  {
    front: "Immutability",
    back: "Once a name is bound to a value within a scope, that binding is not updated to mean a different value.",
  },
  {
    front: "Side effect",
    back: "An observable interaction beyond returning a value, such as reading input, printing text, changing a file, or obtaining the current time.",
  },
  {
    front: "Pure calculation versus IO action",
    back: "A pure calculation produces a value from its inputs. An IO action describes an interaction with the external world and has a type involving IO.",
  },
  {
    front: "Functional composition",
    back: "Combining functions so that the output of one becomes the input of the next. In f . g, g is applied first and f is applied second.",
  },
  {
    front: "Functional versus imperative description",
    back: "A functional description emphasizes values and transformations; an imperative description emphasizes commands and changes to program state.",
  },
  {
    front: "Controlled effect boundary",
    back: "A design in which input and output are kept in a small IO layer while reusable calculations remain pure.",
  },
  {
    front: "Why does every Haskell `if` need an `else`?",
    back: "if...then...else is an expression, and an expression must produce a value on whichever branch is chosen. Without an else, there would be no value when the condition is False, so the expression could not have a type.",
  },
  {
    front: "map, in one sentence",
    back: "map applies a one-argument function to every element of a list and collects the results into a new list, in the same order — it does not sort, deduplicate, or mutate the original list.",
  },
  {
    front: "Does computing `discountedRate = taxRate - 0.02` change `taxRate`?",
    back: "No. Reading taxRate to build discountedRate is reading, not writing. taxRate still means 0.14 afterward; discountedRate is a separate, independent binding that merely mentions taxRate.",
  },
  {
    front: "\"Pure means the function is fast\" — true or false?",
    back: "False. Purity makes behaviour predictable — same inputs always give the same output, and evaluation causes no side effect — but it says nothing about whether the underlying algorithm is efficient.",
  },
  {
    front: "\"Functional code means using map everywhere\" — true or false?",
    back: "False. Functional design is about values, types, transformations, and controlled effects. map is one reusable pattern among many, not the definition of the paradigm.",
  },
  {
    front: "shout versus shout' — which one is the \"correct\" way to write composed code?",
    back: "Neither automatically. shout = addEmphasis . map toUpper (point-free) and shout' message = addEmphasis (map toUpper message) compute the same value; prefer whichever reads more clearly to you. Clarity comes before cleverness.",
  },
  {
    front: "Reading `hasManyWords = (> 3) . length . words` right to left, what does it check?",
    back: "Whether a sentence has more than 3 words. Applied right to left: words splits the string into a list of words, length counts them, and (> 3) checks whether that count exceeds three.",
  },
  {
    front: "Why can't functional programming be used entirely \"alone\" for a real application?",
    back: "Real applications still need input, output, storage, time, randomness, and networking. Haskell represents these effects explicitly with types such as IO, rather than pretending they do not exist.",
  },
  {
    front: "A computer, defined plainly",
    back: "A machine that can follow precise instructions. It is fast, but it does not guess what you meant — a program must be written precisely enough for it to follow.",
  },
  {
    front: "The four meanings of \"store\", from most to least fleeting",
    back: "Binding a name (a stable label inside a running program), a data structure (grouping values so the program can work with them), a source file (saved program text in a .hs file), and persistent storage (data saved outside the running program, such as a file or database).",
  },
  {
    front: "Why is Storage the one stage of input/processing/output/storage that a program can skip?",
    back: "Displaying a result and saving a result are two independent jobs. A calculator that shows a sum but saves nothing is still a complete, correct program — storage only matters when a result must survive after the program ends.",
  },
  {
    front: "What distinguishes a \"paradigm\" from a \"language\"?",
    back: "A paradigm is a general style of organising a solution and describing computation (for functional programming: values and transformations). A language has strict rules for communicating programs to a computer, and one language can support more than one paradigm.",
  },
];

export const flashcardData = [
  {
    front: "Pure function",
    back: "A function whose result depends only on its inputs and which performs no observable input/output effect. The same inputs produce the same result.",
  },
  {
    front: "Read `cube :: Integer -> Integer` aloud",
    back: "cube takes one Integer and returns one Integer. The type signature states the function's input and result types.",
  },
  {
    front: "`putStrLn` versus `print`",
    back: "putStrLn outputs a String without surrounding quotes and adds a newline. print displays any Show value using show, so printing a String includes quotation marks.",
  },
  {
    front: "`show`",
    back: "A pure conversion from a displayable value to a String. For example, show 42 evaluates to \"42\" but performs no output.",
  },
  {
    front: "`main :: IO ()`",
    back: "main is the program's entry action. IO marks interaction with the outside world, and () means the action's useful result is the unit value rather than calculated data.",
  },
  {
    front: "Purpose of `do` in an IO action",
    back: "A do block sequences actions from top to bottom and allows later steps to use results produced by earlier actions.",
  },
  {
    front: "`getLine :: IO String`",
    back: "An input action that reads one line from standard input. When performed, it produces the entered text as a String.",
  },
  {
    front: "`<-` versus `let` in a do block",
    back: "Use <- to perform an action and name its result, as in raw <- getLine. Use let to name the result of a pure expression, as in let number = read raw :: Integer.",
  },
  {
    front: "Risk of `read`",
    back: "read parses text as a type inferred from context, but malformed input causes a runtime exception. Its target type should be clear and user input should eventually be validated safely.",
  },
  {
    front: "Input-process-output pipeline",
    back: "Acquire data with an IO action, transform the resulting value with pure functions, then perform another IO action to present the result.",
  },
  {
    front: "The six-part construction process — why do examples come before the signature and implementation?",
    back: "Writing concrete input-output pairs forces the specification to be precise before any code is written. Examples are also load-bearing later: step 6 (verification) checks the implementation against them.",
  },
  {
    front: "isDigitChar '/' and isDigitChar ':' are tested even though neither is a digit — what's the point?",
    back: "They are the characters immediately outside the boundary ('/' just before '0', ':' just after '9'), which catches an off-by-one comparison mistake (such as using > instead of >=) that a mid-range test like isDigitChar '5' could never reveal.",
  },
  {
    front: "Curried versus tupled — how do rectangleArea and rectangleAreaPair actually get called differently?",
    back: "rectangleArea 5.0 3.0 supplies two separate Double arguments (curried). rectangleAreaPair (5.0, 3.0) supplies one (Double, Double) tuple as its single argument. They are different types, and GHC rejects calling one with the other's argument shape.",
  },
  {
    front: "Partial application — why does greet \"Hello\" work as a standalone value, but greetPair (\"Hello\", \"Ada\") can't be split the same way?",
    back: "greet is curried, so supplying just one argument yields a new one-argument function. greetPair takes one tuple as its single, complete argument — there is nothing left to withhold.",
  },
  {
    front: "Why doesn't compiling successfully prove a function is correct?",
    back: "A compiler proves type consistency, not that your formula matches the problem. If the code runs but the answer is wrong, the fix is to return to the examples and dry run, not just to the code.",
  },
  {
    front: "Is cube 4 an IO action just because it appears inside main's do block, as in print (cube 4)?",
    back: "No. cube 4 is a pure Integer-producing expression; wrapping it in print is what creates the IO () action. Appearing inside a do block does not make a subexpression an action by itself.",
  },
  {
    front: "Is the order actions run in inside a do block the same as strict, top-to-bottom evaluation order?",
    back: "No. The do block describes the order IO actions run in, but Haskell is lazy — a pure expression like cube 4 is only evaluated once its value is actually needed, not necessarily the instant execution reaches that line.",
  },
  {
    front: "print n versus putStrLn (show n) — what's the relationship?",
    back: "print n behaves like putStrLn (show n) — it is not a separate mechanism. print first obtains the value's readable representation via show, then displays that text with a trailing newline.",
  },
  {
    front: "Why doesn't show 42 print anything by itself inside a real program (not the GHCi prompt)?",
    back: "show is a pure calculation: it returns a String value and performs no terminal output. GHCi's habit of echoing a typed expression's value is a feature of the interactive prompt, not something show does on its own — inside a compiled do block, an unused show result is simply computed and discarded.",
  },
  {
    front: "Why does a do block let later lines see earlier bindings, but never the reverse?",
    back: "do is syntactic sugar for nested function calls: each statement is written literally inside the one before it (via >>= and a lambda). A name is visible to everything nested inside the point where it was introduced, never to anything written before it.",
  },
  {
    front: "Of the four meanings of \"store\", which one does let doubled = number * 2 actually provide?",
    back: "Only an immutable binding — a name meaningful while the program is running. It does not survive after the program exits; that would require persistent external storage, an explicit IO write to a file or similar.",
  },
];

export const flashcardData = [
  {
    front: "Expression, evaluation, and value",
    back: "An expression is Haskell code that denotes a result. Evaluation is the process of reducing that expression. The value is the resulting data, such as evaluating 2 + 3 to the value 5.",
  },
  {
    front: "What is GHCi's role when you enter an expression?",
    back: "GHCi reads the expression, checks that it is valid and well typed, evaluates it, and displays a representation of the resulting value. The ghci> text is the prompt, not part of the expression.",
  },
  {
    front: "Literal",
    back: "A literal writes a value directly in source code. Examples include 42, True, 'A', and \"CSI243\". Quotes are part of the syntax used to write character and string literals.",
  },
  {
    front: "Identifier",
    back: "A name that refers to a definition, parameter, or other program entity, such as score or square. Unquoted Hello is treated as a name, whereas \"Hello\" is a String literal.",
  },
  {
    front: "Char versus String",
    back: "Char represents one character and uses single quotes, such as 'A'. String represents a sequence of characters and uses double quotes, such as \"A\". They are different types even when the string has length one.",
  },
  {
    front: "Bool",
    back: "The type whose two values are True and False. Comparisons such as 7 < 10 produce Bool values; the words True and False begin with capital letters and do not use quotes.",
  },
  {
    front: "Int versus Integer",
    back: "Both represent whole numbers. Int has a fixed machine-dependent range, while Integer can grow to much larger values as memory permits. A type signature should state which one a definition intends to use.",
  },
  {
    front: "Float and Double",
    back: "Both are approximate floating-point number types. Double normally provides more precision than Float. Neither represents every decimal fraction exactly.",
  },
  {
    front: "Function application with spaces",
    back: "Writing square 3 applies square to 3. Application binds tightly, so square 3 + 4 means (square 3) + 4. Write square (3 + 4) when the sum must be the argument.",
  },
  {
    front: "Why does print Hello World not mean print the sentence?",
    back: "Without double quotes, Hello and World are parsed as identifiers. Spaces mean function application, so the expression groups as (print Hello) World rather than as one String argument.",
  },
  {
    front: "Why does 9 + -7 error while 9 + (-7) works?",
    back: "Haskell reads the - immediately after an operator as subtraction, not as marking a negative number, so 9 + -7 parses as an incomplete expression. Brackets around (-7) remove the ambiguity by making it unmistakably one literal value.",
  },
  {
    front: ":type versus :info — what's the difference?",
    back: ":type answers a question about an expression you supply, reporting its type. :info answers a bigger question about a name already in scope — what it is and where it came from, including which module defined it, which :type does not show.",
  },
  {
    front: "Do let-definitions entered at the GHCi prompt survive?",
    back: "No. Expressions and definitions entered at the prompt are lost when GHCi closes — that is the entire reason for saving work in a .hs file instead.",
  },
  {
    front: ":{ and :} in GHCi",
    back: "The pair of commands used to enter a definition too long for one line. The continuation lines must be indented relative to the name being defined, and the ghci| prompt shows GHCi is still collecting the block.",
  },
  {
    front: "Module name and filename — what's the rule, and when does a mismatch actually cause an error?",
    back: "A module name must match its filename (module Test lives in Test.hs). Loading that one file directly still works even if they differ, but the mismatch bites as soon as another module tries to import it, or when compiling with ghc -o, which requires a module named Main.",
  },
  {
    front: "runhaskell versus :load — what can :load do that runhaskell can't?",
    back: "runhaskell compiles and runs a script in one step but leaves no prompt afterward — you cannot call anything except main. :load leaves you inside GHCi with every top-level definition available, so you can test any function on its own.",
  },
  {
    front: "What are the .hi and .o files left behind by ghc -o?",
    back: ".o is the compiled object code for a module. .hi is the interface file describing what the module exports. Both are generated artefacts, safe to delete, since ghc recreates them.",
  },
  {
    front: "Why does 'AB' fail as a Char while \"AB\" works fine as a String?",
    back: "Char is defined to hold exactly one character, so two characters cannot fit inside a Char literal — it is rejected as a parse error before types are even checked. String is a list of characters and can hold any length, including two.",
  },
  {
    front: "Left-associative application: what would square 3 4 mean if square took two arguments?",
    back: "(square 3) 4 — apply square to 3 first, then apply whatever that produces to 4. Application always groups left to right, in the order written, never bundled into a pair.",
  },
  {
    front: "Why does 2 + 3 default to Integer while 2.5 defaults to Double?",
    back: "2 + 3's leftover constraint is just Num, and GHC's defaulting rule tries Integer first, which satisfies Num. 2.5 needs Fractional because of its decimal point, and Integer does not satisfy Fractional, so defaulting moves on to Double, which does.",
  },
  {
    front: "What is an operator \"section\", such as (+1) or (`div` 2)?",
    back: "An operator wrapped in parentheses with only one side already filled in — a complete, one-argument function, not evaluated until it is applied to an argument. (+1) is \"add 1\"; (`div` 2) is \"divide by 2\".",
  },
];

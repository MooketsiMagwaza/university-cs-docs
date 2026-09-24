export const flashcardData = [
  {
    front: "Three advantages of splitting code into modules",
    back: "A generic module's exports can be reused across many tasks; loosely coupled modules can be reused separately later; and dividing code into parts with specific purposes makes it more manageable.",
  },
  {
    front: "Module naming rules and the file convention",
    back: "Names are alphanumeric and must begin with an uppercase letter. One module per file, and the file name must match the module name exactly, including capitalisation.",
  },
  {
    front: "How do you define a module?",
    back: "module ModuleName where, followed by the definitions. The where clause marks the start of the module's contents.",
  },
  {
    front: "What does it mean for a module to be closed?",
    back: "Every name mentioned in the source must be defined locally or imported. Entities needed only for type checking are supplied silently and need not be imported by name.",
  },
  {
    front: "What does an export list do?",
    back: "module M (f, g) where restricts what importers can see. Unexported definitions stay private, so they can be rewritten without breaking callers.",
  },
  {
    front: "The five import forms",
    back: "import M (everything); import M (f, g) (selective); import M hiding (f); import qualified M (prefixed); import qualified M as X (prefixed with an alias).",
  },
  {
    front: "Where must import statements appear?",
    back: "Before any function definition, so at the top of the file, with each import on its own line.",
  },
  {
    front: "Two ways to resolve a name clash between modules",
    back: "Use hiding (name) on one import, or import qualified so every use carries the module name as a prefix. Note that types and synonyms cannot be hidden.",
  },
  {
    front: "Name the main standard library modules",
    back: "Prelude (standard definitions, imported automatically), Data.List, Data.Char, Data.Map (key-value pairs), and Data.Set (unique elements, implemented as a binary tree).",
  },
  {
    front: "What is a type synonym?",
    back: "Another name for an existing type, declared with the type keyword. type String = [Char] is the actual Prelude definition. The name must be capitalised.",
  },
  {
    front: "Why does `Metres + Feet` compile when both are synonyms for Double?",
    back: "A synonym introduces a name, not a new type. The compiler expands both to Double before checking, so the addition is valid. Synonyms document intent but give no type safety.",
  },
  {
    front: "Why can't a type synonym be recursive?",
    back: "type Chain = [Chain] expands to [[Chain]], then [[[Chain]]], never reaching a concrete type. Recursive structures need data, whose constructors stop the expansion.",
  },
  {
    front: "What does a `data` declaration create?",
    back: "A genuinely new type, distinct from every other, with one or more capitalised data constructors. Read | as 'or'.",
  },
  {
    front: "What is a data constructor that takes arguments?",
    back: "A function building a value of the type. Circle :: Float -> Shape. Pattern matching such as area (Circle r) extracts the carried value; the parentheses are required.",
  },
  {
    front: "What does `deriving (Show, Eq, Ord)` provide?",
    back: "Show gives conversion to String so values can be printed; Eq gives == and /=; Ord gives comparisons, ordering constructors by their declaration sequence.",
  },
  {
    front: "How do you write a function over a recursive type?",
    back: "One equation per constructor. For data Tree a = Leaf a | Branch (Tree a) (Tree a), the Leaf case is the base case and the Branch case is the recursive step.",
  },
  {
    front: "`type` or `data`?",
    back: "Use type for readability of an existing type; it is interchangeable and cannot recurse. Use data when you need a genuinely new type, enforced separation, or recursion.",
  },
  {
    front: "What is `newtype`, and why use it instead of `data` for a single-field wrapper like `Metres`?",
    back: "newtype Metres = Metres Double creates a type as genuinely distinct as data would — mixing Metres and Feet is still a compile error — but the wrapper is erased entirely at compile time, so a newtype value costs no more than the Double it holds. It's data's type safety at type's run-time price.",
  },
  {
    front: "What restriction does `newtype` have that `data` does not?",
    back: "A newtype allows exactly one constructor with exactly one field. newtype Shape = Circle Float | Rectangle Float Float is rejected — GHC needs exactly one way to build and unwrap the value to erase it safely. More constructors, more fields, or recursion all require data.",
  },
  {
    front: "Given `data Student = Student { studentName :: String, studentMark :: Int }`, what does GHC generate automatically?",
    back: "One accessor function per named field — studentName :: Student -> String and studentMark :: Student -> Int — with no pattern match written by hand. Values also print with their field names attached, e.g. Student {studentName = \"Kago\", studentMark = 72}.",
  },
  {
    front: "What does `kago { studentMark = 75 }` actually do, and what happens to `kago` itself?",
    back: "It builds and returns a brand-new Student, copying every field from kago except studentMark. kago itself is completely unchanged — there is no mutation in pure Haskell, so the new value must be bound to a name to be kept.",
  },
  {
    front: "Is `data StudentP = StudentP String Int Bool` a Haskell \"record\"?",
    back: "No. That's a positional constructor — reading one field means pattern matching all three positions and discarding the rest, e.g. (StudentP _ mark _). A real record needs curly braces after the constructor name, Student { studentName :: String, ... }, which is what generates accessors and enables { field = value } update syntax.",
  },
  {
    front: "`import qualified Data.Map as Map` and `import qualified Data.Set as Map` appear in the same file. What happens?",
    back: "An error — Data.Map and Data.Set both export overlapping names (like insert, empty), so sharing the alias Map between them creates an ambiguous-name conflict. Several modules may share an alias only if none of their names actually clash.",
  },
  {
    front: "A file named `calc.hs` contains `module Calculator where`. What happens when another file does `import Calculator`?",
    back: "GHC reports \"Could not find module Calculator\" — it finds modules by searching for a matching filename (Calculator.hs), not by reading file contents. Loading calc.hs directly with :load calc still works fine on its own; the mismatch only breaks an import from elsewhere.",
  },
  {
    front: "After `Map.insert \"Sipho\" 55 marks`, what is `marks` itself, and what does `Map.lookup` return for a missing key?",
    back: "marks is unchanged — Map.insert returns a new map, like every Haskell update. Map.lookup returns a Maybe: Just value if the key is present, Nothing if it's missing.",
  },
  {
    front: "What is a parameterised type synonym? Give `Pair` and `Assoc`.",
    back: "A type declaration taking lowercase type-variable parameters, instantiated differently at each use. type Pair a = (a, a) and type Assoc k v = [(k, v)] — Assoc is a lookup table from keys to values, e.g. marks :: Assoc String Int.",
  },
  {
    front: "Can you write `import Data.List (sort) hiding (nub)`?",
    back: "No — a selective import and hiding cannot be combined in the same statement. An import either lists what you want (selective) or what you don't want (hiding), never both. Use hiding alone if you need most of a module minus a couple of names.",
  },
];

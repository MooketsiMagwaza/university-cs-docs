export const flashcardData = [
  {
    front: "Concrete type or type variable?",
    back: "Uppercase names such as Int, Bool, Shape are concrete types. Lowercase names such as a, b, k, v are type variables standing for any type.",
  },
  {
    front: "What can a function of type `[a] -> Int` do?",
    back: "It cannot inspect the elements at all, because an unconstrained a supports no operation. It can only count or structurally rearrange them. Fewer constraints means fewer possible behaviours.",
  },
  {
    front: "Does `a -> b` mean the two types must differ?",
    back: "No. Different letters mean the types MAY differ. In map applied to an Int -> Int function, a and b are both Int.",
  },
  {
    front: "The type inference rule for application",
    back: "If f :: A -> B and e :: A, then f e :: B. If the argument's type is not A, the application is rejected before evaluation.",
  },
  {
    front: "Why does `pairUp 1 'a'` fail for `a -> a -> (a, a)`?",
    back: "One type variable stands for one type throughout a given application, so both arguments must have the same type. Use a -> b -> (a, b) to allow them to differ.",
  },
  {
    front: "What is overloading?",
    back: "One name with several implementations, chosen by the type it is used at. == compares Integer, Char, Bool, and String using a different underlying implementation each time.",
  },
  {
    front: "What is a type class?",
    back: "A named collection of operations a type may provide. A type providing them is an instance. A class is not a type — you cannot have a value of type Eq.",
  },
  {
    front: "How do you read `Num a => [a] -> a`?",
    back: "For any type a that is a member of Num, the function takes a list of a and returns an a. Everything before => is the constraint; everything after is the type.",
  },
  {
    front: "The generality trade-off",
    back: "More constraints: fewer types, more capability. Fewer constraints: more types, less capability. Choose the most general signature that still permits what the function needs.",
  },
  {
    front: "What does \"No instance for (Num a)\" mean?",
    back: "An arithmetic operation was used on an unconstrained type variable. The fix is to add Num a => to the signature. The message names the class and the operation that required it.",
  },
  {
    front: "Which class does each need: ==, sort, print, div, /, maxBound?",
    back: "Eq, Ord, Show, Integral, Fractional, Bounded respectively.",
  },
  {
    front: "Why does `Ord a =>` alone give you `==` as well?",
    back: "Ord requires Eq, since ordering presupposes equality. Every Ord instance is also an Eq instance, so writing (Eq a, Ord a) => is redundant.",
  },
  {
    front: "Why does `average xs = sum xs / length xs` fail?",
    back: "length returns Int, but / requires both operands to share one Fractional type and Int is not Fractional. Use sum xs / fromIntegral (length xs).",
  },
  {
    front: "Why does `read` usually need a type annotation?",
    back: "The same text could produce several types — read \"42\" could be Integer or Double — so read cannot tell which was meant. Annotate: read s :: Integer.",
  },
  {
    front: "Why has `Integer` no Bounded instance?",
    back: "Bounded provides minBound and maxBound, which presuppose a largest and smallest value. Integer is arbitrary-precision and grows until memory runs out, so no maximum exists.",
  },
  {
    front: "The declaration of `Maybe`",
    back: "data Maybe a = Nothing | Just a. Nothing means no result; Just holds a value of type a. It makes failure part of the result type.",
  },
  {
    front: "Why prefer Maybe over error?",
    back: "error stops the whole program and cannot be recovered from. Nothing is an ordinary value the caller can handle, the possibility of failure is visible in the signature, and the compiler forces the caller to cover it.",
  },
  {
    front: "How do you write an instance by hand?",
    back: "instance ClassName TypeName where, then define the class's operations for your type. Remove the class from any deriving clause first — a type may have only one instance of a class.",
  },
  {
    front: "Monomorphic or polymorphic — what's the difference in what each accepts?",
    back: "firstChar :: String -> Char is monomorphic, locked to [Char] only. headOf :: [a] -> a is polymorphic and accepts a list of any type. headOf covers everything firstChar covers, plus more — firstChar rejects [1,2,3] outright.",
  },
  {
    front: "What is instantiation?",
    back: "Fixing a polymorphic function's type variable to one concrete type for a given call. Each call instantiates independently — length [1,2,3] fixes a to Integer, length \"hello\" fixes it to Char, with no relationship between the two calls.",
  },
  {
    front: "How does GHC decide which == actually runs for an overloaded symbol?",
    back: "Dispatch happens once, at compile time, by the inferred type of the operands — not by any run-time search. Change the inferred type and a completely different instance's implementation runs, with no change to what you typed.",
  },
  {
    front: "Do Integral and Fractional ever overlap on an ordinary numeric type?",
    back: "No. Both extend Num independently, but no ordinary numeric type is both — div on a Double and / on an Int are both rejected. That is why the two never substitute for each other.",
  },
  {
    front: "How does a derived Ord order values, and how do tuples compare?",
    back: "A derived Ord ranks constructors by the order they're declared (Pass before Fail means Pass < Fail). Tuples compare component by component left to right, stopping as soon as one pair disagrees — later components are only checked if every earlier one tied.",
  },
  {
    front: "What does being an Eq instance guarantee — and what does it NOT guarantee?",
    back: "It guarantees == and /= exist and type-check. It does not guarantee == behaves like mathematical equality (reflexive, symmetric, consistent) — a derived instance does, because it compares every field structurally, but a hand-written one might not.",
  },
  {
    front: "Why does deriving both Show and Read on the same type give you a genuine inverse pair?",
    back: "The text a derived Show produces is exactly the text a derived Read for that type can parse back — read (show k) == k round-trips losslessly, confirmed with a derived Eq.",
  },
  {
    front: "In the reportAverage batch example, why does Class C's average never get printed?",
    back: "reportAverage [] evaluates 0 `div` 0, which raises \"divide by zero\" — an uncaught exception that terminates the whole program right there. Every later line in the do block, including Class C's, never runs. One bad input destroys every result after it, not just its own.",
  },
  {
    front: "What does fmap do, in one sentence?",
    back: "It applies an ordinary function (a -> b) to the value inside a context f a, producing f b, without you ever unwrapping the context by hand. map is exactly list's fmap — fmap (*2) [1,2,3] and map (*2) [1,2,3] are the same function.",
  },
  {
    front: "Why does the exact same do-notation Chapter 3 used for IO also work, unchanged, for Maybe?",
    back: "do is sugar for >>=, and >>= is a method of the Monad class, defined once per instance — IO and Maybe are two separate instances. The Maybe do block short-circuits to Nothing at the first failing <-, exactly like the nested-case version, but written with do syntax.",
  },
];

export const flashcardData = [
  {
    front: "What does it mean that lists are homogeneous?",
    back: "Every element of a list must have the same type. [1, 'a', True] is rejected at compile time because no single element type fits all three.",
  },
  {
    front: "Expand `[1,2,3]` into cons form",
    back: "1:(2:(3:[])). Every list is built one element at a time from the empty list using :, which associates to the right, so it may be written 1:2:3:[].",
  },
  {
    front: "What does `:` require on each side?",
    back: "An element on the left and a list on the right. [1,2] : 3 is a type error. To join two lists use ++, not :.",
  },
  {
    front: "The standard exhaustive split for any list",
    back: "[] matches the empty list and is the base case; (x:xs) matches a non-empty list, binding x to the head and xs to the tail, and is the recursive step.",
  },
  {
    front: "Why does recursion on `(x:xs)` terminate?",
    back: "xs is always one element shorter than the argument, so repeated calls must eventually reach [].",
  },
  {
    front: "Base cases for recursive `sum` and `product`",
    back: "sum [] = 0 and product [] = 1. Each is the identity value for its operation, so it leaves the result unchanged when combined.",
  },
  {
    front: "What is a partial function? Name four on lists.",
    back: "One that is undefined for some inputs its type allows. head, tail, last, init, maximum, minimum, and !! all fail on an empty list or an out-of-range index.",
  },
  {
    front: "`take 6 [1,2,3,4,5]` versus `[1,2] !! 5`",
    back: "take returns the whole list when fewer elements exist — it is total. !! raises an index-too-large exception — it is partial.",
  },
  {
    front: "How do you build a list in a recursive step?",
    back: "Cons the transformed head onto the recursive call: doubleAll (x:xs) = (x * 2) : doubleAll xs. The base case returns [].",
  },
  {
    front: "Shape of a recursive filter",
    back: "Guards decide whether to keep the head: | test = x : f xs, and | otherwise = f xs. Both branches recurse on xs so the list still shrinks.",
  },
  {
    front: "What is arity, and why is arity 1 not allowed?",
    back: "Arity is the number of components in a tuple and is part of its type. (5) is just 5 in brackets — brackets around one expression are grouping, not construction.",
  },
  {
    front: "Why are `(String, Integer)` and `(Integer, String)` different types?",
    back: "A tuple type records the type of each position in order, so swapping positions gives a different type that cannot be used where the other is expected.",
  },
  {
    front: "List or tuple?",
    back: "Ask whether the number of components can change. If yes, a list — same type, varying length. If no and the parts mean different things, a tuple — fixed arity, mixed types.",
  },
  {
    front: "The two parts of a list comprehension",
    back: "Before the pipe is the output function, applied to each surviving element. After it are generators (x <- list) and comma-separated tests that filter. Read | as 'such that'.",
  },
  {
    front: "In `[x + y | x <- [1,2,3], y <- [-3,0,3]]`, which generator varies fastest?",
    back: "The rightmost. x is held while y runs through every value, like a nested loop with the later generator innermost. The result has nine elements.",
  },
  {
    front: "When should you prefer recursion over a comprehension?",
    back: "When the result depends on more than one element at a time (isSorted), when elements combine into a single value (sum), or when the recursion is not over a list at all.",
  },
  {
    front: "How does `evensUpTo` generate a list from a plain number, with no input list to recurse on?",
    back: "Its helper `go k` recurses on the gap between a counter k and the bound n: the base case k > n returns [], the recursive step conses k and calls go (k + 2). The base case is reached by counting past n, not by running out of list elements.",
  },
  {
    front: "Why does `evensDown` (counting down from n and consing as it goes) return `[8,6,4,2]` instead of `[2,4,6,8]` for n = 8?",
    back: "The first element consed on, at the earliest call, is 8 itself, and consing always places the new head at the front. Consing the largest survivor first puts it at the front of the result, reversing the intended order.",
  },
  {
    front: "How does `contains` stop searching the moment it finds a match, with no explicit short-circuit code?",
    back: "The matching guard `v == x = True` returns True directly with no recursive call in that branch. Because the deeper call is simply never made, the remaining tail is never inspected — Haskell's laziness does the rest.",
  },
  {
    front: "`contains` and `linearSearch` compute the same search. What's the actual difference between them?",
    back: "Only argument order: contains is `Eq a => a -> [a] -> Bool` (element first), linearSearch is `Eq a => [a] -> a -> Bool` (list first). Neither is more correct — what matters is that the signature, equations, and every call site agree with each other.",
  },
  {
    front: "How do you read the signature `Eq a => [a] -> a -> Bool`?",
    back: "Read the constraint first, in isolation: \"for any type a that supports ==\". Only then apply the ordinary arrow-by-arrow rule to what follows: takes a list of a, then one more a, gives back a Bool. The constraint is a precondition on a, not an argument itself.",
  },
  {
    front: "Why does a search function using `==` need an `Eq a` constraint at all?",
    back: "`==` is not defined for every possible type. Any function that compares values of type a with == must declare, in its own signature, that a is limited to types where == exists — otherwise GHC refuses to compile it.",
  },
  {
    front: "What does `positionOf` return when the value is never found, and how does it decide that?",
    back: "It returns -1, its \"not found\" sentinel. Its helper `go` increments a running position i on every non-match until the list is exhausted, at which point the base case `go [] _ = -1` fires, discarding whatever i had counted up to.",
  },
  {
    front: "Why is `myReverse xs = myReverse xs' ++ [x]` (consing via `++`) worse than `myReverseFast`'s accumulator version?",
    back: "`++` walks its entire left operand to find the end before attaching the right side, so appending once per element costs O(n²) overall. myReverseFast instead conses onto an accumulator (O(1) per step), making it O(n) — same answer, much less work.",
  },
  {
    front: "Why does `isSorted` need three equations — `[]`, `[_]`, and `(x:y:rest)` — instead of the usual two?",
    back: "A singleton is trivially sorted (nothing to compare it against) but doesn't match (x:y:rest), which needs at least two elements. It needs its own True case, separate from both [] and a genuine two-or-more-element list.",
  },
];

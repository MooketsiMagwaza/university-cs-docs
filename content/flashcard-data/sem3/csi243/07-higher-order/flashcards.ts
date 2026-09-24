export const flashcardData = [
  {
    front: "What is a higher-order function?",
    back: "A function that takes another function as an argument, or returns one as its result. map, filter, foldr, and zipWith are all higher-order.",
  },
  {
    front: "What does it mean that functions are first-class values?",
    back: "They can be passed to functions, returned from functions, and stored in data structures, with no restriction on their use.",
  },
  {
    front: "Write the lambda for λx ● x + x, and apply it to 3",
    back: "\\x -> x + x, applied as (\\x -> x + x) 3, giving 6. The parentheses are required because the lambda body extends as far right as it can.",
  },
  {
    front: "What is currying?",
    back: "Every Haskell function takes exactly one argument. add x y = x + y really means add = \\x -> (\\y -> x + y): it takes x and returns a function awaiting y.",
  },
  {
    front: "How do -> and application associate?",
    back: "-> associates to the right, so Integer -> Integer -> Integer is Integer -> (Integer -> Integer). Application associates to the left, so add 3 4 is (add 3) 4.",
  },
  {
    front: "What is partial application?",
    back: "Supplying fewer arguments than the full count. add 3 is a complete value of type Integer -> Integer. It follows directly from currying, and is impossible with a tupled function.",
  },
  {
    front: "Converting between operators and functions",
    back: "Backticks make a function infix: 7 `div` 2. Parentheses make an operator an ordinary curried function: (+) 3 2. The latter is needed because a bare operator is not a valid expression.",
  },
  {
    front: "What is a section? Give the lambda meaning of (x⊕) and (⊕y)",
    back: "An operator with one side already supplied. (x⊕) is \\y -> x ⊕ y, fixing the left argument. (⊕y) is \\x -> x ⊕ y, fixing the right.",
  },
  {
    front: "Why can't (-5) subtract five?",
    back: "The minus sign also marks negative literals, so (-5) parses as the number negative five, not a section. Use subtract 5. Left sections like (5-) are unaffected.",
  },
  {
    front: "Signature and definition of `map`",
    back: "map :: (a -> b) -> [a] -> [b]; map _ [] = [] and map f (x:xs) = f x : map f xs. Length is always preserved; the element type may change.",
  },
  {
    front: "Signature and definition of `filter`",
    back: "filter :: (a -> Bool) -> [a] -> [a]; filter _ [] = [], then guards | p x = x : filter p xs | otherwise = filter p xs. Element type is unchanged; the result may be shorter.",
  },
  {
    front: "How does `takeWhile` differ from `filter`?",
    back: "takeWhile returns the longest prefix satisfying the predicate and stops permanently at the first failure. filter tests every element. takeWhile (<4) [1,2,3,9,1] is [1,2,3]; filter gives [1,2,3,1].",
  },
  {
    front: "Signature of `foldr` and its three arguments",
    back: "foldr :: (a -> b -> b) -> b -> [a] -> b. A function combining an element with the accumulated result, a starting value returned for [], and the list.",
  },
  {
    front: "How do you predict a `foldr` by substitution?",
    back: "Replace every : with the operator and the final [] with the starting value. foldr (+) 0 [1,2,3] becomes 1 + (2 + (3 + 0)) = 6.",
  },
  {
    front: "Why do foldr and foldl differ for (-) but not (+)?",
    back: "Addition is associative so nesting direction does not matter. Subtraction is not: foldr gives 1-(2-(3-0)) = 2, foldl gives ((0-1)-2)-3 = -6.",
  },
  {
    front: "`sum`, `product`, `and`, `or` as folds",
    back: "sum = foldr (+) 0; product = foldr (*) 1; and = foldr (&&) True; or = foldr (||) False. Each base value is the identity for its operator.",
  },
  {
    front: "Function composition: type and reading direction",
    back: "(.) :: (b -> c) -> (a -> b) -> a -> c, with (f . g) x = f (g x). Read right to left: apply g first, then f.",
  },
  {
    front: "When should you avoid point-free style?",
    back: "Whenever omitting the argument makes the code harder to follow. A readable named function beats a dense chain of operators; clarity comes before cleverness.",
  },
  {
    front: "Why does `map (*2) [1..]` (paired with `take`) terminate, even though `[1..]` never ends?",
    back: "`:` is lazy — `map f (x:xs) = f x : map f xs` builds the cons cell as soon as it has one `x` and one `xs`, without evaluating `map f xs` further. `take` is what stops asking for more; once it reaches 0 it matches a wildcard and never touches the rest of the list.",
  },
  {
    front: "How does `take` decide when to stop, and why does that matter for infinite lists?",
    back: "take 0 _ = [] matches the wildcard immediately, without touching the list at all. take n (x:xs) = x : take (n-1) xs only pattern-matches one element at a time. Because take never demands more of the list than it needs, take 5 (map (*2) [1..]) finishes despite [1..] being infinite.",
  },
  {
    front: "In the grades example (marks = [42,88,35,67,50,91,48,73]), what does filter (< 50) marks return, and what does map applyBonus marks return (a 7% bonus, rounded down)?",
    back: "filter (< 50) marks is [42,35,48] — the failing marks, dropped from an unchanged list. map applyBonus marks is [44,94,37,71,53,97,51,78] — every mark curved, none dropped. The two are independent: map applies the bonus to everyone, including the marks filter would have removed.",
  },
  {
    front: "How do you write \"count how many elements satisfy a test\" in Haskell, without a dedicated counting function?",
    back: "length (filter p xs) — Haskell has no separate counting primitive. filter p xs produces the elements that pass, and length counts them, e.g. countSpaces xs = length (filter isSpaceChar xs).",
  },
  {
    front: "add x = if even x then x+1 else x+2. Do a hand-recursion, a list comprehension, and map add give the same result on [1,2,3,4]?",
    back: "Yes — all three give [3,3,5,5]. map never requires the function it's given to be simple; it only requires one function a -> b applied per element. A per-element rule with its own guards is still a single function, so it fits map exactly as (*2) would.",
  },
  {
    front: "Signature of zipWith, and what happens when the two lists have different lengths?",
    back: "zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]. It applies the combining function pairwise (first with first, second with second, ...) and stops as soon as the shorter list runs out — zipWith (+) [1,2,3] [10,20] is [11,22], not an error and not padded.",
  },
  {
    front: "How does dropWhile differ from filter?",
    back: "dropWhile p xs throws away elements from the front while p says yes, then keeps everything from the first failure onward, unexamined — it stops testing once p fails once. filter tests every element in the list regardless of what came before.",
  },
  {
    front: "Why can foldr produce a result on an infinite list (e.g. take 3 (foldr (:) [] [1..])) while foldl cannot?",
    back: "foldr f acc (x:xs) = f x (foldr f acc xs) can hand back f x (...) as soon as f allows it — for (:), that's immediately, without evaluating the recursive call further. foldl must walk to the very end of the list to build its accumulator before returning anything, so on an infinite list it never returns at all.",
  },
  {
    front: "What is a scan, and how does scanl's last element relate to the corresponding foldl?",
    back: "A scan is a fold that keeps every intermediate result instead of only the last. scanl (+) 0 [1,2,3,4] is [0,1,3,6,10]; its final element, 10, is exactly foldl (+) 0 [1,2,3,4].",
  },
  {
    front: "What does ($) do, and why does it exist?",
    back: "($) :: (a -> b) -> a -> b, with f $ x = f x — ordinary function application, but with the lowest possible precedence. Its only purpose is to remove nested parentheses: sum $ map (^2) $ filter odd [1..10] computes the same thing as sum (map (^2) (filter odd [1..10])).",
  },
];

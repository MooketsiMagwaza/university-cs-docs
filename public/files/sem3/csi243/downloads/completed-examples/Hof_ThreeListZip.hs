-- Title: Implement a recursive zip over three lists
{-
QUESTION
Implement zipWithx :: (a -> b -> c -> d) -> [a] -> [b] -> [c] -> [d]
recursively, stopping when any input is empty; do not call zipWith3.
Also write fp x y z = x+y+z with type Int -> Int -> Int -> Int.
Explain why an all-empty-only base case can crash after printing part of a
list, and why the combiner needs three arguments. (10 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- zipWithx :: (a -> b -> c -> d) -> [a] -> [b] -> [c] -> [d]
-- fp :: Int -> Int -> Int -> Int
-- Plan: Handle each empty input, combine the three heads and recurse on their tails.
zipWithx :: (a -> b -> c -> d) -> [a] -> [b] -> [c] -> [d]
-- Stop when any input is exhausted, not only when all three are empty.
zipWithx _ [] _ _ = []
zipWithx _ _ [] _ = []
zipWithx _ _ _ [] = []
zipWithx f (x:xs) (y:ys) (z:zs) = f x y z : zipWithx f xs ys zs

fp :: Int -> Int -> Int -> Int
fp x y z = x+y+z

-- An all-empty-only case misses ([],nonempty,nonempty) and its permutations.
-- Lazy printing may emit a prefix before demanding that missing case.
-- The combiner consumes one element per list, hence three input arrows.
-- Passing (+) directly is wrong here: it consumes only two arguments.

main :: IO ()
main = do
  print (zipWithx fp [1,2] [10,20] [100,200])  -- expected: [111,222]
  print (zipWithx fp [] [10] [100])  -- expected: []
  print (zipWithx fp [1] [] [100])  -- expected: []
  print (zipWithx fp [1] [10] [])  -- expected: []
  print (zipWithx fp [1] [10,20] [100,200])  -- expected: [111]
  print (zipWithx fp [1,2] [10] [100,200])  -- expected: [111]
  print (zipWithx fp [1,2] [10,20] [100])  -- expected: [111]
  print (zipWithx fp [] [] [])  -- expected: []
  print (zipWithx fp [] [] [1])  -- expected: []
  print (zipWithx fp [] [1] [])  -- expected: []
  print (zipWithx fp [1] [] [])  -- expected: []

-- Title: Implement a recursive zip over three lists
{-
QUESTION
Implement zipWithx :: (a -> b -> c -> d) -> [a] -> [b] -> [c] -> [d]
recursively, stopping when any input is empty; do not call zipWith3.
Also write fp name mark passed = (name,mark,passed) with type String -> Int -> Bool -> (String, Int, Bool).
Explain why an all-empty-only base case can crash after printing part of a
list, and why the combiner needs three arguments. (10 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- zipWithx :: (a -> b -> c -> d) -> [a] -> [b] -> [c] -> [d]
-- fp :: String -> Int -> Bool -> (String, Int, Bool)
-- Plan: Handle each empty input, combine the three heads and recurse on their tails.
zipWithx :: (a -> b -> c -> d) -> [a] -> [b] -> [c] -> [d]
-- Stop when any input is exhausted, not only when all three are empty.
zipWithx _ [] _ _ = []
zipWithx _ _ [] _ = []
zipWithx _ _ _ [] = []
zipWithx f (x:xs) (y:ys) (z:zs) = f x y z : zipWithx f xs ys zs

fp :: String -> Int -> Bool -> (String, Int, Bool)
fp name mark passed = (name,mark,passed)

-- An all-empty-only case misses ([],nonempty,nonempty) and its permutations.
-- Lazy printing may emit a prefix before demanding that missing case.
-- The combiner consumes one element per list, hence three input arrows.
-- Passing (+) directly is wrong here: it consumes only two arguments.

main :: IO ()
main = do
  print (zipWithx fp ["Ada","Bo"] [60,40] [True,False])  -- expected: [("Ada",60,True),("Bo",40,False)]
  print (zipWithx fp [] [60] [True])  -- expected: []
  print (zipWithx fp ["Ada"] [] [True])  -- expected: []
  print (zipWithx fp ["Ada"] [60] [])  -- expected: []
  print (zipWithx fp ["Ada"] [60,40] [True,False])  -- expected: [("Ada",60,True)]
  print (zipWithx fp [] [] [])  -- expected: []
  print (zipWithx fp [] [] [True])  -- expected: []
  print (zipWithx fp [] [1] [])  -- expected: []
  print (zipWithx fp ["a"] [] [])  -- expected: []
  print (zipWithx fp ["a","b"] [60] [True,False])  -- expected: [("a",60,True)]
  print (zipWithx fp ["a","b"] [60,70] [True])  -- expected: [("a",60,True)]

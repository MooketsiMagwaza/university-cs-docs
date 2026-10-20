-- Title: Build every combination of elements from two lists.
{-
QUESTION
Write allPairs :: [a] -> [b] -> [(a,b)]. Pair every element of the first
list with every element of the second, with the second list varying
fastest. Return [] if either list is empty. Keep the function polymorphic.
-}

-- Read the question: Write a polymorphic Cartesian product of two lists.
-- Plan: Use one generator for each input list.
allPairs :: [a] -> [b] -> [(a, b)]
-- The second generator runs fully for each first-list value.
allPairs xs ys = [(x,y) | x <- xs, y <- ys]

main :: IO ()
main = do
  print (allPairs ([] :: [Int]) [True])  -- expected: []
  print (allPairs [True] ([] :: [Int]))  -- expected: []
  print (allPairs ([1] :: [Int]) "a")  -- expected: [(1,'a')]
  print (allPairs ([1,2] :: [Int]) "ab")  -- expected: [(1,'a'),(1,'b'),(2,'a'),(2,'b')]
  print (allPairs [False,True] ["x"])  -- expected: [(False,"x"),(True,"x")]

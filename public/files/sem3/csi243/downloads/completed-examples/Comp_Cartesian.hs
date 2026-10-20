-- Title: Build a Cartesian product
{-
QUESTION
Write cartesian :: [a] -> [b] -> [(a,b)] using a comprehension. [4]
The first list varies slowest; preserve duplicates.
-}

-- Read the question: Write cartesian :: [a] -> [b] -> [(a,b)].
-- Plan: Nest one generator for each input.
cartesian :: [a] -> [b] -> [(a,b)]
cartesian xs ys = [(x,y) | x <- xs, y <- ys]  -- Later generator varies fastest.

main :: IO ()
main = do
  print (cartesian ([] :: [Int]) "ab")  -- expected: []
  print (cartesian [1] "")  -- expected: []
  print (cartesian [1] "a")  -- expected: [(1,'a')]
  print (cartesian [1,2] "ab")  -- expected: [(1,'a'),(1,'b'),(2,'a'),(2,'b')]
  print (cartesian [True,False] [0])  -- expected: [(True,0),(False,0)]

-- Title: Lift a ternary function over three lists
{-
QUESTION
Write triples :: [Int] -> [Int] -> [Int] -> [Int] using pure and <*>.
Lift \a b c -> 100*a + 10*b + c. The first list varies slowest and
the third fastest. An empty argument produces no combinations.
-}

-- Read the question: Write a definition; triples has input/result type [Int] -> [Int] -> [Int] -> [Int].
-- Plan: Use list application with one branch for each ordered combination.
triples :: [Int] -> [Int] -> [Int] -> [Int]
triples as bs cs = pure (\a b c -> 100*a + 10*b + c) <*> as <*> bs <*> cs

main :: IO ()
main = do
  print (triples [] [2] [3])  -- expected: []
  print (triples [1] [] [3])  -- expected: []
  print (triples [1] [2] [])  -- expected: []
  print (triples [1] [2] [3])  -- expected: [123]
  print (triples [1,2] [3] [4,5])  -- expected: [134,135,234,235]
  print (triples [0] [1,2] [0])  -- expected: [10,20]

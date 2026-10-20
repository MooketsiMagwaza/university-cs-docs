-- Title: Generate integers increasing by two lazily
{-
QUESTION
Write numsFrom :: Integer -> [Integer] recursively. [4]
Start with the argument and produce integers increasing by two.
Use (:) so each output cell is available before its tail.
-}

-- Read the question: Write numsFrom :: Integer -> [Integer].
-- Plan: Emit the current value and delay the recursive tail.
numsFrom :: Integer -> [Integer]
numsFrom n = n : numsFrom (n + 2)  -- Productive recursive construction.

main :: IO ()
main = do
  print (take 0 (numsFrom 5))  -- expected: []
  print (take 1 (numsFrom 5))  -- expected: [5]
  print (take 4 (numsFrom 5))  -- expected: [5,7,9,11]
  print (take 3 (numsFrom (-1)))  -- expected: [-1,1,3]
  print (takeWhile (<6) (numsFrom 0))  -- expected: [0,2,4]

-- Title: Generate successive descending integers lazily
{-
QUESTION
Write numsFrom :: Integer -> [Integer] recursively. [4]
Start with the argument and produce successive descending integers.
Use (:) so each output cell is available before its tail.
-}

-- Read the question: Write numsFrom :: Integer -> [Integer].
-- Plan: Emit the current value and delay the recursive tail.
numsFrom :: Integer -> [Integer]
numsFrom n = n : numsFrom (n - 1)  -- Productive recursive construction.

main :: IO ()
main = do
  print (take 0 (numsFrom 5))  -- expected: []
  print (take 1 (numsFrom 5))  -- expected: [5]
  print (take 4 (numsFrom 5))  -- expected: [5,4,3,2]
  print (take 3 (numsFrom (-1)))  -- expected: [-1,-2,-3]
  print (takeWhile (>0) (numsFrom 3))  -- expected: [3,2,1]

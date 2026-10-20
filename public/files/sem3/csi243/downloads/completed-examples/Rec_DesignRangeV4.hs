-- Title: Sum every second value in a signed range
{-
QUESTION
Write range :: Integer -> Integer -> Integer using recursion.
Sum lo, lo+2, lo+4, ... while the term is at most hi.
Return zero when the range is empty; do not build a list.
-}

-- Read the question: Write range with the stated domain and result type.
-- Plan: Advance the lower bound; hi-lo decreases until the empty-range test.
range :: Integer -> Integer -> Integer
-- Base cases stop recursion; each recursive call reduces the stated measure.
range lo hi
  | lo > hi = 0
  | otherwise = lo + range (lo+2) hi

main :: IO ()
main = do
  print (range 0 0)  -- expected: 0
  print (range 1 4)  -- expected: 4
  print (range (-2) 2)  -- expected: 0
  print (range 4 1)  -- expected: 0
  print (range 3 3)  -- expected: 3

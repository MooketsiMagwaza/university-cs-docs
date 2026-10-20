-- Title: Sum an inclusive range with reversed bounds empty
{-
QUESTION
Write range :: Integer -> Integer -> Integer using recursion.
Sum all integers from lo through hi, including both endpoints.
Return zero when the range is empty; do not build a list.
-}

-- Read the question: Write range with the stated domain and result type.
-- Plan: Advance the lower bound; hi-lo decreases until the empty-range test.
range :: Integer -> Integer -> Integer
-- Base cases stop recursion; each recursive call reduces the stated measure.
range lo hi
  | lo > hi = 0
  | otherwise = lo + range (lo+1) hi

main :: IO ()
main = do
  print (range 0 0)  -- expected: 0
  print (range 1 4)  -- expected: 10
  print (range (-2) 2)  -- expected: 0
  print (range 4 1)  -- expected: 0
  print (range 3 3)  -- expected: 3

-- Title: Sum the squares in an inclusive integer range
{-
QUESTION
Specify and implement rangeSquareSum :: Integer -> Integer -> Integer.
Return the sum of the squares of all integers in the inclusive range.
Treat a reversed range as empty, returning 0; include the case 9 6.
-}

-- Read the question: Write rangeSquareSum :: Integer -> Integer -> Integer.
-- Plan: Process the lower endpoint, then increase it until the range is empty.
-- Dry run: rangeSquareSum 3 5 = 9 + (16 + (25 + 0)) = 50.
rangeSquareSum :: Integer -> Integer -> Integer
rangeSquareSum m n
  | m > n = 0 -- Base: empty range.
  | otherwise = m * m + rangeSquareSum (m + 1) n

main :: IO ()
main = do
  print (rangeSquareSum 3 5)  -- expected: 50
  print (rangeSquareSum 9 6)  -- expected: 0
  print (rangeSquareSum 4 4)  -- expected: 16
  print (rangeSquareSum (-2) 2)  -- expected: 10
  print (rangeSquareSum 0 0)  -- expected: 0

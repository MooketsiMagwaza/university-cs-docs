-- Title: Multiply all integers in an inclusive range
{-
QUESTION
Specify and implement rangeProduct :: Integer -> Integer -> Integer.
Return the product of all integers from the first to the second, inclusive.
Treat a reversed range as empty, returning 1; include the case 9 6.
-}

-- Read the question: Write rangeProduct :: Integer -> Integer -> Integer.
-- Plan: Process the lower endpoint, then increase it until the range is empty.
-- Dry run: rangeProduct 3 5 = 3 * (4 * (5 * 1)) = 60.
rangeProduct :: Integer -> Integer -> Integer
rangeProduct m n
  | m > n = 1 -- Base: empty range.
  | otherwise = m * rangeProduct (m + 1) n

main :: IO ()
main = do
  print (rangeProduct 3 5)  -- expected: 60
  print (rangeProduct 9 6)  -- expected: 1
  print (rangeProduct 4 4)  -- expected: 4
  print (rangeProduct (-2) 2)  -- expected: 0
  print (rangeProduct 0 0)  -- expected: 0

-- Title: Sum all integers in an inclusive range
{-
QUESTION
Specify and implement rangeSum :: Integer -> Integer -> Integer.
Return the sum of all integers from the first to the second, inclusive.
For example, rangeSum 3 5 = 12. Dry run this call.
Treat a reversed range as empty, returning 0; include the case 9 6.
-}

rangeSum :: Integer -> Integer -> Integer
rangeSum = undefined -- Your answer here

main :: IO ()
main = do
  print (rangeSum 3 5)  -- expected: 12
  print (rangeSum 9 6)  -- expected: 0
  print (rangeSum 4 4)  -- expected: 4
  print (rangeSum (-2) 2)  -- expected: 0
  print (rangeSum 0 0)  -- expected: 0

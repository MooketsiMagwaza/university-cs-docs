-- Title: Multiply all integers in an inclusive range
{-
QUESTION
Specify and implement rangeProduct :: Integer -> Integer -> Integer.
Return the product of all integers from the first to the second, inclusive.
Treat a reversed range as empty, returning 1; include the case 9 6.
-}

rangeProduct :: Integer -> Integer -> Integer
rangeProduct = undefined -- Your answer here

main :: IO ()
main = do
  print (rangeProduct 3 5)  -- expected: 60
  print (rangeProduct 9 6)  -- expected: 1
  print (rangeProduct 4 4)  -- expected: 4
  print (rangeProduct (-2) 2)  -- expected: 0
  print (rangeProduct 0 0)  -- expected: 0

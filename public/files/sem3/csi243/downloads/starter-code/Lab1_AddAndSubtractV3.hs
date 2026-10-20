-- Title: Return the quotient and remainder as a pair
{-
QUESTION
Write quotientAndRemainder :: Int -> Int -> (Int, Int).
Return the integer quotient first and remainder second; divisor is nonzero.
-}

quotientAndRemainder :: Int -> Int -> (Int, Int)
quotientAndRemainder = undefined -- Your answer here

main :: IO ()
main = do
  print (quotientAndRemainder 0 3)  -- expected: (0,0)
  print (quotientAndRemainder 7 3)  -- expected: (2,1)
  print (quotientAndRemainder 3 7)  -- expected: (0,3)
  print (quotientAndRemainder 8 2)  -- expected: (4,0)
  print (quotientAndRemainder 10 4)  -- expected: (2,2)

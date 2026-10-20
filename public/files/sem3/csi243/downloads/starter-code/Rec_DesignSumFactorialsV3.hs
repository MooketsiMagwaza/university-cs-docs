-- Title: Sum factorials at even indices
{-
QUESTION
Write sumFac with the signature below. Reject negative n with Nothing.
Return the sum of k! for even k between zero and n inclusive.
-}

sumFac :: Int -> Maybe Integer
sumFac = undefined -- Your answer here

main :: IO ()
main = do
  print (sumFac (-1))  -- expected: Nothing
  print (sumFac 0)  -- expected: Just 1
  print (sumFac 1)  -- expected: Just 1
  print (sumFac 2)  -- expected: Just 3
  print (sumFac 4)  -- expected: Just 27

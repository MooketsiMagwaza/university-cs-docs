-- Title: Sum factorials below an exclusive bound
{-
QUESTION
Write sumFac with the signature below. Reject negative n with Nothing.
Return Just (0!+1!+...+(n-1)!). The empty sum at n=0 is zero.
-}

sumFac :: Int -> Maybe Integer
sumFac = undefined -- Your answer here

main :: IO ()
main = do
  print (sumFac (-1))  -- expected: Nothing
  print (sumFac 0)  -- expected: Just 0
  print (sumFac 1)  -- expected: Just 1
  print (sumFac 2)  -- expected: Just 2
  print (sumFac 4)  -- expected: Just 10

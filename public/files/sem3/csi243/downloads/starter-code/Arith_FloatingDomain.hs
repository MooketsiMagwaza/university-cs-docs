-- Title: Test absolute tolerance
{-
QUESTION
Write close :: Double -> Double -> Bool. Reject NaN and infinite
inputs; otherwise use absolute tolerance 0.25, inclusive.
-}

close :: Double -> Double -> Bool
close = undefined -- Your answer here

main :: IO ()
main = do
  print (close 0 0)  -- expected: True
  print (close 1 1.25)  -- expected: True
  print (close 1 1.5)  -- expected: False
  print (close (0/0) 0)  -- expected: False
  print (close (1/0) (1/0))  -- expected: False

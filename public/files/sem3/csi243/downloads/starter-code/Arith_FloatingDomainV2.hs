-- Title: Test combined relative and absolute tolerance
{-
QUESTION
Write close :: Double -> Double -> Bool. Reject non-finite inputs.
Accept when abs(x-y) <= max 0.25 (0.01 * max(abs x)(abs y)).
-}

close :: Double -> Double -> Bool
close = undefined -- Your answer here

main :: IO ()
main = do
  print (close 0 0.25)  -- expected: True
  print (close 0 0.5)  -- expected: False
  print (close 1000 1005)  -- expected: True
  print (close 1000 1020)  -- expected: False
  print (close (0/0) 1)  -- expected: False

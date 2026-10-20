-- Title: Test absolute tolerance
{-
QUESTION
Write close :: Double -> Double -> Bool. Reject NaN and infinite
inputs; otherwise use absolute tolerance 0.25, inclusive.
-}

-- Read the question: Write close using the stated floating-point domain policy.
-- Plan: Reject or classify non-finite results before the ordinary test.
close :: Double -> Double -> Bool
-- Key step: NaN cannot be recognised by equality to itself.
close x y = not (isNaN x || isNaN y || isInfinite x || isInfinite y)
            && abs (x-y) <= 0.25

main :: IO ()
main = do
  print (close 0 0)  -- expected: True
  print (close 1 1.25)  -- expected: True
  print (close 1 1.5)  -- expected: False
  print (close (0/0) 0)  -- expected: False
  print (close (1/0) (1/0))  -- expected: False

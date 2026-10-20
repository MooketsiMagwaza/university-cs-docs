-- Title: Check elementary functions at exact reference points
{-
QUESTION
Write reference :: Double -> Bool. For finite x, test sin x against
zero and cos x against one with absolute tolerance 0.000001.
Angles are in radians; reject non-finite x.
-}

-- Read the question: Write reference using the stated floating-point domain policy.
-- Plan: Reject or classify non-finite results before the ordinary test.
reference :: Double -> Bool
-- Key step: NaN cannot be recognised by equality to itself.
reference x = not (isNaN x || isInfinite x)
              && abs (sin x) <= 0.000001
              && abs (cos x - 1) <= 0.000001

main :: IO ()
main = do
  print (reference 0)  -- expected: True
  print (reference (2*pi))  -- expected: True
  print (reference pi)  -- expected: False
  print (reference (pi/2))  -- expected: False
  print (reference (1/0))  -- expected: False

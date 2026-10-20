-- Title: Check elementary functions at exact reference points
{-
QUESTION
Write reference :: Double -> Bool. For finite x, test sin x against
zero and cos x against one with absolute tolerance 0.000001.
Angles are in radians; reject non-finite x.
-}

reference :: Double -> Bool
reference = undefined -- Your answer here

main :: IO ()
main = do
  print (reference 0)  -- expected: True
  print (reference (2*pi))  -- expected: True
  print (reference pi)  -- expected: False
  print (reference (pi/2))  -- expected: False
  print (reference (1/0))  -- expected: False

-- Title: State negative-range and exact pass-boundary policies
{-
QUESTION
Write rangeSum :: Integer -> Integer -> Integer. Both signed bounds
are valid; sum the inclusive range lo..hi. If lo>hi return the empty sum
0; do not swap the bounds or reject negative bounds.
Also write pass20 :: Int -> Maybe Bool: valid scores are 0..20 inclusive,
passing means score>=10, and invalid scores return Nothing.
These are explicit choices resolving ambiguous range and grade wording.
Partition tests around zero, reversed bounds and the 9/10 cut-off.
-}

rangeSum :: Integer -> Integer -> Integer
rangeSum = undefined -- Your answer here

pass20 :: Int -> Maybe Bool
pass20 = undefined -- Your answer here

main :: IO ()
main = do
  print (rangeSum (-2) 2)  -- expected: 0
  print (rangeSum 3 1)  -- expected: 0
  print (rangeSum (-3) (-1))  -- expected: -6
  print (rangeSum 0 0)  -- expected: 0
  print (pass20 9)  -- expected: Just False
  print (pass20 10)  -- expected: Just True
  print (pass20 20)  -- expected: Just True
  print (pass20 21)  -- expected: Nothing
  print (pass20 (-1))  -- expected: Nothing

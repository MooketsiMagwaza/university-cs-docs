-- Title: Take a bounded enumeration prefix with an explicit count policy
{-
QUESTION
Write firstValues :: (Bounded a, Enum a) => Int -> [a].
Return at most n values from [minBound .. maxBound]; non-positive n gives [].
Test both Bool and Ordering with counts zero, one and beyond the end.
Explain why both constraints are required. (5 marks)
-}

firstValues :: (Bounded a, Enum a) => Int -> [a]
firstValues = undefined -- Your answer here

main :: IO ()
main = do
  print (firstValues 0 :: [Bool])  -- expected: []
  print (firstValues (-2) :: [Ordering])  -- expected: []
  print (firstValues 1 :: [Bool])  -- expected: [False]
  print (firstValues 9 :: [Bool])  -- expected: [False,True]
  print (firstValues 2 :: [Ordering])  -- expected: [LT,EQ]
  print (firstValues 9 :: [Ordering])  -- expected: [LT,EQ,GT]

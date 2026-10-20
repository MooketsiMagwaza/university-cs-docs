-- Title: Take a bounded enumeration prefix with an explicit count policy
{-
QUESTION
Write firstValues :: (Bounded a, Enum a) => Int -> [a].
Return at most n values from [minBound .. maxBound]; non-positive n gives [].
Test both Bool and Ordering with counts zero, one and beyond the end.
Explain why both constraints are required. (5 marks)
-}

-- Read the question: Write a count-controlled generic enumeration returning a list.
-- Plan: Use take, whose non-positive count policy already matches the specification.
firstValues :: (Bounded a, Enum a) => Int -> [a]
-- take stops at the endpoint even when the requested count is larger.
firstValues n = take n [minBound .. maxBound]

main :: IO ()
main = do
  print (firstValues 0 :: [Bool])  -- expected: []
  print (firstValues (-2) :: [Ordering])  -- expected: []
  print (firstValues 1 :: [Bool])  -- expected: [False]
  print (firstValues 9 :: [Bool])  -- expected: [False,True]
  print (firstValues 2 :: [Ordering])  -- expected: [LT,EQ]
  print (firstValues 9 :: [Ordering])  -- expected: [LT,EQ,GT]

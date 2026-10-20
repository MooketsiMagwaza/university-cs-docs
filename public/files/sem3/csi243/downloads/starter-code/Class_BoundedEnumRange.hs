-- Title: Enumerate a bounded type using both necessary constraints
{-
QUESTION
Write universe :: (Bounded a, Enum a) => [a] as [minBound .. maxBound].
Also write boundedSlice :: (Bounded a, Enum a) => Int -> Int -> [a],
dropping the first skip values and then taking at most count values.
Use drop and take, retaining their non-positive count policies. Use result
annotations to test Bool and Ordering, including an empty slice. (6 marks)
Bounded alone supplies endpoints, not enumeration; Enum alone supplies
no endpoints. Assume the conventional finite enumeration of these types.
-}

universe :: (Bounded a, Enum a) => [a]
universe = undefined -- Your answer here

boundedSlice :: (Bounded a, Enum a) => Int -> Int -> [a]
boundedSlice = undefined -- Your answer here

main :: IO ()
main = do
  print (universe :: [Bool])  -- expected: [False,True]
  print (universe :: [Ordering])  -- expected: [LT,EQ,GT]
  print (boundedSlice 0 0 :: [Bool])  -- expected: []
  print (boundedSlice 0 1 :: [Ordering])  -- expected: [LT]
  print (boundedSlice 2 1 :: [Ordering])  -- expected: [GT]

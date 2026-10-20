-- Title: Test whether all list elements are equal
{-
QUESTION
Write allSame :: Eq a => [a] -> Bool recursively. [5]
Return True for empty and singleton lists. Compare adjacent elements.
-}

-- Read the question: Write allSame :: Eq a => [a] -> Bool.
-- Plan: Use two base cases and compare adjacent values.
allSame :: Eq a => [a] -> Bool
allSame [] = True
allSame [_] = True
allSame (x:y:ys) = x == y && allSame (y:ys)  -- Equality requires Eq.

main :: IO ()
main = do
  print (allSame ([] :: [Int]))  -- expected: True
  print (allSame [7])  -- expected: True
  print (allSame [2,2,2])  -- expected: True
  print (allSame [2,2,3])  -- expected: False
  print (allSame "aaa")  -- expected: True

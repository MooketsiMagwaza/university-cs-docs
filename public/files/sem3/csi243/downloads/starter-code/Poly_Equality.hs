-- Title: Test whether all list elements are equal
{-
QUESTION
Write allSame :: Eq a => [a] -> Bool recursively. [5]
Return True for empty and singleton lists. Compare adjacent elements.
-}

allSame :: Eq a => [a] -> Bool
allSame = undefined  -- Your answer here

main :: IO ()
main = do
  print (allSame ([] :: [Int]))  -- expected: True
  print (allSame [7])  -- expected: True
  print (allSame [2,2,2])  -- expected: True
  print (allSame [2,2,3])  -- expected: False
  print (allSame "aaa")  -- expected: True

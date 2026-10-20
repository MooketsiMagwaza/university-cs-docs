-- Title: Find a safe polymorphic minimum
{-
QUESTION
Write smallest :: Ord a => [a] -> Maybe a recursively. [5]
Return Nothing for []; otherwise return Just the least element.
-}

smallest :: Ord a => [a] -> Maybe a
smallest = undefined  -- Your answer here

main :: IO ()
main = do
  print (smallest ([] :: [Int]))  -- expected: Nothing
  print (smallest [7])  -- expected: Just 7
  print (smallest [3,1,2])  -- expected: Just 1
  print (smallest "cat")  -- expected: Just 'a'
  print (smallest ["cat","ant"])  -- expected: Just "ant"

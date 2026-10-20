-- Title: Find a safe polymorphic minimum
{-
QUESTION
Write smallest :: Ord a => [a] -> Maybe a recursively. [5]
Return Nothing for []; otherwise return Just the least element.
-}

-- Read the question: Write smallest :: Ord a => [a] -> Maybe a.
-- Plan: Compare the head with the minimum of the tail.
smallest :: Ord a => [a] -> Maybe a
smallest [] = Nothing
smallest (x:xs) = case smallest xs of
  Nothing -> Just x
  Just y -> Just (min x y)  -- Ord supplies min.

main :: IO ()
main = do
  print (smallest ([] :: [Int]))  -- expected: Nothing
  print (smallest [7])  -- expected: Just 7
  print (smallest [3,1,2])  -- expected: Just 1
  print (smallest "cat")  -- expected: Just 'a'
  print (smallest ["cat","ant"])  -- expected: Just "ant"

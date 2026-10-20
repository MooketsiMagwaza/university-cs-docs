-- Title: Find a safe maximum
{-
QUESTION
Write best :: [Integer] -> Maybe Integer recursively. [5]
Return Nothing for [], otherwise Just the maximum. Do not use maximum or minimum.
-}

-- Read the question: Write best :: [Integer] -> Maybe Integer.
-- Plan: Use Maybe for the empty case and compare against the tail candidate.
best :: [Integer] -> Maybe Integer
best [] = Nothing  -- No candidate exists.
best (x:xs) = case best xs of
  Nothing -> Just x
  Just y -> Just (if x > y then x else y)

main :: IO ()
main = do
  print (best [])  -- expected: Nothing
  print (best [7])  -- expected: Just 7
  print (best [1,9,3])  -- expected: Just 9
  print (best [-4,-2,-7])  -- expected: Just (-2)
  print (best [5,5])  -- expected: Just 5

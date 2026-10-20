-- Title: Find a safe lexicographically greatest string
{-
QUESTION
Write best :: [String] -> Maybe String recursively. [5]
Return Nothing for [], otherwise Just the lexicographically greatest string. Do not use maximum or minimum.
-}

-- Read the question: Write best :: [String] -> Maybe String.
-- Plan: Use Maybe for the empty case and compare against the tail candidate.
best :: [String] -> Maybe String
best [] = Nothing  -- No candidate exists.
best (x:xs) = case best xs of
  Nothing -> Just x
  Just y -> Just (if x > y then x else y)

main :: IO ()
main = do
  print (best [])  -- expected: Nothing
  print (best ["cat"])  -- expected: Just "cat"
  print (best ["ant","zoo","bee"])  -- expected: Just "zoo"
  print (best ["","a"])  -- expected: Just "a"
  print (best ["same","same"])  -- expected: Just "same"

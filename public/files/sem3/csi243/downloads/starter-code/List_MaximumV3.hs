-- Title: Find a safe lexicographically greatest string
{-
QUESTION
Write best :: [String] -> Maybe String recursively. [5]
Return Nothing for [], otherwise Just the lexicographically greatest string. Do not use maximum or minimum.
-}

best :: [String] -> Maybe String
best = undefined  -- Your answer here

main :: IO ()
main = do
  print (best [])  -- expected: Nothing
  print (best ["cat"])  -- expected: Just "cat"
  print (best ["ant","zoo","bee"])  -- expected: Just "zoo"
  print (best ["","a"])  -- expected: Just "a"
  print (best ["same","same"])  -- expected: Just "same"

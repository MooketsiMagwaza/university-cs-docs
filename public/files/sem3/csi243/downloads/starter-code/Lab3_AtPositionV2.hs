-- Title: Return an index and its string element
{-
QUESTION
Define atPosition for a list of strings and index y, returning (y,string).
Use zero-based indexing. atPosition ["a","bb","c"] 1 returns (1,"bb").
Display an informative error for negative indices and indices at or beyond
the list length. Give the signature, recursive definition and a dry run.
-}

atPosition :: [String] -> Int -> (Int, String)
atPosition = undefined -- Your answer here

main :: IO ()
main = do
  print (atPosition ["a","bb","c"] 1)  -- expected: (1,"bb")
  print (atPosition [""] 0)  -- expected: (0,"")
  print (atPosition ["x","x","y"] 1)  -- expected: (1,"x")
  print (atPosition ["red","blue"] 0)  -- expected: (0,"red")
  print (atPosition ["a","b","c"] 2)  -- expected: (2,"c")

-- Title: Return an index and its string element
{-
QUESTION
Define atPosition for a list of strings and index y, returning (y,string).
Use zero-based indexing. atPosition ["a","bb","c"] 1 returns (1,"bb").
Display an informative error for negative indices and indices at or beyond
the list length. Give the signature, recursive definition and a dry run.
-}

-- Read the question: Write atPosition :: [String] -> Int -> (Int, String).
-- Plan: Validate the index; preserve it in the pair while a helper counts down.
-- Dry run: atPosition ["a","bb","c"] 1 = (1,select ["bb","c"] 0) = (1,"bb").
-- Key step: y == length xs is invalid too; duplicate values do not affect lookup.
atPosition :: [String] -> Int -> (Int, String)
atPosition xs y
  | y < 0 = error "atPosition: negative index"
  | y >= length xs = error "atPosition: index out of range"
  | otherwise = (y, select xs y)
  where
    select :: [a] -> Int -> a
    select [] _ = error "atPosition: index out of range"
    select (z:_) 0 = z -- Base: requested element reached.
    select (_:zs) n = select zs (n - 1)

main :: IO ()
main = do
  print (atPosition ["a","bb","c"] 1)  -- expected: (1,"bb")
  print (atPosition [""] 0)  -- expected: (0,"")
  print (atPosition ["x","x","y"] 1)  -- expected: (1,"x")
  print (atPosition ["red","blue"] 0)  -- expected: (0,"red")
  print (atPosition ["a","b","c"] 2)  -- expected: (2,"c")

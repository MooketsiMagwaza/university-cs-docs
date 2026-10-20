-- Title: Test membership in a list of Char values
{-
QUESTION
Specify, dry run and recursively implement isIn.
Return True when the target occurs in the list; otherwise return False.
Use target first, list second.
For example, isIn 'b' "abc" = True; an empty list returns False.
-}

-- Read the question: Write isIn :: Char -> [Char] -> Bool.
-- Plan: Check for an empty list before using head; discard one nonmatching head.
-- Dry run: isIn 'b' "abc" = isIn 'b' "bc" = True.
isIn :: Char -> [Char] -> Bool
isIn target xs
  | null xs = False -- Base: target was not found.
  | head xs == target = True -- Stop at the first match.
  | otherwise = isIn target (tail xs)

main :: IO ()
main = do
  print (isIn 'b' "abc")  -- expected: True
  print (isIn 'z' "abc")  -- expected: False
  print (isIn 'a' "")  -- expected: False
  print (isIn 'a' "a")  -- expected: True
  print (isIn 'a' "aa")  -- expected: True

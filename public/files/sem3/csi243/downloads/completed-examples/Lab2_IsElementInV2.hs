-- Title: Test membership in a list of Char values
{-
QUESTION
Specify, dry run and recursively implement isElementIn.
Return True when the target occurs in the list; otherwise return False.
Use list first, target second.
For example, isElementIn "abc" 'b' = True; an empty list returns False.
-}

-- Read the question: Write isElementIn :: [Char] -> Char -> Bool.
-- Plan: Check for an empty list before using head; discard one nonmatching head.
-- Dry run: isElementIn "abc" 'b' = isElementIn "bc" 'b' = True.
isElementIn :: [Char] -> Char -> Bool
isElementIn xs target
  | null xs = False -- Base: target was not found.
  | head xs == target = True -- Stop at the first match.
  | otherwise = isElementIn (tail xs) target

main :: IO ()
main = do
  print (isElementIn "abc" 'b')  -- expected: True
  print (isElementIn "abc" 'z')  -- expected: False
  print (isElementIn "" 'a')  -- expected: False
  print (isElementIn "a" 'a')  -- expected: True
  print (isElementIn "aa" 'a')  -- expected: True

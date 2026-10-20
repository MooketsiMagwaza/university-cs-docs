-- Title: Test membership in a list of String values
{-
QUESTION
Specify, dry run and recursively implement isElementIn.
Return True when the target occurs in the list; otherwise return False.
Use list first, target second.
For example, isElementIn ["red","blue"] "red" = True; an empty list returns False.
-}

-- Read the question: Write isElementIn :: [String] -> String -> Bool.
-- Plan: Check for an empty list before using head; discard one nonmatching head.
-- Dry run: isElementIn ["blue","red"] "red" = isElementIn ["red"] "red" = True.
isElementIn :: [String] -> String -> Bool
isElementIn xs target
  | null xs = False -- Base: target was not found.
  | head xs == target = True -- Stop at the first match.
  | otherwise = isElementIn (tail xs) target

main :: IO ()
main = do
  print (isElementIn ["red","blue"] "red")  -- expected: True
  print (isElementIn ["red","blue"] "green")  -- expected: False
  print (isElementIn [] "red")  -- expected: False
  print (isElementIn [""] "")  -- expected: True
  print (isElementIn ["red","red"] "red")  -- expected: True

-- Title: Test membership in a list of Int values
{-
QUESTION
Specify, dry run and recursively implement isElementIn.
Return True when the target occurs in the list; otherwise return False.
Use list first, target second.
For example, isElementIn [7,10,6,0] 6 = True; an empty list returns False.
-}

-- Read the question: Write isElementIn :: [Int] -> Int -> Bool.
-- Plan: Check for an empty list before using head; discard one nonmatching head.
-- Dry run: isElementIn [7,10,6,0] 6 = isElementIn [10,6,0] 6 = True.
isElementIn :: [Int] -> Int -> Bool
isElementIn xs target
  | null xs = False -- Base: target was not found.
  | head xs == target = True -- Stop at the first match.
  | otherwise = isElementIn (tail xs) target

main :: IO ()
main = do
  print (isElementIn [7,10,6,0] 6)  -- expected: True
  print (isElementIn [7,10,6,0] 5)  -- expected: False
  print (isElementIn [] 6)  -- expected: False
  print (isElementIn [6] 6)  -- expected: True
  print (isElementIn [6,6] 6)  -- expected: True

-- Title: Test membership in a list of Int values
{-
QUESTION
Specify, dry run and recursively implement isIn.
Return True when the target occurs in the list; otherwise return False.
Use target first, list second.
For example, isIn 6 [7,10,6,0] = True; an empty list returns False.
-}

-- Read the question: Write isIn :: Int -> [Int] -> Bool.
-- Plan: Check for an empty list before using head; discard one nonmatching head.
-- Dry run: isIn 6 [7,10,6,0] = isIn 6 [10,6,0] = isIn 6 [6,0] = True.
isIn :: Int -> [Int] -> Bool
isIn target xs
  | null xs = False -- Base: target was not found.
  | head xs == target = True -- Stop at the first match.
  | otherwise = isIn target (tail xs)

main :: IO ()
main = do
  print (isIn 6 [7,10,6,0])  -- expected: True
  print (isIn 5 [7,10,6,0])  -- expected: False
  print (isIn 6 [])  -- expected: False
  print (isIn 6 [6])  -- expected: True
  print (isIn 6 [6,6])  -- expected: True

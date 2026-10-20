-- Title: Test membership in a list of String values
{-
QUESTION
Specify, dry run and recursively implement isIn.
Return True when the target occurs in the list; otherwise return False.
Use target first, list second.
For example, isIn "red" ["red","blue"] = True; an empty list returns False.
-}

-- Read the question: Write isIn :: String -> [String] -> Bool.
-- Plan: Check for an empty list before using head; discard one nonmatching head.
-- Dry run: isIn "red" ["blue","red"] = isIn "red" ["red"] = True.
isIn :: String -> [String] -> Bool
isIn target xs
  | null xs = False -- Base: target was not found.
  | head xs == target = True -- Stop at the first match.
  | otherwise = isIn target (tail xs)

main :: IO ()
main = do
  print (isIn "red" ["red","blue"])  -- expected: True
  print (isIn "green" ["red","blue"])  -- expected: False
  print (isIn "red" [])  -- expected: False
  print (isIn "" [""])  -- expected: True
  print (isIn "red" ["red","red"])  -- expected: True

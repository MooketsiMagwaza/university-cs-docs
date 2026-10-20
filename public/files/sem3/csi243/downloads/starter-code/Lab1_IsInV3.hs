-- Title: Test membership in a list of String values
{-
QUESTION
Specify, dry run and recursively implement isIn.
Return True when the target occurs in the list; otherwise return False.
Use target first, list second.
For example, isIn "red" ["red","blue"] = True; an empty list returns False.
-}

isIn :: String -> [String] -> Bool
isIn = undefined -- Your answer here

main :: IO ()
main = do
  print (isIn "red" ["red","blue"])  -- expected: True
  print (isIn "green" ["red","blue"])  -- expected: False
  print (isIn "red" [])  -- expected: False
  print (isIn "" [""])  -- expected: True
  print (isIn "red" ["red","red"])  -- expected: True

-- Title: Test membership in a list of Int values
{-
QUESTION
Specify, dry run and recursively implement isIn.
Return True when the target occurs in the list; otherwise return False.
Use target first, list second.
For example, isIn 6 [7,10,6,0] = True; an empty list returns False.
-}

isIn :: Int -> [Int] -> Bool
isIn = undefined -- Your answer here

main :: IO ()
main = do
  print (isIn 6 [7,10,6,0])  -- expected: True
  print (isIn 5 [7,10,6,0])  -- expected: False
  print (isIn 6 [])  -- expected: False
  print (isIn 6 [6])  -- expected: True
  print (isIn 6 [6,6])  -- expected: True

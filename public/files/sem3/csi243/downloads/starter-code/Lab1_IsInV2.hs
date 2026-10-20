-- Title: Test membership in a list of Char values
{-
QUESTION
Specify, dry run and recursively implement isIn.
Return True when the target occurs in the list; otherwise return False.
Use target first, list second.
For example, isIn 'b' "abc" = True; an empty list returns False.
-}

isIn :: Char -> [Char] -> Bool
isIn = undefined -- Your answer here

main :: IO ()
main = do
  print (isIn 'b' "abc")  -- expected: True
  print (isIn 'z' "abc")  -- expected: False
  print (isIn 'a' "")  -- expected: False
  print (isIn 'a' "a")  -- expected: True
  print (isIn 'a' "aa")  -- expected: True

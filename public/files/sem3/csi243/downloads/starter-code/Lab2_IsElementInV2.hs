-- Title: Test membership in a list of Char values
{-
QUESTION
Specify, dry run and recursively implement isElementIn.
Return True when the target occurs in the list; otherwise return False.
Use list first, target second.
For example, isElementIn "abc" 'b' = True; an empty list returns False.
-}

isElementIn :: [Char] -> Char -> Bool
isElementIn = undefined -- Your answer here

main :: IO ()
main = do
  print (isElementIn "abc" 'b')  -- expected: True
  print (isElementIn "abc" 'z')  -- expected: False
  print (isElementIn "" 'a')  -- expected: False
  print (isElementIn "a" 'a')  -- expected: True
  print (isElementIn "aa" 'a')  -- expected: True

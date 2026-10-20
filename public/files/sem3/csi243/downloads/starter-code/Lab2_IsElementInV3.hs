-- Title: Test membership in a list of String values
{-
QUESTION
Specify, dry run and recursively implement isElementIn.
Return True when the target occurs in the list; otherwise return False.
Use list first, target second.
For example, isElementIn ["red","blue"] "red" = True; an empty list returns False.
-}

isElementIn :: [String] -> String -> Bool
isElementIn = undefined -- Your answer here

main :: IO ()
main = do
  print (isElementIn ["red","blue"] "red")  -- expected: True
  print (isElementIn ["red","blue"] "green")  -- expected: False
  print (isElementIn [] "red")  -- expected: False
  print (isElementIn [""] "")  -- expected: True
  print (isElementIn ["red","red"] "red")  -- expected: True

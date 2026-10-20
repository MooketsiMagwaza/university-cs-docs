-- Title: Swap a pair of strings.
{-
QUESTION
Write swapStrings to swap the two strings in a pair.
-}

swapStrings :: (String, String) -> (String, String)
swapStrings = undefined -- Your answer here

main :: IO ()
main = do
  print (swapStrings ("red","blue"))  -- expected: ("blue","red")
  print (swapStrings ("",""))  -- expected: ("","")
  print (swapStrings ("a",""))  -- expected: ("","a")
  print (swapStrings ("x","x"))  -- expected: ("x","x")
  print (swapStrings ("one","two"))  -- expected: ("two","one")

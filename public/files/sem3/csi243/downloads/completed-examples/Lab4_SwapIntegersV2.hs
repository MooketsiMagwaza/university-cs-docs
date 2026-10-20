-- Title: Swap a pair of strings.
{-
QUESTION
Write swapStrings to swap the two strings in a pair.
-}

-- Read the question: Write a tuple transformation with the stated component types.
-- Plan: Construct a tuple in the requested order.
swapStrings :: (String, String) -> (String, String)
-- Name each component in the input pattern.
swapStrings (x,y) = (y,x)

main :: IO ()
main = do
  print (swapStrings ("red","blue"))  -- expected: ("blue","red")
  print (swapStrings ("",""))  -- expected: ("","")
  print (swapStrings ("a",""))  -- expected: ("","a")
  print (swapStrings ("x","x"))  -- expected: ("x","x")
  print (swapStrings ("one","two"))  -- expected: ("two","one")

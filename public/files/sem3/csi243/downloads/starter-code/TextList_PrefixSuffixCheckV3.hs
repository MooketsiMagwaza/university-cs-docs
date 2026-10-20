-- Title: Test whether a pattern occurs anywhere in text
{-
QUESTION
Write containsText :: String -> String -> Bool using isInfixOf.
The first argument is the pattern; an empty pattern matches even empty text.
-}

containsText :: String -> String -> Bool
containsText = undefined -- Your answer here

main :: IO ()
main = do
  print (containsText "" "")  -- expected: True
  print (containsText "x" "")  -- expected: False
  print (containsText "bc" "abcd")  -- expected: True
  print (containsText "ac" "abcd")  -- expected: False
  print (containsText "aba" "ababa")  -- expected: True

-- Title: Remove a prefix safely without searching inside the text
{-
QUESTION
Write removePrefix :: String -> String -> Maybe String using stripPrefix.
Return the remaining text only when the first argument is a prefix.
-}

removePrefix :: String -> String -> Maybe String
removePrefix = undefined -- Your answer here

main :: IO ()
main = do
  print (removePrefix "" "")  -- expected: Just ""
  print (removePrefix "" "abc")  -- expected: Just "abc"
  print (removePrefix "ab" "abc")  -- expected: Just "c"
  print (removePrefix "bc" "abc")  -- expected: Nothing
  print (removePrefix "abc" "abc")  -- expected: Just ""

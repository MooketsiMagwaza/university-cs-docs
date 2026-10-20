-- Title: Test whether text ends with a requested suffix
{-
QUESTION
Write hasSuffix :: String -> String -> Bool using isSuffixOf.
The first argument is the candidate suffix. An empty suffix always matches.
-}

hasSuffix :: String -> String -> Bool
hasSuffix = undefined -- Your answer here

main :: IO ()
main = do
  print (hasSuffix "" "")  -- expected: True
  print (hasSuffix "" "abc")  -- expected: True
  print (hasSuffix "bc" "abc")  -- expected: True
  print (hasSuffix "ab" "abc")  -- expected: False
  print (hasSuffix "abcd" "abc")  -- expected: False

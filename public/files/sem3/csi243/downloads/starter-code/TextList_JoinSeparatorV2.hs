-- Title: Join string fields with a string separator
{-
QUESTION
Write joinFields :: String -> [String] -> String -> String using intercalate.
Keep empty fields and insert the whole separator between adjacent fields.
-}

joinFields :: String -> [String] -> String
joinFields = undefined -- Your answer here

main :: IO ()
main = do
  print (joinFields "," [])  -- expected: ""
  print (joinFields "," ["a"])  -- expected: "a"
  print (joinFields "::" ["a","b","c"])  -- expected: "a::b::c"
  print (joinFields "," ["","a",""])  -- expected: ",a,"
  print (joinFields "" ["ab","cd"])  -- expected: "abcd"

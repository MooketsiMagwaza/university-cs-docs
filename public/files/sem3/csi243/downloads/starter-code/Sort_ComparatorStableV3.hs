-- Title: Repair sorting after uppercasing a list of strings
{-
QUESTION
Write uppercaseSorted :: [String] -> [String]. Convert every character
of every string to uppercase with map (map toUpper), then use sort
for ascending lexicographic order. Do not confuse String with [String].
-}

uppercaseSorted :: [String] -> [String]
uppercaseSorted = undefined -- Your answer here

main :: IO ()
main = do
  print (uppercaseSorted [])  -- expected: []
  print (uppercaseSorted [""])  -- expected: [""]
  print (uppercaseSorted ["b","A","aa"])  -- expected: ["A","AA","B"]
  print (uppercaseSorted ["cat","CAT","Bat"])  -- expected: ["BAT","CAT","CAT"]
  print (uppercaseSorted ["z","","a"])  -- expected: ["","A","Z"]

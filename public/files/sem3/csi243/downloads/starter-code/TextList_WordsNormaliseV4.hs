-- Title: Compare literal space removal with whitespace normalisation
{-
QUESTION
Write spaceComparison :: String -> (String,String). The first result
removes only literal spaces; the second uses unwords . words. Tabs and
newlines survive in the first result. Return both strings for comparison.
-}

spaceComparison :: String -> (String,String)
spaceComparison = undefined -- Your answer here

main :: IO ()
main = do
  print (spaceComparison "")  -- expected: ("","")
  print (spaceComparison "a b")  -- expected: ("ab","a b")
  print (spaceComparison "a\tb")  -- expected: ("a\tb","a b")
  print (spaceComparison "  x  ")  -- expected: ("x","x")
  print (spaceComparison "\n")  -- expected: ("\n","")

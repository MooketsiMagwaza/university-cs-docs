-- Title: Compare literal space removal with whitespace normalisation
{-
QUESTION
Write spaceComparison :: String -> (String,String). The first result
removes only literal spaces; the second uses unwords . words. Tabs and
newlines survive in the first result. Return both strings for comparison.
-}

-- Read the question: Write spaceComparison :: String -> (String,String); use the stated input and result types.
-- Plan: Apply the named library operation; retain its documented order and empty case.
spaceComparison :: String -> (String,String)
-- Key step: the library operation also handles empty input.
spaceComparison s = (filter (/= ' ') s, unwords (words s))

main :: IO ()
main = do
  print (spaceComparison "")  -- expected: ("","")
  print (spaceComparison "a b")  -- expected: ("ab","a b")
  print (spaceComparison "a\tb")  -- expected: ("a\tb","a b")
  print (spaceComparison "  x  ")  -- expected: ("x","x")
  print (spaceComparison "\n")  -- expected: ("\n","")

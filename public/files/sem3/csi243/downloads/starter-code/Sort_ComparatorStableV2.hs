-- Title: Sort strings by descending length with stable ties
{-
QUESTION
Write compareLength :: String -> String -> Ordering and
longestFirst :: [String] -> [String]. Compare lengths in descending
order by reversing the arguments of compare. Use sortBy and retain
input order among equal-length strings.
-}

compareLength :: String -> String -> Ordering
compareLength = undefined -- Your answer here

longestFirst :: [String] -> [String]
longestFirst = undefined -- Your answer here

main :: IO ()
main = do
  print (longestFirst [])  -- expected: []
  print (longestFirst [""])  -- expected: [""]
  print (longestFirst ["bb","aa","x","ccc"])  -- expected: ["ccc","bb","aa","x"]
  print (compareLength "aa" "bb")  -- expected: EQ
  print (compareLength "abc" "x")  -- expected: LT
  print (longestFirst ["","a",""])  -- expected: ["a","",""]

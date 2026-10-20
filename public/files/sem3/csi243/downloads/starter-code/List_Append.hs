-- Title: Append two lists recursively
{-
QUESTION
Write appendR :: [a] -> [a] -> [a] without (++). [4]
Preserve both lists in order; recurse on the first list.
-}

appendR :: [a] -> [a] -> [a]
appendR = undefined  -- Your answer here

main :: IO ()
main = do
  print (appendR ([] :: [Int]) [])  -- expected: []
  print (appendR [] [2])  -- expected: [2]
  print (appendR [1] [])  -- expected: [1]
  print (appendR [1,2] [3,4])  -- expected: [1,2,3,4]
  print (appendR "ab" "cd")  -- expected: "abcd"

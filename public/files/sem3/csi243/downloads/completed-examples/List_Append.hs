-- Title: Append two lists recursively
{-
QUESTION
Write appendR :: [a] -> [a] -> [a] without (++). [4]
Preserve both lists in order; recurse on the first list.
-}

-- Read the question: Write appendR :: [a] -> [a] -> [a].
-- Plan: Copy the first list and finish with the second.
appendR :: [a] -> [a] -> [a]
appendR [] ys = ys  -- Nothing remains on the left.
appendR (x:xs) ys = x : appendR xs ys

main :: IO ()
main = do
  print (appendR ([] :: [Int]) [])  -- expected: []
  print (appendR [] [2])  -- expected: [2]
  print (appendR [1] [])  -- expected: [1]
  print (appendR [1,2] [3,4])  -- expected: [1,2,3,4]
  print (appendR "ab" "cd")  -- expected: "abcd"

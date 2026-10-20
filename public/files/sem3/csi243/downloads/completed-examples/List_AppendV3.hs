-- Title: Interleave two lists recursively
{-
QUESTION
Write interleave :: [a] -> [a] -> [a] recursively. [5]
Alternate elements starting with the first list; retain any unmatched suffix.
-}

-- Read the question: Write interleave :: [a] -> [a] -> [a].
-- Plan: Consume one head from each list until either runs out.
interleave :: [a] -> [a] -> [a]
interleave [] ys = ys
interleave xs [] = xs  -- Retain the longer suffix.
interleave (x:xs) (y:ys) = x : y : interleave xs ys

main :: IO ()
main = do
  print (interleave ([] :: [Int]) [])  -- expected: []
  print (interleave [1] [])  -- expected: [1]
  print (interleave [] [2,3])  -- expected: [2,3]
  print (interleave [1,3,5] [2,4])  -- expected: [1,2,3,4,5]
  print (interleave "ab" "XYZ")  -- expected: "aXbYZ"

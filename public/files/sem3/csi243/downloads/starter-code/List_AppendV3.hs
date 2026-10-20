-- Title: Interleave two lists recursively
{-
QUESTION
Write interleave :: [a] -> [a] -> [a] recursively. [5]
Alternate elements starting with the first list; retain any unmatched suffix.
-}

interleave :: [a] -> [a] -> [a]
interleave = undefined  -- Your answer here

main :: IO ()
main = do
  print (interleave ([] :: [Int]) [])  -- expected: []
  print (interleave [1] [])  -- expected: [1]
  print (interleave [] [2,3])  -- expected: [2,3]
  print (interleave [1,3,5] [2,4])  -- expected: [1,2,3,4,5]
  print (interleave "ab" "XYZ")  -- expected: "aXbYZ"

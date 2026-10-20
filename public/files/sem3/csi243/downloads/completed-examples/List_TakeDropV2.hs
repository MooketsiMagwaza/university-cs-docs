-- Title: Implement dropR recursively
{-
QUESTION
Write dropR :: Int -> [a] -> [a] using recursion, without take, drop or splitAt. [5]
Remove up to n initial elements; non-positive n returns the input.
-}

-- Read the question: Write dropR :: Int -> [a] -> [a].
-- Plan: Inspect the count and list shape before consuming another cell.
dropR :: Int -> [a] -> [a]
-- Stop when the count is exhausted or the list ends.
dropR n xs | n <= 0 = xs
dropR _ [] = []
dropR n (_:xs) = dropR (n - 1) xs

main :: IO ()
main = do
  print (dropR 0 [1,2])  -- expected: [1,2]
  print (dropR 3 ([] :: [Int]))  -- expected: []
  print (dropR 1 [7])  -- expected: []
  print (dropR 2 [1,2,3])  -- expected: [3]
  print (dropR 5 "ab")  -- expected: ""

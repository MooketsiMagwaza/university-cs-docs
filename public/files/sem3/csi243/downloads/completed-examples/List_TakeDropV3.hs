-- Title: Implement splitR recursively
{-
QUESTION
Write splitR :: Int -> [a] -> ([a],[a]) using recursion, without take, drop or splitAt. [5]
Return (the first n elements, the remaining suffix); non-positive n splits at 0.
-}

-- Read the question: Write splitR :: Int -> [a] -> ([a],[a]).
-- Plan: Inspect the count and list shape before consuming another cell.
splitR :: Int -> [a] -> ([a],[a])
-- Stop when the count is exhausted or the list ends.
splitR n xs | n <= 0 = ([],xs)
splitR _ [] = ([],[])
splitR n (x:xs) = let (front,back) = splitR (n - 1) xs
                  in (x:front,back)

main :: IO ()
main = do
  print (splitR 0 [1,2])  -- expected: ([],[1,2])
  print (splitR 3 ([] :: [Int]))  -- expected: ([],[])
  print (splitR 1 [7])  -- expected: ([7],[])
  print (splitR 2 [1,2,3])  -- expected: ([1,2],[3])
  print (splitR 5 "ab")  -- expected: ("ab","")

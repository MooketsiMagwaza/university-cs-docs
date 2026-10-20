-- Title: Implement splitR recursively
{-
QUESTION
Write splitR :: Int -> [a] -> ([a],[a]) using recursion, without take, drop or splitAt. [5]
Return (the first n elements, the remaining suffix); non-positive n splits at 0.
-}

splitR :: Int -> [a] -> ([a],[a])
splitR = undefined  -- Your answer here

main :: IO ()
main = do
  print (splitR 0 [1,2])  -- expected: ([],[1,2])
  print (splitR 3 ([] :: [Int]))  -- expected: ([],[])
  print (splitR 1 [7])  -- expected: ([7],[])
  print (splitR 2 [1,2,3])  -- expected: ([1,2],[3])
  print (splitR 5 "ab")  -- expected: ("ab","")

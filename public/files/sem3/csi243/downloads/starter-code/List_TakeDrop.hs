-- Title: Implement takeR recursively
{-
QUESTION
Write takeR :: Int -> [a] -> [a] using recursion, without take, drop or splitAt. [5]
Return up to n initial elements; non-positive n returns [].
-}

takeR :: Int -> [a] -> [a]
takeR = undefined  -- Your answer here

main :: IO ()
main = do
  print (takeR 0 [1,2])  -- expected: []
  print (takeR 3 ([] :: [Int]))  -- expected: []
  print (takeR 1 [7])  -- expected: [7]
  print (takeR 2 [1,2,3])  -- expected: [1,2]
  print (takeR 5 "ab")  -- expected: "ab"

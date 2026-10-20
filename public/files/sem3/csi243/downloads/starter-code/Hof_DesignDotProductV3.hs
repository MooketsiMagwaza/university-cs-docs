-- Title: Combine paired values and fold their total
{-
QUESTION
Write dot :: [Int] -> [Int] -> Int using zipWith and foldr.
Combine each pair with (\x y -> (x-y)^2), then add the results. Ignore unmatched
suffixes; the empty total is zero. (5 marks)
-}

dot :: [Int] -> [Int] -> Int
dot = undefined -- Your answer here

main :: IO ()
main = do
  print (dot [] [2])  -- expected: 0
  print (dot [2] [3])  -- expected: 1
  print (dot [1,2,3] [4,5])  -- expected: 18
  print (dot [1] [])  -- expected: 0
  print (dot [-2,3] [4,-1])  -- expected: 52

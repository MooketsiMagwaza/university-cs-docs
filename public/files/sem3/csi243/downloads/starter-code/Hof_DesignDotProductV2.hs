-- Title: Combine paired values and fold their total
{-
QUESTION
Write dot :: [Double] -> [Double] -> Double using zipWith and foldr.
Combine each pair with (*), then add the results. Ignore unmatched
suffixes; the empty total is zero. (5 marks)
-}

dot :: [Double] -> [Double] -> Double
dot = undefined -- Your answer here

main :: IO ()
main = do
  print (dot [] [2])  -- expected: 0.0
  print (dot [2] [3])  -- expected: 6.0
  print (dot [1,2,3] [4,5])  -- expected: 14.0
  print (dot [1] [])  -- expected: 0.0
  print (dot [-2,3] [4,-1])  -- expected: -11.0

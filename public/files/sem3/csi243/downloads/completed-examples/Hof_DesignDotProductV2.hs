-- Title: Combine paired values and fold their total
{-
QUESTION
Write dot :: [Double] -> [Double] -> Double using zipWith and foldr.
Combine each pair with (*), then add the results. Ignore unmatched
suffixes; the empty total is zero. (5 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- dot :: [Double] -> [Double] -> Double
-- Plan: Separate pairwise combination from reduction to a scalar.
dot :: [Double] -> [Double] -> Double
-- zipWith truncates before the summing fold.
dot xs ys = foldr (+) 0 (zipWith (*) xs ys)

main :: IO ()
main = do
  print (dot [] [2])  -- expected: 0.0
  print (dot [2] [3])  -- expected: 6.0
  print (dot [1,2,3] [4,5])  -- expected: 14.0
  print (dot [1] [])  -- expected: 0.0
  print (dot [-2,3] [4,-1])  -- expected: -11.0

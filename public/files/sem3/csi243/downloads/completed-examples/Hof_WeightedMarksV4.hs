-- Title: Calculate weighted marks in the ratio 1:3
{-
QUESTION
Write ff :: Int -> Int -> Double with formula (1*x+3*y)/4.
Write fmark :: [Int] -> [Int] -> [Double] using zipWith ff.
Write fmarkLambda of the same type using a direct anonymous formula.
Stop at the shorter list. Convert before division. (9 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- ff :: Int -> Int -> Double
-- fmark :: [Int] -> [Int] -> [Double]
-- fmarkLambda :: [Int] -> [Int] -> [Double]
-- Plan: Use a two-argument combiner and the shortest-list policy of zipWith.
ff :: Int -> Int -> Double
-- Convert the numerator before fractional division.
ff x y = fromIntegral (1*x+3*y) / 4

fmark :: [Int] -> [Int] -> [Double]
fmark = zipWith ff

fmarkLambda :: [Int] -> [Int] -> [Double]
fmarkLambda = zipWith (\x y -> fromIntegral (1*x+3*y) / 4)

main :: IO ()
main = do
  print (ff 0 0)  -- expected: 0.0
  print (ff 20 60)  -- expected: 50.0
  print (ff 1 4)  -- expected: 3.25
  print (fmark [] [60])  -- expected: []
  print (fmark [20,90] [60])  -- expected: [50.0]
  print (fmark [20] [60,90])  -- expected: [50.0]
  print (fmarkLambda [20] [60])  -- expected: [50.0]
  print (fmark [30] [])  -- expected: []
  print (fmark [] [])  -- expected: []

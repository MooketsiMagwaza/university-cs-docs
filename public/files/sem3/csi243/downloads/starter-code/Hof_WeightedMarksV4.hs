-- Title: Calculate weighted marks in the ratio 1:3
{-
QUESTION
Write ff :: Int -> Int -> Double with formula (1*x+3*y)/4.
Write fmark :: [Int] -> [Int] -> [Double] using zipWith ff.
Write fmarkLambda of the same type using a direct anonymous formula.
Stop at the shorter list. Convert before division. (9 marks)
-}

ff :: Int -> Int -> Double
ff = undefined -- Your answer here

fmark :: [Int] -> [Int] -> [Double]
fmark = undefined -- Your answer here

fmarkLambda :: [Int] -> [Int] -> [Double]
fmarkLambda = undefined -- Your answer here

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

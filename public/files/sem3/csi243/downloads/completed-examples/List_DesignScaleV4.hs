-- Title: Reverse integers with a growing accumulator
{-
QUESTION
Write reverseAcc xs with a local accumulator helper.
Do not use append or (++); move each head onto the accumulator.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

-- Read the question: Write reverseAcc with the stated list and result types.
-- Plan: Consume one head per step; return the appropriate empty result.
reverseAcc :: [Integer] -> [Integer]
-- Base cases handle missing data; the recursive case consumes list structure.
reverseAcc xs = go xs []
  where
    go [] acc = acc
    go (y:ys) acc = go ys (y:acc)

main :: IO ()
main = do
  print (reverseAcc [])  -- expected: []
  print (reverseAcc [7])  -- expected: [7]
  print (reverseAcc [1,2,3])  -- expected: [3,2,1]
  print (reverseAcc [4,4])  -- expected: [4,4]
  print (reverseAcc [-1,0,2])  -- expected: [2,0,-1]

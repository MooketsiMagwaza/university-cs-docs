-- Title: Reverse a list using an accumulator
{-
QUESTION
Write reverseAcc :: [a] -> [a] -> [a]. [5]
Return the first list reversed followed by the supplied accumulator.
Use only recursion and (:), without reverse or (++).
-}

reverseAcc :: [a] -> [a] -> [a]
reverseAcc = undefined  -- Your answer here

main :: IO ()
main = do
  print (reverseAcc ([] :: [Int]) [])  -- expected: []
  print (reverseAcc [] [8,9])  -- expected: [8,9]
  print (reverseAcc [1] [8])  -- expected: [1,8]
  print (reverseAcc [1,2,3] [8,9])  -- expected: [3,2,1,8,9]
  print (reverseAcc "ab" "XY")  -- expected: "baXY"

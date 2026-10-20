-- Title: Compute Fibonacci numbers with two accumulators
{-
QUESTION
Write sequenceAt with the signature below; reject negative indices.
Use S_0=0, S_1=1 and S_(n+2)=S_n+1*S_(n+1).
Return S_n.
Use two accumulators and one recursive call per step; do not use lists.
-}

sequenceAt :: Int -> Maybe Integer
sequenceAt = undefined -- Your answer here

main :: IO ()
main = do
  print (sequenceAt (-1))  -- expected: Nothing
  print (sequenceAt 0)  -- expected: Just 0
  print (sequenceAt 1)  -- expected: Just 1
  print (sequenceAt 3)  -- expected: Just 2
  print (sequenceAt 7)  -- expected: Just 13

-- Title: Return adjacent Fibonacci values together
{-
QUESTION
Write sequenceAt with the signature below; reject negative indices.
Return (F_n,F_(n+1)), with F_0=0, F_1=1 and F_(n+2)=F_n+F_(n+1).
Use two accumulators and one recursive call per step; do not use lists.
-}

sequenceAt :: Int -> Maybe (Integer,Integer)
sequenceAt = undefined -- Your answer here

main :: IO ()
main = do
  print (sequenceAt (-1))  -- expected: Nothing
  print (sequenceAt 0)  -- expected: Just (0,1)
  print (sequenceAt 1)  -- expected: Just (1,1)
  print (sequenceAt 3)  -- expected: Just (2,3)
  print (sequenceAt 7)  -- expected: Just (13,21)

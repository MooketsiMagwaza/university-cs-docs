-- Title: Choose Num, Integral and Fractional from the methods used
{-
QUESTION
Write shifted :: Num a => a -> a as x*x+1;
quotRemPair :: Integral a => a -> a -> (a,a) using quotRem (nonzero divisor);
and half :: Fractional a => a -> a using division by 2. (6 marks)
Explain the constraints from the methods rather than assuming all numeric
classes are one chain. Integral has Real and Enum superclasses; Real has
Num and Ord; Fractional has Num. Do not add Ord to half or shifted.
-}

shifted :: Num a => a -> a
shifted = undefined -- Your answer here

quotRemPair :: Integral a => a -> a -> (a,a)
quotRemPair = undefined -- Your answer here

half :: Fractional a => a -> a
half = undefined -- Your answer here

main :: IO ()
main = do
  print (shifted (0 :: Int))  -- expected: 1
  print (shifted (2 :: Integer))  -- expected: 5
  print (quotRemPair (7 :: Int) 3)  -- expected: (2,1)
  print (quotRemPair (-7 :: Int) 3)  -- expected: (-2,-1)
  print (half (5 :: Double))  -- expected: 2.5
  print (half (0 :: Double))  -- expected: 0.0

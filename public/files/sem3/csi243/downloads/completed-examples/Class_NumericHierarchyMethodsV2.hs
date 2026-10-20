-- Title: Choose Real and RealFrac for conversion and decomposition
{-
QUESTION
Write rationalEquals :: Real a => a -> Rational -> Bool, comparing
(toRational x) with its second argument. Write splitNumber :: RealFrac a =>
a -> (Integer,a) using properFraction; also wholeFloor :: RealFrac a =>
a -> Integer using floor. (6 marks)
Real has Num and Ord superclasses. RealFrac has Real and Fractional:
properFraction truncates towards zero, whereas floor rounds down.
-}

-- Read the question: Write conversion and decomposition functions using Real and RealFrac.
-- Plan: Use toRational, properFraction and floor at the weakest suitable class.
rationalEquals :: Real a => a -> Rational -> Bool
-- Real supplies exact rational conversion for these finite inputs.
rationalEquals x r = toRational x == r

splitNumber :: RealFrac a => a -> (Integer,a)
splitNumber = properFraction

wholeFloor :: RealFrac a => a -> Integer
wholeFloor = floor

main :: IO ()
main = do
  print (rationalEquals (0 :: Int) 0)  -- expected: True
  print (rationalEquals (1.5 :: Double) (3/2))  -- expected: True
  print (rationalEquals (2 :: Integer) 3)  -- expected: False
  print (splitNumber (2.5 :: Double))  -- expected: (2,0.5)
  print (splitNumber (-2.5 :: Double))  -- expected: (-2,-0.5)
  print (wholeFloor (-2.5 :: Double))  -- expected: -3

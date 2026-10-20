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

rationalEquals :: Real a => a -> Rational -> Bool
rationalEquals = undefined -- Your answer here

splitNumber :: RealFrac a => a -> (Integer,a)
splitNumber = undefined -- Your answer here

wholeFloor :: RealFrac a => a -> Integer
wholeFloor = undefined -- Your answer here

main :: IO ()
main = do
  print (rationalEquals (0 :: Int) 0)  -- expected: True
  print (rationalEquals (1.5 :: Double) (3/2))  -- expected: True
  print (rationalEquals (2 :: Integer) 3)  -- expected: False
  print (splitNumber (2.5 :: Double))  -- expected: (2,0.5)
  print (splitNumber (-2.5 :: Double))  -- expected: (-2,-0.5)
  print (wholeFloor (-2.5 :: Double))  -- expected: -3

-- Title: Distinguish Floating methods from RealFloat classification
{-
QUESTION
Write root :: Floating a => a -> a using sqrt; special :: RealFloat a =>
a -> (Bool,Bool) returning isNaN and isInfinite; and reflexive :: Double ->
Bool testing x <= x. (6 marks)
Floating has Fractional as superclass; RealFloat has RealFrac and Floating.
Thus Floating alone does not promise Ord or the RealFloat methods.
Explain why NaN violates reflexivity and why the compiler does not enforce
Ord laws. Do not print NaN itself or claim these checks prove universal laws.
-}

-- Read the question: Write square-root, floating classification and a NaN order counterexample.
-- Plan: Use exact square roots and Boolean observations of exceptional floating values.
root :: Floating a => a -> a
-- sqrt needs Floating, but no ordering constraint.
root = sqrt

special :: RealFloat a => a -> (Bool,Bool)
special x = (isNaN x, isInfinite x)

reflexive :: Double -> Bool
reflexive x = x <= x

main :: IO ()
main = do
  print (root (0 :: Double))  -- expected: 0.0
  print (root (4 :: Double))  -- expected: 2.0
  print (special (0 :: Double))  -- expected: (False,False)
  print (special (0/0 :: Double))  -- expected: (True,False)
  print (special (1/0 :: Double))  -- expected: (False,True)
  print (reflexive (0/0))  -- expected: False
  print (reflexive 1)  -- expected: True

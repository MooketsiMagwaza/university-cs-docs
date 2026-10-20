-- Title: Define a non-commutative scaled difference operator
{-
QUESTION
Define (<%>) :: Int -> Int -> Int by x <%> y = 2 * x - y.
Write applyBoth :: Int -> Int -> (Int,Int) returning the results of
x <%> y and (<%>) x y. They must agree. (5 marks)
Explain why a symbolic value operator can be placed in parentheses to
use prefix application and why its name must not begin with a colon.
-}

(<%>) :: Int -> Int -> Int
(<%>) = undefined -- Your answer here

applyBoth :: Int -> Int -> (Int,Int)
applyBoth = undefined -- Your answer here

main :: IO ()
main = do
  print (applyBoth (0) (0))  -- expected: (0,0)
  print (applyBoth (3) (1))  -- expected: (5,5)
  print (applyBoth (1) (3))  -- expected: (-1,-1)
  print (applyBoth (-2) (1))  -- expected: (-5,-5)
  print (applyBoth (4) (0))  -- expected: (8,8)

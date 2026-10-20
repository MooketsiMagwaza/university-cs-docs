-- Title: Define a symbolic difference operator
{-
QUESTION
Define (<->) :: Int -> Int -> Int by x <-> y = x - y.
Write applyBoth :: Int -> Int -> (Int,Int) returning the results of
x <-> y and (<->) x y. They must agree. (5 marks)
Explain why a symbolic value operator can be placed in parentheses to
use prefix application and why its name must not begin with a colon.
-}

-- Read the question: Write an Int operator and compare its prefix and infix applications.
-- Plan: Give the operator a parenthesised signature and use the same two arguments.
(<->) :: Int -> Int -> Int
-- The operand order matters in this definition.
x <-> y = x - y

applyBoth :: Int -> Int -> (Int,Int)
applyBoth x y = (x <-> y, (<->) x y)

main :: IO ()
main = do
  print (applyBoth (0) (0))  -- expected: (0,0)
  print (applyBoth (9) (4))  -- expected: (5,5)
  print (applyBoth (4) (9))  -- expected: (-5,-5)
  print (applyBoth (-2) (3))  -- expected: (-5,-5)
  print (applyBoth (7) (0))  -- expected: (7,7)

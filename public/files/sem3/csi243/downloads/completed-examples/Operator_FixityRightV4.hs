-- Title: Trace right fixity for subtraction scaled by 4
{-
QUESTION
Define (<~>) :: Int -> Int -> Int by x <~> y = x - 4*y, with
infixr 6 <~>. Write evaluate :: Int -> Int -> Int -> (Int,Int).
Return the unparenthesised chain a <~> b <~> c and its left-grouped
alternative as a pair. Show the full grouping of both results. (6 marks)
Also diagnose these deliberately commented alternatives:
-- infixl 6 <+>
-- infixr 6 <*>
-- bad a b c = a <+> b <*> c
Assume both operators are defined as Int operations. Explain whether the
mixed chain can be parsed and repair it with parentheses. Distinguish this
failure from an undeclared operator and from supplying True to an Int
operator. Classify the three failures as parse, scope or type failures.
-}

-- Read the question: Define an Int operator and evaluate two association choices.
-- Plan: Apply the declared fixity, then substitute the operator definition.
-- Equal precedence with opposing associativities is a parse conflict.
-- Repair: (a <+> b) <*> c or a <+> (b <*> c), choosing the intended order.
-- Undeclared operators cause scope errors; Bool in an Int slot is a type error.
infixr 6 <~>
(<~>) :: Int -> Int -> Int
-- The chain groups as (a <~> (b <~> c)); compare ((a <~> b) <~> c).
x <~> y = x - 4 * y

-- On 10,3,2: left = ((10 - 4*3) - 4*2) = -10.
-- Right = (10 - 4*(3 - 4*2)) = 30.
evaluate :: Int -> Int -> Int -> (Int,Int)
evaluate a b c = (a <~> b <~> c, ((a <~> b) <~> c))

main :: IO ()
main = do
  print (evaluate 10 3 2)  -- expected: (30,-10)
  print (evaluate 0 0 0)  -- expected: (0,0)
  print (evaluate 5 1 1)  -- expected: (17,-3)
  print (evaluate 2 4 3)  -- expected: (34,-26)
  print (evaluate (-2) 1 2)  -- expected: (26,-14)

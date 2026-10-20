-- Title: Trace left fixity for subtraction scaled by 2
{-
QUESTION
Define (<~>) :: Int -> Int -> Int by x <~> y = x - 2*y, with
infixl 6 <~>. Write evaluate :: Int -> Int -> Int -> (Int,Int).
Return the unparenthesised chain a <~> b <~> c and its right-grouped
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
infixl 6 <~>
(<~>) :: Int -> Int -> Int
-- The chain groups as ((a <~> b) <~> c); compare (a <~> (b <~> c)).
x <~> y = x - 2 * y

-- On 10,3,2: left = ((10 - 2*3) - 2*2) = 0.
-- Right = (10 - 2*(3 - 2*2)) = 12.
evaluate :: Int -> Int -> Int -> (Int,Int)
evaluate a b c = (a <~> b <~> c, (a <~> (b <~> c)))

main :: IO ()
main = do
  print (evaluate 10 3 2)  -- expected: (0,12)
  print (evaluate 0 0 0)  -- expected: (0,0)
  print (evaluate 5 1 1)  -- expected: (1,7)
  print (evaluate 2 4 3)  -- expected: (-12,6)
  print (evaluate (-2) 1 2)  -- expected: (-8,4)

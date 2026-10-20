-- Title: Evaluate an expression tree with addition and subtraction
{-
QUESTION
Given the declaration below, write eval :: Expr -> Integer recursively. [6]
Lit holds a value; Add adds; Sub performs subtraction.
data Expr = Lit Integer | Add Expr Expr | Sub Expr Expr
-}

-- Read the question: Write eval :: Expr -> Integer.
-- Plan: Use one equation per constructor and combine recursive results.
data Expr = Lit Integer | Add Expr Expr | Sub Expr Expr

eval :: Expr -> Integer
eval (Lit n) = n
eval (Add a b) = eval a + eval b
eval (Sub a b) = eval a - eval b  -- Evaluate both subexpressions.

main :: IO ()
main = do
  print (eval (Lit 0))  -- expected: 0
  print (eval (Lit 7))  -- expected: 7
  print (eval (Add (Lit 2) (Lit 3)))  -- expected: 5
  print (eval (Sub (Add (Lit 2) (Lit 3)) (Lit 4)))  -- expected: 1
  print (eval (Sub (Lit 2) (Add (Lit 3) (Lit 4))))  -- expected: -5

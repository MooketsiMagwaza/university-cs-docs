-- Title: Evaluate an expression tree with addition and multiplication
{-
QUESTION
Given the declaration below, write eval :: Expr -> Integer recursively. [6]
Lit holds a value; Add adds; Mul performs multiplication.
data Expr = Lit Integer | Add Expr Expr | Mul Expr Expr
-}

-- Read the question: Write eval :: Expr -> Integer.
-- Plan: Use one equation per constructor and combine recursive results.
data Expr = Lit Integer | Add Expr Expr | Mul Expr Expr

eval :: Expr -> Integer
eval (Lit n) = n
eval (Add a b) = eval a + eval b
eval (Mul a b) = eval a * eval b  -- Evaluate both subexpressions.

main :: IO ()
main = do
  print (eval (Lit 0))  -- expected: 0
  print (eval (Lit 7))  -- expected: 7
  print (eval (Add (Lit 2) (Lit 3)))  -- expected: 5
  print (eval (Mul (Add (Lit 2) (Lit 3)) (Lit 4)))  -- expected: 20
  print (eval (Add (Lit 2) (Mul (Lit 3) (Lit 4))))  -- expected: 14

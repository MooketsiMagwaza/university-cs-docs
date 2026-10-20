-- Title: Write Item equality using code fields
{-
QUESTION
Given data Item = Item Int String, write an Eq instance. [5]
Treat two items as equal exactly when they have equal code fields, ignoring labels.
Define (==); use the default (/=). Do not derive Eq.
-}

-- Read the question: Write .
-- Plan: Pattern match both operands and apply the specified equality.
data Item = Item Int String

instance Eq Item where
  Item a s == Item b t = a == b  -- Compare only the specified fields.

main :: IO ()
main = do
  print (Item 0 "" == Item 0 "")  -- expected: True
  print (Item 1 "A" == Item 1 "B")  -- expected: True
  print (Item 1 "A" == Item 2 "A")  -- expected: False
  print (Item 2 "B" == Item 2 "B")  -- expected: True
  print (Item 3 "" /= Item 4 "")  -- expected: True

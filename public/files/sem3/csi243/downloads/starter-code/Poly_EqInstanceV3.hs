-- Title: Write Item equality using both fields
{-
QUESTION
Given data Item = Item Int String, write an Eq instance. [5]
Treat two items as equal exactly when they have equal code and label fields.
Define (==); use the default (/=). Do not derive Eq.
-}

data Item = Item Int String

instance Eq Item where
  (==) = undefined  -- Your answer here

main :: IO ()
main = do
  print (Item 0 "" == Item 0 "")  -- expected: True
  print (Item 1 "A" == Item 1 "B")  -- expected: False
  print (Item 1 "A" == Item 2 "A")  -- expected: False
  print (Item 2 "B" == Item 2 "B")  -- expected: True
  print (Item 3 "" /= Item 4 "")  -- expected: True

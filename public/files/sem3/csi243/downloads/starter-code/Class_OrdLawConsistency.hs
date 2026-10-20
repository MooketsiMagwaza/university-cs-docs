-- Title: Check ordering and equality consistency on finite values
{-
QUESTION
Write orderChecks :: Ord a => a -> a -> a -> (Bool, Bool, Bool).
Return: compare x y == EQ agrees with x == y; x <= y or y <= x;
and the implication (x <= y && y <= z) implies x <= z.
Also write pairLaws :: Ord a => a -> a -> (Bool,Bool), returning
reflexivity x <= x and antisymmetry: (x <= y && y <= x) implies x == y.
Use implication p implies q as not p || q. (8 marks)
Explain why these tests are examples, not a proof of the Ord laws.
Assume total values and lawful instances. Bottom and floating NaN are
excluded: a type-class constraint checks available methods, not laws.
-}

orderChecks :: Ord a => a -> a -> a -> (Bool, Bool, Bool)
orderChecks = undefined -- Your answer here

pairLaws :: Ord a => a -> a -> (Bool,Bool)
pairLaws = undefined -- Your answer here

main :: IO ()
main = do
  print (orderChecks (1 :: Int) 2 3)  -- expected: (True,True,True)
  print (orderChecks (3 :: Int) 2 1)  -- expected: (True,True,True)
  print (orderChecks (0 :: Int) 0 0)  -- expected: (True,True,True)
  print (orderChecks "" "a" "b")  -- expected: (True,True,True)
  print (orderChecks 'a' 'b' 'a')  -- expected: (True,True,True)
  print (pairLaws (0 :: Int) 0)  -- expected: (True,True)
  print (pairLaws "" "a")  -- expected: (True,True)

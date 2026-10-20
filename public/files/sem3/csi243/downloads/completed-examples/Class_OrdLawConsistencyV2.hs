-- Title: Compare lexicographic keys and resolve ties
{-
QUESTION
Write keyOrder :: (Ord a, Ord b) => (a,b) -> (a,b) -> Ordering.
Use compare on pairs. Explain why the first unequal component decides,
and why the second component matters only when the first ties. (4 marks)
Assume total values with lawful Ord instances.
-}

-- Read the question: Write a generic pair comparator returning Ordering.
-- Plan: Use the standard lexicographic Ord instance for pairs.
keyOrder :: (Ord a, Ord b) => (a,b) -> (a,b) -> Ordering
-- Pair comparison examines the first component before the second.
keyOrder x y = compare x y

main :: IO ()
main = do
  print (keyOrder (1 :: Int,"z") (2,"a"))  -- expected: LT
  print (keyOrder (2 :: Int,"ant") (2,"bee"))  -- expected: LT
  print (keyOrder (2 :: Int,"bee") (2,"ant"))  -- expected: GT
  print (keyOrder (0 :: Int,"") (0,""))  -- expected: EQ
  print (keyOrder (3 :: Int,"a") (1,"z"))  -- expected: GT

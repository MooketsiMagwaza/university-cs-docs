-- Title: Generate all Pythagorean triples up to a bound.
{-
QUESTION
Write allTriples :: Int -> [(Int,Int,Int)] using a comprehension.
Return all positive a < b < c with c at most the argument and
a*a + b*b == c*c. Include scaled triples but omit swapped duplicates.
-}

-- Read the question: Write a bounded enumeration of integer triples.
-- Plan: Generate ordered positive triples, then test the equation and restrictions.
allTriples :: Int -> [(Int, Int, Int)]
-- Dependent generators enforce strict order and remove swapped duplicates.
allTriples n =
  [(a,b,c) | a <- [1..n], b <- [a+1..n], c <- [b+1..n],
             a*a + b*b == c*c]

main :: IO ()
main = do
  print (allTriples 0)  -- expected: []
  print (allTriples 1)  -- expected: []
  print (allTriples 5)  -- expected: [(3,4,5)]
  print (allTriples 10)  -- expected: [(3,4,5),(6,8,10)]
  print (allTriples 15)  -- expected: [(3,4,5),(5,12,13),(6,8,10),(9,12,15)]

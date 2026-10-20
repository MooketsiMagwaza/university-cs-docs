-- Title: Generate primitive triples with a bounded perimeter.
{-
QUESTION
Write perimeterTriples :: Int -> [(Int,Int,Int)] using a comprehension.
Return positive a < b < c with a*a + b*b == c*c, gcd a b == 1, and
a+b+c at most the argument. Order the result by a, then b, then c.
-}

-- Read the question: Write a bounded enumeration of integer triples.
-- Plan: Generate ordered positive triples, then test the equation and restrictions.
perimeterTriples :: Int -> [(Int, Int, Int)]
-- Dependent generators enforce strict order and remove swapped duplicates.
perimeterTriples n =
  [(a,b,c) | a <- [1..n], b <- [a+1..n], c <- [b+1..n],
             a+b+c <= n, a*a+b*b == c*c, gcd a b == 1]

main :: IO ()
main = do
  print (perimeterTriples 0)  -- expected: []
  print (perimeterTriples 1)  -- expected: []
  print (perimeterTriples 11)  -- expected: []
  print (perimeterTriples 12)  -- expected: [(3,4,5)]
  print (perimeterTriples 30)  -- expected: [(3,4,5),(5,12,13)]

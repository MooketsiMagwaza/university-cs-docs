-- Title: Generate primitive triples
{-
QUESTION
Write triples :: Integer -> [(Integer,Integer,Integer)] with a comprehension. [6]
Generate a from 1..n, b from a..n, c from b..n, in that order.
Keep a*a+b*b == c*c. Require gcd a b == 1 as well.
-}

-- Read the question: Write triples :: Integer -> [(Integer,Integer,Integer)].
-- Plan: Use dependent generators to exclude swapped copies and test the equation.
triples :: Integer -> [(Integer,Integer,Integer)]
triples n = [(a,b,c) | a <- [1..n], b <- [a..n], c <- [b..n],
                       a*a+b*b == c*c, gcd a b == 1]  -- c varies fastest.

main :: IO ()
main = do
  print (triples 0)  -- expected: []
  print (triples 4)  -- expected: []
  print (triples 5)  -- expected: [(3,4,5)]
  print (triples 10)  -- expected: [(3,4,5)]
  print (triples 13)  -- expected: [(3,4,5),(5,12,13)]

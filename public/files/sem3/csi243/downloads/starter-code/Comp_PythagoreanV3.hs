-- Title: Generate triples bounded by perimeter
{-
QUESTION
Write triples :: Integer -> [(Integer,Integer,Integer)] with a comprehension. [6]
Generate a from 1..n, b from a..n, c from b..n, in that order.
Keep a*a+b*b == c*c. Require a+b+c <= n as well.
-}

triples :: Integer -> [(Integer,Integer,Integer)]
triples = undefined  -- Your answer here

main :: IO ()
main = do
  print (triples 0)  -- expected: []
  print (triples 11)  -- expected: []
  print (triples 12)  -- expected: [(3,4,5)]
  print (triples 24)  -- expected: [(3,4,5),(6,8,10)]
  print (triples 30)  -- expected: [(3,4,5),(5,12,13),(6,8,10)]

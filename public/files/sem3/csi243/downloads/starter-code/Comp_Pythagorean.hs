-- Title: Generate all ordered-side triples
{-
QUESTION
Write triples :: Integer -> [(Integer,Integer,Integer)] with a comprehension. [6]
Generate a from 1..n, b from a..n, c from b..n, in that order.
Keep a*a+b*b == c*c. No further restriction.
-}

triples :: Integer -> [(Integer,Integer,Integer)]
triples = undefined  -- Your answer here

main :: IO ()
main = do
  print (triples 0)  -- expected: []
  print (triples 4)  -- expected: []
  print (triples 5)  -- expected: [(3,4,5)]
  print (triples 10)  -- expected: [(3,4,5),(6,8,10)]
  print (triples 13)  -- expected: [(3,4,5),(5,12,13),(6,8,10)]

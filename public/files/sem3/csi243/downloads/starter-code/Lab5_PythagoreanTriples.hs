-- Title: Generate primitive Pythagorean triples below a bound.
{-
QUESTION
Create a comprehension returning primitive Pythagorean triples below 100.
Generalise it as primitiveTriples :: Int -> [(Int,Int,Int)], where the
argument is an exclusive upper bound on every component. Return
positive a < b < c with a*a + b*b == c*c and gcd a b == 1.
The sheet has a formula typo: the correct exponent on c is 2.
Its required 16 triples below 100 means primitive triples only; exclude
scaled copies and swapped duplicates.
-}

primitiveTriples :: Int -> [(Int, Int, Int)]
primitiveTriples = undefined -- Your answer here

main :: IO ()
main = do
  print (primitiveTriples 0)  -- expected: []
  print (primitiveTriples 1)  -- expected: []
  print (primitiveTriples 6)  -- expected: [(3,4,5)]
  print (primitiveTriples 14)  -- expected: [(3,4,5),(5,12,13)]
  print (primitiveTriples 100)  -- expected: [(3,4,5),(5,12,13),(7,24,25),(8,15,17),(9,40,41),(11,60,61),(12,35,37),(13,84,85),(16,63,65),(20,21,29),(28,45,53),(33,56,65),(36,77,85),(39,80,89),(48,55,73),(65,72,97)]

-- Title: Generate primitive triples with a bounded perimeter.
{-
QUESTION
Write perimeterTriples :: Int -> [(Int,Int,Int)] using a comprehension.
Return positive a < b < c with a*a + b*b == c*c, gcd a b == 1, and
a+b+c at most the argument. Order the result by a, then b, then c.
-}

perimeterTriples :: Int -> [(Int, Int, Int)]
perimeterTriples = undefined -- Your answer here

main :: IO ()
main = do
  print (perimeterTriples 0)  -- expected: []
  print (perimeterTriples 1)  -- expected: []
  print (perimeterTriples 11)  -- expected: []
  print (perimeterTriples 12)  -- expected: [(3,4,5)]
  print (perimeterTriples 30)  -- expected: [(3,4,5),(5,12,13)]

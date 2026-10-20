-- Title: Calculate volume by matching shape constructors
{-
QUESTION
Given the declaration below, write volume :: Shape -> Integer. [5]
Return volume for cubes and rectangular boxes. Dimensions are non-negative.
data Shape = Cube Integer | Box Integer Integer Integer
-}

-- Read the question: Write volume :: Shape -> Integer.
-- Plan: Use one equation for each constructor and its formula.
data Shape = Cube Integer | Box Integer Integer Integer

volume :: Shape -> Integer
volume (Cube s) = s*s*s
volume (Box w h d) = w*h*d  -- Multiply all three dimensions.

main :: IO ()
main = do
  print (volume (Cube 0))  -- expected: 0
  print (volume (Cube 1))  -- expected: 1
  print (volume (Cube 3))  -- expected: 27
  print (volume (Box 2 3 4))  -- expected: 24
  print (volume (Box 0 3 4))  -- expected: 0

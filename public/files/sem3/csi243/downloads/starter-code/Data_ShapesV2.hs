-- Title: Calculate volume by matching shape constructors
{-
QUESTION
Given the declaration below, write volume :: Shape -> Integer. [5]
Return volume for cubes and rectangular boxes. Dimensions are non-negative.
data Shape = Cube Integer | Box Integer Integer Integer
-}

data Shape = Cube Integer | Box Integer Integer Integer

volume :: Shape -> Integer
volume = undefined  -- Your answer here

main :: IO ()
main = do
  print (volume (Cube 0))  -- expected: 0
  print (volume (Cube 1))  -- expected: 1
  print (volume (Cube 3))  -- expected: 27
  print (volume (Box 2 3 4))  -- expected: 24
  print (volume (Box 0 3 4))  -- expected: 0

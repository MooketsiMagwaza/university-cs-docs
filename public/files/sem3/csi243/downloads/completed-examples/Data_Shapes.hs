-- Title: Calculate area by matching shape constructors
{-
QUESTION
Given the declaration below, write area :: Shape -> Double. [5]
Return area for squares (side squared), rectangles (width times height),
and triangles (base times height divided by two). Dimensions are non-negative.
data Shape = Square Double | Rectangle Double Double | Triangle Double Double
-}

-- Read the question: Write area :: Shape -> Double.
-- Plan: Use one equation for each constructor and its formula.
data Shape = Square Double | Rectangle Double Double | Triangle Double Double

area :: Shape -> Double
area (Square s) = s*s
area (Rectangle w h) = w*h
area (Triangle b h) = b*h/2  -- Pattern extracts the dimensions.

main :: IO ()
main = do
  print (area (Square 0))  -- expected: 0.0
  print (area (Square 3))  -- expected: 9.0
  print (area (Rectangle 2 5))  -- expected: 10.0
  print (area (Triangle 3 5))  -- expected: 7.5
  print (area (Triangle 0 8))  -- expected: 0.0

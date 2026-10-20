-- Title: Calculate perimeter by matching shape constructors
{-
QUESTION
Given the declaration below, write perimeter :: Shape -> Integer. [5]
Return perimeter for squares, rectangles and triangles with given side lengths.
Assume non-negative dimensions and valid triangle sides.
data Shape = Square Integer | Rectangle Integer Integer | Triangle Integer Integer Integer
-}

-- Read the question: Write perimeter :: Shape -> Integer.
-- Plan: Use one equation for each constructor and its formula.
data Shape = Square Integer | Rectangle Integer Integer | Triangle Integer Integer Integer

perimeter :: Shape -> Integer
perimeter (Square s) = 4*s
perimeter (Rectangle w h) = 2*(w+h)
perimeter (Triangle a b c) = a+b+c  -- Sum all sides.

main :: IO ()
main = do
  print (perimeter (Square 0))  -- expected: 0
  print (perimeter (Square 3))  -- expected: 12
  print (perimeter (Rectangle 2 5))  -- expected: 14
  print (perimeter (Triangle 3 4 5))  -- expected: 12
  print (perimeter (Triangle 2 2 2))  -- expected: 6

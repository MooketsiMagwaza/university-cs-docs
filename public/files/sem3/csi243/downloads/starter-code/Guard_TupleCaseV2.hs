-- Title: Use case on coordinate tests
{-
QUESTION
Write region :: (Integer,Integer) -> String. [5]
Use case on (x == 0,y == 0). Return "Origin" if both are zero,
"YAxis" if only x is zero, "XAxis" if only y is zero, otherwise "OffAxes".
-}

region :: (Integer,Integer) -> String
region = undefined  -- Your answer here

main :: IO ()
main = do
  print (region (0,0))  -- expected: "Origin"
  print (region (0,4))  -- expected: "YAxis"
  print (region (3,0))  -- expected: "XAxis"
  print (region (2,5))  -- expected: "OffAxes"
  print (region (-1,-2))  -- expected: "OffAxes"

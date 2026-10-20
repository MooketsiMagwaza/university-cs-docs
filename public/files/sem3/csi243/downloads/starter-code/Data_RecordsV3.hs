-- Title: Use a Student record to passed
{-
QUESTION
Given the declaration below, write passed :: Student -> Bool. [4]
Return True exactly when the mark is at least 50.
Use the field accessor.
data Student = Student { studentName :: String, studentMark :: Int } deriving (Show,Eq)
-}

data Student = Student { studentName :: String, studentMark :: Int } deriving (Show,Eq)

passed :: Student -> Bool
passed = undefined  -- Your answer here

main :: IO ()
main = do
  print (passed (Student "" 0))  -- expected: False
  print (passed (Student "Ada" 49))  -- expected: False
  print (passed (Student "Ben" 50))  -- expected: True
  print (passed (Student "Cy" 100))  -- expected: True
  print (passed (Student "Di" 75))  -- expected: True

-- Title: Use a Student record to passed
{-
QUESTION
Given the declaration below, write passed :: Student -> Bool. [4]
Return True exactly when the mark is at least 50.
Use the field accessor.
data Student = Student { studentName :: String, studentMark :: Int } deriving (Show,Eq)
-}

-- Read the question: Write passed :: Student -> Bool.
-- Plan: Access the mark by name.
data Student = Student { studentName :: String, studentMark :: Int } deriving (Show,Eq)

passed :: Student -> Bool
passed s = studentMark s >= 50  -- Read a named field.

main :: IO ()
main = do
  print (passed (Student "" 0))  -- expected: False
  print (passed (Student "Ada" 49))  -- expected: False
  print (passed (Student "Ben" 50))  -- expected: True
  print (passed (Student "Cy" 100))  -- expected: True
  print (passed (Student "Di" 75))  -- expected: True

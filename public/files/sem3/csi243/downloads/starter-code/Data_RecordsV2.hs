-- Title: Use a Student record to resetMark
{-
QUESTION
Given the declaration below, write resetMark :: Student -> Student. [4]
Set the mark to 0, preserving the name.
Use record update syntax.
data Student = Student { studentName :: String, studentMark :: Int } deriving (Show,Eq)
-}

data Student = Student { studentName :: String, studentMark :: Int } deriving (Show,Eq)

resetMark :: Student -> Student
resetMark = undefined  -- Your answer here

main :: IO ()
main = do
  print (resetMark (Student "" 0))  -- expected: Student {studentName = "", studentMark = 0}
  print (resetMark (Student "Ada" 50))  -- expected: Student {studentName = "Ada", studentMark = 0}
  print (resetMark (Student "Ben" 98))  -- expected: Student {studentName = "Ben", studentMark = 0}
  print (resetMark (Student "Cy" 100))  -- expected: Student {studentName = "Cy", studentMark = 0}
  print (resetMark (Student "Di" 95))  -- expected: Student {studentName = "Di", studentMark = 0}

-- Title: Use a Student record to award
{-
QUESTION
Given the declaration below, write award :: Student -> Student. [4]
Add 5 to the mark, capped at 100. Marks initially lie in 0..100.
Use record update syntax.
data Student = Student { studentName :: String, studentMark :: Int } deriving (Show,Eq)
-}

data Student = Student { studentName :: String, studentMark :: Int } deriving (Show,Eq)

award :: Student -> Student
award = undefined  -- Your answer here

main :: IO ()
main = do
  print (award (Student "" 0))  -- expected: Student {studentName = "", studentMark = 5}
  print (award (Student "Ada" 50))  -- expected: Student {studentName = "Ada", studentMark = 55}
  print (award (Student "Ben" 98))  -- expected: Student {studentName = "Ben", studentMark = 100}
  print (award (Student "Cy" 100))  -- expected: Student {studentName = "Cy", studentMark = 100}
  print (award (Student "Di" 95))  -- expected: Student {studentName = "Di", studentMark = 100}

-- Title: Model courses with a tuple synonym
{-
QUESTION
Given type Course = (String,String,Int), representing title, code and
nonnegative credits, write courseInfo :: [Course] -> Int to total credits across the supplied courses.
State the fully expanded input/output types. Explain why a raw tuple of
the same type can be passed to this function. (6 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- courseInfo :: [Course] -> Int
-- Plan: Match the fields in their declared order; aliases need no wrapping.
type Course = (String,String,Int)

courseInfo :: [Course] -> Int
-- Course is exactly the tuple type; match its three fields.
courseInfo courses = sum [c | (_,_,c) <- courses]

-- Course = (String,String,Int) = ([Char],[Char],Int).
-- Course and its tuple expansion are interchangeable; no validation is added.

main :: IO ()
main = do
  print (courseInfo [])  -- expected: 0
  print (courseInfo [("FP","CSI243",3)])  -- expected: 3
  print (courseInfo [("A","A1",2),("B","B1",4)])  -- expected: 6
  print (courseInfo [("X","X1",0)])  -- expected: 0
  print (courseInfo [("X","X1",1),("X","X1",1)])  -- expected: 2

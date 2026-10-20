-- Title: Model courses with a tuple synonym
{-
QUESTION
Given type Course = (String,String,Int), representing title, code and
nonnegative credits, write courseInfo :: Course -> Course to add one credit, preserving title and code.
State the fully expanded input/output types. Explain why a raw tuple of
the same type can be passed to this function. (6 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- courseInfo :: Course -> Course
-- Plan: Match the fields in their declared order; aliases need no wrapping.
type Course = (String,String,Int)

courseInfo :: Course -> Course
-- Course is exactly the tuple type; match its three fields.
courseInfo (title,code,credits) = (title,code,credits+1)

-- Course = (String,String,Int) = ([Char],[Char],Int).
-- Course and its tuple expansion are interchangeable; no validation is added.

main :: IO ()
main = do
  print (courseInfo ("","",0))  -- expected: ("","",1)
  print (courseInfo ("FP","CSI243",3))  -- expected: ("FP","CSI243",4)
  print (courseInfo ("Logic","CSI200",2))  -- expected: ("Logic","CSI200",3)
  print (courseInfo ("Maths","M1",4))  -- expected: ("Maths","M1",5)
  print (courseInfo ("X","",1))  -- expected: ("X","",2)

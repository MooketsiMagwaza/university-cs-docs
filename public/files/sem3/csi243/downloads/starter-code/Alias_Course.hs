-- Title: Model courses with a tuple synonym
{-
QUESTION
Given type Course = (String,String,Int), representing title, code and
nonnegative credits, write courseInfo :: Course -> String to return the title.
State the fully expanded input/output types. Explain why a raw tuple of
the same type can be passed to this function. (6 marks)
-}

type Course = (String,String,Int)

courseInfo :: Course -> String
courseInfo = undefined -- Your answer here

main :: IO ()
main = do
  print (courseInfo ("","",0))  -- expected: ""
  print (courseInfo ("FP","CSI243",3))  -- expected: "FP"
  print (courseInfo ("Logic","CSI200",2))  -- expected: "Logic"
  print (courseInfo ("Maths","M1",4))  -- expected: "Maths"
  print (courseInfo ("X","",1))  -- expected: "X"

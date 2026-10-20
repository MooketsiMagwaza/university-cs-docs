-- Title: Repair a type declaration and use its representation
{-
QUESTION
The proposed data Course = (title,code,credits) is invalid.
Use the supplied tuple synonym instead and write repair to return the code.
Explain why a type synonym has no Course value constructor.
Use the function signature repair :: Course -> String. (6 marks)
-}

type Course = (String,String,Int)

repair :: Course -> String
repair = undefined -- Your answer here

main :: IO ()
main = do
  print (repair ("","",0))  -- expected: ""
  print (repair ("FP","CSI243",3))  -- expected: "CSI243"
  print (repair ("A","A1",1))  -- expected: "A1"
  print (repair ("B","B2",2))  -- expected: "B2"
  print (repair ("C","C3",3))  -- expected: "C3"

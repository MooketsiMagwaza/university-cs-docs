-- Title: Repair a type declaration and use its representation
{-
QUESTION
The proposed data Course = (title,code,credits) is invalid.
Use the supplied tuple synonym instead and write repair to return the code.
Explain why a type synonym has no Course value constructor.
Use the function signature repair :: Course -> String. (6 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- repair :: Course -> String
-- Plan: Distinguish an alias expansion from a data or newtype constructor.
type Course = (String,String,Int)

repair :: Course -> String
-- Use the alias directly, or explicitly match/build the real constructor.
repair (_,code,_) = code

-- Tuple components in a type declaration must be types, not field values.
-- The alias creates no constructor; course values are ordinary triples.

main :: IO ()
main = do
  print (repair ("","",0))  -- expected: ""
  print (repair ("FP","CSI243",3))  -- expected: "CSI243"
  print (repair ("A","A1",1))  -- expected: "A1"
  print (repair ("B","B2",2))  -- expected: "B2"
  print (repair ("C","C3",3))  -- expected: "C3"

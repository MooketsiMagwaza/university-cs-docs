-- Title: Extract names of passing students
{-
QUESTION
Write passedNames :: [(String,Int)] -> [String] using a comprehension. [4]
Keep names with marks at least 50 and at most 100; preserve input order.
-}

-- Read the question: Write passedNames :: [(String,Int)] -> [String].
-- Plan: Unpack each tuple in the generator and test the mark.
passedNames :: [(String,Int)] -> [String]
passedNames rows = [name | (name,mark) <- rows, mark >= 50, mark <= 100]

main :: IO ()
main = do
  print (passedNames [])  -- expected: []
  print (passedNames [("Ada",50)])  -- expected: ["Ada"]
  print (passedNames [("A",49),("B",70)])  -- expected: ["B"]
  print (passedNames [("A",101),("B",100)])  -- expected: ["B"]
  print (passedNames [("",50),("C",0)])  -- expected: [""]

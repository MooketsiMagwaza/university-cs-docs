-- Title: Repair a reserved word and discard a tuple component
{-
QUESTION
Repair this deliberately commented definition:
-- case (x, _) = x * 2
Write caseValue :: (Int,String) -> Int with the intended behaviour.
The word case is reserved; caseValue is legal. Use _ for the unused text.
Explain why _name would bind a value but _ does not. (4 marks)
-}

caseValue :: (Int,String) -> Int
caseValue = undefined -- Your answer here

main :: IO ()
main = do
  print (caseValue (0,""))  -- expected: 0
  print (caseValue (3,"ignored"))  -- expected: 6
  print (caseValue (-2,"x"))  -- expected: -4
  print (caseValue (1,"one"))  -- expected: 2
  print (caseValue (4,""))  -- expected: 8

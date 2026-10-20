-- Title: Repair a capitalised function and retain an underscore binding
{-
QUESTION
Repair this deliberately commented definition:
-- Adjusted (x, _offset) = x + _offset
Write adjusted' :: (Int,Int) -> Int with the intended behaviour. (4 marks)
Explain that a value function starts with a lowercase letter or underscore;
uppercase names are for constructors and type constructors. A trailing
apostrophe is legal. _offset is a binding and can be used; _ is a wildcard
and cannot be used as an expression. Do not rename the binding to _ here.
-}

-- Read the question: Repair a name and write a pair-to-Int function.
-- Plan: Use a lowercase value name with an apostrophe and keep the offset binding.
adjusted' :: (Int,Int) -> Int
-- _offset still binds a value, despite starting with an underscore.
adjusted' (x, _offset) = x + _offset

main :: IO ()
main = do
  print (adjusted' (0,0))  -- expected: 0
  print (adjusted' (2,3))  -- expected: 5
  print (adjusted' (-2,3))  -- expected: 1
  print (adjusted' (5,-5))  -- expected: 0
  print (adjusted' (1,0))  -- expected: 1

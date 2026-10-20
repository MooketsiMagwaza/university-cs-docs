-- Title: Use filter to retain marks at least 50
{-
QUESTION
Write select :: [Integer] -> [Integer] using filter. [3]
Keep marks at least 50 in input order.
-}

select :: [Integer] -> [Integer]
select = undefined  -- Your answer here

main :: IO ()
main = do
  print (select [])  -- expected: []
  print (select [49])  -- expected: []
  print (select [50])  -- expected: [50]
  print (select [49,50,80])  -- expected: [50,80]
  print (select [100,0,70])  -- expected: [100,70]

-- Title: Match a constructor operator and handle the empty list
{-
QUESTION
Write peel :: [a] -> Maybe (a,[a]) using [] and the constructor pattern
(x:xs). Return Nothing for the empty list. (4 marks)
Explain why a constructor operator such as (:) may appear in patterns,
whereas an arbitrary value operator application is not a general pattern.
-}

peel :: [a] -> Maybe (a,[a])
peel = undefined -- Your answer here

main :: IO ()
main = do
  print (peel ([] :: [Int]))  -- expected: Nothing
  print (peel [7 :: Int])  -- expected: Just (7,[])
  print (peel [1,2,3 :: Int])  -- expected: Just (1,[2,3])
  print (peel "ab")  -- expected: Just ('a',"b")
  print (peel [True,False])  -- expected: Just (True,[False])

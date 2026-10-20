-- Title: Count cons operations in accumulator reverse
{-
QUESTION
Write reverseCount :: [Char] -> ([Char], Int) using an accumulator.
Count one cons onto the accumulator per consumed character, zero at [].
C(0)=0 and C(n)=C(n-1)+1, hence n cons operations. The reversed result
has n cells; distinguish this result size from auxiliary control space.
Do not infer an exact GHC allocation or stack measurement from the count.
-}

-- Read the question: Write a definition; reverseCount has input/result type [Char] -> ([Char], Int).
-- Plan: Carry a counter for the specified list construction or append traversal.
reverseCount :: [Char] -> ([Char], Int)
reverseCount xs = go xs [] 0
  where
    go [] acc count = (acc,count)
    go (a:as) acc count = go as (a:acc) (count+1)

main :: IO ()
main = do
  print (reverseCount "")  -- expected: ("",0)
  print (reverseCount "a")  -- expected: ("a",1)
  print (reverseCount "ab")  -- expected: ("ba",2)
  print (reverseCount "abc")  -- expected: ("cba",3)
  print (reverseCount "level")  -- expected: ("level",5)

-- Title: Check reordering of independent pure calculations
{-
QUESTION
Write reorder :: [Integer] -> ((Integer,Integer),(Integer,Integer),Bool).
One definition binds s=sum xs before p=product xs; another binds p
before s. Both return (s,p). Return both pairs and their equality.
The bindings are independent and pure, so reordering preserves results
for finite lists. This illustrates referential transparency and freedom
for scheduling/optimisation. It does not promise automatic parallelism
or faster execution: overhead, demand and compiler choices still matter.
An imperative program with stateful effects would need separate reasoning.
-}

-- Read the question: Write a definition; reorder has input/result type [Integer] -> ((Integer,Integer),(Integer,Integer),Bool).
-- Plan: Model the concrete descriptions with pure functions and compare their results.
reorder :: [Integer] -> ((Integer,Integer),(Integer,Integer),Bool)
reorder xs = (first,second,first == second)
  where
    first = let s = sum xs; p = product xs in (s,p)
    second = let p = product xs; s = sum xs in (s,p)

main :: IO ()
main = do
  print (reorder [])  -- expected: ((0,1),(0,1),True)
  print (reorder [0])  -- expected: ((0,0),(0,0),True)
  print (reorder [3])  -- expected: ((3,3),(3,3),True)
  print (reorder [1,2,3])  -- expected: ((6,6),(6,6),True)
  print (reorder [-2,3])  -- expected: ((1,-6),(1,-6),True)

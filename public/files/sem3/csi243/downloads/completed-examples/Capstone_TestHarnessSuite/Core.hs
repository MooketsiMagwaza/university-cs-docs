module Core (adjust, faultyAdjust) where

-- Read the question: Provide a correct transform and a deliberate off-by-one mutant.

-- Plan: Map the required increment over every value; [] stays [].
adjust :: [Int] -> [Int]
adjust xs = map (+ 1) xs

-- Plan: This named, intentionally incorrect implementation is safe to execute.
faultyAdjust :: [Int] -> [Int]
faultyAdjust xs = map (+ 2) xs

-- Title: Convert before dividing
{-
QUESTION
Write convert :: Int -> Int -> Double. Convert both operands before
dividing. The second operand must be nonzero.
-}

-- Read the question: Write convert with the specified numeric input and output types.
-- Plan: Apply the requested conversion at the point where its type is needed.
convert :: Int -> Int -> Double
-- Key step: conversion placement changes the operation performed.
convert a b = fromIntegral a / fromIntegral b

main :: IO ()
main = do
  print (convert 5 2)  -- expected: 2.5
  print (convert (-5) 2)  -- expected: -2.5
  print (convert 0 2)  -- expected: 0.0
  print (convert 1 4)  -- expected: 0.25
  print (convert 6 3)  -- expected: 2.0

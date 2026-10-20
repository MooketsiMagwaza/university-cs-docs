-- Title: Compare truncation before and after division
{-
QUESTION
Write convert :: Int -> Int -> (Double,Double). For nonzero b return
(fromIntegral (a `div` b), fromIntegral a / fromIntegral b).
-}

-- Read the question: Write convert with the specified numeric input and output types.
-- Plan: Apply the requested conversion at the point where its type is needed.
convert :: Int -> Int -> (Double,Double)
-- Key step: conversion placement changes the operation performed.
convert a b = (fromIntegral (a `div` b),fromIntegral a / fromIntegral b)

main :: IO ()
main = do
  print (convert 5 2)  -- expected: (2.0,2.5)
  print (convert (-5) 2)  -- expected: (-3.0,-2.5)
  print (convert 0 2)  -- expected: (0.0,0.0)
  print (convert 1 4)  -- expected: (0.0,0.25)
  print (convert 6 3)  -- expected: (2.0,2.0)

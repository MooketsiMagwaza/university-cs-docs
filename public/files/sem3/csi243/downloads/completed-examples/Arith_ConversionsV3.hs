-- Title: Widen an Int before squaring
{-
QUESTION
Write convert :: Int -> Integer. Use toInteger before squaring, so
the multiplication is performed on unbounded Integer values.
-}

-- Read the question: Write convert with the specified numeric input and output types.
-- Plan: Apply the requested conversion at the point where its type is needed.
convert :: Int -> Integer
-- Key step: conversion placement changes the operation performed.
convert n = toInteger n * toInteger n

main :: IO ()
main = do
  print (convert 0)  -- expected: 0
  print (convert 1)  -- expected: 1
  print (convert (-3))  -- expected: 9
  print (convert 12)  -- expected: 144
  print (convert 50000)  -- expected: 2500000000

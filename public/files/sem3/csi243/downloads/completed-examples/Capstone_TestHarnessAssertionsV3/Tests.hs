module Tests (checks) where

import TestSupport

-- Read the question: Keep test oracles independent of the implementation under test.

-- Plan: Deliberate failed checks test the harness itself; retain their labels.
checks :: [(String, Bool)]
checks =
  [ assertEqual "equal" (20 :: Int) 20
  , assertEqual "wrong-total" (20 :: Int) 18
  , assertTrue "empty-domain" (all even ([] :: [Int]))
  , assertApprox "near" 1.0 2.0 2.0
  , assertApprox "far" 1.0 2.0 4.0
  , assertApprox "negative-tolerance" (-1.0) 2.0 2.0
  ]

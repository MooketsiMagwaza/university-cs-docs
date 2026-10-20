module Tests (checks) where

import TestSupport
import Core
import Report

-- Read the question: Keep test oracles independent of the implementation under test.

-- Plan: Hand-calculate sums and counts before using the tested functions.
checks :: [(String, Bool)]
checks =
  [ assertEqual "empty" Nothing (meanOfMeans [])
  , assertEqual "all-missing" Nothing (pooledMean [[],[]])
  , assertEqual "equal-groups" (Just 50.0) (meanOfMeans [[80],[20]])
  , assertEqual "unequal-total" (120,3) (totals [[80],[20,20]])
  , assertEqual "pooled-unequal" (Just 35.0)
      (pooledMean [[80],[20,20,20]])
  , assertTrue "policies-differ" (policyGap [[80],[20,20]])
  ]

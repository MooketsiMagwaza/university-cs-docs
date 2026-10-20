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
  , assertEqual "equal-groups" (Just 50.0) (meanOfMeans [[60],[40]])
  , assertEqual "unequal-total" (140,3) (totals [[60],[40,40]])
  , assertEqual "pooled-unequal" (Just 45.0)
      (pooledMean [[60],[40,40,40]])
  , assertTrue "policies-differ" (policyGap [[60],[40,40]])
  ]

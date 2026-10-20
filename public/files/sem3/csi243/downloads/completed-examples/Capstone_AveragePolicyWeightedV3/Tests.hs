module Tests (checks) where

import TestSupport
import Core
import Report

-- Read the question: Keep test oracles independent of the implementation under test.

-- Plan: Independent expectations cover each validation partition and the cut-off.
checks :: [(String, Bool)]
checks =
  [ assertEqual "empty" (Left "invalid weights or marks") (weighted [])
  , assertEqual "fixture" (Right 60.0) (weighted [(40,2),(80,2)])
  , assertTrue "zero-weight" (not (validWeights [(50,0)]))
  , assertTrue "bad-mark" (not (validWeights [(101,1)]))
  , assertEqual "boundary" "pass" (decision [(60,1)])
  ]

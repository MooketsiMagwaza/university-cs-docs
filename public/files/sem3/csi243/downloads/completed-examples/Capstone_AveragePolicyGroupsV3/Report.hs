module Report (policyGap) where

import Core

-- Read the question: Detect the policy difference for the supplied exact-valued fixtures.

-- Plan: Compare policy results on finite inputs; this is not an approximation test.
policyGap :: [[Int]] -> Bool
policyGap groups = meanOfMeans groups /= pooledMean groups

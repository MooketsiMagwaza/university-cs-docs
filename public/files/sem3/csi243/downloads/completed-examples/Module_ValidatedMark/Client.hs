module Client (classify, acceptedValue) where

import qualified MarkCore as M

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.
-- Use only M-qualified names. The alias does not make unqualified names available.

classify :: Int -> Maybe Bool
classify n = case M.makeMark n of
  Nothing -> Nothing
  Just mark -> Just (M.passed mark)

acceptedValue :: Int -> Maybe Int
acceptedValue n = case M.makeMark n of
  Nothing -> Nothing
  Just mark -> Just (M.value mark)

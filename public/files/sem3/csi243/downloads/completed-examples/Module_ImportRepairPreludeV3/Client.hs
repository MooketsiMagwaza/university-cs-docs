module Client (report) where

import Prelude hiding (reverse)
import Calculator (reverse)

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.
-- Hiding removes the unqualified Prelude conflict; ordinary imports still allow a qualifier.

report :: Int -> (Int, Int)
report n = (reverse n, Calculator.reverse (n + 1))

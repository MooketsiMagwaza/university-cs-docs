module Report (summary, highNames) where

import Model
import Core

-- Read the question: Produce one-line summaries and the high-observation names.

-- Plan: Keep missing and invalid items visible.
summary :: Loan -> String
summary item@(Loan name _) = name ++ ": " ++ outcome item

-- Plan: Preserve input order and repeated identifiers, using a constructor pattern.
highNames :: [Loan] -> [String]
highNames items = [name | item@(Loan name _) <- items,
  outcome item == "high"]

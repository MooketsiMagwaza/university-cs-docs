module Report (summary, highNames) where

import Model
import Core

-- Read the question: Produce one-line summaries and the high-observation names.

-- Plan: Keep missing and invalid items visible.
summary :: Parcel -> String
summary item@(Parcel name _) = name ++ ": " ++ outcome item

-- Plan: Preserve input order and repeated identifiers, using a constructor pattern.
highNames :: [Parcel] -> [String]
highNames items = [name | item@(Parcel name _) <- items,
  outcome item == "high"]

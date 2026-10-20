# CSI243 Haskell files

Every question is a pair of files with the same name. The file in `completed-examples/` holds the question at the top, the solution with the thinking in comments, and a `main` that prints the results with the expected output in a comment after each call. The file in `starter-code/` holds the same question, the type signatures with `undefined` bodies, and the same `main`, so you can write the answer yourself and compare.

Files ending in `V2` or `V3` are variations: the same kind of question with different data, a different condition or a different type.

Run a file with `runghc FileName.hs`, or load it in GHCi with `ghci FileName.hs`.
For a bundle directory, run `runghc -iBundleName BundleName/Main.hs` from its parent folder.

## Lab 1: recursion

| File | Question |
| --- | --- |
| `Lab1_AddAndSubtract.hs` | Return the sum and difference as a pair |
| `Lab1_AddAndSubtractV2.hs` | Return the product and sum as a pair |
| `Lab1_AddAndSubtractV3.hs` | Return the quotient and remainder as a pair |
| `Lab1_Concatenate.hs` | Concatenate two lists of Int values |
| `Lab1_ConcatenateV2.hs` | Concatenate two lists of Char values |
| `Lab1_ConcatenateV3.hs` | Concatenate two lists of String values |
| `Lab1_DifferenceSequences.hs` | Subtract corresponding sequence terms |
| `Lab1_DifferenceSequencesV2.hs` | Take absolute differences of corresponding sequence terms |
| `Lab1_DifferenceSequencesV3.hs` | Test equality of corresponding sequence terms |
| `Lab1_Factorial.hs` | Calculate factorial recursively |
| `Lab1_FactorialV2.hs` | Multiply the first n positive odd integers |
| `Lab1_FactorialV3.hs` | Multiply the first n positive even integers |
| `Lab1_Fibonacci.hs` | Define Fibonacci numbers and dry run F5 |
| `Lab1_FibonacciV2.hs` | Define the Lucas sequence recursively |
| `Lab1_FibonacciV3.hs` | Define the Pell sequence recursively |
| `Lab1_IsIn.hs` | Test membership in a list of Int values |
| `Lab1_IsInV2.hs` | Test membership in a list of Char values |
| `Lab1_IsInV3.hs` | Test membership in a list of String values |
| `Lab1_Length.hs` | Count the elements of a list of Int values |
| `Lab1_LengthV2.hs` | Count the elements of a list of String values |
| `Lab1_LengthV3.hs` | Count the elements of a list of Bool values |
| `Lab1_Occurrences.hs` | Count occurrences in a list of Int values |
| `Lab1_OccurrencesV2.hs` | Count occurrences in a list of Char values |
| `Lab1_OccurrencesV3.hs` | Count occurrences in a list of String values |
| `Lab1_PairProjections.hs` | Extract components using tuple patterns |
| `Lab1_PairProjectionsV2.hs` | Extract components using tuple patterns |
| `Lab1_PairProjectionsV3.hs` | Extract components using tuple patterns |
| `Lab1_RangeSum.hs` | Sum all integers in an inclusive range |
| `Lab1_RangeSumV2.hs` | Multiply all integers in an inclusive range |
| `Lab1_RangeSumV3.hs` | Sum the squares in an inclusive integer range |
| `Lab1_StructuralInduction.hs` | Prove that the generated set is the positive multiples of 3 |
| `Lab1_StructuralInductionV2.hs` | Prove that the generated set is the positive multiples of 4 |
| `Lab1_StructuralInductionV3.hs` | Prove that the generated set is the positive multiples of 5 |
| `Lab1_SumFactorials.hs` | Sum factorials from zero to n |
| `Lab1_SumFactorialsV2.hs` | Sum factorials at even indices |
| `Lab1_SumFactorialsV3.hs` | Sum factorials at odd indices |
| `Lab1_SumFirst.hs` | Sum the first n terms of a sequence |
| `Lab1_SumFirstV2.hs` | Multiply the first n terms of a sequence |
| `Lab1_SumFirstV3.hs` | Sum the squares of the first n sequence terms |
| `Lab1_SumList.hs` | Sum the terms of a sequence recursively |
| `Lab1_SumListV2.hs` | Multiply the terms of a sequence recursively |
| `Lab1_SumListV3.hs` | Join a sequence of strings recursively |
| `Lab1_SumNumbers.hs` | Sum positive integers up to and including n |
| `Lab1_SumNumbersV2.hs` | Sum the squares from 1 up to n |
| `Lab1_SumNumbersV3.hs` | Sum the first n positive odd integers |
| `Lab1_SumSequences.hs` | Add corresponding sequence terms |
| `Lab1_SumSequencesV2.hs` | Multiply corresponding sequence terms |
| `Lab1_SumSequencesV3.hs` | Take the greater of corresponding sequence terms |
| `Lab1_Swap.hs` | Rearrange tuple components with a pattern |
| `Lab1_SwapV2.hs` | Rearrange tuple components with a pattern |
| `Lab1_SwapV3.hs` | Rearrange tuple components with a pattern |
| `Lab1_TupleArithmetic.hs` | Add the components of an integer pair |
| `Lab1_TupleArithmeticV2.hs` | Multiply the components of an integer pair |
| `Lab1_TupleArithmeticV3.hs` | Subtract the second component from the first |

## Lab 2: recursion on lists and functions

| File | Question |
| --- | --- |
| `Lab2_ConcatLists.hs` | Concatenate two lists of Int values |
| `Lab2_ConcatListsV2.hs` | Concatenate two lists of Char values |
| `Lab2_ConcatListsV3.hs` | Concatenate two lists of String values |
| `Lab2_ElementOccurs.hs` | Count occurrences in a list of Int values |
| `Lab2_ElementOccursV2.hs` | Count occurrences in a list of Char values |
| `Lab2_ElementOccursV3.hs` | Count occurrences in a list of String values |
| `Lab2_IsElementIn.hs` | Test membership in a list of Int values |
| `Lab2_IsElementInV2.hs` | Test membership in a list of Char values |
| `Lab2_IsElementInV3.hs` | Test membership in a list of String values |
| `Lab2_ListLength.hs` | Count the elements of a list of Int values |
| `Lab2_ListLengthV2.hs` | Count the elements of a list of String values |
| `Lab2_ListLengthV3.hs` | Count the elements of a list of Bool values |
| `Lab2_PowerNum.hs` | Raise an integer to a nonnegative integer power |
| `Lab2_PowerNumV2.hs` | Raise an exact Double to a nonnegative power |
| `Lab2_PowerNumV3.hs` | Raise one more than an integer to a power |
| `Lab2_SumNumbers.hs` | Sum whole numbers strictly below n |
| `Lab2_SumNumbersV2.hs` | Sum even whole numbers strictly below n |
| `Lab2_SumNumbersV3.hs` | Sum squares of whole numbers strictly below n |

## Lab 3: recursion continued

| File | Question |
| --- | --- |
| `Lab3_AtPosition.hs` | Return an index and its list element |
| `Lab3_AtPositionV2.hs` | Return an index and its string element |
| `Lab3_AtPositionV3.hs` | Look up a list element counting from the right |
| `Lab3_IsSorted.hs` | Check whether a list is sorted in descending order |
| `Lab3_IsSortedV2.hs` | Check whether a list is sorted in ascending order |
| `Lab3_IsSortedV3.hs` | Check whether a list is strictly descending |
| `Lab3_LargerY.hs` | Keep list elements larger than a threshold |
| `Lab3_LargerYV2.hs` | Keep list elements at least a threshold |
| `Lab3_LargerYV3.hs` | Keep strings shorter than a length threshold |
| `Lab3_PositiveNumbers.hs` | Select all positive integers recursively |
| `Lab3_PositiveNumbersV2.hs` | Select all nonnegative integers recursively |
| `Lab3_PositiveNumbersV3.hs` | Select all integers divisible by three recursively |

## Lab 4: pattern matching

| File | Question |
| --- | --- |
| `Lab4_AddSub.hs` | Return the sum and absolute difference of two integers. |
| `Lab4_AddSubV2.hs` | Return the product and absolute difference of two integers. |
| `Lab4_AddSubV3.hs` | Return the sum and signed difference of two Double values. |
| `Lab4_GradePointLetter.hs` | Convert exact grade points to letter grades. |
| `Lab4_GradePointLetterV2.hs` | Convert integer grade points to letter grades. |
| `Lab4_GradePointLetterV3.hs` | Convert exact grade points to recommendations. |
| `Lab4_GradePoints.hs` | Convert percentage scores to grade points. |
| `Lab4_GradePointsV2.hs` | Convert scores out of twenty to grade points. |
| `Lab4_GradePointsV3.hs` | Convert percentages using revised grade-point boundaries. |
| `Lab4_LetterGrade.hs` | Convert percentage scores to letter grades. |
| `Lab4_LetterGradeV2.hs` | Convert scores out of twenty to letter grades. |
| `Lab4_LetterGradeV3.hs` | Convert percentages using revised letter-grade boundaries. |
| `Lab4_Recommendation.hs` | Convert percentage scores to university recommendations. |
| `Lab4_RecommendationV2.hs` | Convert scores out of twenty to university recommendations. |
| `Lab4_RecommendationV3.hs` | Convert percentages using revised recommendation boundaries. |
| `Lab4_SwapIntegers.hs` | Swap the contents of a pair of integers. |
| `Lab4_SwapIntegersV2.hs` | Swap a pair of strings. |
| `Lab4_SwapIntegersV3.hs` | Rotate three integers one position to the left. |

## Lab 5: list comprehensions

| File | Question |
| --- | --- |
| `Lab5_Consonants.hs` | Produce the uppercase consonants of an alphabet. |
| `Lab5_ConsonantsV2.hs` | Produce uppercase vowels from a string. |
| `Lab5_ConsonantsV3.hs` | Produce lowercase consonants from uppercase letters. |
| `Lab5_MarkAverages.hs` | Find each student's test and assignment averages. |
| `Lab5_MarkAveragesV2.hs` | Find test and assignment totals for each student. |
| `Lab5_MarkAveragesV3.hs` | Average three tests and two assignments per student. |
| `Lab5_PythagoreanTriples.hs` | Generate primitive Pythagorean triples below a bound. |
| `Lab5_PythagoreanTriplesV2.hs` | Generate all Pythagorean triples up to a bound. |
| `Lab5_PythagoreanTriplesV3.hs` | Generate primitive triples with a bounded perimeter. |
| `Lab5_Squares.hs` | Square the odd integers in a list. |
| `Lab5_SquaresV2.hs` | Cube the even integers in a list. |
| `Lab5_SquaresV3.hs` | Square integers divisible by three. |

## Lab 6: polymorphism and overloading

| File | Question |
| --- | --- |
| `Lab6_LastElement.hs` | Return the last element of a nonempty list. |
| `Lab6_LastElementV2.hs` | Return the last element safely using Maybe. |
| `Lab6_LastElementV3.hs` | Return the penultimate element safely. |
| `Lab6_ReverseList.hs` | Reverse a list polymorphically. |
| `Lab6_ReverseListV2.hs` | Reverse every inner list without reordering the outer list. |
| `Lab6_ReverseListV3.hs` | Reverse only a prefix of a polymorphic list. |
| `Lab6_SwapElements.hs` | Swap the two elements of a polymorphic pair. |
| `Lab6_SwapElementsV2.hs` | Rotate three independently typed tuple elements. |
| `Lab6_SwapElementsV3.hs` | Swap the fields of every pair in a list. |
| `Lab6_TwoLists.hs` | Pair corresponding elements from two lists. |
| `Lab6_TwoListsV2.hs` | Build every combination of elements from two lists. |
| `Lab6_TwoListsV3.hs` | Combine corresponding elements of three lists. |

## Recursion on numbers

| File | Question |
| --- | --- |
| `Rec_DesignDigits.hs` | Sum decimal digits after sign normalisation |
| `Rec_DesignDigitsV2.hs` | Count decimal digits with a zero convention |
| `Rec_DesignDigitsV3.hs` | Reverse decimal digits with an accumulator |
| `Rec_DesignDigitsV4.hs` | Multiply decimal digits recursively |
| `Rec_DesignEuclid.hs` | Normalise signs in Euclid gcd |
| `Rec_DesignEuclidV2.hs` | Derive a safe least common multiple |
| `Rec_DesignEuclidV3.hs` | Recognise coprime signed integers |
| `Rec_DesignEuclidV4.hs` | Compare remainder and subtraction gcd |
| `Rec_DesignFibAcc.hs` | Compute Fibonacci numbers with two accumulators |
| `Rec_DesignFibAccV2.hs` | Change the accumulator seeds to Lucas numbers |
| `Rec_DesignFibAccV3.hs` | Change the recurrence to Pell numbers |
| `Rec_DesignFibAccV4.hs` | Return adjacent Fibonacci values together |
| `Rec_DesignMultiply.hs` | Multiply signed integers by repeated addition |
| `Rec_DesignMultiplyV2.hs` | Multiply with a signed accumulator |
| `Rec_DesignMultiplyV3.hs` | Build a signed cube from repeated addition |
| `Rec_DesignMultiplyV4.hs` | Compare repeated addition with multiplication |
| `Rec_DesignPower.hs` | Repair the zero case of recursive power |
| `Rec_DesignPowerV2.hs` | Design power by exponentiation by squaring |
| `Rec_DesignPowerV3.hs` | Extend recursive power to negative exponents |
| `Rec_DesignPowerV4.hs` | Compare linear and halving power algorithms |
| `Rec_DesignRange.hs` | Sum an inclusive range with reversed bounds empty |
| `Rec_DesignRangeV2.hs` | Sum a half-open range recursively |
| `Rec_DesignRangeV3.hs` | Sum squares over an inclusive signed range |
| `Rec_DesignRangeV4.hs` | Sum every second value in a signed range |
| `Rec_DesignSumFactorials.hs` | Sum factorials with an explicit invalid-input policy |
| `Rec_DesignSumFactorialsV2.hs` | Sum factorials below an exclusive bound |
| `Rec_DesignSumFactorialsV3.hs` | Sum factorials at even indices |
| `Rec_DesignSumFactorialsV4.hs` | Compare factorial sum with a running-factorial algorithm |
| `Rec_Digits.hs` | Sum decimal digits recursively |
| `Rec_DigitsV2.hs` | Count decimal digits recursively |
| `Rec_DigitsV3.hs` | Convert a non-negative integer to binary digits |
| `Rec_Factorial.hs` | Compute a factorial recursively |
| `Rec_FactorialV2.hs` | Compute a double factorial recursively |
| `Rec_FactorialV3.hs` | Sum factorials using recursion |
| `Rec_Fibonacci.hs` | Compute the Fibonacci recurrence |
| `Rec_FibonacciV2.hs` | Compute the Lucas recurrence |
| `Rec_FibonacciV3.hs` | Compute the shifted Fibonacci recurrence |
| `Rec_Gcd.hs` | Implement Euclid gcd with remainders |
| `Rec_GcdV2.hs` | Implement gcd by repeated subtraction |
| `Rec_GcdV3.hs` | Calculate lcm through a recursive gcd |
| `Rec_Power.hs` | Raise an integer to a non-negative power |
| `Rec_PowerV2.hs` | Compute exact powers of a fractional base |
| `Rec_PowerV3.hs` | Add a finite geometric series recursively |
| `Rec_SumTo.hs` | Sum the first n integers recursively |
| `Rec_SumToV2.hs` | Sum the first n squares recursively |
| `Rec_SumToV3.hs` | Sum the first n odd numbers recursively |

## Recursion on lists

| File | Question |
| --- | --- |
| `List_Append.hs` | Append two lists recursively |
| `List_AppendV2.hs` | Flatten nested lists with recursive append |
| `List_AppendV3.hs` | Interleave two lists recursively |
| `List_DesignExtrema.hs` | Find a safe maximum without a fabricated initial value |
| `List_DesignExtremaV2.hs` | Find a safe minimum of negative and positive integers |
| `List_DesignExtremaV3.hs` | Find the lexicographically greatest string safely |
| `List_DesignExtremaV4.hs` | Compute both extrema in one recursive traversal |
| `List_DesignIndex.hs` | Preserve an index when looking up integers |
| `List_DesignIndexV2.hs` | Preserve an index when looking up strings |
| `List_DesignIndexV3.hs` | Preserve an index when looking up Booleans |
| `List_DesignIndexV4.hs` | Find the penultimate element without partial functions |
| `List_DesignInterleave.hs` | Alternate two integer lists and retain the remainder |
| `List_DesignInterleaveV2.hs` | Append two lists using only cons |
| `List_DesignInterleaveV3.hs` | Add corresponding list values and stop at the shorter list |
| `List_DesignInterleaveV4.hs` | Interleave strings while retaining an unmatched suffix |
| `List_DesignPrefix.hs` | Take only the initial even run |
| `List_DesignPrefixV2.hs` | Drop only the initial negative run |
| `List_DesignPrefixV3.hs` | Split at the first value below a threshold |
| `List_DesignPrefixV4.hs` | Safely remove the last element recursively |
| `List_DesignScale.hs` | Scale every integer recursively |
| `List_DesignScaleV2.hs` | Sum even values using explicit recursion |
| `List_DesignScaleV3.hs` | Transform each string into its length recursively |
| `List_DesignScaleV4.hs` | Reverse integers with a growing accumulator |
| `List_DesignSorted.hs` | Check non-increasing order with duplicates allowed |
| `List_DesignSortedV2.hs` | Check strictly decreasing order |
| `List_DesignSortedV3.hs` | Check non-decreasing order |
| `List_DesignSortedV4.hs` | Check strictly increasing characters |
| `List_DesignTakeDrop.hs` | Take a bounded prefix with a negative-count policy |
| `List_DesignTakeDropV2.hs` | Drop a bounded prefix with a negative-count policy |
| `List_DesignTakeDropV3.hs` | Split once at a bounded position |
| `List_DesignTakeDropV4.hs` | Take a prefix from a list of strings |
| `List_DesignThreshold.hs` | Select values strictly above a threshold |
| `List_DesignThresholdV2.hs` | Select positive values while preserving order |
| `List_DesignThresholdV3.hs` | Count values at least a threshold |
| `List_DesignThresholdV4.hs` | Test recursive membership with short-circuiting |
| `List_InsertionSort.hs` | Implement ascending insertion sort |
| `List_InsertionSortV2.hs` | Implement descending insertion sort |
| `List_InsertionSortV3.hs` | Implement lexicographically ascending insertion sort |
| `List_LengthSum.hs` | Use list recursion to count its elements |
| `List_LengthSumV2.hs` | Use list recursion to sum its elements |
| `List_LengthSumV3.hs` | Use list recursion to multiply its elements |
| `List_Maximum.hs` | Find a safe maximum |
| `List_MaximumV2.hs` | Find a safe minimum |
| `List_MaximumV3.hs` | Find a safe lexicographically greatest string |
| `List_Membership.hs` | Search a list using recursive equality tests |
| `List_MembershipV2.hs` | Count occurrences recursively |
| `List_MembershipV3.hs` | Delete the first matching element recursively |
| `List_Merge.hs` | Merge two ascending lists |
| `List_MergeV2.hs` | Merge two descending lists |
| `List_MergeV3.hs` | Merge two lexicographically ascending lists |
| `List_Reverse.hs` | Reverse a list by structural recursion |
| `List_ReverseV2.hs` | Reverse a list using an accumulator |
| `List_ReverseV3.hs` | Recognise palindromes using a recursive reverse |
| `List_TakeDrop.hs` | Implement takeR recursively |
| `List_TakeDropV2.hs` | Implement dropR recursively |
| `List_TakeDropV3.hs` | Implement splitR recursively |

## Guards and pattern matching

| File | Question |
| --- | --- |
| `Guard_AsPattern.hs` | Duplicate a list head with an as-pattern |
| `Guard_AsPatternV2.hs` | Keep or remove a head using an as-pattern |
| `Guard_AsPatternV3.hs` | Retain a tuple while extracting its first field |
| `Guard_Grade.hs` | Classify marks using ordered guards |
| `Guard_GradeV2.hs` | Classify marks using ordered guards |
| `Guard_GradeV3.hs` | Classify marks using ordered guards |
| `Guard_LeapYear.hs` | Recognise Gregorian leap years |
| `Guard_LeapYearV2.hs` | Find the number of days in February |
| `Guard_LeapYearV3.hs` | Classify leap years and ordinary centuries |
| `Guard_Sign.hs` | Write a sign function with guards |
| `Guard_SignV2.hs` | Clamp an integer using guards |
| `Guard_SignV3.hs` | Compute an absolute difference with guards |
| `Guard_TupleCase.hs` | Classify a pair of Boolean flags with case |
| `Guard_TupleCaseV2.hs` | Use case on coordinate tests |
| `Guard_TupleCaseV3.hs` | Classify a pair using guarded case alternatives |

## List comprehensions

| File | Question |
| --- | --- |
| `Comp_Cartesian.hs` | Build a Cartesian product |
| `Comp_CartesianV2.hs` | Build a table of pairwise sums |
| `Comp_CartesianV3.hs` | Generate index pairs above the diagonal |
| `Comp_Factors.hs` | Find all positive factors |
| `Comp_FactorsV2.hs` | Find proper positive factors (excluding n) |
| `Comp_FactorsV3.hs` | Find even positive factors |
| `Comp_Filter.hs` | Select even numbers with a comprehension |
| `Comp_FilterV2.hs` | Select multiples of three with a comprehension |
| `Comp_FilterV3.hs` | Select valid passing marks with a comprehension |
| `Comp_Primes.hs` | Test primality with a factor comprehension |
| `Comp_PrimesV2.hs` | Generate primes up to a limit |
| `Comp_PrimesV3.hs` | Generate prime pairs separated by two |
| `Comp_Pythagorean.hs` | Generate all ordered-side triples |
| `Comp_PythagoreanV2.hs` | Generate primitive triples |
| `Comp_PythagoreanV3.hs` | Generate triples bounded by perimeter |
| `Comp_Squares.hs` | Generate squares with a comprehension |
| `Comp_SquaresV2.hs` | Generate cubes with a comprehension |
| `Comp_SquaresV3.hs` | Generate number-square pairs with a comprehension |
| `Comp_StringProcessing.hs` | Remove spaces with a string comprehension |
| `Comp_StringProcessingV2.hs` | Extract lowercase vowels with a comprehension |
| `Comp_StringProcessingV3.hs` | Extract names of passing students |

## Higher-order functions

| File | Question |
| --- | --- |
| `Hof_Composition.hs` | Compose filtering and summation |
| `Hof_CompositionV2.hs` | Compose mapping and a product |
| `Hof_CompositionV3.hs` | Compose word lengths and a sum |
| `Hof_DesignDotProduct.hs` | Combine paired values and fold their total |
| `Hof_DesignDotProductV2.hs` | Combine paired values and fold their total |
| `Hof_DesignDotProductV3.hs` | Combine paired values and fold their total |
| `Hof_DesignDotProductV4.hs` | Combine paired values and fold their total |
| `Hof_DesignFold.hs` | Design product, length, count and mapping folds |
| `Hof_DesignFoldV2.hs` | Design product, length, count and mapping folds |
| `Hof_DesignFoldV3.hs` | Design product, length, count and mapping folds |
| `Hof_DesignFoldV4.hs` | Design product, length, count and mapping folds |
| `Hof_DesignSumSq.hs` | Use foldr to total squares |
| `Hof_DesignSumSqV2.hs` | Use foldr to total cubes |
| `Hof_DesignSumSqV3.hs` | Use foldr to total fourth powers |
| `Hof_DesignSumSqV4.hs` | Use foldr to total doubled values |
| `Hof_Filter.hs` | Use filter to retain marks at least 50 |
| `Hof_FilterV2.hs` | Use filter to retain multiples of three |
| `Hof_FilterV3.hs` | Use filter to retain strings of length at least three |
| `Hof_Foldl.hs` | Compute left-associated subtraction with foldl |
| `Hof_FoldlV2.hs` | Compute a decimal digit value with foldl |
| `Hof_FoldlV3.hs` | Compute a reversed list with foldl |
| `Hof_Foldr.hs` | Compute right-associated subtraction |
| `Hof_FoldrV2.hs` | Compute a weighted right fold |
| `Hof_FoldrV3.hs` | Compute a product by right fold |
| `Hof_Lab04Integrated.hs` | Build a selection fold and a three-weight mark function |
| `Hof_Lab04IntegratedV2.hs` | Build a selection fold and a three-weight mark function |
| `Hof_Lab04IntegratedV3.hs` | Build a selection fold and a three-weight mark function |
| `Hof_Lab04IntegratedV4.hs` | Build a selection fold and a three-weight mark function |
| `Hof_Map.hs` | Use map to add three |
| `Hof_MapV2.hs` | Use map to square each value |
| `Hof_MapV3.hs` | Use map to subtract each value from ten |
| `Hof_Scanl.hs` | Produce running totals using scanl |
| `Hof_ScanlV2.hs` | Produce running products using scanl |
| `Hof_ScanlV3.hs` | Produce running differences using scanl |
| `Hof_TakeWhile.hs` | Take the initial run of values below four |
| `Hof_TakeWhileV2.hs` | Take the initial run of even values |
| `Hof_TakeWhileV3.hs` | Take the initial run of non-negative values |
| `Hof_ThreeListZip.hs` | Implement a recursive zip over three lists |
| `Hof_ThreeListZipV2.hs` | Implement a recursive zip over three lists |
| `Hof_ThreeListZipV3.hs` | Implement a recursive zip over three lists |
| `Hof_ThreeListZipV4.hs` | Implement a recursive zip over three lists |
| `Hof_WeightedMarks.hs` | Calculate weighted marks in the ratio 1:2 |
| `Hof_WeightedMarksV2.hs` | Calculate weighted marks in the ratio 2:1 |
| `Hof_WeightedMarksV3.hs` | Calculate weighted marks in the ratio 1:1 |
| `Hof_WeightedMarksV4.hs` | Calculate weighted marks in the ratio 1:3 |
| `Hof_ZipWith.hs` | Calculate pairwise sums using zipWith |
| `Hof_ZipWithV2.hs` | Calculate pairwise products using zipWith |
| `Hof_ZipWithV3.hs` | Calculate pairwise differences using zipWith |

## Custom data types

| File | Question |
| --- | --- |
| `Data_BinaryTree.hs` | Implement binary tree insert |
| `Data_BinaryTreeV2.hs` | Implement binary tree size |
| `Data_BinaryTreeV3.hs` | Implement binary tree inorder |
| `Data_Enumeration.hs` | Define next over an enumeration |
| `Data_EnumerationV2.hs` | Define weekend over an enumeration |
| `Data_EnumerationV3.hs` | Define promote over an enumeration |
| `Data_Expression.hs` | Evaluate an expression tree with addition and multiplication |
| `Data_ExpressionV2.hs` | Evaluate an expression tree with addition and subtraction |
| `Data_ExpressionV3.hs` | Evaluate an expression tree with addition and maximum |
| `Data_Optional.hs` | Write safeHead using a Maybe-like type |
| `Data_OptionalV2.hs` | Write divideSafe using a Maybe-like type |
| `Data_OptionalV3.hs` | Write mapOptional using a Maybe-like type |
| `Data_Records.hs` | Use a Student record to award |
| `Data_RecordsV2.hs` | Use a Student record to resetMark |
| `Data_RecordsV3.hs` | Use a Student record to passed |
| `Data_Shapes.hs` | Calculate area by matching shape constructors |
| `Data_ShapesV2.hs` | Calculate volume by matching shape constructors |
| `Data_ShapesV3.hs` | Calculate perimeter by matching shape constructors |

## Polymorphism and type classes

| File | Question |
| --- | --- |
| `Poly_EqInstance.hs` | Write Item equality using code fields |
| `Poly_EqInstanceV2.hs` | Write Item equality using label fields |
| `Poly_EqInstanceV3.hs` | Write Item equality using both fields |
| `Poly_Equality.hs` | Test whether all list elements are equal |
| `Poly_EqualityV2.hs` | Look up a key with an Eq constraint |
| `Poly_EqualityV3.hs` | Test whether two lists share an element |
| `Poly_Ordering.hs` | Order a pair with an Ord constraint |
| `Poly_OrderingV2.hs` | Check whether a polymorphic list is sorted |
| `Poly_OrderingV3.hs` | Find a safe polymorphic minimum |
| `Poly_Rearrange.hs` | Swap the components of a polymorphic pair |
| `Poly_RearrangeV2.hs` | Duplicate a value polymorphically |
| `Poly_RearrangeV3.hs` | Project first components polymorphically |
| `Poly_ShowInstance.hs` | Write Show by hand for Result |
| `Poly_ShowInstanceV2.hs` | Write Show by hand for Switch |
| `Poly_ShowInstanceV3.hs` | Write Show by hand for Direction |

## Lazy evaluation and infinite data

| File | Question |
| --- | --- |
| `Lazy_ConstantStream.hs` | Define the infinite ones stream |
| `Lazy_ConstantStreamV2.hs` | Define the infinite zeros stream |
| `Lazy_ConstantStreamV3.hs` | Define the infinite letters stream |
| `Lazy_Cycle.hs` | Use cycle for a repeating three-number pattern |
| `Lazy_CycleV2.hs` | Use cycle for alternating letters |
| `Lazy_CycleV3.hs` | Use cycle for alternating Boolean values |
| `Lazy_Fibonacci.hs` | Define a self-referential Fibonacci stream |
| `Lazy_FibonacciV2.hs` | Define a self-referential Lucas stream |
| `Lazy_FibonacciV3.hs` | Define a self-referential shifted Fibonacci stream |
| `Lazy_Iterate.hs` | Use iterate to produce powers of two |
| `Lazy_IterateV2.hs` | Use iterate to produce multiples of three |
| `Lazy_IterateV3.hs` | Use iterate to produce the recurrence n becomes 2*n+1 from zero |
| `Lazy_NumsFrom.hs` | Generate successive integers lazily |
| `Lazy_NumsFromV2.hs` | Generate integers increasing by two lazily |
| `Lazy_NumsFromV3.hs` | Generate successive descending integers lazily |
| `Lazy_Primes.hs` | Generate primes with a lazy sieve |
| `Lazy_PrimesV2.hs` | Observe prime gaps from a lazy sieve |
| `Lazy_PrimesV3.hs` | Generate twin primes from an infinite prime stream |

## Proofs about programs

| File | Question |
| --- | --- |
| `Proof_AppendMeasure.hs` | Prove that append preserves length combination |
| `Proof_AppendMeasureV2.hs` | Prove that append preserves sum combination |
| `Proof_AppendMeasureV3.hs` | Prove that append preserves product combination |
| `Proof_FactorialSpecification.hs` | Prove factorial equals its mathematical product specification |
| `Proof_FactorialSpecificationV2.hs` | Prove an inclusive range product including reversed bounds |
| `Proof_FactorialSpecificationV3.hs` | Prove double factorial against its descending product |
| `Proof_MapLaw.hs` | Prove mapping id leaves a list unchanged |
| `Proof_MapLawV2.hs` | Prove the map composition law |
| `Proof_MapLawV3.hs` | Prove mapping preserves list length |
| `Proof_NumberSum.hs` | Prove the formula for twice the sum to n |
| `Proof_NumberSumV2.hs` | Prove the formula for the sum of the first n odd numbers |
| `Proof_NumberSumV3.hs` | Prove the formula for the sum of the first n positive even numbers |
| `Proof_TreeMirror.hs` | Prove mirroring preserves tree size |
| `Proof_TreeMirrorV2.hs` | Prove mirroring preserves tree height |
| `Proof_TreeMirrorV3.hs` | Prove mirroring a tree twice restores it |

## Arithmetic and numeric operators

| File | Question |
| --- | --- |
| `Arith_Conversions.hs` | Convert before dividing |
| `Arith_ConversionsV2.hs` | Compare rounding rules on signed inputs |
| `Arith_ConversionsV3.hs` | Widen an Int before squaring |
| `Arith_ConversionsV4.hs` | Compare truncation before and after division |
| `Arith_DivisionPairs.hs` | Check the divMod reconstruction identity |
| `Arith_DivisionPairsV2.hs` | Check the quotRem reconstruction identity |
| `Arith_DivisionPairsV3.hs` | Check the divMod reconstruction identity |
| `Arith_DivisionPairsV4.hs` | Check the quotRem reconstruction identity |
| `Arith_ExponentChoice.hs` | Use integral exponents with ^ |
| `Arith_ExponentChoiceV2.hs` | Use signed integral exponents with ^^ |
| `Arith_ExponentChoiceV3.hs` | Check floating powers with a tolerance |
| `Arith_ExponentChoiceV4.hs` | Compare non-negative power operators |
| `Arith_ExpressionTrace.hs` | Trace arithmetic and Boolean precedence |
| `Arith_ExpressionTraceV2.hs` | Construct an expression from a price specification |
| `Arith_ExpressionTraceV3.hs` | Expose the negative repeated-addition counterexample |
| `Arith_ExpressionTraceV4.hs` | Distinguish subtract from negation |
| `Arith_FloatingDomain.hs` | Test absolute tolerance |
| `Arith_FloatingDomainV2.hs` | Test combined relative and absolute tolerance |
| `Arith_FloatingDomainV3.hs` | Classify floating domain results |
| `Arith_FloatingDomainV4.hs` | Check elementary functions at exact reference points |
| `Arith_SignedDivision.hs` | Apply div to signed integers |
| `Arith_SignedDivisionV2.hs` | Apply mod to signed integers |
| `Arith_SignedDivisionV3.hs` | Apply quot to signed integers |
| `Arith_SignedDivisionV4.hs` | Apply rem to signed integers |

## Type synonyms and aliases

| File | Question |
| --- | --- |
| `Alias_Assoc.hs` | Use a parameterised association-table alias |
| `Alias_AssocV2.hs` | Use a parameterised association-table alias |
| `Alias_AssocV3.hs` | Use a parameterised association-table alias |
| `Alias_AssocV4.hs` | Use a parameterised association-table alias |
| `Alias_Course.hs` | Model courses with a tuple synonym |
| `Alias_CourseV2.hs` | Model courses with a tuple synonym |
| `Alias_CourseV3.hs` | Model courses with a tuple synonym |
| `Alias_CourseV4.hs` | Model courses with a tuple synonym |
| `Alias_Expand.hs` | Expand aliases and implement a client function |
| `Alias_ExpandV2.hs` | Expand aliases and implement a client function |
| `Alias_ExpandV3.hs` | Expand aliases and implement a client function |
| `Alias_ExpandV4.hs` | Expand aliases and implement a client function |
| `Alias_ParserResult.hs` | Read parser results and preserve unconsumed input |
| `Alias_ParserResultV2.hs` | Read parser results and preserve unconsumed input |
| `Alias_ParserResultV3.hs` | Read parser results and preserve unconsumed input |
| `Alias_ParserResultV4.hs` | Read parser results and preserve unconsumed input |
| `Alias_Repair.hs` | Repair a type declaration and use its representation |
| `Alias_RepairV2.hs` | Repair a type declaration and use its representation |
| `Alias_RepairV3.hs` | Repair a type declaration and use its representation |
| `Alias_RepairV4.hs` | Repair a type declaration and use its representation |

## Characters and Data.Char

| File | Question |
| --- | --- |
| `Char_Classify.hs` | Compare character predicates |
| `Char_ClassifyV2.hs` | Compare character predicates |
| `Char_ClassifyV3.hs` | Compare character predicates |
| `Char_CodePoint.hs` | Convert characters to their Unicode code points |
| `Char_CodePointV2.hs` | Decode only ASCII code points |
| `Char_CodePointV3.hs` | Check chr bounds before testing ASCII membership |
| `Char_CountWhitespace.hs` | Count spaces or whitespace at the correct list level |
| `Char_CountWhitespaceV2.hs` | Count spaces or whitespace at the correct list level |
| `Char_CountWhitespaceV3.hs` | Count spaces or whitespace at the correct list level |
| `Char_DigitConversion.hs` | Convert a decimal digit only after validating it |
| `Char_DigitConversionV2.hs` | Convert decimal and hexadecimal digit characters |
| `Char_DigitConversionV3.hs` | Convert a bounded integer to a hexadecimal digit |
| `Char_EscapeOutput.hs` | Inspect escape sequences as character codes |
| `Char_EscapeOutputV2.hs` | Replace control characters with visible punctuation |
| `Char_EscapeOutputV3.hs` | Construct strings containing escapes from integer codes |
| `Char_Normalise.hs` | Normalise characters across text values |
| `Char_NormaliseV2.hs` | Normalise characters across text values |
| `Char_NormaliseV3.hs` | Normalise characters across text values |
| `Char_NormaliseV4.hs` | Normalise characters across text values |

## Text and list library functions

| File | Question |
| --- | --- |
| `TextList_JoinSeparator.hs` | Insert a character separator between characters |
| `TextList_JoinSeparatorV2.hs` | Join string fields with a string separator |
| `TextList_JoinSeparatorV3.hs` | Join lists of integers with a list separator |
| `TextList_JoinSeparatorV4.hs` | Concatenate text using the standard append operator |
| `TextList_LinesRoundTrip.hs` | Split lines while retaining interior empty lines |
| `TextList_LinesRoundTripV2.hs` | Join lines with a newline after every element |
| `TextList_LinesRoundTripV3.hs` | Normalise the final newline of nonempty text |
| `TextList_LinesRoundTripV4.hs` | Check when splitting and joining preserves exact text |
| `TextList_PrefixSuffixCheck.hs` | Test whether text ends with a requested suffix |
| `TextList_PrefixSuffixCheckV2.hs` | Remove a prefix safely without searching inside the text |
| `TextList_PrefixSuffixCheckV3.hs` | Test whether a pattern occurs anywhere in text |
| `TextList_SearchFirst.hs` | Find the first integer meeting a threshold |
| `TextList_SearchFirstV2.hs` | Find the index of the first even integer |
| `TextList_SearchFirstV3.hs` | Find the first position of a requested word |
| `TextList_SubstringBounds.hs` | Extract a bounded substring with zero-based positions |
| `TextList_SubstringBoundsV2.hs` | Extract a bounded slice of a string list |
| `TextList_SubstringBoundsV3.hs` | Extract text between two exclusive boundary positions |
| `TextList_TransposeRagged.hs` | Transpose integer rows using library ragged-list semantics |
| `TextList_TransposeRaggedV2.hs` | Read character rows as columns |
| `TextList_TransposeRaggedV3.hs` | Sum columns of a ragged integer matrix |
| `TextList_WordsNormalise.hs` | Normalise arbitrary whitespace between words |
| `TextList_WordsNormaliseV2.hs` | Split text into words and report their lengths |
| `TextList_WordsNormaliseV3.hs` | Join word tokens without preserving empty token boundaries |
| `TextList_WordsNormaliseV4.hs` | Compare literal space removal with whitespace normalisation |

## Sorting and merging

| File | Question |
| --- | --- |
| `Sort_ComparatorStable.hs` | Sort labelled scores by score with stable ties |
| `Sort_ComparatorStableV2.hs` | Sort strings by descending length with stable ties |
| `Sort_ComparatorStableV3.hs` | Repair sorting after uppercasing a list of strings |
| `Sort_FrequencyRuns.hs` | Build an ascending integer frequency table |
| `Sort_FrequencyRunsV2.hs` | Count words in lexicographic key order |
| `Sort_FrequencyRunsV3.hs` | Count consecutive runs without reordering integers |
| `Sort_InsertionOrdered.hs` | Implement stable ascending insertion sort on labelled scores |
| `Sort_InsertionOrderedV2.hs` | Implement descending insertion sort for integers |
| `Sort_InsertionOrderedV3.hs` | Implement insertion sort by ascending string length |
| `Sort_MergeStable.hs` | Implement stable merge sort on labelled scores |
| `Sort_MergeStableV2.hs` | Implement descending merge sort on integers |
| `Sort_MergeStableV3.hs` | Implement ascending lexicographic merge sort |

## Maps and sets

| File | Question |
| --- | --- |
| `Collections_MapModelOrdered.hs` | Model an ordered map with last duplicate key winning |
| `Collections_MapModelOrderedV2.hs` | Model an ordered integer-key map holding text |
| `Collections_MapModelOrderedV3.hs` | Model a map that sums values of duplicate keys |
| `Collections_SetModelAlgebra.hs` | Model integer sets and their algebra using sorted lists |
| `Collections_SetModelAlgebraV2.hs` | Model string sets with case-sensitive ordered traversal |
| `Collections_SetModelAlgebraV3.hs` | Model character sets with duplicate-free string results |

## Input and output

| File | Question |
| --- | --- |
| `IO_CharacterRemainder.hs` | Observe the remainder after getChar |
| `IO_CharacterRemainderV2.hs` | Consume a newline character before reading a line |
| `IO_CharacterRemainderV3.hs` | Read an integer action followed by a text action |
| `IO_FilePipelineScratch.hs` | Overwrite a scratch fixture then append a transformed report |
| `IO_FilePipelineScratchV2.hs` | Reverse scratch-file lines before appending a marker |
| `IO_FilePipelineScratchV3.hs` | Write scratch-file line lengths and append a zero |
| `IO_FormattedReportExact.hs` | Format an exact price report to two decimal places |
| `IO_FormattedReportExactV2.hs` | Format an exact mass report to two decimal places |
| `IO_FormattedReportExactV3.hs` | Format an exact balance report to two decimal places |
| `IO_PromptLoopValidate.hs` | Prompt until a nonnegative integer is entered |
| `IO_PromptLoopValidateV2.hs` | Prompt until an integer mark is in range |
| `IO_PromptLoopValidateV3.hs` | Prompt until a yes or no token is entered |
| `IO_SentinelCollect.hs` | Sum valid integers until a stop sentinel |
| `IO_SentinelCollectV2.hs` | Count words until a dot sentinel |
| `IO_SentinelCollectV3.hs` | Collect text in reverse order until END |
| `IO_SequenceActions.hs` | Execute a list of input actions with sequence |
| `IO_SequenceActionsV2.hs` | Collect mapM results and execute sequence_ output |
| `IO_SequenceActionsV3.hs` | Report two independent parse outcomes using bind |
| `IO_WholeInputTransform.hs` | Count complete input and report normalised words |
| `IO_WholeInputTransformV2.hs` | Transform every input line with interact |
| `IO_WholeInputTransformV3.hs` | Report the length of every line using a pure core |

## Functor, Applicative and dependent computation

| File | Question |
| --- | --- |
| `Context_Applicative.hs` | Lift addition over two independent Maybe values |
| `Context_ApplicativeV2.hs` | Lift a ternary total over independent Either values |
| `Context_ApplicativeV3.hs` | Compare fmap in list, Maybe and Either contexts |
| `Context_DependentBind.hs` | Choose a second Maybe calculation from the first result |
| `Context_DependentBindV2.hs` | Sequence dependent Either validation failures |
| `Context_DependentBindV3.hs` | Use list bind for dependent branching |
| `Context_DoRewrite.hs` | Compare do notation with its bind rewrite |
| `Context_DoRewriteV2.hs` | Compare do notation with its bind rewrite |
| `Context_DoRewriteV3.hs` | Compare do notation with its bind rewrite |
| `Context_EitherFib.hs` | Evaluate a checked Fibonacci recurrence |
| `Context_EitherFibV2.hs` | Evaluate a checked Lucas recurrence |
| `Context_EitherFibV3.hs` | Evaluate a checked shifted Fibonacci recurrence |
| `Context_FunctorTree.hs` | Map a custom Tree and check the Functor laws |
| `Context_FunctorTreeV2.hs` | Map a custom Tree and check the Functor laws |
| `Context_FunctorTreeV3.hs` | Map a custom Tree and check the Functor laws |
| `Context_ListApplication.hs` | Apply a list of functions in function-major order |
| `Context_ListApplicationV2.hs` | Form all differences with list Applicative |
| `Context_ListApplicationV3.hs` | Lift a ternary function over three lists |

## Complexity and recurrences

| File | Question |
| --- | --- |
| `Cost_Recurrence.hs` | Count unit-cost multiplications in recursive factorial |
| `Cost_RecurrenceV2.hs` | Compare naive Fibonacci calls with accumulator steps |
| `Cost_RecurrenceV3.hs` | Contrast decrementing, halving and split recurrences |
| `Cost_Reverse.hs` | Count copied cells in append-based reverse |
| `Cost_ReverseV2.hs` | Count cons operations in accumulator reverse |
| `Cost_ReverseV3.hs` | Compare reverse algorithms on lists of words |
| `Cost_Sharing.hs` | Model repeated versus shared invariant length work |
| `Cost_SharingV2.hs` | Count traversals of changing suffixes |
| `Cost_SharingV3.hs` | Compare repeated and incremental factorial sums |
| `Cost_Sort.hs` | Instrument insertion sort's key comparisons |
| `Cost_SortV2.hs` | Count comparisons when merging two sorted inputs |
| `Cost_SortV3.hs` | Count merge-sort comparisons with uneven splitting |
| `Cost_Space.hs` | Model stack depth, pending sums and output cells |
| `Cost_SpaceV2.hs` | Model retained input roots after a prefix is consumed |
| `Cost_SpaceV3.hs` | Count short-circuit search demand and result size |

## Contracts and specifications

| File | Question |
| --- | --- |
| `Spec_AmbiguousRequirement.hs` | Resolve zero divisor and ordering before implementing divisibility |
| `Spec_AmbiguousRequirementV2.hs` | Implement literal special-square and safe-index policies |
| `Spec_AmbiguousRequirementV3.hs` | State negative-range and exact pass-boundary policies |
| `Spec_ContractComposition.hs` | Compose mark validation with a narrower pass contract |
| `Spec_ContractCompositionV2.hs` | Check a nonzero precondition after squaring |
| `Spec_ContractCompositionV3.hs` | Check a digit contract after safe indexing |
| `Spec_Domain.hs` | Specify parity on the entire Integer domain |
| `Spec_DomainV2.hs` | Recognise ASCII digits with an explicit invalid subset |
| `Spec_DomainV3.hs` | Specify valid marks and disjoint grade boundaries |
| `Spec_ParadigmComparison.hs` | Compare a functional formula with an explicit state model |
| `Spec_ParadigmComparisonV2.hs` | Check reordering of independent pure calculations |
| `Spec_ParadigmComparisonV3.hs` | Classify concrete programming and markup descriptions |
| `Spec_Predicate.hs` | Translate only-if, equivalence and XOR truth tables |
| `Spec_PredicateV2.hs` | Check both De Morgan translations on Boolean lists |
| `Spec_PredicateV3.hs` | Distinguish implications about positivity and evenness |
| `Spec_Quantifier.hs` | Translate every, some and none over an integer domain |
| `Spec_QuantifierV2.hs` | Show that swapping universal and existential changes meaning |
| `Spec_QuantifierV3.hs` | Quantify over words including an empty word |

## Standard type classes

| File | Question |
| --- | --- |
| `Class_BoundedEnumRange.hs` | Enumerate a bounded type using both necessary constraints |
| `Class_BoundedEnumRangeV2.hs` | Obtain endpoints without requiring enumeration |
| `Class_BoundedEnumRangeV3.hs` | Take a bounded enumeration prefix with an explicit count policy |
| `Class_EnumBoundarySafe.hs` | Guard succ at the upper Boolean endpoint |
| `Class_EnumBoundarySafeV2.hs` | Guard pred at the lower Ordering endpoint |
| `Class_EnumBoundarySafeV3.hs` | Validate a Boolean enumeration index before toEnum |
| `Class_EnumBoundarySafeV4.hs` | Use Enum on Integer without assuming finite bounds |
| `Class_NumericHierarchyMethods.hs` | Choose Num, Integral and Fractional from the methods used |
| `Class_NumericHierarchyMethodsV2.hs` | Choose Real and RealFrac for conversion and decomposition |
| `Class_NumericHierarchyMethodsV3.hs` | Distinguish Floating methods from RealFloat classification |
| `Class_OrdLawConsistency.hs` | Check ordering and equality consistency on finite values |
| `Class_OrdLawConsistencyV2.hs` | Compare lexicographic keys and resolve ties |
| `Class_OrdLawConsistencyV3.hs` | Find generic bounds and check the min and max laws |
| `Class_ReadShowContext.hs` | Read integers safely and check a Show round trip |
| `Class_ReadShowContextV2.hs` | Read Boolean values with an explicit result context |
| `Class_ReadShowContextV3.hs` | Read integer lists and reject malformed list syntax |
| `Class_ReadShowContextV4.hs` | Read tuples using their field types as context |

## Operators and lexical rules

| File | Question |
| --- | --- |
| `Operator_ConstructorLists.hs` | Use a constructor operator in prefix and infix form |
| `Operator_ConstructorListsV2.hs` | Match a constructor operator and handle the empty list |
| `Operator_ConstructorListsV3.hs` | Use right-associated cons patterns to swap a list prefix |
| `Operator_DefinitionSymbolic.hs` | Define a symbolic difference operator |
| `Operator_DefinitionSymbolicV2.hs` | Define a decimal-combining symbolic operator |
| `Operator_DefinitionSymbolicV3.hs` | Define a non-commutative scaled difference operator |
| `Operator_FixityLeft.hs` | Trace left fixity for subtraction scaled by 1 |
| `Operator_FixityLeftV2.hs` | Trace left fixity for subtraction scaled by 2 |
| `Operator_FixityLeftV3.hs` | Trace left fixity for subtraction scaled by 3 |
| `Operator_FixityLeftV4.hs` | Trace left fixity for subtraction scaled by 4 |
| `Operator_FixityNonAssoc.hs` | Trace nonassoc fixity for subtraction scaled by 1 |
| `Operator_FixityNonAssocV2.hs` | Trace nonassoc fixity for subtraction scaled by 2 |
| `Operator_FixityNonAssocV3.hs` | Trace nonassoc fixity for subtraction scaled by 3 |
| `Operator_FixityNonAssocV4.hs` | Trace nonassoc fixity for subtraction scaled by 4 |
| `Operator_FixityRight.hs` | Trace right fixity for subtraction scaled by 1 |
| `Operator_FixityRightV2.hs` | Trace right fixity for subtraction scaled by 2 |
| `Operator_FixityRightV3.hs` | Trace right fixity for subtraction scaled by 3 |
| `Operator_FixityRightV4.hs` | Trace right fixity for subtraction scaled by 4 |
| `Operator_LegacyPatternOffset.hs` | Rewrite the legacy successor pattern using an ordinary guard |
| `Operator_LegacyPatternOffsetV2.hs` | Rewrite a legacy plus-two pattern with a boundary check |
| `Operator_LegacyPatternOffsetV3.hs` | Rewrite a legacy plus-three pattern without an extension |
| `Operator_LegacyPatternOffsetV4.hs` | Rewrite a legacy plus-four pattern and test its exact boundary |
| `Operator_NameRepairIdentifiers.hs` | Repair a capitalised function and retain an underscore binding |
| `Operator_NameRepairIdentifiersV2.hs` | Repair a reserved word and discard a tuple component |
| `Operator_NameRepairIdentifiersV3.hs` | Repair an underscore name and distinguish scope from type errors |

## Modules and abstraction

| File | Question |
| --- | --- |
| `Module_AbstractStack/` | Build and test an opaque stack of Int values |
| `Module_AbstractStackV2/` | Build and test an opaque stack of String values |
| `Module_AbstractStackV3/` | Build and test an opaque stack of Bool values |
| `Module_ExportGeometry/` | Export a geometry function while hiding its type synonym |
| `Module_ExportGeometryV2/` | Export a geometry function while hiding its type synonym |
| `Module_ExportGeometryV3/` | Export a geometry function while hiding its type synonym |
| `Module_ExportSignal/` | Use a signal interface with opaque |
| `Module_ExportSignalV2/` | Use a signal interface with all constructors |
| `Module_ExportSignalV3/` | Use a signal interface with only Go |
| `Module_GhciSessionDemand/` | Inspect demand on a lazy prefix of successive positive integers |
| `Module_GhciSessionDemandV2/` | Inspect demand on a lazy prefix of positive even integers |
| `Module_GhciSessionDemandV3/` | Inspect demand on a lazy prefix of alternating Boolean values |
| `Module_GhciSessionTrace/` | Trace a recursive integers total through separate modules |
| `Module_GhciSessionTraceV2/` | Trace a recursive squares total through separate modules |
| `Module_GhciSessionTraceV3/` | Trace a recursive cubes total through separate modules |
| `Module_ImportRepairCycle/` | Remove a module cycle by passing a transformation function |
| `Module_ImportRepairCycleV2/` | Remove a module cycle by passing a transformation function |
| `Module_ImportRepairCycleV3/` | Remove a module cycle by passing a transformation function |
| `Module_ImportRepairPrelude/` | Repair a Prelude clash and retain qualified access |
| `Module_ImportRepairPreludeV2/` | Repair a Prelude clash and retain qualified access |
| `Module_ImportRepairPreludeV3/` | Repair a Prelude clash and retain qualified access |
| `Module_ValidatedMark/` | Validate opaque marks from zero to 100 |
| `Module_ValidatedMarkV2/` | Validate opaque marks from zero to 20 |
| `Module_ValidatedMarkV3/` | Validate opaque marks from zero to 10 |

## First programs and the first lab

| File | Note |
| --- | --- |
| `FirstProgram.hs` | Introductory file; it may read from the keyboard, so run it in a terminal. |
| `FunctionPractice.hs` | Introductory file; it may read from the keyboard, so run it in a terminal. |
| `Lab01Solution.hs` | Introductory file; it may read from the keyboard, so run it in a terminal. |

# Calc Fee Library

A Solidity Library For Calculating Fees in Percentage

## Functions

`calcFee` - calculates the fee amount based on the fee in percentage from the original amount

`calcFeeWithPrecision` - calculates the fee amount based on the fee in percentage from the original amount with precision

`calcFinal` - calculates the amount left after subtracting the fees

`calcFeeWithPrecision` - calculates the amount left after subtracting the fees with precision

## Precision Table Guide

| Precision | Range                      |
|-----------|----------------------------|
| 0         | 100 = 100% and 1 = 1%      |
| 1         | 1000 = 100% and 1 = 0.1%   |
| 2         | 10000 = 100% and 1 = 0.01% |

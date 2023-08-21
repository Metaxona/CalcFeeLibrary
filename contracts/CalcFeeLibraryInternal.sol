// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;


/**
@title CalcFee Library
@custom:contract-name CalcFeeLibrary
@custom:version 0.0.1
@author Metaxona
@custom:author-url https://metaxona.com 
@custom:github https://github.com/metaxona
@notice This is a library used to aclculate the amount of fee in percentage
    to be deducted to the original amount.

    This can be used in cases where you attach a fee on a transaction to be taken
    as profit or to be burned. 
*/
library CalcFeeLibrary {
    
    error InvalidFeeError(string errorMsg);
    
    /**
    @custom:function-name calcFee
    @dev calculates the amount in fee

    `originalAmount` - the originalAmount to be converted
    `fee` - the amount of fee to be outputed in percent

    Limitations:
        when the result underflows it will return 0 
    */
    function calcFee(uint256 originalAmount, uint256 fee) internal pure returns(uint256) {

        uint256 denominator = 10 ** 2 ;
        
        if (fee > denominator) revert InvalidFeeError("Fee cannot be greater than 100");

        return  (originalAmount * fee) / denominator;
    }


    /**
    @custom:function-name calcFeeWithPrecision
    @dev calculates the precise amount in fee

    `originalAmount` - the originalAmount to be converted
    `fee` - the amount of fee to be outputed in percent based on the precision
    `precision` - number of decimal places between 0 and 1
    
    precision | range
    0         | 10_000 = 100% and 1 = 0.01%
    1         | 1_000 = 100% and 1 - 0.1%
    2         | 100 = 100% and 1 = 1%

    more precision means more zeroes between 0 and 1

    Limitations:
        when the result underflows it will return 0 
    */
    function calcFeeWithPrecision(uint256 originalAmount, uint256 fee, uint8 precision) internal pure returns(uint256) {
        
        uint256 denominator = (10 ** ( 2 + (1 * precision) ) );

        if (fee > denominator) revert InvalidFeeError("Fee cannot be greater than 10 ** (2 + (1 * precision) )");
                
        return (originalAmount * fee) / denominator;
    }

    /**
    @custom:function-name calcFinal
    @dev calculates the amount left after subtracting the fees

    `originalAmount` - the originalAmount to be converted
    `fee` - the amount of fee to be outputed in percent

    Limitations:
        when the result underflows nothing will be deducted
        fee cannot be greater than 100%
    */
    function calcFinal(uint256 originalAmount, uint256 fee) internal pure returns(uint256) {
        
        uint256 denominator = 10 ** 2 ;

        if (fee > denominator) revert InvalidFeeError("Fee cannot be greater than 100");

        return originalAmount - ( (originalAmount * fee) / denominator );
    }

    /**
    @custom:function-name calcFinalWithPrecision
    @dev calculates the amount left after subtracting the fees

    `originalAmount` - the originalAmount to be converted
    `fee` - the amount of fee in percent based on the precision to be deducted
    `precision` - number of decimal places between 0 and 1
    
    precision | range
    0         | 10_000 = 100% and 1 = 0.01%
    1         | 1_000 = 100% and 1 - 0.1%
    2         | 100 = 100% and 1 = 1%

    more precision means more zeroes between 0 and 1

    Limitations:
        when the result underflows nothing will be deducted
        fee cannot be greater than 100%
    */
    function calcFinalWithPrecision(uint256 originalAmount, uint256 fee, uint8 precision) internal pure returns(uint256) {
        
        uint256 denominator = (10 ** ( 2 + (1 * precision) ) );

        if (fee > denominator) revert InvalidFeeError("Fee cannot be greater than 10 ** (2 + (1 * precision) )");

        return originalAmount - ( (originalAmount * fee) / denominator );
    }

}
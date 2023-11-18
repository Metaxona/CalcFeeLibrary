import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

function calcFeePercentage(
  value: number,
  percent: number,
  precision: number
): number {
  return Math.round(value * (percent / 10 ** (2 + 1 * precision)));
}

function calcFinalPercentage(
  value: number,
  percent: number,
  precision: number
): number {
  return Math.round(value - value * (percent / 10 ** (2 + 1 * precision)));
}
    
describe("Calc Fee Library", function () {
  const testValues = [
    {
      originalAmount: 1000000,
      fee: 5,
      precision: 0,
      expectedFinalAmount: calcFinalPercentage(1000000, 5, 0),
      expectedFeeAmount: calcFeePercentage(1000000, 5, 0),
    },
    {
      originalAmount: 95215648,
      fee: 5,
      precision: 0,
      expectedFinalAmount: calcFinalPercentage(95215648, 5, 0),
      expectedFeeAmount: calcFeePercentage(95215648, 5, 0),
    },
    {
      originalAmount: 120654,
      fee: 50,
      precision: 0,
      expectedFinalAmount: calcFinalPercentage(120654, 50, 0),
      expectedFeeAmount: calcFeePercentage(120654, 50, 0),
    },
    {
      originalAmount: 95215648,
      fee: 100,
      precision: 0,
      expectedFinalAmount: calcFinalPercentage(95215648, 100, 0),
      expectedFeeAmount: calcFeePercentage(95215648, 100, 0),
    },
  ];

  const testValuesPrecise = [
    {
      originalAmount: 1000000,
      fee: 1,
      precision: 2,
      expectedFinalAmount: calcFinalPercentage(1000000, 1, 2),
      expectedFeeAmount: calcFeePercentage(1000000, 1, 2),
    },
    {
      originalAmount: 1000000,
      fee: 10,
      precision: 1,
      expectedFinalAmount: calcFinalPercentage(1000000, 10, 1),
      expectedFeeAmount: calcFeePercentage(1000000, 10, 1),
    },
    {
      originalAmount: 120654,
      fee: 50,
      precision: 0,
      expectedFinalAmount: calcFinalPercentage(120654, 50, 0),
      expectedFeeAmount: calcFeePercentage(120654, 50, 0),
    },
    {
      originalAmount: 95215648,
      fee: 100,
      precision: 0,
      expectedFinalAmount: calcFinalPercentage(95215648, 100, 0),
      expectedFeeAmount: calcFeePercentage(95215648, 100, 0),
    },
  ];

  const testCaseExpectZero = [
    {
      originalAmount: 10,
      fee: 1,
      precision: 0,
      expectedFinalAmount: calcFinalPercentage(95215648, 1, 0),
      expectedFeeAmount: 0,
    },
  ];

  const testCasePreciseExpectZero = [
    {
      originalAmount: 1000,
      fee: 1,
      precision: 2,
      expectedFinalAmount: calcFinalPercentage(95215648, 1, 2),
      expectedFeeAmount: 0,
    },
    {
      originalAmount: 1000,
      fee: 1,
      precision: 2,
      expectedFinalAmount: calcFinalPercentage(95215648, 1, 2),
      expectedFeeAmount: 0,
    },
    {
      originalAmount: 100,
      fee: 1,
      precision: 1,
      expectedFinalAmount: calcFinalPercentage(95215648, 1, 1),
      expectedFeeAmount: 0,
    },
  ];

  const testCaseExpectRevert = [
    {
      originalAmount: 100,
      fee: 101,
      precision: 0,
      expectedFinalAmount: calcFinalPercentage(95215648, 101, 1),
      expectedFeeAmount: calcFinalPercentage(95215648, 101, 1),
    },
    {
      originalAmount: 120654,
      fee: 101,
      precision: 0,
      expectedFinalAmount: calcFinalPercentage(120654, 101, 0),
      expectedFeeAmount: calcFeePercentage(120654, 101, 0),
    },
  ];

  const testCaseExpectRevertWithPrecision = [
    {
      originalAmount: 100,
      fee: 101,
      precision: 0,
      expectedFinalAmount: calcFinalPercentage(95215648, 101, 1),
      expectedFeeAmount: calcFinalPercentage(95215648, 101, 1),
    },
    {
      originalAmount: 120654,
      fee: 10001,
      precision: 2,
      expectedFinalAmount: calcFinalPercentage(120654, 10001, 2),
      expectedFeeAmount: calcFeePercentage(120654, 10001, 2),
    },
  ];

  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const CalcFeeLibrary = await ethers.getContractFactory("CalcFeeLibrary");
    const calcFeeLibrary = await CalcFeeLibrary.deploy();

    return { calcFeeLibrary, owner, otherAccount };
  }

  it("Should retrieve the fee amount", async function () {
    const { calcFeeLibrary, owner, otherAccount } = await loadFixture(
      deployFixture
    );

    for (const i of testValues) {
      expect(await calcFeeLibrary.calcFee(i.originalAmount, i.fee)).to.be.eq(
        i.expectedFeeAmount
      );
    }
  });

  it("Should retrieve the fee amount with precision", async function () {
    const { calcFeeLibrary, owner, otherAccount } = await loadFixture(
      deployFixture
    );

    for (const i of testValuesPrecise) {
      expect(
        await calcFeeLibrary.calcFeeWithPrecision(
          i.originalAmount,
          i.fee,
          i.precision
        )
      ).to.be.eq(i.expectedFeeAmount);
    }
  });

  it("Should retrieve the original amount minus the fee", async function () {
    const { calcFeeLibrary, owner, otherAccount } = await loadFixture(
      deployFixture
    );
    for (const i of testValues) {
      expect(await calcFeeLibrary.calcFinal(i.originalAmount, i.fee)).to.be.eq(
        i.expectedFinalAmount
      );
    }
  });

  it("Should retrieve the original amount minus the fee with precision", async function () {
    const { calcFeeLibrary, owner, otherAccount } = await loadFixture(
      deployFixture
    );
    for (const i of testValuesPrecise) {
      expect(
        await calcFeeLibrary.calcFinalWithPrecision(
          i.originalAmount,
          i.fee,
          i.precision
        )
      ).to.be.eq(i.expectedFinalAmount);
    }
  });

  it("Should return ZERO when retrieving the fee amount", async function () {
    const { calcFeeLibrary, owner, otherAccount } = await loadFixture(
      deployFixture
    );
    for (const i of testCaseExpectZero) {
      expect(await calcFeeLibrary.calcFee(i.originalAmount, i.fee)).to.be.eq(
        i.expectedFeeAmount
      );
    }
  });

  it("Should return ZERO when retrieving the fee amount with precision", async function () {
    const { calcFeeLibrary, owner, otherAccount } = await loadFixture(
      deployFixture
    );
    for (const i of testCasePreciseExpectZero) {
      expect(
        await calcFeeLibrary.calcFeeWithPrecision(
          i.originalAmount,
          i.fee,
          i.precision
        )
      ).to.be.eq(i.expectedFeeAmount);
    }
  });

  it("Should REVERT when retrieving the fee amount", async function () {
    const { calcFeeLibrary, owner, otherAccount } = await loadFixture(
      deployFixture
    );
    for (const i of testCaseExpectRevert) {
      await expect(calcFeeLibrary.calcFee(i.originalAmount, i.fee)).to.be
        .reverted;
    }
  });

  it("Should REVERT when retrieving the fee amount with precision", async function () {
    const { calcFeeLibrary, owner, otherAccount } = await loadFixture(
      deployFixture
    );
    for (const i of testCaseExpectRevertWithPrecision) {
      await expect(
        calcFeeLibrary.calcFeeWithPrecision(
          i.originalAmount,
          i.fee,
          i.precision
        )
      ).to.be.reverted;
    }
  });

  it("Should REVERT when retrieving the final amount", async function () {
    const { calcFeeLibrary, owner, otherAccount } = await loadFixture(
      deployFixture
    );
    for (const i of testCaseExpectRevert) {
      await expect(calcFeeLibrary.calcFinal(i.originalAmount, i.fee)).to.be
        .reverted;
    }
  });

  it("Should REVERT when retrieving the final amount with precision", async function () {
    const { calcFeeLibrary, owner, otherAccount } = await loadFixture(
      deployFixture
    );
    for (const i of testCaseExpectRevertWithPrecision) {
      await expect(
        calcFeeLibrary.calcFinalWithPrecision(
          i.originalAmount,
          i.fee,
          i.precision
        )
      ).to.be.reverted;
    }
  });
});

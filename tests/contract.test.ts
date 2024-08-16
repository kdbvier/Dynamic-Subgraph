import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { AddedLiquidity } from "../generated/schema"
import { AddedLiquidity as AddedLiquidityEvent } from "../generated/Contract/Contract"
import { handleAddedLiquidity } from "../src/contract"
import { createAddedLiquidityEvent } from "./contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let amountAdded = BigInt.fromI32(234)
    let pricePerToken = BigInt.fromI32(234)
    let newAddedLiquidityEvent = createAddedLiquidityEvent(
      amountAdded,
      pricePerToken
    )
    handleAddedLiquidity(newAddedLiquidityEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AddedLiquidity created and stored", () => {
    assert.entityCount("AddedLiquidity", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AddedLiquidity",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amountAdded",
      "234"
    )
    assert.fieldEquals(
      "AddedLiquidity",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "pricePerToken",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})

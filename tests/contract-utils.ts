import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  AddedLiquidity,
  MigratedManually,
  MigratedToUniswap,
  OwnershipTransferred,
  Paused,
  PurchasedTokens,
  SetLaunchTime,
  SetNewToken,
  SoldTokens,
  Unpaused
} from "../generated/Contract/Contract"

export function createAddedLiquidityEvent(
  amountAdded: BigInt,
  pricePerToken: BigInt
): AddedLiquidity {
  let addedLiquidityEvent = changetype<AddedLiquidity>(newMockEvent())

  addedLiquidityEvent.parameters = new Array()

  addedLiquidityEvent.parameters.push(
    new ethereum.EventParam(
      "amountAdded",
      ethereum.Value.fromUnsignedBigInt(amountAdded)
    )
  )
  addedLiquidityEvent.parameters.push(
    new ethereum.EventParam(
      "pricePerToken",
      ethereum.Value.fromUnsignedBigInt(pricePerToken)
    )
  )

  return addedLiquidityEvent
}

export function createMigratedManuallyEvent(
  token: Address,
  amountToken: BigInt,
  amountETH: BigInt
): MigratedManually {
  let migratedManuallyEvent = changetype<MigratedManually>(newMockEvent())

  migratedManuallyEvent.parameters = new Array()

  migratedManuallyEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  migratedManuallyEvent.parameters.push(
    new ethereum.EventParam(
      "amountToken",
      ethereum.Value.fromUnsignedBigInt(amountToken)
    )
  )
  migratedManuallyEvent.parameters.push(
    new ethereum.EventParam(
      "amountETH",
      ethereum.Value.fromUnsignedBigInt(amountETH)
    )
  )

  return migratedManuallyEvent
}

export function createMigratedToUniswapEvent(
  token: Address,
  pair: Address,
  amountToken: BigInt,
  amountETH: BigInt
): MigratedToUniswap {
  let migratedToUniswapEvent = changetype<MigratedToUniswap>(newMockEvent())

  migratedToUniswapEvent.parameters = new Array()

  migratedToUniswapEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  migratedToUniswapEvent.parameters.push(
    new ethereum.EventParam("pair", ethereum.Value.fromAddress(pair))
  )
  migratedToUniswapEvent.parameters.push(
    new ethereum.EventParam(
      "amountToken",
      ethereum.Value.fromUnsignedBigInt(amountToken)
    )
  )
  migratedToUniswapEvent.parameters.push(
    new ethereum.EventParam(
      "amountETH",
      ethereum.Value.fromUnsignedBigInt(amountETH)
    )
  )

  return migratedToUniswapEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createPurchasedTokensEvent(
  buyer: Address,
  amountSpent: BigInt,
  amountReceived: BigInt,
  openPriceInETH: BigInt,
  closePriceInETH: BigInt
): PurchasedTokens {
  let purchasedTokensEvent = changetype<PurchasedTokens>(newMockEvent())

  purchasedTokensEvent.parameters = new Array()

  purchasedTokensEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  purchasedTokensEvent.parameters.push(
    new ethereum.EventParam(
      "amountSpent",
      ethereum.Value.fromUnsignedBigInt(amountSpent)
    )
  )
  purchasedTokensEvent.parameters.push(
    new ethereum.EventParam(
      "amountReceived",
      ethereum.Value.fromUnsignedBigInt(amountReceived)
    )
  )
  purchasedTokensEvent.parameters.push(
    new ethereum.EventParam(
      "openPriceInETH",
      ethereum.Value.fromUnsignedBigInt(openPriceInETH)
    )
  )
  purchasedTokensEvent.parameters.push(
    new ethereum.EventParam(
      "closePriceInETH",
      ethereum.Value.fromUnsignedBigInt(closePriceInETH)
    )
  )

  return purchasedTokensEvent
}

export function createSetLaunchTimeEvent(launchTime: BigInt): SetLaunchTime {
  let setLaunchTimeEvent = changetype<SetLaunchTime>(newMockEvent())

  setLaunchTimeEvent.parameters = new Array()

  setLaunchTimeEvent.parameters.push(
    new ethereum.EventParam(
      "launchTime",
      ethereum.Value.fromUnsignedBigInt(launchTime)
    )
  )

  return setLaunchTimeEvent
}

export function createSetNewTokenEvent(token: Address): SetNewToken {
  let setNewTokenEvent = changetype<SetNewToken>(newMockEvent())

  setNewTokenEvent.parameters = new Array()

  setNewTokenEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )

  return setNewTokenEvent
}

export function createSoldTokensEvent(
  seller: Address,
  amountSpent: BigInt,
  amountReceived: BigInt,
  openPriceInETH: BigInt,
  closePriceInETH: BigInt
): SoldTokens {
  let soldTokensEvent = changetype<SoldTokens>(newMockEvent())

  soldTokensEvent.parameters = new Array()

  soldTokensEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  soldTokensEvent.parameters.push(
    new ethereum.EventParam(
      "amountSpent",
      ethereum.Value.fromUnsignedBigInt(amountSpent)
    )
  )
  soldTokensEvent.parameters.push(
    new ethereum.EventParam(
      "amountReceived",
      ethereum.Value.fromUnsignedBigInt(amountReceived)
    )
  )
  soldTokensEvent.parameters.push(
    new ethereum.EventParam(
      "openPriceInETH",
      ethereum.Value.fromUnsignedBigInt(openPriceInETH)
    )
  )
  soldTokensEvent.parameters.push(
    new ethereum.EventParam(
      "closePriceInETH",
      ethereum.Value.fromUnsignedBigInt(closePriceInETH)
    )
  )

  return soldTokensEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}

import {
  AddedLiquidity as AddedLiquidityEvent,
  MigratedManually as MigratedManuallyEvent,
  MigratedToUniswap as MigratedToUniswapEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Paused as PausedEvent,
  PurchasedTokens as PurchasedTokensEvent,
  SetLaunchTime as SetLaunchTimeEvent,
  SetNewToken as SetNewTokenEvent,
  SoldTokens as SoldTokensEvent,
  Unpaused as UnpausedEvent,
} from "../generated/OldIgniteFactory/oldIgniteFactory";
import { UniPool } from "../generated/templates";
import { BigInt, BigDecimal, Address } from "@graphprotocol/graph-ts";
import {
  PairDayData,
  PairHourData,
  PairMinsData,
  Swap,
  ERC20,
  UniEvent,
  Pool,
} from "../generated/schema";
const ZERO_BI = BigInt.fromString("0");
const ERC20_CONST = "0xd12443d642d021dc52d0af8f5f6191e02d1e9419";
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2".toLowerCase();

const updatePairMinData = (
  timestamp: number,
  amount: BigInt,
  price0: BigInt,
  price1: BigInt,
  erc20Address: string
): void => {
  const minId = Math.floor(timestamp / 60);
  const minStartTimestamp = minId * 60;

  let pairData = PairMinsData.load(erc20Address + ":" + minId.toString());
  if (pairData === null) {
    pairData = new PairMinsData(erc20Address + ":" + minId.toString());
    pairData.startUnix = minStartTimestamp as i32;
    pairData.open = price0;
    pairData.trades = 0;
    pairData.volume = ZERO_BI;
    pairData.high = price0;
    pairData.low = price0;
  }
  pairData.close = price1;
  pairData.erc20 = erc20Address;
  pairData.volume = pairData.volume.plus(amount);
  if (pairData.high.lt(price1)) {
    pairData.high = price1;
  }
  if (pairData.low.gt(price1)) {
    pairData.low = price1;
  }
  pairData.trades++;
  pairData.save();
};
const updatePairHourData = (
  timestamp: number,
  amount: BigInt,
  price0: BigInt,
  price1: BigInt,
  erc20Address: string
): void => {
  const hourId = Math.floor(timestamp / 3600);
  const hourStartTimestamp = hourId * 3600;
  let pairData = PairHourData.load(erc20Address + ":" + hourId.toString());
  if (pairData === null) {
    pairData = new PairHourData(erc20Address + ":" + hourId.toString());
    pairData.startUnix = hourStartTimestamp as i32;
    pairData.open = price0;
    pairData.trades = 0;
    pairData.volume = ZERO_BI;
    pairData.high = price0;
    pairData.low = price0;
  }
  pairData.close = price1;
  pairData.erc20 = erc20Address;
  pairData.volume = pairData.volume.plus(amount);
  if (pairData.high.lt(price1)) {
    pairData.high = price1;
  }
  if (pairData.low.gt(price1)) {
    pairData.low = price1;
  }
  pairData.trades++;
  pairData.save();
};

const updatePairDayData = (
  timestamp: number,
  amount: BigInt,
  price0: BigInt,
  price1: BigInt,
  erc20Address: string
): void => {
  const dayId = Math.floor(timestamp / 86400);
  const dayStartTimestamp = dayId * 86400;
  let pairData = PairDayData.load(erc20Address + ":" + dayId.toString());
  if (pairData === null) {
    pairData = new PairDayData(erc20Address + ":" + dayId.toString());
    pairData.startUnix = dayStartTimestamp as i32;
    pairData.open = price0;
    pairData.trades = 0;
    pairData.volume = ZERO_BI;
    pairData.high = price0;
    pairData.low = price0;
  }
  pairData.close = price1;
  pairData.erc20 = erc20Address;
  pairData.volume = pairData.volume.plus(amount);
  if (pairData.high.lt(price1)) {
    pairData.high = price1;
  }
  if (pairData.low.gt(price1)) {
    pairData.low = price1;
  }
  pairData.trades++;
  pairData.save();
};
export function handleAddedLiquidity(event: AddedLiquidityEvent): void {}

export function handleMigratedManually(event: MigratedManuallyEvent): void {}

export function handleMigratedToUniswap(event: MigratedToUniswapEvent): void {
  UniPool.create(
    Address.fromString(
      "0xB252697dDF0d2D979B1B262429b27f2254F16999".toLowerCase()
    )
  );
  let erc20Entity = ERC20.load(ERC20_CONST);
  let erc20Address = "null";
  if (erc20Entity !== null) {
    erc20Address = erc20Entity.address;
  }
  let pool_info = Pool.load(
    "0xB252697dDF0d2D979B1B262429b27f2254F16999".toLowerCase()
  );
  if (pool_info !== null) return;
  pool_info = new Pool(
    "0xB252697dDF0d2D979B1B262429b27f2254F16999".toLowerCase()
  );

  pool_info.token0 = WETH;
  pool_info.token1 = erc20Address;
  pool_info.reserve0 = event.params.amountETH;
  pool_info.reserve1 = event.params.amountToken;
  pool_info.save();
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {}

export function handlePaused(event: PausedEvent): void {}

export function handlePurchasedTokens(event: PurchasedTokensEvent): void {
  if(event.block.number.gt(BigInt.fromI32(17971863))) {  //17971863 is a block number when it was migrated on uniswap.
    return;
  }
  let entity = new Swap(event.block.timestamp.toString());
  let erc20Entity = ERC20.load(ERC20_CONST);
  let erc20Address = "null";
  if (erc20Entity !== null) {
    erc20Address = erc20Entity.address;
  }
  entity.amount0In = event.params.amountSpent;
  entity.amount1In = ZERO_BI;
  entity.amount0Out = ZERO_BI;
  entity.amount1Out = event.params.amountReceived;
  entity.amountEth = event.params.amountSpent;
  entity.sender = event.params.buyer.toHex();
  entity.timestamp = event.block.timestamp;
  entity.transaction = event.transaction.hash.toHex();
  entity.erc20 = erc20Address;
  entity.save();
  updatePairMinData(
    event.block.timestamp.toI32(),
    entity.amountEth,
    event.params.openPriceInETH,
    event.params.closePriceInETH,
    erc20Address
  );
  updatePairHourData(
    event.block.timestamp.toI32(),
    entity.amountEth,
    event.params.openPriceInETH,
    event.params.closePriceInETH,
    erc20Address
  );
  updatePairDayData(
    event.block.timestamp.toI32(),
    entity.amountEth,
    event.params.openPriceInETH,
    event.params.closePriceInETH,
    erc20Address
  );
}

export function handleSetLaunchTime(event: SetLaunchTimeEvent): void {}

export function handleSetNewToken(event: SetNewTokenEvent): void {
  if (
    event.params.token.toHex() != "0xd12443d642d021dc52d0af8f5f6191e02d1e9419"
  )
    return;
  let entity = ERC20.load(event.params.token.toHex());
  if (entity === null) {
    entity = new ERC20(event.params.token.toHex());
  }
  entity.address = event.params.token.toHex();
  entity.name = "Ignite";
  entity.decimals = 18;
  entity.symbol = "IGNT";
  entity.save();
}

export function handleSoldTokens(event: SoldTokensEvent): void {
  if(event.block.number.gt(BigInt.fromI32(17971863))) {  //17971863 is a block number when it was migrated on uniswap.
    return;
  }
  let entity = new Swap(event.block.timestamp.toString());
  let erc20Entity = ERC20.load(ERC20_CONST);
  let erc20Address = "null";
  if (erc20Entity !== null) {
    erc20Address = erc20Entity.address;
  }
  entity.amount0In = ZERO_BI;
  entity.amount1In = event.params.amountSpent;
  entity.amount0Out = event.params.amountReceived;
  entity.amount1Out = ZERO_BI;
  entity.amountEth = event.params.amountReceived;
  entity.sender = event.params.seller.toHex();
  entity.timestamp = event.block.timestamp;
  entity.transaction = event.transaction.hash.toHex();
  entity.erc20 = erc20Address;
  entity.save();
  updatePairMinData(
    event.block.timestamp.toI32(),
    entity.amountEth,
    event.params.openPriceInETH,
    event.params.closePriceInETH,
    erc20Address
  );
  updatePairHourData(
    event.block.timestamp.toI32(),
    entity.amountEth,
    event.params.openPriceInETH,
    event.params.closePriceInETH,
    erc20Address
  );
  updatePairDayData(
    event.block.timestamp.toI32(),
    entity.amountEth,
    event.params.openPriceInETH,
    event.params.closePriceInETH,
    erc20Address
  );
}

export function handleUnpaused(event: UnpausedEvent): void {}

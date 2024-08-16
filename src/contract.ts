import {
  AddedLiquidity as AddedLiquidityEvent,
  MigratedManually as MigratedManuallyEvent,
  MigratedToUniswap as MigratedToUniswapEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PurchasedTokens as PurchasedTokensEvent,
  SetLaunchTime as SetLaunchTimeEvent,
  SoldTokens as SoldTokensEvent,
  CreatedNewPool as CreatedNewPoolEvent,
} from "../generated/IgniteFactory/igniteFactory";
import {
  Approval as ApprovalEvent,
  Burn as BurnEvent,
  Mint as MintEvent,
  Swap as SwapEvent,
  Sync as SyncEvent,
  Transfer as TransferEvent,
} from "../generated/templates/UniPool/uniPool";
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
  TestEvent,
} from "../generated/schema";
const ZERO_BI = BigInt.fromString("0");
const TEN_BI = BigInt.fromString("10");
let ONE_BI = BigInt.fromI32(1);
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2".toLowerCase();
const ETHDecimal = BigInt.fromString("1000000000000000000");

export function exponentToBigDecimal(decimals: number): BigInt {
  let bd = BigInt.fromString("1");
  for (let i = 0; i < decimals; i = i + 1) {
    bd = bd.times(BigInt.fromString("10"));
  }
  return bd;
}

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
  UniPool.create(event.params.pair);
  let pool_info = Pool.load(event.params.pair.toHex());
  if (pool_info !== null) return;
  pool_info = new Pool(event.params.pair.toHex());

  pool_info.token0 = WETH;
  pool_info.token1 = event.params.token.toHex();
  pool_info.reserve0 = event.params.amountETH;
  pool_info.reserve1 = event.params.amountToken;
  pool_info.save();
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {}

export function handlePurchasedTokens(event: PurchasedTokensEvent): void {
  let entity = new Swap(event.block.timestamp.toString());
  let erc20Entity = ERC20.load(event.params.token.toHex());
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

export function handleCreatedNewPool(event: CreatedNewPoolEvent): void {
  let testEvent = new TestEvent(event.block.timestamp.toString());
  testEvent.pair = event.params.name.toString();
  testEvent.save();
  let entity = ERC20.load(event.params.token.toHex());
  if (entity === null) {
    entity = new ERC20(event.params.token.toHex());
  }
  entity.address = event.params.token.toHex();
  entity.decimals = event.params.decimals.toI32();
  entity.name = event.params.name;
  entity.symbol = event.params.symbol;
  entity.save();
}

export function handleSoldTokens(event: SoldTokensEvent): void {
  let entity = new Swap(event.block.timestamp.toString());
  let erc20Entity = ERC20.load(event.params.token.toHex());
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

// Uniswap pool
export function handleSwap(event: SwapEvent): void {
  let pool_info = Pool.load(event.address.toHex());
  if (pool_info == null) return;
  let entity = new Swap(event.block.timestamp.toString());
  let erc20Entity = ERC20.load(pool_info.token1);
  if (!erc20Entity) return;
  const tokenDecimal = exponentToBigDecimal(erc20Entity.decimals);
  entity.erc20 = pool_info.token1;
  entity.sender = event.params.to.toHex();
  entity.timestamp = event.block.timestamp;
  entity.transaction = event.transaction.hash.toHex();
  let amountEth = ZERO_BI;
  let amountToken = ZERO_BI;
  let reserve0 = pool_info.reserve0;
  let reserve1 = pool_info.reserve1;
  if (pool_info.token0 > pool_info.token1) {
    amountEth = event.params.amount1In.plus(event.params.amount1Out);
    amountToken = event.params.amount0In.plus(event.params.amount0Out);
    entity.amountEth = amountEth;
    if (event.params.amount0In == ZERO_BI) {
      reserve0 = reserve0.minus(amountEth); //value before swap
      reserve1 = reserve1.plus(amountToken); //value before swap
      entity.amount0In = amountEth;
      entity.amount0Out = ZERO_BI;
      entity.amount1In = ZERO_BI;
      entity.amount1Out = amountToken;
    } else {
      reserve0 = reserve0.plus(amountEth); //value before swap
      reserve1 = reserve1.minus(amountToken); //value before swap
      entity.amount0In = ZERO_BI;
      entity.amount0Out = amountEth;
      entity.amount1In = amountToken;
      entity.amount1Out = ZERO_BI;
    }
  } else {
    amountEth = event.params.amount0In.plus(event.params.amount0Out);
    amountToken = event.params.amount1In.plus(event.params.amount1Out);
    entity.amountEth = amountEth;
    if (event.params.amount1In == ZERO_BI) {
      reserve0 = reserve0.minus(amountEth); //value before swap
      reserve1 = reserve1.plus(amountToken); //value before swap
      entity.amount0In = amountEth;
      entity.amount0Out = ZERO_BI;
      entity.amount1In = ZERO_BI;
      entity.amount1Out = amountToken;
    } else {
      reserve0 = reserve0.plus(amountEth); //value before swap
      reserve1 = reserve1.minus(amountToken); //value before swap
      entity.amount0In = ZERO_BI;
      entity.amount0Out = amountEth;
      entity.amount1In = amountToken;
      entity.amount1Out = ZERO_BI;
    }
  }
  entity.save();
  updatePairMinData(
    event.block.timestamp.toI32(),
    amountEth,
    reserve0.times(tokenDecimal).div(reserve1),
    pool_info.reserve0.times(tokenDecimal).div(pool_info.reserve1), //as it shows the result value after the swap, it should be the close price.
    pool_info.token1
  );
  updatePairHourData(
    event.block.timestamp.toI32(),
    amountEth,
    reserve0.times(tokenDecimal).div(reserve1),
    pool_info.reserve0.times(tokenDecimal).div(pool_info.reserve1), //as it shows the result value after the swap, it should be the close price.
    pool_info.token1
  );
  updatePairDayData(
    event.block.timestamp.toI32(),
    amountEth,
    reserve0.times(tokenDecimal).div(reserve1),
    pool_info.reserve0.times(tokenDecimal).div(pool_info.reserve1), //as it shows the result value after the swap, it should be the close price.
    pool_info.token1
  );
}
export function handleTransfer(event: TransferEvent): void {}
export function handleSync(event: SyncEvent): void {
  let pool_info = Pool.load(event.address.toHex());
  if (pool_info == null) return;
  if (pool_info.token0 > pool_info.token1) {
    pool_info.reserve0 = event.params.reserve1;
    pool_info.reserve1 = event.params.reserve0;
  } else {
    pool_info.reserve0 = event.params.reserve0;
    pool_info.reserve1 = event.params.reserve1;
  }
  pool_info.save();
}
export function handleApproval(event: ApprovalEvent): void {}

export function handleBurn(event: BurnEvent): void {}

export function handleMint(event: MintEvent): void {}

import React from "react";
import { useSort } from "../hooks/useSort";
import { Link } from "react-router-dom";
import { TrendingTokens } from "../types/trending-tokens";
import { Sparklines, SparklinesLine, SparklinesNormalBand } from "react-sparklines";

type TableHeader = {
  dataId: keyof TrendingTokens;
  name: string;
};

type TokenTableProps = {
  trendingTokens: TrendingTokens[];
};

const sharedStyles = {
  headItem: "py-3 px-6 flex items-center gap-2",
  bodyItem: "h-[calc(70vh/10)] px-6 ",
};

const TokenTable: React.FC<TokenTableProps> = ({ trendingTokens }) => {
  const { sortedItems, sortIt, getClassForSortedColumn } = useSort(trendingTokens);

  const tableHeader: TableHeader[] = [
    { dataId: "id", name: "#" },
    { dataId: "name", name: "Coin" },
    { dataId: "symbol", name: "" },
    { dataId: "price", name: "Price" },
    { dataId: "priceChange24h", name: "24h" },
    { dataId: "priceChange7d", name: "7d" },
    { dataId: "volume24h", name: "24h Volume" },
    { dataId: "mktCap", name: "Mkt Cap" },
  ];

  return (
    <div className='overflow-x-auto rounded-xl'>
      <table className='w-full text-sm text-left text-gray-500 h-[70px] dark:text-gray-200'>
        <thead className='text-xs text-gray-700 dark:text-gray-50 bg-slate-200 dark:bg-gray-700'>
          <tr>
            {tableHeader.map((header, idx) => (
              <th key={idx}>
                <button
                  aria-label={`sort by ${header.dataId}`}
                  className={`${sharedStyles.headItem} ${getClassForSortedColumn(header.dataId)} `}
                  onClick={() => sortIt(header.dataId)}>
                  {header.name}
                </button>
              </th>
            ))}
            <th className={sharedStyles.headItem}>Last 7 days</th>
          </tr>
        </thead>

        <tbody className='bg-slate-100 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700'>
          {sortedItems &&
            sortedItems.map((token, index) => (
              <tr key={index}>
                <td className={sharedStyles.bodyItem}>{token.id}</td>
                <td className={sharedStyles.bodyItem}>
                  <span className='flex items-center gap-2'>
                    <img src={token.image} alt={`${token.name}-logo`} width={25} height={25} />
                    <span>{token.name}</span>
                  </span>
                </td>
                <td className={sharedStyles.bodyItem}>{token.symbol}</td>
                <td className={sharedStyles.bodyItem}>{token.displayPrice}</td>
                <td
                  className={`${sharedStyles.bodyItem} font-semibold ${
                    token.priceChange24h > 0 ? "text-[#57bd0d]" : "text-[#ed5565]"
                  }`}>
                  {token.displayPriceChange24h}
                </td>
                <td
                  className={`${sharedStyles.bodyItem} font-semibold ${
                    token.priceChange7d > 0 ? "text-[#57bd0d]" : "text-[#ed5565]"
                  }`}>
                  {token.displayPriceChange7d}
                </td>
                <td className={sharedStyles.bodyItem}>{token.displayVolume24h}</td>
                <td className={sharedStyles.bodyItem}>{token.displayMktCap}</td>
                <td className={sharedStyles.bodyItem}>
                  <Link to={token.route}>{renderSparkline(token.sparkline)}</Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

const renderSparkline = (data: number[]): React.ReactNode => {
  return (
    <div className='w-24 md:w-40'>
      <Sparklines data={data}>
        <SparklinesLine
          style={{ fill: "none", strokeWidth: 3 }}
          color={data[0] < data[data.length - 1] ? "#57bd0d" : "#ed5565"}
        />
      </Sparklines>
    </div>
  );
};

export default React.memo(TokenTable);

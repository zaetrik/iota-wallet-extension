/** @jsxImportSource theme-ui */

import { ThemeUICSSObject } from '@theme-ui/css';
import { useState } from 'react';
import {
  getNextUnitLevel,
  getUnitShorthandNotation,
  iotasToUnit,
  IOTAUnit,
} from '../utils/iota';

const IOTABalance = ({
  balance,
  styles = {},
}: {
  balance: number;
  styles?: ThemeUICSSObject;
}) => {
  const [iotaUnit, setIOTAUnit] = useState<IOTAUnit>(IOTAUnit.MIOTA);
  return (
    <p
      sx={{ fontSize: 5, cursor: 'pointer', userSelect: 'none', ...styles }}
      onClick={() => setIOTAUnit(getNextUnitLevel(iotaUnit))}
    >
      {iotasToUnit(balance, iotaUnit).toLocaleString(undefined, {
        maximumFractionDigits: 4,
      })}{' '}
      {getUnitShorthandNotation(iotaUnit)}
    </p>
  );
};

export default IOTABalance;

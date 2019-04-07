import Diff from './diff';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import round from 'lodash/round';
import {formatMoney} from '../utils/format';

export function FinancialHeaders() {
  return (
    <Fragment>
      <TableCell align="right">Initial</TableCell>
      <TableCell align="right">Current</TableCell>
      <TableCell align="right">Cash</TableCell>
      <TableCell align="right">Diff</TableCell>
      <TableCell align="right">
        <Tooltip title="Return on investment">
          <span>ROI</span>
        </Tooltip>
      </TableCell>
    </Fragment>
  );
}

function FinancialCell(props) {
  return (
    <TableCell align="right">
      {props.bold ? <strong>{props.children}</strong> : props.children}
    </TableCell>
  );
}

FinancialCell.propTypes = {
  bold: PropTypes.bool,
  children: PropTypes.node.isRequired
};

export default function FinancialCells(props) {
  const roi = (props.diff / props.initialValue) * 100;
  return [
    formatMoney(props.initialValue),
    formatMoney(props.currentValue),
    formatMoney(props.currentCash),
    <Diff key="diff" value={props.diff} />,
    `${round(roi, 2)} %`
  ].map((value, index) => (
    <FinancialCell key={index} bold={props.bold}>
      {value}
    </FinancialCell>
  ));
}

FinancialCells.propTypes = {
  bold: PropTypes.bool,
  currentValue: PropTypes.number.isRequired,
  currentCash: PropTypes.number.isRequired,
  initialValue: PropTypes.number.isRequired,
  diff: PropTypes.number.isRequired
};

import Diff from './diff';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import styled from '@emotion/styled';
import {StaticQuery, graphql} from 'gatsby';
import {ratingToCost} from '../utils/get-player-cost';
import {withTheme} from '@material-ui/core/styles';

const StyledMarquee = withTheme()(
  styled.marquee(({theme}) => ({
    display: 'block',
    margin: 0,
    padding: `${8}px 0`,
    color: 'white',
    backgroundColor: theme.palette.action.active
  }))
);

const StyledText = styled(Typography)({
  display: 'inline',
  marginRight: 32
});

export default function Ticker() {
  return (
    <StaticQuery
      query={graphql`
        {
          superteam {
            players {
              ...PlayerFragment
            }
          }
        }
      `}
      render={data => (
        <StyledMarquee behavior="slide">
          <StyledText color="inherit" variant="button">
            Recent value changes
          </StyledText>
          {data.superteam.players
            .map(({statistics, ...player}) => {
              if (statistics.length < 2) {
                return player;
              }

              const [
                {rating: currentRating},
                {rating: prevRating}
              ] = statistics;
              const currentCost = ratingToCost(currentRating);
              const prevCost = ratingToCost(prevRating);
              return {
                ...player,
                change: currentCost - prevCost
              };
            })
            .filter(player => player.change)
            .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
            .map(player => (
              <StyledText component="span" color="inherit" key={player.id}>
                {player.ign}: <Diff value={player.change} />
              </StyledText>
            ))}
        </StyledMarquee>
      )}
    />
  );
}

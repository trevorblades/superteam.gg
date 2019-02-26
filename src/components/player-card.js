import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import EmojiFlag from './emoji-flag';
import NumberText from './number-text';
import PropTypes from 'prop-types';
import React, {Fragment, PureComponent} from 'react';
import Typography from '@material-ui/core/Typography';
import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';
import chroma from 'chroma-js';
import deepPurple from '@material-ui/core/colors/deepPurple';
import green from '@material-ui/core/colors/green';
import mapProps from 'recompose/mapProps';
import styled from '@emotion/styled';
import theme from '@trevorblades/mui-theme';
import withProps from 'recompose/withProps';
import {cover, transparentize} from 'polished';

export const CARD_ASPECT_RATIO = 3 / 4;

function getGradient(color, direction) {
  return `linear-gradient(${[direction, color, transparentize(1, color)]})`;
}

const StyledCard = styled(Card)({
  paddingTop: `${(1 / CARD_ASPECT_RATIO) * 100}%`,
  position: 'relative'
});

const TeamLogo = styled.div(cover(), {
  backgroundSize: '150%',
  backgroundPosition: 'center',
  mixBlendMode: 'luminosity',
  opacity: 0.5
});

const StyledCardActionArea = styled(CardActionArea)(cover(), {
  display: 'flex',
  alignItems: 'stretch',
  flexDirection: 'column'
});

const Status = styled.div({
  padding: `${12}px ${16}px`,
  color: 'white',
  backgroundImage: `linear-gradient(${[
    'to right',
    transparentize(0.25, 'black'),
    transparentize(0.5, 'black')
  ]})`
});

const MiniStatus = styled(Typography)({
  margin: 4
});

const Statistics = styled.div({
  padding: 16
});

const Statistic = mapProps(props => ({
  variant: 'subtitle2',
  children: `${props.title}: ${props.value}`
}))(Typography);

const PlayerImage = styled.img(props => ({
  height: '100%',
  pointerEvents: 'none',
  position: 'absolute',
  top: 0,
  left: props.centered ? '50%' : 0,
  transform: props.centered ? 'translate(-50%)' : 'none'
}));

const PlayerName = styled.div({
  marginTop: 'auto',
  position: 'relative'
});

const playerNameBackground = 'white';
const PlayerNameCurve = styled.svg({
  display: 'block',
  width: '100%',
  height: 48,
  fill: playerNameBackground
});

const PlayerNameInner = styled.div({
  padding: 24,
  paddingTop: 0,
  backgroundColor: playerNameBackground
});

const PlayerNameText = withProps({
  noWrap: true,
  align: 'center'
})(Typography);

const MiniPlayerName = styled.div({
  marginTop: 'auto',
  padding: 4,
  backgroundColor: 'white',
  position: 'relative'
});

const Glow = styled.div({
  width: '100%',
  height: '50%',
  mixBlendMode: 'overlay', // might be better without this
  position: 'absolute',
  bottom: 0,
  left: 0
});

const colors = {
  [theme.palette.grey[500]]: 0,
  [green[500]]: 0.1,
  [blue[500]]: 0.4,
  [deepPurple[500]]: 0.7,
  [amber[500]]: 0.9
};

const scale = chroma
  .scale(Object.keys(colors))
  .classes([...Object.values(colors), 1]);

export default class PlayerCard extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    cost: PropTypes.number.isRequired,
    player: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    percentile: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    mini: PropTypes.bool
  };

  onClick = () => {
    this.props.onClick(this.props.player.id, this.props.cost);
  };

  render() {
    const color = scale(this.props.percentile).hex();
    return (
      <StyledCard
        style={{
          backgroundImage: getGradient(color, 'to bottom'),
          filter: this.props.disabled ? 'grayscale(85%)' : 'none'
        }}
      >
        <TeamLogo
          style={{
            backgroundImage:
              this.props.player.team && `url(${this.props.player.team.logo})`
          }}
        />
        <StyledCardActionArea
          disabled={this.props.disabled}
          onClick={this.onClick}
        >
          {this.props.mini ? (
            <MiniStatus variant="caption">
              {this.props.selected ? '✅' : '❌'}
            </MiniStatus>
          ) : (
            <Fragment>
              <Status>
                <NumberText color="inherit" variant="h6">
                  {this.props.selected
                    ? '✅ Acquired'
                    : `$${this.props.cost.toLocaleString()}`}
                </NumberText>
              </Status>
              <Statistics>
                <Statistic
                  title="K/D"
                  value={this.props.player.statistics.kdRatio}
                />
                <Statistic
                  title="ADR"
                  value={this.props.player.statistics.damagePerRound}
                />
                <Statistic
                  title="HS%"
                  value={this.props.player.statistics.headshots}
                />
              </Statistics>
            </Fragment>
          )}
          <PlayerImage
            src={this.props.player.image}
            centered={this.props.mini}
          />
          <Glow
            style={{
              backgroundImage: getGradient(color, 'to top')
            }}
          />
          {this.props.mini ? (
            <MiniPlayerName>
              <Typography align="center" noWrap variant="caption">
                {this.props.player.ign}
              </Typography>
            </MiniPlayerName>
          ) : (
            <PlayerName>
              <PlayerNameCurve viewBox="0 0 100 48" preserveAspectRatio="none">
                <path d="M 0,48 Q 50,0 100,48 Z" fill="white" />
              </PlayerNameCurve>
              <PlayerNameInner>
                <PlayerNameText variant="h6">
                  {this.props.player.ign}
                </PlayerNameText>
                <PlayerNameText>
                  <EmojiFlag country={this.props.player.country} />{' '}
                  {this.props.player.name}
                </PlayerNameText>
              </PlayerNameInner>
            </PlayerName>
          )}
        </StyledCardActionArea>
      </StyledCard>
    );
  }
}

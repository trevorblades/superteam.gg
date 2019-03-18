import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase'; // eslint-disable-line sort-imports-es6-autofix/sort-imports-es6
import LogoTitle from '../logo-title';
import NoSsr from 'react-no-ssr';
import PropTypes from 'prop-types';
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import TwitterLogin from '../twitter-login';
import Typography from '@material-ui/core/Typography';
import UserMenu from './user-menu';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import styled from '@emotion/styled';
import withProps from 'recompose/withProps';
import withUser from '../with-user';
import {FaTwitter} from 'react-icons/fa';
import {Link} from 'gatsby';
import {TWITTER_BLUE} from '../../utils/constants';
import {withTheme} from '@material-ui/core/styles';

const StyledLogoTitle = styled(LogoTitle)({
  pointerEvents: 'none',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
});

const Nav = styled.nav({
  display: 'flex',
  alignSelf: 'stretch'
});

const NavItem = compose(
  withTheme(),
  withProps({variant: 'subtitle1'})
)(
  styled(Typography)(({theme}) => {
    const {main} = theme.palette.primary;
    return {
      display: 'flex',
      alignItems: 'center',
      margin: `0 ${8}px`,
      padding: `0 ${8}px`,
      borderBottom: '2px solid transparent',
      textDecoration: 'none',
      '&.active': {
        color: main,
        borderColor: main
      }
    };
  })
);

function isActive(className) {
  return ({href, location}) => {
    const isCurrent =
      href === location.pathname ||
      href === location.pathname.replace(/\/$/, '');
    return {
      className: className + (isCurrent ? ' active' : '')
    };
  };
}

const NavLink = mapProps(({className, ...props}) => ({
  ...props,
  getProps: isActive(className)
}))(Link);

const RightActions = styled.div({
  display: 'flex',
  marginLeft: 'auto'
});

const StyledAvatar = styled(Avatar)({
  borderRadius: '50%',
  color: 'white',
  backgroundColor: TWITTER_BLUE
});

function Header(props) {
  return (
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Toolbar>
        <Nav>
          <NavItem component={NavLink} to="/">
            Home
          </NavItem>
          <NavItem component={NavLink} to="/create">
            Create team
          </NavItem>
          <NavItem component={NavLink} to="/standings">
            Standings
          </NavItem>
          {/* <NavItem color="textSecondary">DOTA 2</NavItem> */}
        </Nav>
        <StyledLogoTitle />
        <RightActions>
          <NoSsr>
            {props.user ? (
              <UserMenu user={props.user} />
            ) : (
              <TwitterLogin>
                {({pending, startAuth}) => (
                  <Tooltip title="Log in with Twitter">
                    <StyledAvatar
                      component={ButtonBase}
                      onClick={startAuth}
                      disabled={pending}
                    >
                      <FaTwitter size={20} />
                    </StyledAvatar>
                  </Tooltip>
                )}
              </TwitterLogin>
            )}
          </NoSsr>
          {props.children}
        </RightActions>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  children: PropTypes.node,
  user: PropTypes.object
};

export default withUser(Header);

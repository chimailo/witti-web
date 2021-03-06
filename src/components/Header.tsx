import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';

import Search from './Search';
import Sidebar from './Sidebar';
import { User } from '../../types';
import { KEYS } from '../lib/constants';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      width: '100%',
      zIndex: 1,
      position: 'sticky',
      top: 0,
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(0, 1),
      backgroundColor: theme.palette.background.paper,
    },
    drawer: {
      width: 240,
    },
    avatar: {
      flexGrow: 0,
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
    titleContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      marginLeft: theme.spacing(2),
    },
    title: {
      textTransform: 'capitalize',
      lineHeight: '1.4',
      fontWeight: theme.typography.fontWeightBold,
    },
  })
);

type HeaderProps = {
  title?: string;
  user?: User;
  avatar?: boolean;
  back?: boolean;
  search?: boolean;
  meta?: string;
};

export default function Header(props: HeaderProps) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const classes = useStyles();
  const router = useRouter();
  const queryClient = useQueryClient();
  const auth = queryClient.getQueryData<User>(KEYS.AUTH);

  const { user, title, search, back, avatar, meta } = props;

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setDrawerOpen(open);
    };

  return (
    <Toolbar classes={{ root: classes.toolbar }} disableGutters>
      <Box display='flex' flexGrow={1} position='relative' alignItems='center'>
        {back && (
          <IconButton
            size='small'
            aria-label='go back'
            onClick={() => router.back()}
          >
            <KeyboardBackspaceIcon color='primary' />
          </IconButton>
        )}
        {avatar && (
          <IconButton
            size='small'
            aria-label='menu'
            onClick={() => router.push(`/${auth?.profile.username}`)}
          >
            <Avatar
              alt={user ? user.profile.avatar : auth?.profile.avatar}
              src={user ? user.profile.avatar : auth?.profile.avatar}
              className={classes.avatar}
            />
          </IconButton>
        )}
        {title && (
          <div className={classes.titleContainer}>
            <Typography
              variant='subtitle1'
              component='h3'
              className={classes.title}
              noWrap
            >
              {title}
            </Typography>
            {meta && (
              <Typography
                color='textSecondary'
                noWrap
                style={{ lineHeight: 1 }}
              >
                <small>{meta}</small>
              </Typography>
            )}
          </div>
        )}
        {search && <Search />}
        <Hidden smUp>
          <IconButton
            size='small'
            aria-label='menu'
            onClick={toggleDrawer(true)}
          >
            <MoreVertIcon />
          </IconButton>
          <Hidden smUp>
            <Drawer
              anchor='left'
              open={isDrawerOpen}
              onClose={toggleDrawer(false)}
              classes={{ paper: classes.drawer }}
            >
              <Sidebar user={auth} />
            </Drawer>
          </Hidden>
        </Hidden>
      </Box>
    </Toolbar>
  );
}

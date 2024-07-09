import SettingsContent from '../Wrapper';
import Index from './Index.vue';
import { frontendURL } from '../../../../helper/URLHelper';

export default {
  routes: [
    {
      path: frontendURL('accounts/:accountId/calendar'),
      name: 'calendar_home',
      roles: ['administrator', 'agent'],
      component: Index,
      props: {
        headerTitle: 'PROFILE_SETTINGS.TITLE',
        icon: 'edit',
        showNewButton: false,
        showSidemenuIcon: false,
      },
    //   children: [
    //     {
    //       path: 'calendar',
    //       name: 'calendar_settings_index',
    //       component: Index,
    //       roles: ['administrator', 'agent'],
    //     },
    //   ],
    },
  ],
};
import Index from './Index';
import Whatsapp from './Whatsapp'; //Andres Liverio 180524
import SettingsContent from '../Wrapper';
import { frontendURL } from '../../../../helper/URLHelper';

export default {
  routes: [
    {
      path: frontendURL('accounts/:accountId/campaigns'),
      component: SettingsContent,
      props: {
        headerTitle: 'CAMPAIGN.ONGOING.HEADER',
        icon: 'arrow-swap',
      },
      children: [
        {
          path: '',
          redirect: 'ongoing',
        },
        {
          path: 'ongoing',
          name: 'settings_account_campaigns',
          roles: ['administrator'],
          component: { ...Index },
        },
      ],
    },
    {
      path: frontendURL('accounts/:accountId/campaigns'),
      component: SettingsContent,
      props: {
        headerTitle: 'CAMPAIGN.ONE_OFF.HEADER',
        icon: 'sound-source',
      },
      children: [
        {
          path: 'one_off',
          name: 'one_off',
          roles: ['administrator'],
          component: { ...Index },
        },
      ],
    },
    //Andres Liverio 180524
    {
      path: frontendURL('accounts/:accountId/campaigns'),
      component: SettingsContent,
      props: {
        headerTitle: 'CAMPAIGN.MM_WA.HEADER',
        icon: 'whatsapp',
      },
      children: [
        {
          path: 'mm_wa',
          name: 'mm_wa',
          roles: ['administrator'],
          component: { ...Whatsapp },
        },
      ],
    },
    //Andres Liverio 180524
  ],
};

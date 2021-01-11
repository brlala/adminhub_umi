import { setIntl, setLocale } from '@@/plugin-locale/localeExports';
import moment from 'moment';

export const changeLanguage = (lang: string) => {
  setLocale(lang);
  setIntl(lang);
  moment.locale(lang);
};
